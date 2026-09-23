import { type NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import sgMail from '@sendgrid/mail'
import { createServiceClient } from '@/lib/supabase/server'

// Google Ads lead form assets post their leads here.
//
// Google has no usable email delivery of its own: the notification it offers only
// says "you have new leads", it rejects most sender domains, and it deletes the
// leads after 30 days. So this endpoint is the delivery method. It stores the lead
// in marketing_leads alongside the /go/ quiz leads and emails it straight out
// through SendGrid, which means the alerts can go to any address we like.
//
// Set the same key in Google Ads and in GOOGLE_LEAD_WEBHOOK_KEY. Google will not
// let the form be saved until "Send test data" gets a 200 back from this URL.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALERT_FALLBACK = 'lenny@trgdigital.co.uk'

type LeadField = {
  column_id?: string
  column_name?: string
  string_value?: string
}

type LeadPayload = {
  lead_id?: string
  api_version?: string
  form_id?: number | string
  campaign_id?: number | string
  adgroup_id?: number | string
  creative_id?: number | string
  gcl_id?: string
  google_key?: string
  is_test?: boolean
  user_column_data?: LeadField[]
}

/** Constant-time compare that never throws on a length mismatch. */
function keyMatches(sent: string, expected: string): boolean {
  const a = Buffer.from(sent)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}

/**
 * Google sends its standard fields with a stable column_id, and every custom
 * question with only the question text. So known fields are picked by id, and
 * anything left over is kept verbatim as a question and answer.
 */
function readLead(fields: LeadField[]) {
  const known: Record<string, string> = {}
  const custom: Array<[string, string]> = []

  for (const f of fields.slice(0, 40)) {
    const value = String(f.string_value ?? '').trim().slice(0, 500)
    if (!value) continue
    const id = String(f.column_id ?? '').toUpperCase()
    const label = String(f.column_name ?? '').trim().slice(0, 200)

    switch (id) {
      case 'FULL_NAME':
      case 'FIRST_NAME':
      case 'LAST_NAME':
        known.name = known.name ? `${known.name} ${value}`.trim() : value
        break
      case 'EMAIL':
        known.email = value
        break
      case 'PHONE_NUMBER':
        known.phone = value
        break
      case 'COMPANY_NAME':
        known.company = value
        break
      case 'JOB_TITLE':
        known.jobTitle = value
        break
      case 'POSTAL_CODE':
      case 'CITY':
      case 'REGION':
      case 'COUNTRY':
        custom.push([label || id, value])
        break
      default:
        custom.push([label || id || 'Answer', value])
    }
  }

  return {
    name: known.name ?? '',
    email: known.email ?? '',
    phone: known.phone ?? '',
    company: known.company ?? '',
    jobTitle: known.jobTitle ?? '',
    custom,
  }
}

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] as string)

