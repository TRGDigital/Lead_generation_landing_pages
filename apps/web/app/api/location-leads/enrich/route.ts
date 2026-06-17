import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { careTypeLabel } from '@/lib/care-finder'
import { matchBuyersForLead, distributeLead } from '@/lib/distribution'

// Enrich a captured location lead with the answers gathered AFTER the contact step.
// Keyed by the lead id (an unguessable UUID) and scoped to careassura location leads;
// only the answers + derived care_type are updated. Best-effort, fired as the user
// continues the care-finder quiz.
//
// When `completed` is true (the quiz finished), this is also where we AUTO-DISTRIBUTE
// — not at lead creation — so buyers receive the FULL set of answers, not just the
// few captured at the mid-funnel contact step. Awaited so it completes within the
// request (Vercel freezes the function after the response).
type LeadForDist = {
  id: string
  area: string | null
  care_type: string | null
  full_name: string
  email: string
  phone: string
  care_for: string | null
  move_in_timeframe: string | null
  message: string | null
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      leadId?: string
      answers?: Record<string, unknown>
      completed?: boolean
    }
    const leadId = String(body?.leadId ?? '')
    const answers = body?.answers
    if (!/^[0-9a-fA-F-]{36}$/.test(leadId) || typeof answers !== 'object' || answers == null) {
      return NextResponse.json({ error: 'bad request' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient() as unknown as any
    const { data: updated } = await db
      .from('leads')
      .update({ answers, care_type: careTypeLabel(answers.care_type as string | undefined) })
      .eq('id', leadId)
      .eq('lead_source', 'careassura-location')
      .select('id, area, care_type, full_name, email, phone, care_for, move_in_timeframe, message')
      .single()

    const lead = updated as LeadForDist | null

    // On completion, distribute with the full answer set now saved.
    if (body?.completed === true && process.env.AUTO_DISTRIBUTE_LEADS === 'true' && lead) {
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
        if (buyers.length) await distributeLead(lead.id, buyers.map((b) => b.id), null)
      } catch (e) {
        console.error('[enrich] auto-distribute failed:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
