import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendHtmlEmail } from '@lib/sendgrid'
import { verifyCronSecret, logCronRun } from '@/lib/cron'

// Weekly digest to Len: every nurture email sent in the last 7 days with opens and
// clicks, plus new leads captured and anyone who unsubscribed or bounced.
// Scheduled Monday mornings in vercel.json.

export const runtime = 'nodejs'
export const maxDuration = 60

const TO = 'lenny@trgdigital.co.uk'

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = createServiceClient() as unknown as any
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString()

  const [{ data: sends }, { data: enrollments }, { data: leads }] = await Promise.all([
    db
      .from('nurture_sends')
      .select('email_id, recipient, sent_at, opened_at, clicked_at, bounced_at, unsubscribed_at, open_count, click_count, is_preview, nurture_enrollments(name, tool_slug)')
      .gte('sent_at', since)
      .eq('is_preview', false)
      .order('sent_at', { ascending: false })
      .limit(500),
    db
      .from('nurture_enrollments')
      .select('name, email, tool_slug, status, enrolled_at')
      .gte('enrolled_at', since)
      .order('enrolled_at', { ascending: false })
      .limit(200),
    db
      .from('marketing_leads')
      .select('name, email, message, source, created_at')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  // Cross reference every address we emailed or captured against the Lead Engine
  // (separate Supabase project) so known prospects are flagged in the digest.
  const s = (sends ?? []) as any[]
  const allEmails = [
    ...new Set(
      [...s.map((x) => x.recipient), ...((enrollments ?? []) as any[]).map((e) => e.email), ...((leads ?? []) as any[]).map((l) => l.email)]
        .filter(Boolean)
        .map((e: string) => e.toLowerCase().trim())
    ),
  ]
  const known: Record<string, { name: string; town: string; cqc: string; score: number | null }> = {}
  const leUrl = process.env.LEAD_ENGINE_SUPABASE_URL
  const leKey = process.env.LEAD_ENGINE_SERVICE_ROLE_KEY
  if (leUrl && leKey && allEmails.length) {
    try {
      const list = allEmails.map((e) => `"${e.replace(/"/g, '')}"`).join(',')
      const r = await fetch(
        `${leUrl}/rest/v1/provider_leads?or=(email.in.(${list}),enriched_email.in.(${list}),alt_email.in.(${list}))&select=name,town,cqc_rating,score,email,enriched_email,alt_email&limit=200`,
        { headers: { apikey: leKey, Authorization: `Bearer ${leKey}` } }
      )
      if (r.ok) {
        for (const p of (await r.json()) as any[]) {
          for (const e of [p.email, p.enriched_email, p.alt_email]) {
            if (e) known[String(e).toLowerCase().trim()] = { name: p.name, town: p.town, cqc: p.cqc_rating, score: p.score }
          }
        }
      }
    } catch {
      // digest still goes out without the cross reference
    }
  }
  const knownTag = (email: string) => {
    const k = known[String(email || '').toLowerCase().trim()]
    return k
      ? `<br><span style="color:#7c3aed;font-size:12px">★ Lead Engine: ${esc(k.name)}${k.town ? `, ${esc(k.town)}` : ''}${k.cqc ? ` · CQC ${esc(k.cqc)}` : ''}${k.score != null ? ` · score ${esc(k.score)}` : ''}</span>`
      : ''
  }
  const matched = allEmails.filter((e) => known[e]).length
  const opened = s.filter((x) => x.opened_at).length
  const clicked = s.filter((x) => x.clicked_at).length
  const bounced = s.filter((x) => x.bounced_at)
  const unsubs = s.filter((x) => x.unsubscribed_at)
  const pct = (n: number) => (s.length ? Math.round((n / s.length) * 100) : 0)

  const sendRows = s
    .map(
      (x) => `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(x.nurture_enrollments?.name || x.recipient)}<br><span style="color:#888;font-size:12px">${esc(x.recipient)}</span>${knownTag(x.recipient)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(x.email_id)}<br><span style="color:#888;font-size:12px">${esc(x.nurture_enrollments?.tool_slug || '')}</span></td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;white-space:nowrap">${new Date(x.sent_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${x.opened_at ? `✓ ×${x.open_count || 1}` : '–'}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${x.clicked_at ? `✓ ×${x.click_count || 1}` : '–'}</td>
      </tr>`
    )
    .join('')

  const enrollRows = ((enrollments ?? []) as any[])
    .map(
      (e) => `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(e.name || '')}<br><span style="color:#888;font-size:12px">${esc(e.email)}</span>${knownTag(e.email)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(e.tool_slug)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;white-space:nowrap">${new Date(e.enrolled_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
      </tr>`
    )
    .join('')

  const leadRows = ((leads ?? []) as any[])
    .map(
      (l) => `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(l.name || '')}<br><span style="color:#888;font-size:12px">${esc(l.email)}</span>${knownTag(l.email)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(String(l.message || '').slice(0, 90))}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;white-space:nowrap">${new Date(l.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</td>
      </tr>`
    )
    .join('')

  const alerts = [
    ...bounced.map((x) => `Bounced: ${esc(x.recipient)} (${esc(x.email_id)})`),
    ...unsubs.map((x) => `Unsubscribed: ${esc(x.recipient)} (after ${esc(x.email_id)})`),
  ]

  const table = (head: string, rows: string, empty: string) =>
    rows
      ? `<table style="border-collapse:collapse;width:100%;font-size:14px"><tr style="text-align:left;color:#666;font-size:12px">${head}</tr>${rows}</table>`
      : `<p style="color:#888;font-size:14px">${empty}</p>`

  const html = `<div style="font-family:sans-serif;max-width:640px;margin:0 auto;line-height:1.5;color:#1a2332">
    <h2>Nurture weekly digest</h2>
    <p style="font-size:15px"><b>${s.length}</b> emails sent to leads this week · <b>${opened}</b> opened (${pct(opened)}%) · <b>${clicked}</b> clicked (${pct(clicked)}%)</p>
    ${matched ? `<p style="font-size:13px;color:#7c3aed">★ ${matched} of this week's contacts match known prospects in the <a href="https://trg-lead-engine.vercel.app" style="color:#7c3aed">Lead Engine</a>, look for the purple stars below.</p>` : ''}
    ${alerts.length ? `<p style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:10px 12px;font-size:13px;color:#7f1d1d">${alerts.join('<br>')}</p>` : ''}
    <h3 style="margin-top:22px">New leads captured (${(leads ?? []).length})</h3>
    ${table('<th style="padding:6px 8px">Who</th><th style="padding:6px 8px">What they did</th><th style="padding:6px 8px">When</th>', leadRows, 'No new leads this week.')}
    <h3 style="margin-top:22px">New nurture enrollments (${(enrollments ?? []).length})</h3>
    ${table('<th style="padding:6px 8px">Who</th><th style="padding:6px 8px">Via tool</th><th style="padding:6px 8px">When</th>', enrollRows, 'No new enrollments this week.')}
    <h3 style="margin-top:22px">Every email sent (${s.length})</h3>
    ${table('<th style="padding:6px 8px">To</th><th style="padding:6px 8px">Email</th><th style="padding:6px 8px">Sent</th><th style="padding:6px 8px">Opened</th><th style="padding:6px 8px">Clicked</th>', sendRows, 'No nurture emails went out this week.')}
    <p style="margin-top:22px;font-size:13px"><a href="https://www.trgdigital.co.uk/admin/email-nurture" style="color:#2b4fe8">Open the nurture admin</a> for the full picture.</p>
  </div>`

  await sendHtmlEmail({
    to: TO,
    subject: `Nurture digest: ${s.length} emails, ${clicked} clicks, ${(leads ?? []).length} new leads`,
    html,
    fromName: 'TRG Digital',
  })

  await logCronRun('nurture-weekly-digest', true, { sends: s.length, leads: (leads ?? []).length })
  return NextResponse.json({ ok: true, sends: s.length, leads: (leads ?? []).length })
}
