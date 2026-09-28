import { type NextRequest, NextResponse } from 'next/server'
import { getCqcRating, type CqcMatch } from '@/lib/cqc'
import { checkRateLimit } from '@/lib/rate-limit'
import { blockedHost, safeFetch as guardedFetch } from '@/lib/safe-fetch'

// CQC Rating Display Checker. Fetches a provider's homepage (and, if needed, a handful of likely
// inner pages) and reports whether the official CQC widget is embedded, whether a rating is
// mentioned in text or image alt text, and whether what is shown matches the live CQC rating.
//
// The official widget is a script tag:
//   <script src="//www.cqc.org.uk/sites/all/modules/custom/cqc_widget/widget.js?data-id=1-XXXX&data-host=www.cqc.org.uk&type=location"></script>
// At runtime it inserts <div class="cqc-widget cleanslate" id="CQCWidget-1-XXXX-1"> and loads
// https://www.cqc.org.uk/widget/<id>/<div id>/location via JSONP. Server-side we only ever see the
// script tag (sometimes JSON-escaped inside a page builder payload), so that is what we look for.

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const UA = 'TRG-CqcDisplayChecker/1.0 (+https://www.trgdigital.co.uk)'
const MAX_FETCHES = 5
const MAX_BYTES = 1_500_000

type Status = 'pass' | 'warn' | 'fail'
type Verdict = 'pass' | 'attention' | 'fail'

// ---------------------------------------------------------------- SSRF guard

// The guard itself lives in lib/safe-fetch.ts so other tools can share it.
const safeFetch = (url: string, timeoutMs: number) => guardedFetch(url, timeoutMs, { userAgent: UA, maxBytes: MAX_BYTES })

// ---------------------------------------------------------------- page analysis

const RATING_WORDS: Record<string, string> = {
  outstanding: 'Outstanding',
  good: 'Good',
  'requires improvement': 'Requires improvement',
  inadequate: 'Inadequate',
}
const R = '(outstanding|good|requires improvement|inadequate)'
const Q = `["'“‘]?`
const CQC = '(?:cqc|care quality commission)'
const RATING_PATTERNS: RegExp[] = [
  new RegExp(`\\b${CQC}\\b[^.!?|]{0,60}?\\brated\\s+(?:as\\s+)?(?:an?\\s+)?${Q}${R}\\b`, 'g'),
  new RegExp(`\\brated\\s+(?:as\\s+)?${Q}${R}${Q}\\s+(?:overall\\s+)?(?:by|from|with)\\s+(?:the\\s+)?${CQC}`, 'g'),
  new RegExp(`\\b${CQC}\\s+(?:overall\\s+)?rating\\s*(?:of|:|is|was|-)?\\s*(?:currently\\s+)?${Q}${R}\\b`, 'g'),
  new RegExp(`\\b${R}${Q}\\s+(?:overall\\s+)?(?:by\\s+the\\s+)?${CQC}\\s+rating`, 'g'),
  new RegExp(`\\b${R}${Q}\\s+(?:rating\\s+)?(?:from|by)\\s+(?:the\\s+)?${CQC}`, 'g'),
  new RegExp(`\\b${CQC}[\\s-]+(?:rated\\s+)?${Q}${R}\\b`, 'g'), // "CQC Outstanding home care", "CQC-rated Good"
]

