import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { scoreAdvert, stripDashes, ADVERT_MAX_CHARS, ADVERT_MIN_CHARS } from '@/lib/job-advert-checker'

// AI rewrite for the Care Job Advert Checker (/tools/care-job-advert-checker).
//
// Gated: it only runs when this visitor has just completed the tool's lead form.
// ToolLeadGate posts the lead to /api/marketing-leads (which stores it in
// marketing_leads with the IP and a message beginning "Used the Care Job Advert
// Checker."), so here we look that row up by IP within the last few hours and
// require an email on it. No new tables.

export const runtime = 'nodejs'
export const maxDuration = 60

const TOOL_NAME = 'Care Job Advert Checker'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'
const MAX_TOKENS = 2000
const TIMEOUT_MS = 45_000
const LEAD_WINDOW_MS = 3 * 60 * 60 * 1000
const RATE_LIMIT = 5 // rewrites per IP per hour

const schema = z.object({
  advert: z.string().min(ADVERT_MIN_CHARS).max(ADVERT_MAX_CHARS),
})

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

// Per-instance fallback limiter, used on top of KV (which fails open when unset).
const memHits = new Map<string, number[]>()
function memLimit(ip: string): boolean {
  const now = Date.now()
  const hits = (memHits.get(ip) ?? []).filter((t) => now - t < 3600_000)
  if (hits.length >= RATE_LIMIT) return false
  hits.push(now)
  memHits.set(ip, hits)
  return true
}

