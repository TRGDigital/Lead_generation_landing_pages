import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyCronSecret, logCronRun } from '@/lib/cron'
import { matchBuyersForLead, distributeLead } from '@/lib/distribution'

export const runtime = 'nodejs'
export const maxDuration = 120

// Fallback distribution: a lead that gives contact details but ABANDONS the quiz
// never hits the completion-time distribution. This catches them — careassura
// location leads that are still undistributed after a grace window — and sends
// them to matching buyers. Test leads (@example.com) are skipped.
const GRACE_MIN = 20

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (process.env.AUTO_DISTRIBUTE_LEADS !== 'true') {
    return NextResponse.json({ ok: true, skipped: 'AUTO_DISTRIBUTE_LEADS not enabled' })
  }

  const cutoff = new Date(Date.now() - GRACE_MIN * 60_000).toISOString()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as unknown as any

  const { data: stale } = await db
    .from('leads')
    .select('id, area, care_type, full_name, email, phone, care_for, move_in_timeframe, message')
    .eq('lead_source', 'careassura-location')
    .is('distributed_at', null)
    .not('email', 'is', null)
    .not('phone', 'is', null)
    .not('email', 'ilike', '%@example.com')
    .lt('created_at', cutoff)
    .limit(50)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leads = (stale ?? []) as any[]
  let distributed = 0
  let noMatch = 0

  for (const lead of leads) {
    try {
      const buyers = await matchBuyersForLead({
        id: lead.id,
        full_name: lead.full_name,
        email: lead.email,
        phone: lead.phone,
        area: lead.area,
        care_type: lead.care_type,
        care_for: lead.care_for,
        move_in_timeframe: lead.move_in_timeframe,
        message: lead.message,
      })
      if (buyers.length) {
        await distributeLead(lead.id, buyers.map((b) => b.id), null)
        distributed++
      } else {
        noMatch++
      }
    } catch (e) {
      console.error('[cron:distribute-stale]', lead.id, e)
    }
  }

  const summary = { candidates: leads.length, distributed, noMatch }
  await logCronRun('distribute-stale', true, summary)
  return NextResponse.json({ ok: true, ...summary })
}
