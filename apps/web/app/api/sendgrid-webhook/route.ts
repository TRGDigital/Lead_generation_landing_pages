import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// SendGrid Event Webhook receiver. SendGrid POSTs a JSON array of events; the
// distribution emails carry custom_args { lead_id, buyer_id }, which SendGrid
// echoes back on each event so we can tie delivered/opened/clicked to the exact
// lead_distributions row.
//
// Optional protection: set SENDGRID_WEBHOOK_SECRET and append ?key=<secret> to
// the webhook URL in SendGrid. (lead_id/buyer_id are unguessable UUIDs, so events
// can't be meaningfully forged without them anyway.)

const EVENT_COLUMN: Record<string, 'delivered_at' | 'opened_at' | 'clicked_at'> = {
  delivered: 'delivered_at',
  open: 'opened_at',
  click: 'clicked_at',
}

// Nurture emails carry custom_args { nsend } (a nurture_sends id). Map each event
// type to the timestamp column stamped on that row.
const NURTURE_COLUMN: Record<string, string> = {
  delivered: 'delivered_at',
  open: 'opened_at',
  click: 'clicked_at',
  bounce: 'bounced_at',
  dropped: 'dropped_at',
  spamreport: 'spamreport_at',
  unsubscribe: 'unsubscribed_at',
  group_unsubscribe: 'unsubscribed_at',
}

type SendGridEvent = {
  event?: string
  timestamp?: number
  lead_id?: string
  buyer_id?: string
  nsend?: string
  site?: string   // custom_args.site: 'careassura' marks CareAssura's emails (same SendGrid account)
  csend?: string  // CareAssura claim_nurture_sends id
}

// SendGrid allows two event webhooks per account and both are taken, so CareAssura's emails share
// this one. Events tagged site=careassura are forwarded to careassura.com and not processed here.
async function forwardToCareAssura(events: SendGridEvent[]) {
  const secret = process.env.NURTURE_FORWARD_SECRET
  if (!events.length || !secret) return
  try {
    await fetch('https://careassura.com/api/claim-nurture?action=sendgrid-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forward-secret': secret },
      body: JSON.stringify(events),
    })
  } catch (e) {
    console.error('[sendgrid-webhook] forward to careassura failed', e)
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.SENDGRID_WEBHOOK_SECRET
  if (secret && req.nextUrl.searchParams.get('key') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let events: unknown
  try {
    events = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
  if (!Array.isArray(events)) return NextResponse.json({ ok: true, processed: 0 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  let processed = 0
  const careassura: SendGridEvent[] = []

  for (const ev of events as SendGridEvent[]) {
    if (ev.site === 'careassura') { careassura.push(ev); continue }
    const ts = ev.timestamp ? new Date(ev.timestamp * 1000).toISOString() : new Date().toISOString()

    // Nurture-sequence events (tie back via the nurture_sends id).
    if (ev.nsend && ev.event) {
      const ncol = NURTURE_COLUMN[ev.event]
      if (!ncol) continue
      await db.from('nurture_sends').update({ [ncol]: ts }).eq('id', ev.nsend).is(ncol, null)
      if (ev.event === 'open' || ev.event === 'click') {
        const cntCol = ev.event === 'open' ? 'open_count' : 'click_count'
        const { data: cur } = await db.from('nurture_sends').select(cntCol).eq('id', ev.nsend).maybeSingle()
        await db.from('nurture_sends').update({ [cntCol]: ((cur?.[cntCol] as number) ?? 0) + 1 }).eq('id', ev.nsend)
      }
      if (ncol === 'unsubscribed_at') {
        const { data: s } = await db.from('nurture_sends').select('enrollment_id').eq('id', ev.nsend).maybeSingle()
        if (s?.enrollment_id) {
          await db.from('nurture_enrollments').update({ status: 'unsubscribed', updated_at: ts }).eq('id', s.enrollment_id)
        }
      }
      processed++
      continue
    }

    // CareBeds lead-distribution events.
    const col = ev.event ? EVENT_COLUMN[ev.event] : undefined
    if (!col || !ev.lead_id || !ev.buyer_id) continue
    // Record the FIRST occurrence only (keeps the earliest event time).
    await db
      .from('lead_distributions')
      .update({ [col]: ts })
      .eq('lead_id', ev.lead_id)
      .eq('buyer_id', ev.buyer_id)
      .is(col, null)
    processed++
  }

  await forwardToCareAssura(careassura)
  return NextResponse.json({ ok: true, processed, forwarded: careassura.length })
}