export async function POST(req: NextRequest) {
  const expectedKey = process.env.GOOGLE_LEAD_WEBHOOK_KEY
  if (!expectedKey) {
    // Fail closed. An open lead webhook is an open door for junk.
    console.error('[webhook:google-lead-form] GOOGLE_LEAD_WEBHOOK_KEY is not set')
    return NextResponse.json({ error: 'Not configured' }, { status: 503 })
  }

  let body: LeadPayload
  try {
    body = (await req.json()) as LeadPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!keyMatches(String(body.google_key ?? ''), expectedKey)) {
    console.warn('[webhook:google-lead-form] rejected: bad key')
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const leadId = String(body.lead_id ?? '').slice(0, 200)
  const isTest = body.is_test === true
  const lead = readLead(body.user_column_data ?? [])

  const campaign = String(body.campaign_id ?? '')
  const gclid = String(body.gcl_id ?? '').slice(0, 200)
  const db = createServiceClient() as unknown as any

  // Google retries a delivery it did not get a 200 for, so the same lead can
  // arrive more than once. Return 200 on a repeat: retrying will not help it.
  if (leadId) {
    const { data: existing } = await db
      .from('marketing_leads')
      .select('id')
      .eq('source', 'google-lead-form')
      .like('message', `%Lead ID: ${leadId}%`)
      .limit(1)
    if (existing?.length) {
      return NextResponse.json({ ok: true, duplicate: true })
    }
  }

  const detailLines = [
    ...lead.custom.map(([q, a]) => `${q}: ${a}`),
    lead.jobTitle ? `Job title: ${lead.jobTitle}` : '',
    '',
    `Lead ID: ${leadId || 'none'}`,
    campaign ? `Campaign: ${campaign}` : '',
    body.form_id ? `Form: ${body.form_id}` : '',
    body.adgroup_id ? `Ad group: ${body.adgroup_id}` : '',
    gclid ? `gclid=${gclid}` : '',
  ].filter(Boolean)

  const message = [
    isTest ? 'GOOGLE TEST LEAD (sent by the Send test data button)' : 'Google Ads lead form',
    ...detailLines,
  ].join('\n')

  const { error } = await db.from('marketing_leads').insert({
    // Google guarantees neither a name nor an email on every form, but the
    // columns are NOT NULL, so fall back rather than drop the lead.
    name: lead.name || 'Google lead form',
    email: lead.email || 'no-email@trgdigital.co.uk',
    company: lead.company || null,
    phone: lead.phone || null,
    message,
    source: 'google-lead-form',
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: campaign || null,
  })
  if (error) {
    // A 500 makes Google retry, which is what we want if the write failed.
    console.error('[webhook:google-lead-form] insert error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  const apiKey = process.env.SENDGRID_API_KEY
  const recipients = (process.env.GOOGLE_LEAD_ALERT_EMAIL ?? process.env.MARKETING_ALERT_EMAIL ?? ALERT_FALLBACK)
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
  const fromEmail = process.env.TRG_FROM_EMAIL ?? process.env.SENDGRID_FROM_EMAIL ?? 'leads@careassura.com'

  if (apiKey) {
    sgMail.setApiKey(apiKey)
    const rows = [
      ['Name', lead.name || '—'],
      ['Email', lead.email || '—'],
      ['Phone', lead.phone || '—'],
      ['Company', lead.company || '—'],
      lead.jobTitle ? ['Job title', lead.jobTitle] : null,
      ...lead.custom,
    ].filter(Boolean) as Array<[string, string]>

    const tableRows = rows
      .map(
        ([k, v]) =>
          `<tr><td style="padding:5px 14px 5px 0;vertical-align:top;white-space:nowrap"><strong>${esc(k)}</strong></td><td style="padding:5px 0">${esc(v)}</td></tr>`
      )
      .join('')

    try {
      await sgMail.send({
        to: recipients,
        from: { email: fromEmail, name: 'TRG Digital' },
        ...(lead.email ? { replyTo: lead.email } : {}),
        subject: `${isTest ? '[TEST] ' : ''}Google Ads lead form: ${lead.name || 'new lead'}${lead.company ? ` (${lead.company})` : ''}`,
        html: `<h2 style="font-family:sans-serif;margin-bottom:4px">${isTest ? 'Test lead from Google' : 'New lead from a Google Ads lead form'}</h2>
${isTest ? '<p style="font-family:sans-serif;font-size:13px;color:#a15c00">This came from the Send test data button in Google Ads. The details are dummy data.</p>' : ''}
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${tableRows}</table>
<p style="font-family:sans-serif;font-size:12px;color:#666;margin-top:16px">
Campaign ${esc(campaign || 'unknown')}${body.form_id ? ` · form ${esc(String(body.form_id))}` : ''}${gclid ? ' · click tracked' : ''}<br>
Saved in the admin under Marketing leads.
</p>`,
      })
    } catch (err) {
      // The lead is already saved. Never make Google retry over a failed email.
      console.error('[webhook:google-lead-form] SendGrid error', err)
    }
  } else {
    console.warn('[webhook:google-lead-form] SENDGRID_API_KEY not set, lead saved but no email sent')
  }

  return NextResponse.json({ ok: true })
}

// Google only ever POSTs. A GET is someone (or you) checking the URL is alive.
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: 'google-lead-form',
    configured: Boolean(process.env.GOOGLE_LEAD_WEBHOOK_KEY),
  })
}
