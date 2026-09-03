import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import sgMail from '@sendgrid/mail'
import { createServiceClient } from '@/lib/supabase/server'
import { getWebsiteBySlug } from '@/lib/websites'

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
    .select('id, name, phone, answers, created_at, trigger, website_id')
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

  // Follow-up email: only once they have finished, and only if they told us something.
  const detail = Object.entries(merged).filter(([k]) => k !== '_sent')
  if (final && detail.length && !(lead.answers ?? {})._sent) {
    await db.from('organic_leads').update({ answers: { ...merged, _sent: '1' } }).eq('id', leadId)
    const apiKey = process.env.SENDGRID_API_KEY
    if (apiKey) {
      sgMail.setApiKey(apiKey)
      const esc = (s: string) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] as string))
      const trgEmail = process.env.MARKETING_ALERT_EMAIL ?? 'lenny@trgdigital.co.uk'
      const hasClient = !!site.client_email && /.+@.+/.test(site.client_email) && site.client_email !== trgEmail
      const domain = (() => { try { return new URL(site.url).host.replace(/^www\./, '') } catch { return site.url } })()
      const rows = detail
        .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6b6358"><strong>${esc(k)}</strong></td><td style="color:#2a2620">${esc(String(v))}</td></tr>`)
        .join('')
      const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;border:1px solid #ebe9e4;border-radius:12px;overflow:hidden">
<div style="padding:24px">
<p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#F0532B;font-weight:700">Before you call back</p>
<h1 style="margin:0 0 12px;font-size:20px;color:#2a2620">${esc(lead.name || 'Your call back request')}${lead.phone ? ` — ${esc(lead.phone)}` : ''}</h1>
<p style="margin:0 0 14px;font-size:14px;color:#57534e">They answered a few questions after asking for a call back, so you know the picture before you ring.</p>
<table style="width:100%;font-size:14px;border-collapse:collapse">${rows}</table>
</div>
<div style="background:#f7f6f3;padding:14px 24px;font-size:12px;color:#9a958c">Came through ${esc(domain)} and was delivered by TRG Digital.</div>
</div>`
      try {
        await sgMail.send({
          to: hasClient ? [site.client_email] : [trgEmail],
          bcc: hasClient ? [trgEmail] : undefined,
          from: { email: process.env.TRG_FROM_EMAIL ?? process.env.SENDGRID_FROM_EMAIL ?? 'leads@careassura.com', name: 'TRG Digital' },
          subject: `More detail before you call ${lead.name || 'them'} back (${domain})`,
          html,
        })
      } catch (err) {
        console.error('SendGrid error (lead-detail)', err)
      }
    }
  }

  return NextResponse.json({ ok: true }, { headers: CORS })
}
