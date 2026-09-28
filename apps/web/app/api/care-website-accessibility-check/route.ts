import { type NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { blockedHost, safeFetch } from '@/lib/safe-fetch'
import { analysePage, buildChecks, innerPages, scoreChecks, topFixes, STUDY, type PageFacts } from '@/lib/accessibility-check'

// Care Website Accessibility Check. Fetches a care provider's homepage plus up to two key inner
// pages (contact first) and runs static HTML accessibility checks. No browser, so it is quick,
// and it only reports what the markup shows. See lib/accessibility-check.ts.

export const dynamic = 'force-dynamic'
export const maxDuration = 20

const UA = 'TRG-AccessibilityCheck/1.0 (+https://www.trgdigital.co.uk)'
const MAX_PAGES = 3
const MAX_BYTES = 1_500_000
const fetchPage = (url: string, timeoutMs: number) => safeFetch(url, timeoutMs, { userAgent: UA, maxBytes: MAX_BYTES })

export async function POST(req: NextRequest) {
  const started = Date.now()
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = await checkRateLimit(`a11y-check:${ip}`, 20, 600)
  if (!allowed) return NextResponse.json({ error: 'You have run a lot of checks in a short time. Please wait a few minutes and try again.' }, { status: 429 })

  let body: { url?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  let raw = (body.url || '').trim()
  if (!raw) return NextResponse.json({ error: 'Please enter your website address.' }, { status: 400 })
  if (raw.length > 300) return NextResponse.json({ error: 'That web address looks too long.' }, { status: 400 })
  if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw
  let target: URL
  try {
    target = new URL(raw)
  } catch {
    return NextResponse.json({ error: 'That does not look like a valid website address.' }, { status: 400 })
  }
  if (!/^https?:$/.test(target.protocol) || blockedHost(target.hostname) || !target.hostname.includes('.')) {
    return NextResponse.json({ error: 'We can only check public websites.' }, { status: 400 })
  }

  let home = await fetchPage(target.toString(), 7000)
  if (!home && target.pathname !== '/') home = await fetchPage(new URL('/', target).toString(), 6000)
  if (!home) {
    return NextResponse.json({ error: 'We could not reach that website. Check the address and try again.' }, { status: 502 })
  }

  const pages: PageFacts[] = [analysePage(home.url, home.html, true)]
  const links = innerPages(home.html, new URL(home.url), MAX_PAGES - 1)
  const fetched = await Promise.all(links.map((l) => fetchPage(l, 5000)))
  const pagesChecked = [{ url: home.url, ok: true }]
  fetched.forEach((f, i) => {
    if (f) pages.push(analysePage(f.url, f.html, false))
    pagesChecked.push({ url: f?.url ?? links[i]!, ok: !!f })
  })

  const checks = buildChecks(pages)
  const score = scoreChecks(checks)
  const jsHeavy = pages[0]!.textLength < 400
  const tools = [...new Set(pages.flatMap((p) => p.a11yTools))]

  return NextResponse.json({
    url: home.url,
    score,
    band: score >= 85 ? 'good' : score >= 60 ? 'fair' : 'poor',
    checks: checks.map(({ weight: _w, ...c }) => c),
    topFixes: topFixes(checks),
    counts: {
      pass: checks.filter((c) => c.status === 'pass').length,
      warn: checks.filter((c) => c.status === 'warn').length,
      fail: checks.filter((c) => c.status === 'fail').length,
    },
    jsHeavy,
    a11yTools: tools,
    study: {
      measured: STUDY.measured,
      cleanSites: STUDY.cleanSites,
      contrastPct: Math.round((STUDY.contrastSites / STUDY.measured) * 100),
      toolSites: STUDY.toolSites,
      toolSitesStillFailing: STUDY.toolSitesStillFailing,
    },
    pagesChecked,
    elapsedMs: Date.now() - started,
  })
}
