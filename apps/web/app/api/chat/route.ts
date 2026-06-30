import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getWebsiteBySlug, AVAILABILITY_LABELS } from '@/lib/websites'

// The branded AI care-assistant. Answers families' questions about a client's care home
// from the home's own content + structured facts, and nudges toward a callback. Uses Claude.
export const runtime = 'nodejs'
export const maxDuration = 30

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

const schema = z.object({
  site: z.string().min(1).max(80),
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(2000) })).min(1).max(20),
})

const FALLBACK = "I'm sorry, I can't answer that right now. The team would be happy to help, please request a callback or give us a call and we'll talk you through it."

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers: CORS }) }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 422, headers: CORS })
  const { site: slug, messages } = parsed.data

  const site = await getWebsiteBySlug(slug)
  if (!site || !site.chat_enabled) return NextResponse.json({ error: 'Chat is not available.' }, { status: 403, headers: CORS })

  const key = process.env.ANTHROPIC_API_KEY
  if (!key) {
    return NextResponse.json({ reply: FALLBACK, callback: true }, { headers: CORS })
  }

  const phone = site.callbar_phone || site.lp_phone || ''
  const avail = AVAILABILITY_LABELS[site.availability_status]?.label ?? ''
  const availLine = site.availability_status === 'available' || site.availability_status === 'limited'
    ? `${avail}${site.rooms_available > 0 ? ` (${site.rooms_available} room${site.rooms_available === 1 ? '' : 's'})` : ''}${site.availability_note ? `, ${site.availability_note}` : ''}`
    : avail

  const facts = [
    `Care home name: ${site.name}`,
    `Website: ${site.url}`,
    phone ? `Phone: ${phone}` : '',
    site.lp_address ? `Address: ${site.lp_address}` : '',
    availLine ? `Current room availability: ${availLine}` : '',
    site.lp_cqc_url ? `CQC report: ${site.lp_cqc_url}` : '',
    (site.tools_enabled || []).includes('funding') ? 'A free care funding calculator is available on the website.' : '',
  ].filter(Boolean).join('\n')

  const system = `You are the warm, friendly virtual assistant for ${site.name}, a UK care home. You help families who are researching care, a stressful time, so be reassuring, kind and concise (2 to 4 short sentences).

Facts you can rely on:
${facts}

About the home (from their own website):
${(site.chat_knowledge || '').slice(0, 8000) || '(No extra detail provided. Stick to the facts above and general UK care guidance.)'}
${(site.chat_prompt || '').trim() ? `\nSpecific instructions for this home (follow these closely, within the rules below):\n${site.chat_prompt.trim().slice(0, 4000)}\n` : ''}
Rules:
- Only answer about ${site.name} and general UK care guidance (types of care, visiting, the move-in process, what to look for). Gently steer off-topic questions back.
- Never invent specifics. If you are not certain of a detail (exact weekly fees, the CQC rating, anything medical), say you are not sure and offer to arrange a callback from the team.
- Do not give medical or financial advice. For funding questions you may mention the free funding calculator on the website.
- Where helpful, invite the family to request a callback${phone ? ` or call ${phone}` : ''}.
- Plain, warm language. No markdown, no headings, no bullet lists unless truly needed.`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    })
    if (!r.ok) {
      console.error('anthropic error', r.status, await r.text().catch(() => ''))
      return NextResponse.json({ reply: FALLBACK, callback: true }, { headers: CORS })
    }
    const j = await r.json()
    const reply = j?.content?.[0]?.text?.trim() || FALLBACK
    return NextResponse.json({ reply }, { headers: CORS })
  } catch (e) {
    console.error('chat error', e)
    return NextResponse.json({ reply: FALLBACK, callback: true }, { headers: CORS })
  }
}
