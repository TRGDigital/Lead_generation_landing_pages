import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { careTypeLabel } from '@/lib/care-finder'

// Enrich a captured location lead with the answers gathered AFTER the contact step.
// Keyed by the lead id (an unguessable UUID) and scoped to careassura location leads;
// only the answers + derived care_type are updated. Best-effort, fired as the user
// continues the care-finder quiz.
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { leadId?: string; answers?: Record<string, unknown> }
    const leadId = String(body?.leadId ?? '')
    const answers = body?.answers
    if (!/^[0-9a-fA-F-]{36}$/.test(leadId) || typeof answers !== 'object' || answers == null) {
      return NextResponse.json({ error: 'bad request' }, { status: 400 })
    }
    const db = createServiceClient() as unknown as any
    await db
      .from('leads')
      .update({ answers, care_type: careTypeLabel(answers.care_type as string | undefined) })
      .eq('id', leadId)
      .eq('lead_source', 'careassura-location')
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