// Best-effort cost reporting to the cross-app AI Spend collector. No-op unless
// AI_SPEND_URL and AI_SPEND_TOKEN are set; never throws or delays the response.
function trackAiUsage(usage: Record<string, unknown> | undefined) {
  try {
    const url = process.env.AI_SPEND_URL
    const token = process.env.AI_SPEND_TOKEN
    if (!url || !token) return
    const u = (usage ?? {}) as Record<string, number>
    fetch(url.replace(/\/$/, '') + '/api/ingest', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-ingest-token': token },
      body: JSON.stringify({
        app: 'trgdigital',
        feature: 'job-advert-checker',
        surface: '/api/job-advert-rewrite',
        provider: 'anthropic',
        model: MODEL,
        input_tokens: u.input_tokens ?? 0,
        output_tokens: u.output_tokens ?? 0,
        cache_read_tokens: u.cache_read_input_tokens ?? 0,
        cache_creation_tokens: u.cache_creation_input_tokens ?? 0,
      }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* never break the feature for cost logging */
  }
}

const REWRITE_TOOL = {
  name: 'submit_rewrite',
  description: 'Return the rewritten job advert.',
  input_schema: {
    type: 'object',
    properties: {
      jobTitle: { type: 'string', description: 'One job title for Indeed and Google for Jobs.' },
      advert: { type: 'string', description: 'The rewritten advert as plain text with line breaks.' },
      placeholders: { type: 'array', items: { type: 'string' }, description: 'Placeholder labels used, e.g. "hourly rate".' },
      notes: { type: 'array', items: { type: 'string' }, description: 'Up to 3 short tips for the manager, each under 25 words.' },
    },
    required: ['jobTitle', 'advert', 'placeholders', 'notes'],
  },
}

const SYSTEM = `You rewrite job adverts for UK care providers (care homes, nursing homes and home care agencies) so that more carers apply.

Rules you must follow:
1. Never invent facts. Use only facts stated in the original advert: pay, hours, location, benefits, requirements, the organisation's name and details. Do not add a pay rate, benefit, bonus, rating, location or contact detail that is not in the original.
2. Where an important fact is missing, insert a clear placeholder in square brackets for the manager to fill in, in the form [add: hourly rate], [add: shift pattern], [add: town or area], [add: how to apply], [add: paid training?]. Only suggest placeholders for things carers genuinely look for, and only ones that fit the role: mileage or a car only for home care or community roles, never for a care home. Keep the original way to apply (for example "send your CV to the manager") and only use [add: how to apply] when the original gives none. Never state that qualifications or experience are not needed unless the original says so.
3. Structure: a short opening of no more than 2 sentences that leads with the role, pay and location; then short sections with plain headings such as "What you will get", "Your shifts", "What you will be doing", "What we are looking for", "How to apply". Use short bullet points starting with "- ". Keep it between 200 and 450 words.
4. Write to the reader as "you". Warm, plain, respectful UK English (organisation, colour, recognise). No HR jargon ("the successful candidate", "commensurate", "self starter", "fast paced environment"). Prefer "the people we support" or "residents" over "service users" unless the original insists.
5. For entry level care roles, do not require qualifications or experience unless the original says they are legally required; if the original demands an NVQ or diploma for an entry role, soften it to "welcome but not essential" only if that does not contradict a stated legal requirement, and otherwise keep it as written.
6. Never use em dashes or en dashes. Use commas, full stops or the word "to".
7. Suggest one job title for Indeed and Google for Jobs: the plain role name carers search for, plus the setting and town if known, e.g. "Care Assistant, Nursing Home, Stroud". No pay, no emojis, no capitals for emphasis, under 60 characters. Only include a town if it is in the original.

Return the result by calling the submit_rewrite tool.`

type RewriteJson = { jobTitle?: string; advert?: string; placeholders?: string[]; notes?: string[] }

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: `Please paste an advert between ${ADVERT_MIN_CHARS} and ${ADVERT_MAX_CHARS} characters.` }, { status: 422 })
  }
  const advert = parsed.data.advert.trim()
  const ip = getIp(req)

  // 1. Lead gate: a completed lead for this tool from this IP, with an email.
  const db = createServiceClient() as unknown as any
  const since = new Date(Date.now() - LEAD_WINDOW_MS).toISOString()
  const { data: leads, error: leadErr } = await db
    .from('marketing_leads')
    .select('id, email, company')
    .eq('ip_address', ip)
    .ilike('message', `Used the ${TOOL_NAME}%`)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1)
  if (leadErr) {
    console.error('job-advert-rewrite lead lookup error', leadErr)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
  const lead = (leads ?? [])[0] as { id: string; email: string | null } | undefined
  if (!lead || !lead.email || !/.+@.+\..+/.test(lead.email)) {
    return NextResponse.json({ error: 'Please add your details above to get your rewritten advert.' }, { status: 403 })
  }

  // 2. Rate limit.
  const rl = await checkRateLimit(`job-advert-rewrite:${ip}`, RATE_LIMIT, 3600)
  if (!rl.allowed || !memLimit(ip)) {
    return NextResponse.json({ error: 'You have reached the limit of 5 rewrites an hour. Please try again later.' }, { status: 429 })
  }

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return NextResponse.json({ error: 'The rewrite service is not available right now. We have your details and will be in touch.' }, { status: 503 })
  }

  // 3. Tell the model what the rule-based checker found missing, to guide placeholders.
  const score = scoreAdvert(advert)
  const user = `Original advert (${score.roleLabel.toLowerCase()}):
<<<
${advert}
>>>

Our checker scored it ${score.score}/100. It could not find: ${score.missing.length ? score.missing.join('; ') : 'nothing major'}.
Rewrite it following the rules and return it with the submit_rewrite tool.`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // A short structured rewrite: no thinking, so the whole budget goes to the answer.
        thinking: { type: 'disabled' },
        system: SYSTEM,
        messages: [{ role: 'user', content: user }],
        // A forced tool call returns the rewrite as parsed JSON, so line breaks inside the
        // advert can never break the parse the way free text JSON did.
        tools: [REWRITE_TOOL],
        tool_choice: { type: 'tool', name: REWRITE_TOOL.name },
      }),
      signal: controller.signal,
    })
    if (!res.ok) {
      console.error('job-advert-rewrite anthropic error', res.status, (await res.text().catch(() => '')).slice(0, 300))
      return NextResponse.json({ error: 'We could not rewrite your advert just now. Please try again in a minute.' }, { status: 502 })
    }
    const data = (await res.json()) as { content?: Array<{ type?: string; name?: string; input?: unknown }>; usage?: Record<string, unknown>; stop_reason?: string }
    trackAiUsage(data.usage)

    const call = (data.content ?? []).find((b) => b?.type === 'tool_use' && b.name === REWRITE_TOOL.name)
    const out = (call?.input ?? null) as RewriteJson | null
    if (!out?.advert) {
      console.error('job-advert-rewrite bad reply', data.stop_reason)
      return NextResponse.json({ error: 'We could not rewrite your advert just now. Please try again.' }, { status: 502 })
    }

    const advertOut = stripDashes(String(out.advert)).trim()
    return NextResponse.json({
      jobTitle: stripDashes(String(out.jobTitle ?? '')).trim().slice(0, 90),
      advert: advertOut,
      placeholders: Array.isArray(out.placeholders) ? out.placeholders.slice(0, 12).map((p) => stripDashes(String(p))) : [],
      notes: Array.isArray(out.notes) ? out.notes.slice(0, 3).map((n) => stripDashes(String(n))) : [],
      newScore: scoreAdvert(advertOut).score,
    })
  } catch (e) {
    const aborted = e instanceof Error && e.name === 'AbortError'
    console.error('job-advert-rewrite error', aborted ? 'timeout' : e)
    return NextResponse.json({ error: aborted ? 'The rewrite took too long. Please try again.' : 'Something went wrong. Please try again.' }, { status: aborted ? 504 : 500 })
  } finally {
    clearTimeout(timer)
  }
}
