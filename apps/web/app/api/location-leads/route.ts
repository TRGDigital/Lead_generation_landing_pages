import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { LocationLeadSchema } from '@lib/schemas'
import { sendTemplateEmail } from '@lib/sendgrid'
import { checkRateLimit, checkIdempotency, setIdempotency } from '@/lib/rate-limit'
import { careTypeLabel } from '@/lib/care-finder'

// CareAssura location landing pages capture leads that are NOT yet tied to a
// single care home — they land unassigned in /admin/leads, tagged by area, ready
// for the distribution tool.
type LocationRow = { area_name: string }
type LeadRow = { id: string }

export async function POST(req: NextRequest) {
  try {
    return await handle(req)
  } catch (e) {
    console.error('[api/location-leads] uncaught:', e)
    return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 })
  }
}

async function handle(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ua = req.headers.get('user-agent') ?? ''

  const { allowed } = await checkRateLimit(`location-leads:${ip}`, 5, 600)
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = LocationLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Validation failed', issues: parsed.error.issues }, { status: 422 })
  }
  const data = parsed.data

  // Honeypot — silently succeed
  if (data.companyWebsite !== '') return NextResponse.json({ success: true })

  if (data.idempotencyKey) {
    const seen = await checkIdempotency(data.idempotencyKey)
    if (seen) return NextResponse.json({ success: true, duplicate: true })
  }

  const supabase = createServiceClient()

  // Resolve the area name from the published location page.
  const locResult = await supabase
    .from('location_pages')
    .select('area_name')
    .eq('slug', data.locationSlug)
    .eq('status', 'published')
    .single()
  const loc = locResult.data as unknown as LocationRow | null
  if (locResult.error ?? !loc) {
    return NextResponse.json({ error: 'Location not found' }, { status: 404 })
  }

  const insertResult = await supabase
    .from('leads')
    .insert({
      care_home_id: null,
      area: loc.area_name,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      care_for: data.careFor ?? null,
      care_type: careTypeLabel((data.answers as Record<string, unknown> | undefined)?.care_type as string | undefined),
      move_in_timeframe: data.moveInTimeframe ?? null,
      message: data.message ?? null,
      answers: data.answers ?? {},
      utm_source: data.utmSource ?? null,
      utm_medium: data.utmMedium ?? null,
      utm_campaign: data.utmCampaign ?? null,
      utm_content: data.utmContent ?? null,
      utm_term: data.utmTerm ?? null,
      gclid: data.gclid ?? null,
      ip_address: ip,
      user_agent: ua,
      idempotency_key: data.idempotencyKey ?? null,
      marketing_consent: data.consent ?? false,
      consent_at: data.consent ? new Date().toISOString() : null,
      lead_source: 'careassura-location',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    .select('id')
    .single()

  const lead = insertResult.data as unknown as LeadRow | null
  if (insertResult.error ?? !lead) {
    console.error('[api/location-leads] Insert error:', insertResult.error)
    return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 })
  }

  if (data.idempotencyKey) await setIdempotency(data.idempotencyKey)

  const notifyEmail = process.env.NOTIFY_EMAIL
  const leadTemplateId = process.env.SENDGRID_LEAD_TEMPLATE_ID
  if (notifyEmail && leadTemplateId) {
    void sendTemplateEmail({
      to: notifyEmail,
      templateId: leadTemplateId,
      dynamicData: {
        lead_id: lead.id,
        care_home_name: `CareAssura — ${loc.area_name}`,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        care_type: data.careType ?? '',
        move_in_timeframe: data.moveInTimeframe ?? '',
      },
    }).catch(() => {})
  }

  // NOTE: auto-distribution does NOT happen here. The lead is created at the
  // mid-funnel contact step with only partial answers; distributing now would email
  // buyers an incomplete enquiry. Distribution fires on quiz COMPLETION in
  // /api/location-leads/enrich (completed=true), once all answers are saved.

  return NextResponse.json({ success: true, leadId: lead.id })
}
