import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import sgMail from '@sendgrid/mail'
import { createServiceClient } from '@/lib/supabase/server'
import { enrollLead, sendNurtureEmail } from '@/lib/tool-nurture/send'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  company: z.string().max(255).optional(),
  phone: z.string().max(30).optional(),
  message: z.string().min(10).max(2000),
  website: z.string().max(0, 'Bot detected').optional(),
  heard_about: z.string().max(80).optional(),
  landing_page: z.string().max(500).optional(),
  first_referrer: z.string().max(500).optional(),
  utm_source: z.string().max(120).optional(),
  utm_medium: z.string().max(120).optional(),
  utm_campaign: z.string().max(200).optional(),
})

// A plain-English channel for the alert email, from the first-touch referrer and UTM tags.
function describeChannel(a: { first_referrer?: string; utm_source?: string; utm_medium?: string }): string {
  if (a.utm_medium === 'cpc' || a.utm_medium === 'ppc' || a.utm_medium === 'paid') return `Paid (${a.utm_source ?? 'ads'})`
  if (a.utm_source) return `Campaign (${a.utm_source}${a.utm_medium ? ` / ${a.utm_medium}` : ''})`
  const ref = a.first_referrer ?? ''
  let host = ''
  try { host = ref ? new URL(ref).hostname.replace(/^www\./, '') : '' } catch { host = '' }
  if (!host) return 'Direct or unknown'
  if (/chatgpt\.com|openai\.com|perplexity\.ai|gemini\.google|claude\.ai|copilot\.microsoft/.test(host)) return `AI assistant (${host})`
  if (/(^|\.)google\./.test(host)) return 'Google (organic)'
  if (/(^|\.)bing\.com$/.test(host)) return 'Bing (organic)'
  if (/duckduckgo|yahoo|ecosia/.test(host)) return `Search (${host})`
  if (/linkedin\.com|lnkd\.in/.test(host)) return 'LinkedIn'
  if (/facebook\.com|instagram\.com|t\.co$|x\.com/.test(host)) return `Social (${host})`
  return `Referral (${host})`
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { name, email, company, phone, message, website, heard_about, landing_page, first_referrer, utm_source, utm_medium, utm_campaign } = parsed.data
  const channel = describeChannel({ first_referrer, utm_source, utm_medium })

  // Honeypot
  if (website) {
    return NextResponse.json({ ok: true })
  }

  const ip = getIp(req)
  const db = createServiceClient() as unknown as any

  // Rate limit: max 3 submissions per IP per hour
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await db
    .from('marketing_leads')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', hourAgo)

  if ((count ?? 0) >= 3) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Insert lead
  const { data: lead, error: insertError } = await db
    .from('marketing_leads')
    .insert({
      name,
      email,
      company: company ?? null,
      phone: phone ?? null,
      message,
      ip_address: ip,
      source: req.headers.get('referer') ?? null,
      user_agent: req.headers.get('user-agent')?.slice(0, 500) ?? null,
      heard_about: heard_about ?? null,
      landing_page: landing_page ?? null,
      first_referrer: first_referrer ?? null,
      utm_source: utm_source ?? null,
      utm_medium: utm_medium ?? null,
      utm_campaign: utm_campaign ?? null,
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('marketing_leads insert error', insertError)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  // Tool-signup nurture: enrol the lead and fire the day-0 welcome now; the rest of
  // the sequence goes out via the daily cron. Gated by NURTURE_ENABLED so live sending
  // only starts once it is switched on in the environment. ToolLeadGate sends a message
  // beginning "Used the <tool>." which is how we identify a tool signup.
  if (process.env.NURTURE_ENABLED === 'true' && /^used the /i.test(message)) {
    try {
      const toolSlug = (req.headers.get('referer') ?? '').match(/\/tools\/([a-z0-9-]+)/i)?.[1] ?? null
      const { enrollment, isNew } = await enrollLead({ db, leadId: lead?.id ?? null, email, name, toolSlug })
      if (enrollment && isNew && enrollment.status === 'active') {
        await sendNurtureEmail({
          db,
          emailId: 'welcome',
          to: email,
          name,
          enrollmentId: enrollment.id,
          unsubscribeToken: enrollment.unsubscribe_token,
        })
      }
    } catch (err) {
      console.error('nurture enroll error', err)
      // Never fail the lead capture because of the nurture step.
    }
  }

  // SendGrid alert — always send (uses a template if one is configured, otherwise a plain HTML email)
  const apiKey = process.env.SENDGRID_API_KEY
  const templateId = process.env.SENDGRID_TPL_MARKETING_LEAD
  // Always alert lenny@trgdigital.co.uk, plus any additionally-configured alert address.
  const configuredAlert = process.env.MARKETING_ALERT_EMAIL?.trim()
  const toEmail = Array.from(new Set(['lenny@trgdigital.co.uk', ...(configuredAlert ? [configuredAlert] : [])]))
  const fromEmail = process.env.TRG_FROM_EMAIL ?? process.env.SENDGRID_FROM_EMAIL ?? 'leads@careassura.com'
  const fromName = 'TRG Digital'

  if (apiKey) {
    sgMail.setApiKey(apiKey)
    const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))
    const common = {
      to: toEmail,
      from: { email: fromEmail, name: fromName },
      replyTo: email,
    }
    try {
      if (templateId) {
        await sgMail.send({ ...common, templateId, dynamicTemplateData: { name, email, company, phone, message, heard_about, channel, landing_page } })
      } else {
        await sgMail.send({
          ...common,
          subject: `New website enquiry from ${name}${company ? ` (${company})` : ''}`,
          html: `<h2 style="font-family:sans-serif">New enquiry from the TRG Digital website</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
<tr><td style="padding:4px 12px 4px 0"><strong>Name</strong></td><td>${esc(name)}</td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>Email</strong></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>Company</strong></td><td>${esc(company ?? '—')}</td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>Phone</strong></td><td>${esc(phone ?? '—')}</td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>Heard about us</strong></td><td>${esc(heard_about ?? 'Not answered')}</td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>Channel</strong></td><td>${esc(channel)}</td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>First page</strong></td><td>${esc(landing_page ?? 'Unknown')}</td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>Sent from</strong></td><td>${esc(req.headers.get('referer') ?? 'Unknown')}</td></tr>
</table>
<p style="font-family:sans-serif;font-size:14px"><strong>Message</strong></p>
<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${esc(message)}</p>`,
        })
      }
    } catch (err) {
      console.error('SendGrid error', err)
      // Don't fail the request — lead is already saved
    }
  }

  return NextResponse.json({ ok: true })
}
