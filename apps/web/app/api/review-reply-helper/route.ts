import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import {
  PLATFORMS,
  REVIEW_MAX_CHARS,
  REVIEW_TOOL_NAME,
  SERVICE_TYPES,
  SYSTEM_PROMPT,
  TONES,
  buildUserPrompt,
  cleanReply,
  holdingReply,
  precheckReview,
  safeguardingFlags,
  wordCount,
} from '@/lib/review-reply'

// Care Review Reply Helper. Drafts a GDPR-safe public reply to a care review with Claude.
// Gated: the request must carry the email of a lead captured by the tool's lead gate
// (a marketing_leads row whose message starts "Used the Care Review Reply Helper."), checked
// server side. Rate limited per IP and per lead. Safeguarding allegations never reach the model:
// they get a fixed neutral holding reply.

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'
const MAX_TOKENS = 600
const TIMEOUT_MS = 25_000
// claude-sonnet-5 list price, USD per token (for the spend log line).
const PRICE_IN = 2 / 1_000_000
const PRICE_OUT = 10 / 1_000_000

const schema = z.object({
  review: z.string({ required_error: 'Please paste the review.' }).trim().min(10, 'Please paste the review.').max(REVIEW_MAX_CHARS, `Reviews are limited to ${REVIEW_MAX_CHARS} characters.`),
  platform: z.enum(PLATFORMS),
  stars: z.number().int().min(1).max(5),
  managerName: z.string().trim().min(2).max(80),
  role: z.string().trim().min(2).max(80),
  serviceName: z.string().trim().min(2).max(120),
  serviceType: z.enum(SERVICE_TYPES.map((s) => s.id) as [string, ...string[]]),
  tone: z.enum(TONES),
  contact: z.string().trim().max(120).optional(),
  leadEmail: z.string().trim().email().max(255),
})

// In-memory fallback when KV is not configured (checkRateLimit fails open). Per instance only.
const memHits = new Map<string, number[]>()
function memLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const hits = (memHits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    memHits.set(key, hits)
    return false
  }
  hits.push(now)
  memHits.set(key, hits)
  if (memHits.size > 5000) memHits.clear()
  return true
}

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown'
}

/** A lead from this tool's gate: same IP within 24 hours, or any IP within 3 hours (mobile IPs change). */
async function hasToolLead(email: string, ip: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as unknown as any
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { data, error } = await db
    .from('marketing_leads')
    .select('ip_address, created_at')
    .ilike('email', email.replace(/[%_\\]/g, '\\$&'))
    .ilike('message', `Used the ${REVIEW_TOOL_NAME}.%`)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(10)
  if (error) {
    console.error('review-reply-helper lead check error', error)
    return false
  }
  const recent = Date.now() - 3 * 60 * 60 * 1000
  return ((data ?? []) as { ip_address: string | null; created_at: string }[]).some(
    (r) => r.ip_address === ip || new Date(r.created_at).getTime() >= recent
  )
}

type AiResult = { safeguarding: boolean; reply: string; shorter: string }

