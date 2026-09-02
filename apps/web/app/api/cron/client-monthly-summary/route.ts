import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyCronSecret } from '@/lib/cron'

// Monthly "here's what TRG generated for you" summary, emailed to each client. Proves the
// ROI of the tools, pop-up, landing page and call bar we add to their site. Runs on the
// 1st of each month and reports the previous calendar month.
export const runtime = 'nodejs'
export const maxDuration = 120

type Lead = { trigger: string | null }

function categorise(rows: Lead[]) {
  let calls = 0, callbacks = 0, tools = 0, landing = 0, popup = 0
  for (const r of rows) {
    const t = r.trigger || ''
    if (t === 'callback') callbacks++
    else if (t === 'call') calls++
    else if (t.startsWith('tool:')) tools++
    else if (t === 'landing') landing++
    else popup++
  }
  return { calls, callbacks, tools, landing, popup, total: rows.length }
}

function esc(s: string) {
  return String(s ?? '').replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c] as string))
}

function buildHtml(siteName: string, monthLabel: string, c: ReturnType<typeof categorise>) {
  const items = [
    { label: 'Phone calls', n: c.calls },
    { label: 'Pop-up enquiries', n: c.popup },
    { label: 'Care tool enquiries', n: c.tools },
    { label: 'Landing page enquiries', n: c.landing },
  ].filter((i) => i.n > 0)

  const breakdown = items
    .map((i) => `<tr><td style="padding:7px 0;color:#57534e;border-top:1px solid #ece9e3">${esc(i.label)}</td><td style="padding:7px 0;text-align:right;font-weight:700;color:#2a2620;border-top:1px solid #ece9e3">${i.n}</td></tr>`)
    .join('')

  return `<!doctype html><html><body style="margin:0;background:#f7f6f3;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f6f3;padding:24px 0"><tr><td align="center">
<table role="presentation" width="540" cellpadding="0" cellspacing="0" style="width:540px;max-width:92%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.06)">
  <tr><td style="background:#2a2620;padding:20px 28px">
    <span style="color:#fff;font-size:18px;font-weight:800;letter-spacing:-.01em">TRG <span style="color:#F0532B">Digital</span></span>
  </td></tr>
  <tr><td style="padding:28px">
    <p style="margin:0 0 4px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#F0532B">Your monthly results · ${esc(monthLabel)}</p>
    <h1 style="margin:0 0 14px;font-size:22px;color:#2a2620">${esc(siteName)}</h1>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.5;color:#57534e">Here's what your website generated last month through the tools and lead capture we built into it.</p>
    <div style="background:#fff7f4;border:1px solid #f6d9cf;border-radius:12px;padding:18px;text-align:center">
      <p style="margin:0;font-size:40px;font-weight:800;color:#F0532B;line-height:1">${c.total}</p>
      <p style="margin:4px 0 0;font-size:14px;color:#57534e">enquiries generated for you${c.callbacks ? `, including <strong style="color:#2a2620">${c.callbacks}</strong> call back ${c.callbacks === 1 ? 'request' : 'requests'}` : ''}${c.calls ? `, plus <strong style="color:#2a2620">${c.calls}</strong> ${c.calls === 1 ? 'tap' : 'taps'} on your phone number` : ''}</p>
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0 0;font-size:14px">${breakdown}</table>
    <p style="margin:22px 0 0;font-size:13px;line-height:1.5;color:#9a958c">Every one of these came through the website, pop-up, care tools, landing page and click-to-call bar that TRG Digital added to your site. Questions, or want to do even more next month? Just reply to this email.</p>
  </td></tr>
  <tr><td style="background:#f7f6f3;padding:16px 28px;text-align:center;font-size:11px;color:#9a958c">Sent by TRG Digital · www.trgdigital.co.uk</td></tr>
</table></td></tr></table></body></html>`
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServiceClient() as unknown as any
  const now = new Date()
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)) // start of this month
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)) // start of last month
  const monthLabel = start.toLocaleString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })

  const { data: sites } = await db.from('websites').select('id, name, client_email').neq('client_email', '')

  const apiKey = process.env.SENDGRID_API_KEY
  const fromEmail = process.env.TRG_FROM_EMAIL ?? process.env.SENDGRID_FROM_EMAIL ?? 'leads@careassura.com'
  const trgEmail = process.env.MARKETING_ALERT_EMAIL ?? 'lenny@trgdigital.co.uk'
  if (apiKey) sgMail.setApiKey(apiKey)

  const result = { month: monthLabel, sent: 0, skipped: 0, errored: 0 }

  for (const site of (sites ?? []) as { id: string; name: string; client_email: string }[]) {
    if (!site.client_email || !/.+@.+/.test(site.client_email)) { result.skipped++; continue }
    const { data: leads } = await db
      .from('organic_leads')
      .select('trigger, created_at')
      .eq('website_id', site.id)
      .gte('created_at', start.toISOString())
      .lt('created_at', end.toISOString())

    const rows = (leads ?? []) as Lead[]
    if (rows.length === 0) { result.skipped++; continue } // don't send an empty-month email

    const c = categorise(rows)
    if (!apiKey) { result.skipped++; continue }
    try {
      await sgMail.send({
        to: site.client_email,
        bcc: site.client_email === trgEmail ? undefined : trgEmail,
        from: { email: fromEmail, name: 'TRG Digital' },
        subject: `Your enquiries from TRG, ${monthLabel}`,
        html: buildHtml(site.name, monthLabel, c),
      })
      result.sent++
    } catch (e) {
      console.error('[cron:client-monthly-summary] send failed for', site.name, e)
      result.errored++
    }
  }

  return NextResponse.json({ ok: true, ...result })
}
