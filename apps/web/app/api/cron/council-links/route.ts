import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { sendHtmlEmail } from '@lib/sendgrid'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyCronSecret, logCronRun } from '@/lib/cron'
import { checkCouncilUrl } from '@/lib/county-rollout'

// Checks every council link on the county pages, quarterly.
//
// Councils restructure their sites constantly and an outbound 404 on a page arguing that
// other people's websites are broken is not a good look. A link that fails is switched
// off rather than left showing: county_pages.council_ok goes false, the page drops the
// link and keeps the sentence, and the report says which ones need a new URL.
//
// This is also what lets the seed script carry candidate URLs. A guess never reaches a
// page until this route has opened it and got a 200.

export const runtime = 'nodejs'
export const maxDuration = 300

const TO = process.env.DAILY_BRIEF_EMAIL ?? 'lenny@trgdigital.co.uk'

type Row = { slug: string; name: string; council_name: string | null; council_url: string | null; council_ok: boolean }

const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] as string)

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient() as any
    const { data } = await db
      .from('county_pages')
      .select('slug, name, council_name, council_url, council_ok')
      .order('slug')

    const rows = (data ?? []) as Row[]
    const withUrl = rows.filter((r) => r.council_url)
    const missing = rows.filter((r) => !r.council_url)

    const broke: { row: Row; status: number | string }[] = []
    const fixed: Row[] = []
    const moved: { row: Row; to: string }[] = []
    const blocked: Row[] = []

    // Sequential on purpose: 70 councils, no reason to hammer anyone.
    for (const r of withUrl) {
      const result = await checkCouncilUrl(r.council_url as string)
      const now = new Date().toISOString()
      if (result.blocked) {
        // A bot wall is not a broken link: leave council_ok alone and list it for a browser check.
        blocked.push(r)
        continue
      }
      if (result.ok !== r.council_ok) {
        await db
          .from('county_pages')
          .update({ council_ok: result.ok, council_checked_at: now, updated_at: now })
          .eq('slug', r.slug)
        if (result.ok) fixed.push(r)
      } else {
        await db.from('county_pages').update({ council_checked_at: now }).eq('slug', r.slug)
      }
      if (!result.ok) broke.push({ row: r, status: result.status })
      else if (result.finalUrl) moved.push({ row: r, to: result.finalUrl })
    }

    revalidateTag('county-pages')

    const list = (items: string[]) =>
      items.length ? `<ul style="font-size:13.5px;color:#333;padding-left:18px;margin:0">${items.join('')}</ul>` : ''

    const html = `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;color:#111">
  <h1 style="font-size:20px;margin:0 0 6px">Council links on the county pages</h1>
  <p style="font-size:13px;color:#6b7280;margin:0 0 16px">
    ${withUrl.length} checked, ${withUrl.length - broke.length - blocked.length} working, ${broke.length} failing, ${blocked.length} blocked, ${missing.length} with no URL yet.
  </p>

  ${broke.length ? `<h2 style="font-size:15px;margin:18px 0 4px">Failing, link now hidden on the page</h2>${list(broke.map((b) => `<li><strong>${esc(b.row.name)}</strong> ${esc(String(b.status))} <span style="color:#6b7280">${esc(b.row.council_url ?? '')}</span></li>`))}` : '<p style="font-size:14px;color:#166534">Every council link is working.</p>'}

  ${moved.length ? `<h2 style="font-size:15px;margin:18px 0 4px">Redirecting, worth updating</h2>${list(moved.map((m) => `<li><strong>${esc(m.row.name)}</strong> now lands on <span style="color:#6b7280">${esc(m.to)}</span></li>`))}` : ''}

  ${blocked.length ? `<h2 style="font-size:15px;margin:18px 0 4px">Blocked our checker, open these in a browser</h2>${list(blocked.map((b) => `<li><strong>${esc(b.name)}</strong> ${b.council_ok ? 'showing' : 'hidden'} <span style="color:#6b7280">${esc(b.council_url ?? '')}</span></li>`))}` : ''}

  ${fixed.length ? `<h2 style="font-size:15px;margin:18px 0 4px">Newly confirmed, link now showing</h2>${list(fixed.map((f) => `<li>${esc(f.name)}</li>`))}` : ''}

  ${missing.length ? `<h2 style="font-size:15px;margin:18px 0 4px">No council URL yet</h2>${list(missing.map((m) => `<li>${esc(m.name)}</li>`))}` : ''}

  <p style="margin:18px 0 0"><a href="https://www.trgdigital.co.uk/admin/blog?tab=counties" style="font-size:14px;color:#F0532B">Fix them in the admin</a></p>
</div>`

    await sendHtmlEmail({
      to: TO,
      subject: broke.length
        ? `Council links: ${broke.length} failing on the county pages`
        : 'Council links: all working',
      html,
    })

    await logCronRun('council-links', true, {
      checked: withUrl.length,
      failing: broke.length,
      missing: missing.length,
    })
    return NextResponse.json({ ok: true, checked: withUrl.length, failing: broke.length, missing: missing.length })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    await logCronRun('council-links', false, { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
