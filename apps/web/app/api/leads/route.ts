import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { LeadSubmissionSchema } from '@lib/schemas'
import { sendTemplateEmail } from '@lib/sendgrid'
import { sendSms } from '@lib/twilio'
import { sendGA4Event } from '@lib/ga4'
import { checkRateLimit, checkIdempotency, setIdempotency } from '@/lib/rate-limit'

// Supabase JS v2 column-select inference doesn't work with our custom Database
// type — see DECISIONS.md ADR-002. Use explicit casts for all query results.
type CareHomeRow = { id: string; name: string; phone_display: string }
type LeadRow = { id: string }

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ua = req.headers.get('user-agent') ?? ''

  const { allowed } = await checkRateLimit(`leads:${ip}`, 5, 600)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = LeadSubmissionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.issues },
      { status: 422 }
    )
  }

  const data = parsed.data

  // Honeypot — silently succeed so bots don't know they were blocked
  if (data.companyWebsite !== '') {
    return NextResponse.json({ success: true })
  }

  // Idempotency check
  if (data.idempotencyKey) {
    const seen = await checkIdempotency(data.idempotencyKey)
    if (seen) {
      return NextResponse.json({ success: true, duplicate: true })
    }
  }

  const supabase = createServiceClient()

  const careHomeResult = await supabase
    .from('care_homes')
    .select('id, name, phone_display')
    .eq('id', data.careHomeId)
    .eq('is_active', true)
    .single()

  // ADR-002: cast because Supabase v2 type inference returns never for new tables
  const careHome = careHomeResult.data as unknown as CareHomeRow | null

  if (careHomeResult.error ?? !careHome) {
    return NextResponse.json({ error: 'Care home not found' }, { status: 404 })
  }

  // ADR-002: insert parameter typed as any to work around never[] inference
  const insertResult = await supabase
    .from('leads')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({
      care_home_id: data.careHomeId,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      resident_name: data.residentName ?? null,
      care_type: data.careType ?? null,
      move_in_timeframe: data.moveInTimeframe ?? null,
      message: data.message ?? null,
      utm_source: data.utmSource ?? null,
      utm_medium: data.utmMedium ?? null,
      utm_campaign: data.utmCampaign ?? null,
      utm_content: data.utmContent ?? null,
      utm_term: data.utmTerm ?? null,
      gclid: data.gclid ?? null,
      ip_address: ip,
      user_agent: ua,
      idempotency_key: data.idempotencyKey ?? null,
      lead_source: 'form',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
    .select('id')
    .single()

  const lead = insertResult.data as unknown as LeadRow | null

  if (insertResult.error ?? !lead) {
    console.error('[api/leads] Insert error:', insertResult.error)
    return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 })
  }

  if (data.idempotencyKey) {
    await setIdempotency(data.idempotencyKey)
  }

  const notifyEmail = process.env.NOTIFY_EMAIL
  const leadTemplateId = process.env.SENDGRID_LEAD_TEMPLATE_ID
  const notifyPhone = process.env.NOTIFY_PHONE

  void Promise.allSettled([
    notifyEmail && leadTemplateId
      ? sendTemplateEmail({
          to: notifyEmail,
          templateId: leadTemplateId,
          dynamicData: {
            lead_id: lead.id,
            care_home_name: careHome.name,
            full_name: data.fullName,
            email: data.email,
            phone: data.phone,
            care_type: data.careType ?? '',
            move_in_timeframe: data.moveInTimeframe ?? '',
          },
        })
      : Promise.resolve(),

    notifyPhone
      ? sendSms({
          to: notifyPhone,
          body: `New enquiry for ${careHome.name}: ${data.fullName} (${data.phone})`,
        })
      : Promise.resolve(),

    process.env.GA4_MEASUREMENT_ID && process.env.GA4_API_SECRET
      ? sendGA4Event(
          process.env.GA4_MEASUREMENT_ID,
          process.env.GA4_API_SECRET,
          data.gclid ?? ip,
          {
            name: 'generate_lead',
            params: {
              care_home_id: data.careHomeId,
              source: data.utmSource ?? 'direct',
            },
          }
        )
      : Promise.resolve(),
  ])

  return NextResponse.json({ success: true, leadId: lead.id })
}
