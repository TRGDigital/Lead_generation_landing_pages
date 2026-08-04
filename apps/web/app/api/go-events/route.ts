import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'

// Quiz analytics beacon for the /go/ ad pages. Anonymous: a per-session random id,
// the event, and (for answers) which option was picked. No PII.
export const dynamic = 'force-dynamic'

const EVENTS = new Set(['view', 'start', 'answer', 'contact', 'submit'])

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = await checkRateLimit(`go-events:${ip}`, 120, 600)
  if (!allowed) return NextResponse.json({ ok: true }) // silently drop; analytics must never error loudly

  let body: any
  try { body = await req.json() } catch { return NextResponse.json({ ok: true }) }

  const slug = String(body?.slug ?? '').slice(0, 80)
  const session = String(body?.session ?? '').slice(0, 64)
  const event = String(body?.event ?? '')
  if (!slug || !session || !EVENTS.has(event)) return NextResponse.json({ ok: true })

  const db = createServiceClient() as unknown as any
  await db.from('go_quiz_events').insert({
    slug,
    session_id: session,
    event,
    step: Number.isFinite(Number(body?.step)) ? Number(body.step) : null,
    question: body?.question ? String(body.question).slice(0, 200) : null,
    option: body?.option ? String(body.option).slice(0, 200) : null,
  }).then(() => {}, () => {})

  return NextResponse.json({ ok: true })
}
