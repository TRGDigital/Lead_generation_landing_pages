import sgMail from '@sendgrid/mail'
import type { Website } from '@/lib/websites'

// The single notification for a call back request.
//
// A call back is captured the moment the visitor gives a name and number, but the questions
// that follow arrive over the next minute or so. Sending at capture would mean a second email
// with the useful part, so instead nothing is sent until the answers are in: either when the
// visitor finishes (usually within a minute) or when the sweep gives up waiting. One email,
// complete, and never blocked on detail that may never arrive.

// Internal bookkeeping the provider should never be shown.
const INTERNAL = new Set(['via', 'office', '_sent'])

export type CallbackLead = {
  id: string
  name: string | null
  phone: string | null
  email?: string | null
  message: string | null
  page_url?: string | null
  answers: Record<string, string> | null
  created_at: string
}

const esc = (s: unknown) =>
  String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))

export function buildCallbackEmail(site: Website, lead: CallbackLead) {
  const answers = lead.answers ?? {}
  const detail = Object.entries(answers).filter(([k]) => !INTERNAL.has(k))
  const closed = answers.office === 'closed'
  const domain = (() => {
    try {
      return new URL(site.url).host.replace(/^www\./, '')
    } catch {
      return site.url
    }
  })()
  const tel = String(lead.phone ?? '').replace(/[^0-9+]/g, '')

  const rows = [
    ['Name', esc(lead.name || '—')],
    ['Phone', lead.phone ? `<a href="tel:${esc(tel)}" style="color:#F0532B">${esc(lead.phone)}</a>` : '—'],
    ...detail.map(([k, v]) => [esc(k), esc(v)]),
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:7px 12px 7px 0;color:#6b6358;vertical-align:top;width:44%"><strong>${k}</strong></td><td style="color:#2a2620">${v}</td></tr>`,
    )
    .join('')

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;border:1px solid #ebe9e4;border-radius:12px;overflow:hidden">
<div style="background:#2a2620;padding:18px 24px"><img src="https://lead-generation-landing-pages.vercel.app/trg-digital-footer.png" alt="TRG Digital" height="22" style="height:22px;width:auto" /></div>
<div style="padding:24px">
<p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#F0532B;font-weight:700">Call back requested</p>
<h1 style="margin:0 0 2px;font-size:20px;color:#2a2620">${esc(site.name)}</h1>
<p style="margin:0 0 16px;font-size:13px;color:#6b6358">via <strong>${esc(domain)}</strong></p>
<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:14px 16px;margin:0 0 18px">
<p style="margin:0 0 6px;font-size:13px;color:#9a3412">${esc(lead.name || 'Someone')} asked you to call them back${closed ? ' — they came through while you were closed' : ''}.</p>
${lead.phone ? `<a href="tel:${esc(tel)}" style="font-size:24px;font-weight:700;color:#2a2620;text-decoration:none">${esc(lead.phone)}</a>` : ''}
</div>
<table style="width:100%;font-size:14px;border-collapse:collapse">${rows}</table>
${lead.message ? `<p style="margin:18px 0 4px;font-size:13px;color:#6b6358"><strong>What they said</strong></p><p style="margin:0;font-size:14px;color:#2a2620;white-space:pre-wrap">${esc(lead.message)}</p>` : ''}
${detail.length === 0 ? `<p style="margin:18px 0 0;font-size:13px;color:#9a958c">They did not answer the follow up questions, so a call is the quickest way to find out what they need.</p>` : ''}
</div>
<div style="background:#f7f6f3;padding:14px 24px;font-size:12px;color:#9a958c">This request came through ${esc(domain)} and was delivered by TRG Digital.</div>
</div>`

  return {
    subject: `Call back request${lead.name ? ` from ${lead.name}` : ''}${lead.phone ? ` — ${lead.phone}` : ''} (${domain})`,
    html,
  }
}

// Sends once and records it, so the visitor finishing and the sweep can never both fire.
export async function sendCallbackEmail(db: any, site: Website, lead: CallbackLead): Promise<boolean> {
  const { data: claimed } = await db
    .from('organic_leads')
    .update({ notified_at: new Date().toISOString() })
    .eq('id', lead.id)
    .is('notified_at', null)
    .select('id')
  if (!claimed || claimed.length === 0) return false // already sent by the other path

  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) return false
  sgMail.setApiKey(apiKey)

  const trgEmail = process.env.MARKETING_ALERT_EMAIL ?? 'lenny@trgdigital.co.uk'
  const hasClient = !!site.client_email && /.+@.+/.test(site.client_email) && site.client_email !== trgEmail
  const { subject, html } = buildCallbackEmail(site, lead)

  try {
    await sgMail.send({
      to: hasClient ? [site.client_email] : [trgEmail],
      bcc: hasClient ? [trgEmail] : undefined,
      from: {
        email: process.env.TRG_FROM_EMAIL ?? process.env.SENDGRID_FROM_EMAIL ?? 'leads@careassura.com',
        name: 'TRG Digital',
      },
      subject,
      html,
    })
    return true
  } catch (err) {
    console.error('SendGrid error (call back)', err)
    // Let the sweep try again rather than losing the notification entirely.
    await db.from('organic_leads').update({ notified_at: null }).eq('id', lead.id)
    return false
  }
}
