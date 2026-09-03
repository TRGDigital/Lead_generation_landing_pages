import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { getWebsiteBySlug } from '@/lib/websites'
import { sendCallbackEmail } from '@/lib/callback-email'

// Extra detail attached to a call-back request AFTER it has already been captured.
//
// The lead is saved the moment the visitor gives a name and number, so it can never be lost
// by asking more questions. These answers are appended one at a time, which means someone who
// abandons half way still leaves behind whatever they did answer. The provider gets a short
// follow-up email only when the answers are finished, so a call back is never delayed waiting
// for detail that may never arrive.
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const schema = z.object({
  site: z.string().min(1).max(80),
  leadId: z.string().uuid(),
  answers: z.record(z.string().max(120)).refine((a) => Object.keys(a).length <= 12, 'too many'),
  final: z.boolean().optional(),
})

// Only a lead from the last half hour can be added to, which keeps this endpoint from being
// a way to edit older records.
const WINDOW_MS = 30 * 60 * 1000

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 422, headers: CORS })
  const { site: slug, leadId, answers, final } = parsed.data

  const site = await getWebsiteBySlug(slug)
  if (!site) return NextResponse.json({ error: 'Unknown site' }, { status: 404, headers: CORS })

  const db = createServiceClient() as unknown as any
  const { data: lead } = await db
    .from('organic_leads')
    .select('id, name, phone, email, message, answers, created_at, trigger, website_id, notified_at')
    .eq('id', leadId)
    .eq('website_id', site.id)
    .single()

  if (!lead || lead.trigger !== 'callback') {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: CORS })
  }
  if (Date.now() - new Date(lead.created_at).getTime() > WINDOW_MS) {
    return NextResponse.json({ error: 'Too late' }, { status: 409, headers: CORS })
  }

  const merged = { ...(lead.answers ?? {}), ...answers }
  const { error } = await db.from('organic_leads').update({ answers: merged }).eq('id', leadId)
  if (error) {
    console.error('lead-detail update error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: CORS })
  }

  // Finished: send the one complete notification now, with everything they told us.
  if (final) {
    const fresh = { ...lead, answers: merged }
    await sendCallbackEmail(db, site, fresh as any)
  }

  return NextResponse.json({ ok: true }, { headers: CORS })
}
