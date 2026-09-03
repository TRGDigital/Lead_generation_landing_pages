import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import sgMail from '@sendgrid/mail'
import { createServiceClient } from '@/lib/supabase/server'
import { getWebsiteBySlug } from '@/lib/websites'
import { buildCareStreamLeadEmail } from '@/lib/carestream-email'

export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const schema = z.object({
  site: z.string().min(1).max(80),
  name: z.string().max(120).optional(),
  email: z.string().email().max(255).optional().or(z.literal('')),
  phone: z.string().max(40).optional(),
  message: z.string().max(2000).optional(),
  trigger: z.string().max(40).optional(),
  pageUrl: z.string().max(500).optional(),
  consent: z.boolean().optional(),
  answers: z.record(z.string().max(200)).optional(),
  website: z.string().max(0).optional(), // honeypot
})

function getIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown'
}

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
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 422, headers: CORS })
  }
  const { site: slug, name, email, phone, message, trigger, pageUrl, consent, answers, website } = parsed.data

  if (website) return NextResponse.json({ ok: true }, { headers: CORS }) // honeypot
  // Call-bar clicks are tracked without visitor contact details (it's a tap-to-call signal).
  if (trigger !== 'call' && !name && !email && !phone) {
    return NextResponse.json({ error: 'Please provide a contact detail' }, { status: 422, headers: CORS })
  }

  const site = await getWebsiteBySlug(slug)
  if (!site) return NextResponse.json({ error: 'Unknown site' }, { status: 404, headers: CORS })

  const ip = getIp(req)
  const db = createServiceClient() as unknown as any

  // Rate limit: max 5 per IP per hour per site
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await db
    .from('organic_leads')
    .select('id', { count: 'exact', head: true })
    .eq('website_id', site.id)
    .eq('ip_address', ip)
    .gte('created_at', hourAgo)
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429, headers: CORS })
  }

  const { data: inserted, error } = await db.from('organic_leads').insert({
    website_id: site.id,
    name: name ?? null,
    email: email || null,
    phone: phone ?? null,
    message: message ?? null,
    trigger: trigger ?? null,
    page_url: pageUrl ?? null,
    consent: !!consent,
    answers: answers && Object.keys(answers).length ? answers : null,
    ip_address: ip,
  }).select('id').single()
  if (error) {
    console.error('organic_leads insert error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500, headers: CORS })
  }

  // Click-to-call enquiries are tracked and attributed to the call bar, but not emailed
  // per click (the client gets the actual phone call). They show in the leads dashboards.
  if (trigger === 'call') {
    return NextResponse.json({ ok: true }, { headers: CORS })
  }

  const leadId: string | null = inserted?.id ?? null

  // Email alert — organic enquiries are TRG-branded, sent to TRG and to the client
  const apiKey = process.env.SENDGRID_API_KEY
  // Prefer a TRG sender once trgdigital.co.uk is authenticated in SendGrid; fall back to the verified CareAssura sender.
  const fromEmail = process.env.TRG_FROM_EMAIL ?? process.env.SENDGRID_FROM_EMAIL ?? 'leads@careassura.com'
  const trgEmail = process.env.MARKETING_ALERT_EMAIL ?? 'lenny@trgdigital.co.uk'
  const hasClient = !!site.client_email && /.+@.+/.test(site.client_email) && site.client_email !== trgEmail
  const toList = hasClient ? [site.client_email] : [trgEmail]
  const bccList = hasClient ? [trgEmail] : undefined

  const domain = (() => { try { return new URL(site.url).host.replace(/^www\./, '') } catch { return site.url } })()

  if (apiKey) {
    sgMail.setApiKey(apiKey)
    const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))
    const logo = 'https://lead-generation-landing-pages.vercel.app/trg-digital-footer.png'
    const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;border:1px solid #ebe9e4;border-radius:12px;overflow:hidden">