// Undo the escaping page builders use when a script tag is stored inside a JSON payload.
function unescapeHtml(s: string): string {
  return s
    .replace(/\\u002f/gi, '/')
    .replace(/\\u0026/gi, '&')
    .replace(/\\u003c/gi, '<')
    .replace(/\\u003e/gi, '>')
    .replace(/\\u0022/gi, '"')
    .replace(/\\\//g, '/')
    .replace(/&amp;/gi, '&')
    .replace(/&#0?38;/g, '&')
    .replace(/&#x2f;|&#47;/gi, '/')
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;|&rsquo;|&lsquo;/gi, "'")
    .replace(/&ldquo;|&rdquo;/gi, '"')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
}

// Visible text plus alt / title / aria-label text, lower-cased and single-spaced.
function visibleText(html: string): string {
  const noScript = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<template[\s\S]*?<\/template>|<!--[\s\S]*?-->/gi, ' ')
  const attrs = [...noScript.matchAll(/\s(?:alt|title|aria-label)\s*=\s*("([^"]*)"|'([^']*)')/gi)].map((m) => m[2] ?? m[3] ?? '')
  const withAttrText = noScript.replace(/<img\b[^>]*>/gi, (tag) => {
    const alt = tag.match(/\salt\s*=\s*("([^"]*)"|'([^']*)')/i)
    return ` ${alt?.[2] ?? alt?.[3] ?? ''} . `
  })
  const text = decodeEntities(withAttrText.replace(/<\/(p|div|li|h\d|section|td|br)>/gi, ' . ').replace(/<[^>]+>/g, ' '))
  return `${text} . ${attrs.map(decodeEntities).join(' . ')}`.replace(/\s+/g, ' ').toLowerCase()
}

type Mention = { rating: string; snippet: string }

function findRatingMentions(text: string, rawHtml: string): Mention[] {
  const out: Mention[] = []
  for (const re of RATING_PATTERNS) {
    re.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(text))) {
      const word = m.slice(1).find((g) => g && RATING_WORDS[g])
      if (!word) continue
      const start = Math.max(0, m.index - 40)
      out.push({ rating: RATING_WORDS[word]!, snippet: text.slice(start, m.index + m[0].length + 40).trim() })
    }
  }
  // CQC badge images named by rating, e.g. /badges/cqc-good.png
  for (const m of rawHtml.matchAll(/<img\b[^>]*\bsrc\s*=\s*["']([^"']*cqc[^"']*)["']/gi)) {
    const src = (m[1] || '').toLowerCase()
    const w = src.match(/(outstanding|requires[-_ ]?improvement|inadequate|good)/)?.[1]
    if (w) {
      const key = w.startsWith('requires') ? 'requires improvement' : w
      out.push({ rating: RATING_WORDS[key]!, snippet: `CQC badge image: ${src.split('/').pop()}` })
    }
  }
  const seen = new Set<string>()
  return out.filter((m) => (seen.has(m.snippet) ? false : (seen.add(m.snippet), true)))
}

type PageResult = {
  url: string
  isHome: boolean
  widget: { found: boolean; locationId: string | null; type: string | null; inFooter: boolean }
  mentions: Mention[]
  mentionInMain: boolean
  mentionInFooter: boolean
  mentionsCqc: boolean
  notYetRated: boolean
  cqcLocationIds: string[]
  textLength: number
}

function analysePage(url: string, html: string, isHome: boolean): PageResult {
  const unesc = unescapeHtml(html)
  const footerAt = (() => {
    const i = html.search(/<footer[\s>]/i)
    return i >= 0 ? i : html.length
  })()

  // Official widget (script tag, legacy iframe, or the rendered container if a plugin prints it server-side)
  const widgetRe = /cqc[^"'<>\s]*\/cqc_widget\/widget\.js|cqc\.org\.uk\/widget\/1-\d+|class=["'][^"']*\bcqc-widget\b/i
  const wMatch = unesc.match(widgetRe)
  let widget: PageResult['widget'] = { found: false, locationId: null, type: null, inFooter: false }
  if (wMatch && wMatch.index !== undefined) {
    const around = unesc.slice(wMatch.index, wMatch.index + 400)
    const locationId = around.match(/data-id=\s*(1-\d+)/i)?.[1] ?? around.match(/widget\/(1-\d+)/i)?.[1] ?? around.match(/CQCWidget-(1-\d+)/i)?.[1] ?? null
    const type = around.match(/[?&]type=(location|provider)/i)?.[1]?.toLowerCase() ?? null
    const rawIdx = html.search(/cqc_widget\/widget\.js|cqc\.org\.uk\/widget\/1-/i)
    widget = { found: true, locationId, type, inFooter: rawIdx >= 0 && rawIdx > footerAt }
  }

  const mainText = visibleText(html.slice(0, footerAt))
  const footerText = footerAt < html.length ? visibleText(html.slice(footerAt)) : ''
  let mainMentions = findRatingMentions(mainText, html.slice(0, footerAt))
  // Sites built with React/Next often ship some copy only inside a JSON payload. If the visible
  // HTML has no rating, look there too (position on the page unknown, so treated as main body).
  if (mainMentions.length === 0) {
    const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1] || '').join(' ')
    const payloadText = decodeEntities(unescapeHtml(scripts).replace(/\\[rnt]/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').toLowerCase()
    if (/cqc|care quality commission/.test(payloadText)) mainMentions = findRatingMentions(payloadText, '')
  }
  const footerMentions = findRatingMentions(footerText, html.slice(footerAt))
  const all = `${mainText} ${footerText}`

  return {
    url,
    isHome,
    widget,
    mentions: [...mainMentions, ...footerMentions],
    mentionInMain: mainMentions.length > 0,
    mentionInFooter: footerMentions.length > 0,
    mentionsCqc: /\b(cqc|care quality commission)\b/.test(all),
    notYetRated: /\b(not yet (been )?rated|awaiting (our )?(first )?(cqc )?(inspection|rating)|yet to be (inspected|rated))\b/.test(all),
    cqcLocationIds: [...new Set([...unesc.matchAll(/cqc\.org\.uk\/location\/(1-\d+)/gi)].map((m) => m[1]!))],
    textLength: mainText.length + footerText.length,
  }
}

// Pick likely internal pages to check when the homepage has no widget.
function candidateLinks(html: string, base: URL): string[] {
  const scored: { url: string; score: number }[] = []
  const seen = new Set<string>([base.toString().replace(/#.*$/, '').replace(/\/$/, '')])
  const baseHost = base.hostname.replace(/^www\./, '')
  for (const m of html.matchAll(/<a\b[^>]*\bhref\s*=\s*["']([^"'#]+)["'][^>]*>([\s\S]{0,300}?)<\/a>/gi)) {
    let u: URL
    try {
      u = new URL(decodeEntities(m[1] || ''), base)
    } catch {
      continue
    }
    if (!/^https?:$/.test(u.protocol) || u.hostname.replace(/^www\./, '') !== baseHost) continue
    if (/\.(pdf|jpe?g|png|gif|webp|svg|docx?|xlsx?|zip|mp4)$/i.test(u.pathname)) continue
    u.hash = ''
    const key = u.toString().replace(/\/$/, '')
    if (seen.has(key)) continue
    seen.add(key)
    const hay = `${u.pathname} ${(m[2] || '').replace(/<[^>]+>/g, ' ')}`.toLowerCase()
    let score = 0
    if (/cqc|care quality|rating|inspection|regulat|report/.test(hay)) score += 10
    if (/about|who-we-are|why-choose|our-home|quality|accredit|award/.test(hay)) score += 4
    if (/contact|faq|fees/.test(hay)) score += 1
    const basePath = base.pathname.replace(/\/$/, '')
    if (basePath && score > 0) score += u.pathname.startsWith(basePath + '/') ? 5 : -3 // stay within a branch site
    if (score > 0) scored.push({ url: u.toString(), score })
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, MAX_FETCHES - 1).map((s) => s.url)
}

// ---------------------------------------------------------------- handler

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = await checkRateLimit(`cqc-display:${ip}`, 20, 600)
  if (!allowed) return NextResponse.json({ error: 'You have run a lot of checks in a short time. Please wait a few minutes and try again.' }, { status: 429 })

  let body: { url?: string; locationId?: string }
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

  const selectedId = (body.locationId || '').match(/^1-\d{5,15}$/)?.[0] ?? null
  const livePromise: Promise<CqcMatch | null> = selectedId ? getCqcRating(selectedId).catch(() => null) : Promise.resolve(null)

  // Homepage: the address as entered (a franchise branch's homepage is often a path on a shared
  // domain, e.g. /bath), falling back to the root of the site if that fails.
  let home = await safeFetch(target.toString(), 8000)
  if (!home && target.pathname !== '/') home = await safeFetch(new URL('/', target).toString(), 8000)
  if (!home) {
    return NextResponse.json({ error: 'We could not reach that website. Check the address and try again.' }, { status: 502 })
  }
  const finalHome = new URL(home.url)
  const pages: PageResult[] = [analysePage(home.url, home.html, true)]
  const homePage = pages[0]!

  // Inner pages, only if the homepage does not already carry the widget
  if (!homePage.widget.found) {
    const links = candidateLinks(home.html, finalHome)
    const fetched = await Promise.all(links.map((l) => safeFetch(l, 6000)))
    fetched.forEach((f, i) => {
      if (f) pages.push(analysePage(f.url, f.html, false))
      else if (links[i]) pages.push({ ...analysePage(links[i]!, '', false), textLength: -1 })
    })
  }
  const okPages = pages.filter((p) => p.textLength >= 0)

  // Which CQC location are we comparing against?
  const widgetPage = okPages.find((p) => p.widget.found) ?? null
  const siteIds = [...new Set(okPages.flatMap((p) => [p.widget.locationId, ...p.cqcLocationIds]).filter((x): x is string => !!x))]
  let locationId = selectedId
  let locationSource: 'selected' | 'widget' | 'link' | null = selectedId ? 'selected' : null
  if (!locationId && widgetPage?.widget.locationId) {
    locationId = widgetPage.widget.locationId
    locationSource = 'widget'
  } else if (!locationId && siteIds.length === 1) {
    locationId = siteIds[0]!
    locationSource = 'link'
  }
  const live = selectedId ? await livePromise : locationId ? await getCqcRating(locationId).catch(() => null) : null
  const liveRating = live?.overall || null
  const liveNotRated = liveRating === 'Not yet rated'

  // Rating mentions
  const mentionPage = okPages.find((p) => p.mentions.length > 0) ?? null
  const allMentions = okPages.flatMap((p) => p.mentions.map((m) => ({ ...m, page: p.url, isHome: p.isHome })))
  const counts = new Map<string, number>()
  for (const m of allMentions) counts.set(m.rating, (counts.get(m.rating) ?? 0) + 1)
  const shownRatings = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([r]) => r)
  const homeRatings = [...new Set(homePage.mentions.map((m) => m.rating))]
  const outdated = liveRating && !liveNotRated ? shownRatings.filter((r) => r !== liveRating) : []
  const homeTextMatches = !!liveRating && homeRatings.includes(liveRating)

  // Widget checks
  const w = widgetPage?.widget ?? null
  const widgetOnHome = !!homePage.widget.found
  const widgetWrongId = !!(w && w.locationId && selectedId && w.locationId !== selectedId)
  const widgetProvider = w?.type === 'provider'
  const widgetGood = widgetOnHome && !widgetWrongId && !widgetProvider

  const jsHeavy = homePage.textLength < 400
  const checks: { id: string; label: string; status: Status; detail: string }[] = []
  const fixes: { text: string; code?: string }[] = []
  const fix = (text: string, code?: string) => fixes.push(code ? { text, code } : { text })

  // 1. Widget
  if (widgetOnHome) {
    checks.push({
      id: 'widget',
      label: 'Official CQC widget on your homepage',
      status: widgetWrongId || widgetProvider ? 'warn' : 'pass',
      detail: widgetWrongId
        ? `We found the widget, but it is set up for CQC location ${w?.locationId}, not the service you picked (${selectedId}).`
        : widgetProvider
          ? 'We found the widget, but it uses the provider level code (type=provider). For most care services that code does not show a rating.'
          : `The official widget is embedded on your homepage${w?.inFooter ? ', in the footer' : ''}. It updates itself whenever the CQC publishes a new rating.`,
    })
  } else if (widgetPage) {
    checks.push({ id: 'widget', label: 'Official CQC widget on your homepage', status: 'warn', detail: `The widget is on ${widgetPage.url}, but not on your homepage.` })
  } else {
    checks.push({ id: 'widget', label: 'Official CQC widget on your homepage', status: homePage.mentionInMain ? 'warn' : 'fail', detail: `We did not find the official CQC widget on your homepage${okPages.length > 1 ? ` or the ${okPages.length - 1} other page${okPages.length > 2 ? 's' : ''} we checked` : ''}.` })
  }

  // 2. Rating mentioned in text or image
  if (homePage.mentions.length > 0) {
    const footerOnly = !homePage.mentionInMain && homePage.mentionInFooter
    checks.push({
      id: 'mention',
      label: 'Rating shown in words or an image',
      status: footerOnly && !widgetGood ? 'warn' : 'pass',
      detail: footerOnly
        ? `Your homepage mentions a rating of ${homeRatings.join(' / ')}, but only in the footer.`
        : `Your homepage mentions a rating of ${homeRatings.join(' / ')}.`,
    })
  } else if (mentionPage) {
    checks.push({ id: 'mention', label: 'Rating shown in words or an image', status: widgetGood ? 'pass' : 'warn', detail: `A rating of ${[...new Set(mentionPage.mentions.map((m) => m.rating))].join(' / ')} is mentioned on ${mentionPage.url}, but not on your homepage.` })
  } else {
    checks.push({
      id: 'mention',
      label: 'Rating shown in words or an image',
      status: widgetGood ? 'pass' : 'fail',
      detail: widgetGood
        ? 'We did not find the rating written in text, which is fine because the widget shows it.'
        : homePage.mentionsCqc
          ? 'Your site mentions the CQC, but we could not find a rating (such as "rated Good by the CQC") in the text or image descriptions.'
          : 'We could not find your CQC rating written anywhere on the pages we checked.',
    })
  }

  // 3. Matches the live rating
  if (liveRating && !liveNotRated) {
    if (widgetGood && outdated.length === 0) {
      checks.push({ id: 'current', label: 'Matches your current CQC rating', status: 'pass', detail: `Your current CQC rating is ${liveRating}. The widget always shows the latest rating.` })
    } else if (outdated.length > 0) {
      checks.push({
        id: 'current',
        label: 'Matches your current CQC rating',
        status: widgetGood || locationSource === 'link' ? 'warn' : 'fail',
        detail: locationSource === 'link'
          ? `Your site links to ${live?.name ?? 'a CQC location'}, rated ${liveRating}${live?.published ? ` (published ${live.published})` : ''}, but your site also says ${outdated.join(' / ')}. If that is your service, the rating on your site looks out of date. If not, pick your service above and check again.`
          : `Your current CQC rating is ${liveRating}${live?.published ? ` (published ${live.published})` : ''}, but your site also says ${outdated.join(' / ')}. That looks out of date.`,
      })
    } else if (shownRatings.length > 0) {
      checks.push({ id: 'current', label: 'Matches your current CQC rating', status: 'pass', detail: `Your site shows ${liveRating}, which matches the CQC register.` })
    } else if (widgetPage && !widgetWrongId) {
      checks.push({ id: 'current', label: 'Matches your current CQC rating', status: 'pass', detail: `Your current CQC rating is ${liveRating}, and the widget shows the latest rating automatically.` })
    } else {
      checks.push({ id: 'current', label: 'Matches your current CQC rating', status: 'fail', detail: `Your current CQC rating is ${liveRating}, and we could not find it shown on your site.` })
    }
  } else if (liveNotRated) {
    checks.push({ id: 'current', label: 'Matches your current CQC rating', status: 'pass', detail: 'The CQC register shows this service has not been rated yet, so there is no rating to display.' })
  } else {
    checks.push({
      id: 'current',
      label: 'Matches your current CQC rating',
      status: 'warn',
      detail: siteIds.length > 1
        ? 'Your site links to more than one CQC location, so pick your service above and run the check again to compare against the live rating.'
        : 'We could not tell which CQC location this site belongs to. Search for your service name above to compare against the live rating.',
    })
  }

  // 4. Conspicuous (homepage)
  const onHome = widgetOnHome || homePage.mentions.length > 0
  const homeFooterOnly = onHome && !(widgetOnHome && !homePage.widget.inFooter) && !homePage.mentionInMain
  checks.push({
    id: 'homepage',
    label: 'Easy to spot on your homepage',
    status: !onHome ? (liveNotRated ? 'pass' : 'fail') : homeFooterOnly ? 'warn' : 'pass',
    detail: !onHome
      ? liveNotRated
        ? 'Nothing to show yet, as the service has not been rated.'
        : 'Your rating is not on your homepage, where most families land first.'
      : homeFooterOnly
        ? 'Your rating is on the homepage, but only in the footer, where many visitors will not scroll.'
        : 'Your rating appears in the main body of your homepage.',
  })

  // ---- Verdict
  let verdict: Verdict
  let headline: string
  const liveKnown = !!liveRating && !liveNotRated
  const pickedElsewhere = !!selectedId && siteIds.length > 0 && !siteIds.includes(selectedId)
  const inferred = locationSource === 'link' && outdated.length > 0
  if (inferred && !widgetGood) {
    verdict = 'attention'
    headline = 'Check your rating is current'
  } else if (pickedElsewhere && !widgetWrongId && outdated.length > 0) {
    verdict = 'attention'
    headline = 'Check you picked the right service'
  } else if (liveNotRated && !widgetPage && shownRatings.length === 0) {
    verdict = 'pass'
    headline = 'No rating to display yet'
  } else if (widgetWrongId) {
    verdict = 'fail'
    headline = 'Your widget shows a different service'
  } else if (!widgetPage && shownRatings.length === 0) {
    verdict = 'fail'
    headline = 'We could not find your CQC rating'
  } else if (liveKnown && !widgetGood && outdated.length > 0 && !homeTextMatches) {
    verdict = 'fail'
    headline = 'Your rating looks out of date'
  } else if (widgetGood && outdated.length === 0) {
    verdict = 'pass'
    headline = 'Your CQC rating is on show'
  } else if (!widgetGood && homePage.mentionInMain && liveKnown && homeTextMatches && outdated.length === 0) {
    verdict = 'pass'
    headline = 'Your CQC rating is on show'
  } else {
    verdict = 'attention'
    headline = outdated.length > 0 ? 'An old rating is still on your site' : !onHome ? 'Your rating is hard to find' : !liveKnown && !liveNotRated ? 'Pick your service to confirm it is current' : 'Nearly there'
  }

  // ---- Fixes (plain English)
  if (pickedElsewhere && !widgetWrongId) fix(`Your site links to CQC location ${siteIds.join(', ')}, but you picked ${selectedId}. If that is not your service, pick the right one and run the check again.`)
  if (widgetWrongId) fix(`Replace the widget code with the one from your own CQC location page (location ${selectedId}), so families see the right rating.`)
  if (widgetProvider) fix('Swap the provider level widget for your location widget. The code should end with type=location.')
  if (outdated.length > 0 && liveRating) fix(`Update every mention of ${outdated.join(' / ')} to your current rating, ${liveRating}. Old badges and phrases like "rated ${outdated[0]}" are easy to miss in footers and about pages.`)
  if (!widgetOnHome && !liveNotRated) fix(`Add the official CQC widget to your homepage. It is free, and it updates itself whenever the CQC publishes a new rating, so it never goes out of date. Paste this code where you want it to show:`, `<script type="text/javascript" src="//www.cqc.org.uk/sites/all/modules/custom/cqc_widget/widget.js?data-id=${locationId ?? 'YOUR-LOCATION-ID'}&data-host=www.cqc.org.uk&type=location"></script>`)
  if (!widgetOnHome && widgetPage) fix('Move or copy the widget from your inner page to your homepage, near the top, so families see it straight away.')
  if (homeFooterOnly && !liveNotRated) fix('Bring your rating up out of the footer and into the main part of the homepage, for example next to your welcome text or contact details.')
  if (!liveKnown && !liveNotRated && !selectedId) fix('Pick your service in the search box and run the check again, so we can confirm your site shows your latest rating.')
  if (liveNotRated && widgetPage == null) fix('Once your first rating is published, add the official CQC widget to your homepage so it shows automatically.')
  if (jsHeavy) fix('Your homepage builds most of its content with JavaScript, so we could only see part of it. If the widget or rating is there, it may be loading in a way search engines also struggle to read.')

  return NextResponse.json({
    url: home.url,
    verdict,
    headline,
    checks,
    fixes,
    jsHeavy,
    widget: widgetPage ? { page: widgetPage.url, onHomepage: widgetOnHome, locationId: w?.locationId ?? null, type: w?.type ?? null, inFooter: !!w?.inFooter } : null,
    shownRatings,
    mentions: allMentions.slice(0, 6).map((m) => ({ rating: m.rating, page: m.page, snippet: m.snippet.slice(0, 180) })),
    live: live ? { id: live.id, name: decodeEntities(live.name).replace(/\s+/g, ' ').trim(), overall: live.overall, published: live.published, url: live.url, postcode: live.postcode } : null,
    locationSource,
    siteLocationIds: siteIds.slice(0, 5),
    pagesChecked: pages.map((p) => ({ url: p.url, ok: p.textLength >= 0, widget: p.widget.found, mention: p.mentions.length > 0 })),
  })
}
