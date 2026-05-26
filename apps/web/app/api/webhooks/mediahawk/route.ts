import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import * as Sentry from '@sentry/nextjs'
import { createServiceClient } from '@/lib/supabase/server'
import { sendTemplateEmail } from '@lib/sendgrid'
import { sendSms } from '@lib/twilio'

export const runtime = 'nodejs'

// Mediahawk signs payloads using HMAC-SHA256 of the raw body
async function verifySignature(req: NextRequest, rawBody: string): Promise<boolean> {
  const secret = process.env.MEDIAHAWK_WEBHOOK_SECRET
  if (!secret) {
    console.warn('[webhook:mediahawk] MEDIAHAWK_WEBHOOK_SECRET not set — skipping signature check')
    return process.env.NODE_ENV === 'development'
  }
  const signature = req.headers.get('x-mediahawk-signature') ?? req.headers.get('x-hub-signature-256') ?? ''
  const expected = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

type MediahawkPayload = {
  call_id: string
  caller_number: string
  tracking_number: string
  destination_number: string
  duration_seconds: number
  recording_url?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  gclid?: string
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  const valid = await verifySignature(req, rawBody)
  if (!valid) {
    console.warn('[webhook:mediahawk] Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: MediahawkPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Only create lead for meaningful calls (> 30 seconds)
  if ((payload.duration_seconds ?? 0) <= 30) {
    console.log(`[webhook:mediahawk] Call ${payload.call_id} too short (${payload.duration_seconds}s) — skipped`)
    return NextResponse.json({ ok: true, skipped: 'too_short' })
  }

  const db = createServiceClient() as unknown as any

  // Look up care home by tracking number
  const { data: home } = await db
    .from('care_homes')
    .select('id, name, phone_display, phone_tracking')
    .filter('phone_tracking->>mediahawk_tracking_number', 'eq', payload.tracking_number)
    .single()

  if (!home) {
    console.warn(`[webhook:mediahawk] No care home found for tracking number ${payload.tracking_number}`)
    Sentry.captureMessage(`Mediahawk tracking number not mapped: ${payload.tracking_number}`, 'warning')
    return NextResponse.json({ ok: true, skipped: 'unknown_tracking_number' })
  }

  // Idempotency: skip if call already recorded
  const { count } = await db
    .from('leads')
    .select('id', { count: 'exact', head: true })
    .eq('idempotency_key', `mediahawk:${payload.call_id}`)

  if ((count ?? 0) > 0) {
    return NextResponse.json({ ok: true, skipped: 'duplicate' })
  }

  const { data: lead, error } = await db
    .from('leads')
    .insert({
      care_home_id: home.id,
      full_name: 'Phone enquiry',
      phone: payload.caller_number,
      email: `phone-enquiry-${payload.call_id}@placeholder.invalid`,
      lead_source: 'phone',
      utm_source: payload.utm_source ?? null,
      utm_medium: payload.utm_medium ?? null,
      utm_campaign: payload.utm_campaign ?? null,
      gclid: payload.gclid ?? null,
      message: payload.recording_url ? `Recording: ${payload.recording_url}` : null,
      idempotency_key: `mediahawk:${payload.call_id}`,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[webhook:mediahawk] Insert error:', error)
    Sentry.captureException(error)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  // Same notification pipeline as form leads
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
            care_home_name: home.name,
            full_name: 'Phone enquiry',
            phone: payload.caller_number,
            email: '',
            care_type: '',
            move_in_timeframe: '',
            source: 'Phone call',
          },
        })
      : Promise.resolve(),
    notifyPhone
      ? sendSms({
          to: notifyPhone,
          body: `Phone enquiry for ${home.name}: ${payload.caller_number} (${payload.duration_seconds}s call)`,
        })
      : Promise.resolve(),
  ])

  console.log(`[webhook:mediahawk] Created lead ${lead.id} for ${home.name}`)
  return NextResponse.json({ ok: true, leadId: lead.id })
}
