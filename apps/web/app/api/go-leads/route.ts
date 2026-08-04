import { type NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { createServiceClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { getGoPage } from '@/lib/go-pages'

// Lead capture for the TRG /go/ ad landing pages: stores in marketing_leads and
// emails the page's recipients (fallback: the marketing alert inbox).
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = await checkRateLimit(`go-leads:${ip}`, 5, 600)
  if (!allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const slug = String(body?.slug ?? '').trim()
  const name = String(body?.name ?? '').trim().slice(0, 200)
  const email = String(body?.email ?? '').trim().slice(0, 200)
  const phone = String(body?.phone ?? '').trim().slice(0, 50)
  const company = String(body?.company ?? '').trim().slice(0, 200)
  const answers = (body?.answers ?? {}) as Record<string, string>
  const utm = (body?.utm ?? {}) as Record<string, string>

  if (!slug || !name || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Please fill in your name and a valid email.' }, { status: 400 })
  }

  const page = await getGoPage(slug)
  if (!page || page.status !== 'published') {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 })
  }

  // Quiz answers + UTM go into the message so they show in /admin/marketing-leads as-is.
  const answerLines = Object.entries(answers)
    .slice(0, 20)
    .map(([q, a]) => `${String(q).slice(0, 200)}: ${String(a).slice(0, 200)}`)
  const utmLine = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'gclid']
    .map((k) => (utm[k] ? `${k}=${String(utm[k]).slice(0, 120)}` : null))
    .filter(Boolean)
    .join(' ')
  const message = [
    `Quiz: ${page.service} (/go/${slug})`,
    ...answerLines,
    utmLine ? `\n${utmLine}` : '',
  ].join('\n')

  const db = createServiceClient() as unknown as any
  const { error } = await db.from('marketing_leads').insert({
    name,
    email,
    company: company || null,
    phone: phone || null,
    message,
    ip_address: ip,
    source: `/go/${slug}`,
  })
  if (error) {
    console.error('[api/go-leads] insert error', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  // Email the page's recipients (fallback to the marketing alert inbox).
  const apiKey = process.env.SENDGRID_API_KEY
  const recipients = page.notify_emails?.length
    ? page.notify_emails
    : [process.env.MARKETING_ALERT_EMAIL ?? 'lenny@trgdigital.co.uk']
  const fromEmail = process.env.TRG_FROM_EMAIL ?? process.env.SENDGRID_FROM_EMAIL ?? 'leads@careassura.com'

  if (apiKey) {
    sgMail.setApiKey(apiKey)
    const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] as string)
    const rows = answerLines
      .map((l) => {
        const i = l.indexOf(':')
        return `<tr><td style="padding:4px 12px 4px 0;vertical-align:top"><strong>${esc(l.slice(0, i))}</strong></td><td>${esc(l.slice(i + 1).trim())}</td></tr>`
      })
      .join('')
    try {
      await sgMail.send({
        to: recipients,
        from: { email: fromEmail, name: 'TRG Digital' },
        replyTo: email,
        subject: `New ${page.service} lead from ${name}${company ? ` (${company})` : ''}`,
        html: `<h2 style="font-family:sans-serif">New lead — ${esc(page.service)} landing page</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
<tr><td style="padding:4px 12px 4px 0"><strong>Name</strong></td><td>${esc(name)}</td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>Email</strong></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>Phone</strong></td><td>${esc(phone || '—')}</td></tr>
<tr><td style="padding:4px 12px 4px 0"><strong>Care home</strong></td><td>${esc(company || '—')}</td></tr>
${rows}
</table>
${utmLine ? `<p style="font-family:sans-serif;font-size:12px;color:#666">${esc(utmLine)}</p>` : ''}`,
      })
    } catch (err) {
      console.error('[api/go-leads] SendGrid error', err)
      // Lead is saved — don't fail the request.
    }
  }

  return NextResponse.json({ ok: true })
}