<div style="background:#2a2620;padding:18px 24px"><img src="${logo}" alt="TRG Digital" height="22" style="height:22px;width:auto" /></div>
<div style="padding:24px">
<p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#F0532B;font-weight:700">${trigger === 'callback' ? 'Call back requested' : 'New website enquiry'}</p>
<h1 style="margin:0 0 2px;font-size:20px;color:#2a2620">${esc(site.name)}</h1>
<p style="margin:0 0 16px;font-size:13px;color:#6b6358">via <strong>${esc(domain)}</strong></p>
${trigger === 'callback' && phone ? `<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px;margin:0 0 16px">
<p style="margin:0 0 6px;font-size:13px;color:#9a3412">${esc(name || 'Someone')} asked ${esc(site.name)} to call them back${answers && answers.office === 'closed' ? ' — they came through while you were closed' : ''}.</p>
<a href="tel:${esc(String(phone).replace(/[^0-9+]/g, ''))}" style="font-size:22px;font-weight:700;color:#2a2620;text-decoration:none">${esc(phone)}</a>
</div>` : ''}
<table style="width:100%;font-size:14px;border-collapse:collapse">
<tr><td style="padding:6px 12px 6px 0;color:#6b6358;width:90px"><strong>Website</strong></td><td style="color:#2a2620">${esc(site.name)} (${esc(domain)})</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#6b6358"><strong>Name</strong></td><td style="color:#2a2620">${esc(name ?? '—')}</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#6b6358"><strong>Email</strong></td><td><a href="mailto:${esc(email || '')}" style="color:#F0532B">${esc(email || '—')}</a></td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#6b6358"><strong>Phone</strong></td><td style="color:#2a2620">${esc(phone ?? '—')}</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#6b6358"><strong>Source</strong></td><td style="color:#2a2620">${esc(trigger === 'callback' ? 'call back request (tapped your phone number)' : trigger && trigger.startsWith('tool:') ? trigger.slice(5).replace(/-/g, ' ') + ' tool' : trigger === 'landing' ? 'landing page' : (trigger ? trigger + ' popup' : 'popup'))}</td></tr>
${answers && Object.keys(answers).length ? Object.entries(answers).map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6b6358"><strong>${esc(k)}</strong></td><td style="color:#2a2620">${esc(String(v))}</td></tr>`).join('') : ''}
</table>
${message ? `<p style="margin:16px 0 4px;font-size:13px;color:#6b6358"><strong>Message</strong></p><p style="margin:0;font-size:14px;color:#2a2620;white-space:pre-wrap">${esc(message)}</p>` : ''}
</div>
<div style="background:#f7f6f3;padding:14px 24px;font-size:12px;color:#9a958c">This enquiry came through ${esc(domain)} and was delivered by TRG Digital.</div>
</div>`
    try {
      await sgMail.send({
        to: toList,
        bcc: bccList,
        from: { email: fromEmail, name: 'TRG Digital' },
        replyTo: email || undefined,
        subject: trigger === 'callback'
          ? `Call back request${name ? ` from ${name}` : ''}${phone ? ` — ${phone}` : ''} (${domain})`
          : `New enquiry from ${site.name} (${domain})`,
        html,
      })
    } catch (err) {
      console.error('SendGrid error', err)
    }

    // CareStream-only: send the lead a tailored "how CareStream can help" email,
    // built from their quiz answers. Other sites get the notification above only.
    if (slug === 'carestreamai' && email) {
      const csEmail = buildCareStreamLeadEmail(answers, name)
      if (csEmail) {
        try {
          await sgMail.send({
            to: email,
            from: { email: process.env.CARESTREAM_FROM_EMAIL ?? fromEmail, name: 'CareStream AI' },
            replyTo: process.env.CARESTREAM_REPLY_EMAIL ?? trgEmail,
            subject: csEmail.subject,
            html: csEmail.html,
          })
        } catch (err) {
          console.error('CareStream lead email error', err)
        }
      }
    }
  }

  return NextResponse.json({ ok: true, id: leadId }, { headers: CORS })
}
