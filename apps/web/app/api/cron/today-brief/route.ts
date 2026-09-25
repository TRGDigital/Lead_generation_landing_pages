import { NextRequest, NextResponse } from 'next/server'
import { sendHtmlEmail } from '@lib/sendgrid'
import { verifyCronSecret, logCronRun } from '@/lib/cron'
import { DAILY_AUDIT_TARGET, getAuditTasks, getContentSlot, getManualTasks } from '@/lib/daily'
import { getAreaPageTasks, careSitesConfigured } from '@/lib/care-sites'

// The day's work, in an inbox at eight, because an admin page you have to remember to
// open is an admin page you stop opening. Weekdays only: the schedule says 1-5, and
// the guard below means a manual run at the weekend does not send anything either.
export const runtime = 'nodejs'
export const maxDuration = 60

const TO = process.env.DAILY_BRIEF_EMAIL ?? 'lenny@trgdigital.co.uk'
const ADMIN = 'https://www.trgdigital.co.uk/admin/today'

const SEVERITY_COLOUR: Record<string, string> = {
  critical: '#b3261e',
  high: '#c2410c',
  medium: '#a16207',
  low: '#6b7280',
}

const esc = (s: string) =>
  s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] as string)

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const day = now.getDay()
  if (day === 0 || day === 6) {
    await logCronRun('today-brief', true, { skipped: 'weekend' })
    return NextResponse.json({ ok: true, skipped: 'weekend' })
  }

  try {
    const [auditTasks, manual, content, areas] = await Promise.all([
      getAuditTasks(),
      getManualTasks(),
      getContentSlot(now),
      careSitesConfigured() ? getAreaPageTasks() : Promise.resolve([]),
    ])

    const open = auditTasks.filter((t) => t.status === 'open')
    const todays = open.slice(0, DAILY_AUDIT_TARGET)

    // Per client, so the shape of the week is visible at a glance.
    const byClient = new Map<string, number>()
    for (const t of open) byClient.set(t.clientName ?? 'Internal', (byClient.get(t.clientName ?? 'Internal') ?? 0) + 1)

    const contentLine = content.slot
      ? content.done
        ? `<p style="margin:0 0 6px"><strong>Content:</strong> ${esc(content.slot.label)}, already done this week.</p>`
        : `<p style="margin:0 0 6px"><strong>Content today:</strong> ${esc(content.slot.label)}.</p>`
      : ''

    const auditRows = todays
      .map(
        (t) => `<tr>
          <td style="padding:7px 10px 7px 0;vertical-align:top;white-space:nowrap">
            <span style="font-size:11px;text-transform:uppercase;color:${SEVERITY_COLOUR[t.severity ?? 'low']}">${esc(t.severity ?? '')}</span>
          </td>
          <td style="padding:7px 10px 7px 0;vertical-align:top;white-space:nowrap;font-size:12px;color:#6b7280">${esc(t.clientName ?? '')}</td>
          <td style="padding:7px 0;vertical-align:top">
            <div style="font-size:14px;color:#111">${esc(t.title)}</div>
            ${t.detail ? `<div style="font-size:12.5px;color:#555;line-height:1.5">${esc(t.detail.slice(0, 180))}</div>` : ''}
          </td>
        </tr>`,
      )
      .join('')

    const areaRows = areas
      .slice(0, 3)
      .map(
        (a) =>
          `<li style="margin-bottom:3px"><span style="color:#6b7280">${esc(a.site.label)}</span> <code style="font-size:12px">${esc(a.path)}</code> · ${esc(a.need)}</li>`,
      )
      .join('')

    const manualRows = manual
      .slice(0, 5)
      .map((t) => `<li style="margin-bottom:3px">${esc(t.title)}${t.clientName ? ` <span style="color:#6b7280">(${esc(t.clientName)})</span>` : ''}</li>`)
      .join('')

    const counts = [...byClient.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([client, n]) => `${esc(client)} ${n}`)
      .join(' · ')

    const dayName = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

    const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;color:#111">
  <p style="font-size:13px;color:#6b7280;margin:0 0 2px">${esc(dayName)}</p>
  <h1 style="font-size:20px;margin:0 0 14px">Today</h1>

  ${contentLine}

  <h2 style="font-size:15px;margin:18px 0 4px">Audit work, ${todays.length} of ${open.length} open</h2>
  ${todays.length ? `<table style="border-collapse:collapse;width:100%">${auditRows}</table>` : '<p style="font-size:14px;color:#555">Nothing open. Run an audit, or take the afternoon off.</p>'}

  ${areaRows ? `<h2 style="font-size:15px;margin:18px 0 4px">Local area pages</h2><ul style="font-size:13.5px;color:#333;padding-left:18px;margin:0">${areaRows}</ul><p style="font-size:12px;color:#6b7280;margin:4px 0 0">${areas.length} with work outstanding.</p>` : ''}

  ${manualRows ? `<h2 style="font-size:15px;margin:18px 0 4px">Your own list</h2><ul style="font-size:13.5px;color:#333;padding-left:18px;margin:0">${manualRows}</ul>` : ''}

  <p style="font-size:12.5px;color:#6b7280;margin:18px 0 0">Open: ${counts || 'nothing'}</p>
  <p style="margin:14px 0 0"><a href="${ADMIN}" style="font-size:14px;color:#F0532B">Open Today in the admin</a></p>
  <p style="font-size:11.5px;color:#9ca3af;margin:16px 0 0">Anything you do not get to stays on the list. Nothing is lost by ignoring this email.</p>
</div>`

    await sendHtmlEmail({
      to: TO,
      subject: `Today: ${todays.length} audit items${content.slot && !content.done ? `, content for ${content.slot.label}` : ''}`,
      html,
    })

    await logCronRun('today-brief', true, { audit: todays.length, open: open.length, areas: areas.length })
    return NextResponse.json({ ok: true, sent: TO, audit: todays.length, open: open.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    await logCronRun('today-brief', false, { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
