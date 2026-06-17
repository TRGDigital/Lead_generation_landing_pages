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

type SendGridEvent = {
  event?: string
  timestamp?: number
  lead_id?: string
  buyer_id?: string
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

  for (const ev of events as SendGridEvent[]) {
    const col = ev.event ? EVENT_COLUMN[ev.event] : undefined
    if (!col || !ev.lead_id || !ev.buyer_id) continue
    const ts = ev.timestamp ? new Date(ev.timestamp * 1000).toISOString() : new Date().toISOString()
    // Record the FIRST occurrence only (keeps the earliest event time).
    await db
      .from('lead_distributions')
      .update({ [col]: ts })
      .eq('lead_id', ev.lead_id)
      .eq('buyer_id', ev.buyer_id)
      .is(col, null)
    processed++
  }

  return NextResponse.json({ ok: true, processed })
}