async function draftWithClaude(system: string, user: string): Promise<AiResult & { inTok: number; outTok: number }> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw Object.assign(new Error('The reply helper is not configured yet. Please try again later.'), { status: 503 })
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // Short, tightly specified output: no thinking, so the token cap goes on the reply itself.
        thinking: { type: 'disabled' },
        system,
        messages: [{ role: 'user', content: user }],
      }),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('review-reply-helper anthropic error', res.status, detail.slice(0, 300))
      throw Object.assign(new Error('We could not draft a reply just now. Please try again.'), { status: 502 })
    }
    const data = (await res.json()) as {
      content?: Array<{ type?: string; text?: string }>
      stop_reason?: string
      usage?: { input_tokens?: number; output_tokens?: number }
    }
    if (data.stop_reason === 'refusal') {
      throw Object.assign(new Error('We could not draft a reply for this review. Please write it by hand.'), { status: 422 })
    }
    let text = (data.content ?? []).map((b) => (b?.type === 'text' && typeof b.text === 'string' ? b.text : '')).join('').trim()
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start < 0 || end <= start) throw Object.assign(new Error('We could not draft a reply just now. Please try again.'), { status: 502 })
    const parsed = JSON.parse(text.slice(start, end + 1)) as Partial<AiResult>
    if (typeof parsed.reply !== 'string' || typeof parsed.shorter !== 'string') {
      throw Object.assign(new Error('We could not draft a reply just now. Please try again.'), { status: 502 })
    }
    return {
      safeguarding: parsed.safeguarding === true,
      reply: parsed.reply,
      shorter: parsed.shorter,
      inTok: data.usage?.input_tokens ?? 0,
      outTok: data.usage?.output_tokens ?? 0,
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw Object.assign(new Error('The reply took too long. Please try again.'), { status: 504 })
    }
    if (err instanceof SyntaxError) {
      throw Object.assign(new Error('We could not draft a reply just now. Please try again.'), { status: 502 })
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    const msg = first?.path[0] === 'review' ? first.message : 'Please check the form and try again.'
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  const input = parsed.data
  const ip = getIp(req)
  const email = input.leadEmail.toLowerCase()

  // Rate limits: 10 drafts per hour per IP, 15 per day per lead.
  const ipRl = await checkRateLimit(`review-reply:ip:${ip}`, 10, 3600)
  const leadRl = await checkRateLimit(`review-reply:lead:${email}`, 15, 86400)
  if (!ipRl.allowed || !leadRl.allowed || !memLimit(`ip:${ip}`, 10, 3600_000) || !memLimit(`lead:${email}`, 15, 86400_000)) {
    return NextResponse.json({ error: 'You have reached the limit for drafts. Please try again in an hour.' }, { status: 429 })
  }

  if (!(await hasToolLead(email, ip))) {
    return NextResponse.json({ error: 'Please enter your details to use the reply helper.', needsLead: true }, { status: 403 })
  }

  const precheck = precheckReview(input.review, input.serviceName)
  const flags = safeguardingFlags(input.review)

  // Safeguarding allegation: never draft a public defence. Fixed neutral holding reply, no AI call.
  if (flags.length > 0) {
    const h = holdingReply(input)
    console.info(JSON.stringify({ feature: 'review-reply-helper', model: 'none', safeguarding: true, source: 'rules' }))
    return NextResponse.json({
      safeguarding: true,
      safeguardingSource: 'rules',
      reply: cleanReply(h.reply),
      shorter: cleanReply(h.shorter),
      precheck,
      mentions: [],
    })
  }

  try {
    const ai = await draftWithClaude(SYSTEM_PROMPT, buildUserPrompt(input as Parameters<typeof buildUserPrompt>[0]))
    const cost = ai.inTok * PRICE_IN + ai.outTok * PRICE_OUT
    // AI spend log (no ai_spend helper exists in this app yet; picked up from the Vercel logs).
    console.info(
      JSON.stringify({ feature: 'review-reply-helper', model: MODEL, input_tokens: ai.inTok, output_tokens: ai.outTok, usd: Number(cost.toFixed(5)) })
    )

    // The model flagged a safeguarding concern the rules missed: use the fixed holding reply.
    if (ai.safeguarding) {
      const h = holdingReply(input)
      return NextResponse.json({ safeguarding: true, safeguardingSource: 'ai', reply: cleanReply(h.reply), shorter: cleanReply(h.shorter), precheck, mentions: [] })
    }

    const reply = cleanReply(ai.reply)
    const shorter = cleanReply(ai.shorter)
    // Post-check: anything personal from the review that slipped into the draft.
    const both = `${reply}\n${shorter}`.toLowerCase()
    const mentions = precheck.filter((f) => f.kind !== 'date' && both.includes(f.text.toLowerCase())).map((f) => f.text)

    return NextResponse.json({ safeguarding: false, reply, shorter, words: wordCount(reply), precheck, mentions })
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500
    if (status === 500) console.error('review-reply-helper error', err)
    return NextResponse.json({ error: status === 500 ? 'Something went wrong. Please try again.' : (err as Error).message }, { status })
  }
}
