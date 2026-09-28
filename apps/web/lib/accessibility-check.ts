import * as cheerio from 'cheerio'
import type { CheerioAPI } from 'cheerio'
import { detectA11yTools } from '@/lib/site-audit/a11y-tools'

// The slice of the parsed tree we touch. domhandler is not a direct dependency, so, like
// lib/site-audit/crawl.ts, we describe the shape ourselves rather than import its types.
type DomNode = { type: string; name?: string; attribs?: Record<string, string>; parent?: DomNode | null }
type Element = { type: string; name: string; attribs: Record<string, string>; parent: DomNode | null }

// Static HTML accessibility checks for the free Care Website Accessibility Check tool.
//
// Everything here reads the HTML a server sends, with no browser. That keeps the tool fast and
// cheap, and it also sets the limits: nothing that needs rendering (colour contrast, focus order,
// keyboard traps, text over images, content injected by JavaScript) is judged. Where a check
// cannot be made reliably from the markup, it is left out rather than guessed.

export type Status = 'pass' | 'warn' | 'fail' | 'info'

export type Check = {
  id: string
  label: string
  status: Status
  /** What we found, in plain English. */
  detail: string
  /** Why it matters for older visitors and families. */
  why: string
  /** What to do about it (only used when status is warn or fail). */
  fix: string
  /** A comparison with the TRG study, only where the study measured the same thing. */
  benchmark?: string
  /** A few examples from the page, to help whoever fixes it. */
  examples?: string[]
  weight: number
}

// ---------------------------------------------------------------- study figures
// From scripts/study/data/summary.json (TRG study, September 2026, 578 care provider websites
// measured). Only figures that appear in that file are quoted here.
export const STUDY = {
  measured: 578,
  missingAltSites: 161, // sites with at least one image with no alt attribute
  noLangSites: 48,
  noViewportSites: 34,
  unlabelledSites: 213,
  sitesWithForms: 368,
  noSkipLinkSites: 411,
  contrastSites: 517,
  cleanSites: 19,
  toolSites: 17,
  toolSitesStillFailing: 17,
}
const pct = (n: number, d: number) => Math.round((n / d) * 100)
const STUDY_NOTE = `our study of ${STUDY.measured} UK care provider websites`

// ---------------------------------------------------------------- page level measurement

export type PageFacts = {
  url: string
  isHome: boolean
  lang: string
  viewport: string | null
  images: number
  imagesNoAlt: number
  imagesNoAltExamples: string[]
  h1s: string[]
  headingSkips: string[]
  fields: number
  fieldsUnlabelled: number
  fieldExamples: string[]
  placeholderOnly: number
  links: number
  linksNoName: number
  linkNoNameExamples: string[]
  vagueLinks: string[]
  buttons: number
  buttonsNoName: number
  buttonExamples: string[]
  iframes: number
  iframesNoTitle: number
  iframeExamples: string[]
  skipLink: boolean
  mainLandmark: boolean
  telLinks: number
  phoneInText: string | null
  baseFontPx: number | null
  tinyInlineText: number
  textLength: number
  a11yTools: string[]
}

const VAGUE = new Set([
  'click here', 'here', 'click', 'read more', 'more', 'learn more', 'find out more', 'more info',
  'more information', 'more details', 'details', 'this page', 'this link', 'link', 'continue',
  'continue reading', 'view more', 'see more', 'view', 'go', 'discover more', 'explore', 'info',
  'click here to find out more', 'click here for more information', 'read more here', 'find out more here',
])

function styleHidden(style: string | undefined): boolean {
  return !!style && /(?:^|;)\s*(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(style)
}

/** True when the element or an ancestor is hidden from everyone in a way the markup shows. */
function isHidden(el: DomNode): boolean {
  let n: DomNode | null | undefined = el
  while (n && n.type === 'tag') {
    const a = n.attribs || {}
    if ('hidden' in a || a['aria-hidden'] === 'true' || styleHidden(a['style'])) return true
    if (n.name === 'template') return true
    n = n.parent
  }
  return false
}

function clean(s: string): string {
  return s.replace(/\s+/g, ' ').trim()
}

/** A rough accessible name: aria-labelledby, aria-label, visible text, image alt, title. */
function accessibleName($: CheerioAPI, el: Element): string {
  const a = el.attribs || {}
  if (a['aria-labelledby']) {
    const t = a['aria-labelledby']
      .split(/\s+/)
      .map((id) => {
        try {
          return $(`[id="${id.replace(/"/g, '')}"]`).first().text()
        } catch {
          return ''
        }
      })
      .join(' ')
    if (clean(t)) return clean(t)
  }
  if (a['aria-label'] && clean(a['aria-label'])) return clean(a['aria-label'])
  const node = $(el as never).clone()
  node.find('[aria-hidden="true"], script, style').remove()
  const alts = node
    .find('img[alt], [role="img"][aria-label]')
    .toArray()
    .map((i) => (i as unknown as Element).attribs['alt'] ?? (i as unknown as Element).attribs['aria-label'] ?? '')
    .join(' ')
  const text = clean(`${node.text()} ${alts}`)
  if (text) return text
  if (a['title'] && clean(a['title'])) return clean(a['title'])
  return ''
}

function describe(el: Element): string {
  const a = el.attribs || {}
  const bits = [el.name]
  if (a['id']) bits.push(`#${a['id']}`)
  else if (a['class']) bits.push(`.${a['class'].trim().split(/\s+/).slice(0, 2).join('.')}`)
  if (a['href']) bits.push(`href="${a['href'].slice(0, 60)}"`)
  if (a['src']) bits.push(`src="${a['src'].split('?')[0]!.split('/').pop()!.slice(0, 50)}"`)
  if (a['name']) bits.push(`name="${a['name'].slice(0, 30)}"`)
  return bits.join(' ')
}

// UK phone numbers written in text: 01xxx, 02x, 03xx, 07xxx, 08xx, or +44.
const PHONE_RE = /(?:\+44\s?(?:\(0\)\s?)?|\b0)(?:\d[\s.-]?){9,10}\b/g

function phoneInText(text: string): string | null {
  for (const m of text.matchAll(PHONE_RE)) {
    const digits = m[0].replace(/\D/g, '')
    const national = digits.startsWith('44') ? '0' + digits.slice(2) : digits
    if (/^0[1-35789]\d{8,9}$/.test(national)) return clean(m[0])
  }
  return null
}

/** The body text size set in inline CSS, if the page sets one in px, pt, rem, em or %. */
function inlineBaseFont(css: string): number | null {
  const noPrint = css.replace(/@media\s+print[^{]*\{(?:[^{}]*\{[^}]*\})*[^}]*\}/gi, ' ').replace(/\/\*[\s\S]*?\*\//g, ' ')
  let htmlPx: number | null = null
  const bodyPx: number[] = []
  for (const m of noPrint.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = (m[1] || '').split(',').map((s) => s.trim().toLowerCase())
    const decl = (m[2] || '').match(/(?:^|[;\s])font-size\s*:\s*([\d.]+)\s*(px|pt|rem|em|%)/i)
    if (!decl) continue
    const v = Number(decl[1])
    const unit = (decl[2] || '').toLowerCase()
    if (!Number.isFinite(v) || v <= 0) continue
    const isHtml = selectors.some((s) => s === 'html' || s === ':root')
    const isBody = selectors.some((s) => s === 'body')
    if (isHtml) {
      if (unit === 'px') htmlPx = v
      else if (unit === 'pt') htmlPx = v * (4 / 3)
      else if (unit === '%') htmlPx = (16 * v) / 100
      else htmlPx = 16 * v
    }
    if (isBody) {
      const root = htmlPx ?? 16
      if (unit === 'px') bodyPx.push(v)
      else if (unit === 'pt') bodyPx.push(v * (4 / 3))
      else if (unit === '%') bodyPx.push((root * v) / 100)
      else bodyPx.push(root * v)
    }
  }
  if (bodyPx.length) return Math.round(Math.min(...bodyPx) * 10) / 10
  if (htmlPx !== null) {
    // html at 62.5% is a common trick to make rem maths easy; the body then sets the real size,
    // which we did not find, so we cannot say anything.
    if (htmlPx < 12) return null
    return Math.round(htmlPx * 10) / 10
  }
  return null
}

export function analysePage(url: string, html: string, isHome: boolean): PageFacts {
  const $ = cheerio.load(html)
  const f: PageFacts = {
    url, isHome, lang: clean($('html').attr('lang') || ''), viewport: null,
    images: 0, imagesNoAlt: 0, imagesNoAltExamples: [], h1s: [], headingSkips: [],
    fields: 0, fieldsUnlabelled: 0, fieldExamples: [], placeholderOnly: 0,
    links: 0, linksNoName: 0, linkNoNameExamples: [], vagueLinks: [],
    buttons: 0, buttonsNoName: 0, buttonExamples: [], iframes: 0, iframesNoTitle: 0, iframeExamples: [],
    skipLink: false, mainLandmark: false, telLinks: 0, phoneInText: null, baseFontPx: null, tinyInlineText: 0,
    textLength: 0, a11yTools: detectA11yTools(html).map((t) => t.name),
  }

  const vp = $('meta[name="viewport" i]').first()
  f.viewport = vp.length ? (vp.attr('content') || '').toLowerCase() : null

  // Images
  $('img, input[type="image" i]').each((_i, n) => {
    const el = n as unknown as Element
    if (isHidden(el)) return
    const a = el.attribs
    const role = (a['role'] || '').toLowerCase()
    if (role === 'presentation' || role === 'none') return
    if ((a['width'] === '1' || a['width'] === '0') && (a['height'] === '1' || a['height'] === '0')) return // tracking pixel
    f.images++
    if (a['alt'] === undefined && !clean(a['aria-label'] || '') && !a['aria-labelledby']) {
      f.imagesNoAlt++
      if (f.imagesNoAltExamples.length < 4) f.imagesNoAltExamples.push(describe(el))
    }
  })

  // Headings
  let prev = 0
  $('h1, h2, h3, h4, h5, h6').each((_i, n) => {
    const el = n as unknown as Element
    if (isHidden(el)) return
    const level = Number(el.name.slice(1))
    const text = clean($(el as never).text())
    if (level === 1) f.h1s.push(text.slice(0, 80))
    if (prev && level > prev + 1 && f.headingSkips.length < 4) f.headingSkips.push(`H${prev} to H${level}${text ? ` ("${text.slice(0, 50)}")` : ''}`)
    prev = level
  })

  // Form fields
  const labelled = new Set($('label[for]').toArray().map((l) => (l as unknown as Element).attribs['for']))
  const skipTypes = new Set(['hidden', 'submit', 'button', 'image', 'reset'])
  $('input, select, textarea').each((_i, n) => {
    const el = n as unknown as Element
    const a = el.attribs
    if (skipTypes.has((a['type'] || '').toLowerCase())) return
    if (isHidden(el) || a['tabindex'] === '-1') return // honeypots and reCAPTCHA fields
    if (/g-recaptcha-response|h-captcha-response/i.test(a['name'] || '')) return
    f.fields++
    const hasLabel =
      (a['id'] && labelled.has(a['id'])) ||
      clean(a['aria-label'] || '') ||
      a['aria-labelledby'] ||
      clean(a['title'] || '') ||
      $(el as never).closest('label').length > 0
    if (!hasLabel) {
      f.fieldsUnlabelled++
      if (a['placeholder']) f.placeholderOnly++
      if (f.fieldExamples.length < 4) f.fieldExamples.push(a['placeholder'] ? `${el.name} with placeholder "${a['placeholder'].slice(0, 40)}"` : describe(el))
    }
  })

  // Links
  $('a[href]').each((_i, n) => {
    const el = n as unknown as Element
    if (isHidden(el)) return
    const href = (el.attribs['href'] || '').trim()
    if (/^tel:/i.test(href)) f.telLinks++
    if (/^#/.test(href) && /skip|jump to/i.test(clean($(el as never).text()) + ' ' + (el.attribs['aria-label'] || ''))) f.skipLink = true
    if (/^#(main|content|primary|skip|maincontent|main-content|site-content|page-content)\b/i.test(href) && /skip|jump|content|main/i.test(clean($(el as never).text()))) f.skipLink = true
    f.links++
    const name = accessibleName($, el)
    if (!name) {
      f.linksNoName++
      if (f.linkNoNameExamples.length < 4) f.linkNoNameExamples.push(describe(el))
      return
    }
    const norm = name.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()
    if (VAGUE.has(norm) && !el.attribs['aria-label'] && !el.attribs['aria-labelledby']) {
      if (!f.vagueLinks.includes(name)) f.vagueLinks.push(name)
    }
  })
  // Skip links hidden until focused often use inline styles or classes we treat as visible, which
  // is right; the ones in isHidden() above are hidden from everyone, so check the raw markup too.
  if (!f.skipLink) {
    f.skipLink = $('a[href^="#"]').toArray().some((n) => /skip|jump to/i.test($(n).text() + ' ' + ((n as unknown as Element).attribs['aria-label'] || '')))
  }
  f.mainLandmark = $('main, [role="main"]').length > 0

  // Buttons
  $('button, [role="button"], input[type="button" i], input[type="submit" i], input[type="reset" i]').each((_i, n) => {
    const el = n as unknown as Element
    if (isHidden(el)) return
    if (el.name === 'a') return // counted with links
    f.buttons++
    const a = el.attribs
    let name = el.name === 'input' ? clean(a['value'] || '') || clean(a['aria-label'] || '') || clean(a['title'] || '') : accessibleName($, el)
    if (!name && el.name === 'input' && /^(submit|reset)$/i.test(a['type'] || '')) name = a['type'] || 'submit' // browsers supply a default name
    if (!name) {
      f.buttonsNoName++
      if (f.buttonExamples.length < 4) f.buttonExamples.push(describe(el))
    }
  })

  // Iframes (maps, videos, booking widgets)
  $('iframe').each((_i, n) => {
    const el = n as unknown as Element
    if (isHidden(el)) return
    const a = el.attribs
    if ((a['width'] === '0' || a['width'] === '1') && (a['height'] === '0' || a['height'] === '1')) return
    f.iframes++
    if (!clean(a['title'] || '') && !clean(a['aria-label'] || '')) {
      f.iframesNoTitle++
      if (f.iframeExamples.length < 4) {
        let host = ''
        try {
          host = new URL(a['src'] || a['data-src'] || '', url).hostname
        } catch {
          /* no usable src */
        }
        f.iframeExamples.push(host ? `iframe from ${host}` : describe(el))
      }
    }
  })

  // Text size, only from CSS written into the page itself
  const css = $('style').toArray().map((s) => $(s).text()).join('\n')
  f.baseFontPx = inlineBaseFont(css)
  $('[style*="font-size" i]').each((_i, n) => {
    const el = n as unknown as Element
    const m = (el.attribs['style'] || '').match(/font-size\s*:\s*([\d.]+)\s*(px|pt)/i)
    if (!m) return
    const px = Number(m[1]) * ((m[2] || '').toLowerCase() === 'pt' ? 4 / 3 : 1)
    if (px > 0 && px < 12 && clean($(el as never).text()).length > 20 && !isHidden(el)) f.tinyInlineText++
  })

  // Visible text, for the phone number and the "built with JavaScript" warning
  const body = $('body').clone()
  body.find('script, style, noscript, template, svg').remove()
  const text = clean(body.text())
  f.textLength = text.length
  f.phoneInText = phoneInText(text)
  return f
}

// ---------------------------------------------------------------- site level verdicts

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

export function buildChecks(pages: PageFacts[]): Check[] {
  const home = pages[0]!
  const sum = (k: keyof PageFacts) => pages.reduce((a, p) => a + (p[k] as number), 0)
  const firstN = (k: keyof PageFacts, n = 3) => pages.flatMap((p) => p[k] as string[]).slice(0, n)
  const checks: Check[] = []
  const onPages = pages.length === 1 ? 'on your homepage' : `across the ${pages.length} pages we checked`

  // 1. Image descriptions
  {
    const imgs = sum('images')
    const missing = sum('imagesNoAlt')
    const share = imgs ? Math.round((missing / imgs) * 100) : 0
    checks.push({
      id: 'alt',
      label: 'Images have text descriptions (alt text)',
      weight: 15,
      status: imgs === 0 || missing === 0 ? 'pass' : missing <= 2 && share < 10 ? 'warn' : 'fail',
      detail: imgs === 0
        ? 'We did not find any images in the page code.'
        : missing === 0
          ? `All ${plural(imgs, 'image')} ${onPages} have an alt attribute.`
          : `${missing} of ${imgs} images (${share}%) ${onPages} have no alt attribute at all.`,
      why: 'People with poor sight use screen readers that read images aloud from their alt text. Without it, a photo of your lounge or your CQC badge is read out as a file name, or skipped, so a family member listening to your site misses what you are showing them.',
      fix: 'Add a short description to every meaningful image, such as "Residents enjoying the garden at our home". Purely decorative images should have an empty alt (alt="") so screen readers skip them. Most website editors have an alt text box on each image.',
      benchmark: `In ${STUDY_NOTE}, ${pct(STUDY.missingAltSites, STUDY.measured)}% had at least one image with no alt text.`,
      examples: firstN('imagesNoAltExamples'),
    })
  }

  // 2. Page language
  checks.push({
    id: 'lang',
    label: 'Page language is set',
    weight: 8,
    status: home.lang ? 'pass' : 'fail',
    detail: home.lang ? `Your homepage declares its language as "${home.lang}".` : 'Your homepage does not say what language it is written in.',
    why: 'Screen readers use the page language to pick the right voice and pronunciation. Without it, English text can be read out in the wrong accent or with garbled words, which is hard work for anyone who relies on listening.',
    fix: 'Add lang="en-GB" to the <html> tag at the top of your site template. On WordPress this is set under Settings, General, Site Language.',
    benchmark: `In ${STUDY_NOTE}, ${pct(STUDY.noLangSites, STUDY.measured)}% did not declare a language.`,
  })

  // 3. One main heading
  {
    const none = pages.filter((p) => p.h1s.length === 0 || p.h1s.every((h) => !h))
    const many = pages.filter((p) => p.h1s.length > 1)
    checks.push({
      id: 'h1',
      label: 'Each page has one main heading',
      weight: 8,
      status: none.length ? 'fail' : many.length ? 'warn' : 'pass',
      detail: none.length
        ? `${none.length === pages.length ? (pages.length === 1 ? 'Your homepage has' : 'None of the pages we checked have') : `${plural(none.length, 'page')} we checked ${none.length === 1 ? 'has' : 'have'}`} no main (H1) heading.`
        : many.length
          ? `${plural(many.length, 'page')} ${many.length === 1 ? 'has' : 'have'} more than one main (H1) heading, for example ${many[0]!.h1s.length} on ${shortPath(many[0]!.url)}.`
          : `Every page we checked has a single main heading, for example "${home.h1s[0]}".`,
      why: 'The main heading tells visitors, and screen readers, what a page is about. People who use a screen reader often jump straight to it. With no main heading, or several, it is harder to tell whether they have landed on the right page.',
      fix: 'Give each page one clear H1 that says what the page is about, such as "Residential care in Harrogate". Use H2 and H3 for the sections below it.',
    })
  }

  // 4. Heading order
  {
    const skips = pages.flatMap((p) => p.headingSkips)
    checks.push({
      id: 'heading-order',
      label: 'Headings follow a logical order',
      weight: 5,
      status: skips.length === 0 ? 'pass' : 'warn',
      detail: skips.length === 0 ? 'Your headings step down in order without skipping levels.' : `Your headings skip levels in ${plural(skips.length, 'place')}, for example ${skips[0]}.`,
      why: 'Headings work like a table of contents for people using screen readers. When levels are skipped, the outline looks like something is missing, and it is harder to understand how the page is organised.',
      fix: 'Choose heading levels for structure, not for size. Go from H2 to H3 without jumping to H4, and use your theme settings to change how big a heading looks.',
      examples: skips.slice(0, 3),
    })
  }

  // 5. Form labels
  {
    const fields = sum('fields')
    const missing = sum('fieldsUnlabelled')
    const placeholders = sum('placeholderOnly')
    checks.push({
      id: 'labels',
      label: 'Form fields have labels',
      weight: 12,
      status: fields === 0 ? 'info' : missing === 0 ? 'pass' : 'fail',
      detail: fields === 0
        ? 'We did not find an enquiry form on the pages we checked, so we could not test this.'
        : missing === 0
          ? `All ${plural(fields, 'form field')} we found have a label.`
          : `${missing} of ${fields} form fields have no label${placeholders ? `, and ${placeholders === missing ? 'all' : placeholders} of them rely on grey placeholder text inside the box` : ''}.`,
      why: 'Your enquiry form is how families reach you. Placeholder text disappears as soon as someone starts typing, which catches out anyone with memory or concentration difficulties, and a screen reader may announce an unlabelled box simply as "edit text".',
      fix: 'Give every field a visible label above it, such as "Your phone number", linked to the field in the code. Most form plugins have a setting to show labels rather than placeholders.',
      benchmark: `In ${STUDY_NOTE}, ${pct(STUDY.unlabelledSites, STUDY.sitesWithForms)}% of sites with a form had at least one field with no label.`,
      examples: firstN('fieldExamples'),
    })
  }

  // 6. Links with no text
  {
    const links = sum('links')
    const missing = sum('linksNoName')
    checks.push({
      id: 'link-names',
      label: 'Every link has readable text',
      weight: 10,
      status: missing === 0 ? 'pass' : missing <= 3 ? 'warn' : 'fail',
      detail: missing === 0 ? `All ${plural(links, 'link')} we found have text a screen reader can read.` : `${plural(missing, 'link')} ${missing === 1 ? 'has' : 'have'} no text at all, often icon links such as social media buttons or image links with no alt text.`,
      why: 'A link with no text is announced as just "link", or as a long web address, so someone listening has no idea where it goes. Social icons, logos and slider arrows are the usual culprits.',
      fix: 'Give icon and image links a text alternative, for example an aria-label of "Visit us on Facebook", or alt text on the image inside the link that says where it goes.',
      examples: firstN('linkNoNameExamples'),
    })
  }

  // 7. Vague link text
  {
    const vague = [...new Set(pages.flatMap((p) => p.vagueLinks))]
    checks.push({
      id: 'link-text',
      label: 'Link text says where it goes',
      weight: 5,
      status: vague.length === 0 ? 'pass' : 'warn',
      detail: vague.length === 0 ? 'We did not find vague links such as "click here" or "read more".' : `We found links that only say ${vague.slice(0, 4).map((v) => `"${v}"`).join(', ')}.`,
      why: 'Many people scan a page by its links, and screen reader users often hear a list of links on their own. Five links that all say "read more" give them nothing to choose between.',
      fix: 'Make link text describe the destination, such as "Read more about our dementia care" or "See our fees", rather than "click here".',
    })
  }

  // 8. Viewport and zoom
  {
    const vp = home.viewport
    const noScale = vp !== null && /user-scalable\s*=\s*(no|0)\b/.test(vp)
    const maxScale = vp?.match(/maximum-scale\s*=\s*([\d.]+)/)?.[1]
    const capped = maxScale !== undefined && Number(maxScale) < 2
    checks.push({
      id: 'zoom',
      label: 'Works on phones and lets people zoom in',
      weight: 12,
      status: vp === null || noScale || capped ? 'fail' : 'pass',
      detail: vp === null
        ? 'Your homepage has no mobile viewport tag, so phones may show a shrunken desktop page.'
        : noScale || capped
          ? `Your site tells phones not to let people zoom in (${noScale ? 'user-scalable=no' : `maximum-scale=${maxScale}`}).`
          : 'Your site is set up for phones and does not block pinch to zoom.',
      why: 'Many of the people reading your site are older, and a lot of them are on a phone. Pinching to zoom is how they read small print. Blocking it, or showing a tiny desktop layout, can make your fees and contact details unreadable.',
      fix: vp === null
        ? 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the <head> of your site template.'
        : 'Change your viewport tag to <meta name="viewport" content="width=device-width, initial-scale=1">, removing user-scalable=no and maximum-scale=1.',
      benchmark: vp === null ? `In ${STUDY_NOTE}, ${pct(STUDY.noViewportSites, STUDY.measured)}% had no mobile viewport tag.` : undefined,
    })
  }

  // 9. Text size (only when the page's own CSS tells us)
  {
    const sizes = pages.map((p) => p.baseFontPx).filter((x): x is number => x !== null)
    const tiny = sum('tinyInlineText')
    if (sizes.length || tiny) {
      const smallest = sizes.length ? Math.min(...sizes) : null
      const status: Status = smallest !== null && smallest < 12 ? 'fail' : (smallest !== null && smallest < 14) || tiny > 0 ? 'warn' : 'pass'
      checks.push({
        id: 'text-size',
        label: 'Body text is a comfortable size',
        weight: 5,
        status,
        detail: [
          smallest !== null ? `Your main text is set at about ${smallest}px${smallest >= 16 ? ', which is a good size' : smallest >= 14 ? ', which is readable but on the small side' : ', which is small for older readers'}.` : '',
          tiny ? `We also found ${plural(tiny, 'block')} of text styled at under 12px.` : '',
        ].filter(Boolean).join(' '),
        why: 'Small text is one of the most common complaints from older visitors. Many will not know how to enlarge it, and simply give up and ring, or go elsewhere.',
        fix: 'Set body text to at least 16px, with a line height of about 1.5. Keep small print for things like copyright lines, never for fees, opening hours or contact details.',
      })
    }
  }

  // 10. Skip link
  checks.push({
    id: 'skip',
    label: 'Skip to content link',
    weight: 5,
    status: home.skipLink ? 'pass' : 'warn',
    detail: home.skipLink
      ? 'Your homepage has a skip to content link.'
      : `We did not find a skip to content link on your homepage${home.mainLandmark ? ', although it does mark up its main content area, which helps' : ''}.`,
    why: 'People who use a keyboard or a switch instead of a mouse, often because of arthritis, a tremor or a stroke, have to tab through every menu item on every page. A skip link lets them jump straight to the content.',
    fix: 'Add a "Skip to content" link as the first item on the page, visible when it receives keyboard focus, pointing to your main content area. Most modern themes include one that can be switched on.',
    benchmark: `In ${STUDY_NOTE}, ${pct(STUDY.noSkipLinkSites, STUDY.measured)}% had no skip link.`,
  })

  // 11. Buttons
  {
    const buttons = sum('buttons')
    const missing = sum('buttonsNoName')
    checks.push({
      id: 'buttons',
      label: 'Buttons have names',
      weight: 8,
      status: missing === 0 ? 'pass' : missing <= 2 ? 'warn' : 'fail',
      detail: buttons === 0 ? 'We did not find any buttons in the page code.' : missing === 0 ? `All ${plural(buttons, 'button')} we found have a name.` : `${plural(missing, 'button')} ${missing === 1 ? 'has' : 'have'} no name. The mobile menu button is a common example.`,
      why: 'A button with only an icon, such as the three line menu button, is announced as just "button". Someone using a screen reader cannot tell it opens your menu, so they may never find your fees or contact page.',
      fix: 'Give icon buttons a name, for example aria-label="Open menu" on the menu button, or a word next to the icon.',
      examples: firstN('buttonExamples'),
    })
  }

  // 12. Iframes
  {
    const frames = sum('iframes')
    const missing = sum('iframesNoTitle')
    if (frames > 0) {
      checks.push({
        id: 'iframes',
        label: 'Embedded maps and videos have titles',
        weight: 4,
        status: missing === 0 ? 'pass' : 'warn',
        detail: frames === 1
          ? `Your embedded map, video or widget ${missing ? 'has no title' : 'has a title'}.`
          : missing === 0 ? `All ${frames} embedded maps, videos or widgets have a title.` : `${missing} of ${frames} embedded maps, videos or widgets have no title.`,
        why: 'Embedded Google Maps, YouTube videos and booking widgets are announced by their title. Without one, a screen reader user hears "frame" and has to go inside to find out what it is.',
        fix: 'Add a title to each embed, such as title="Map showing how to find us" or title="Video tour of our home".',
        examples: firstN('iframeExamples'),
      })
    }
  }

  // 13. Tap to call
  {
    const tel = sum('telLinks')
    const phone = pages.map((p) => p.phoneInText).find(Boolean) ?? null
    checks.push({
      id: 'tel',
      label: 'Phone number is tap to call',
      weight: 8,
      status: tel > 0 ? 'pass' : phone ? 'fail' : 'warn',
      detail: tel > 0
        ? `Your phone number is a tap to call link${pages.length > 1 ? ' on the pages we checked' : ''}.`
        : phone
          ? `Your site shows a phone number (${phone}) but it is not a tap to call link.`
          : 'We could not find a phone number on the pages we checked.',
      why: 'Many families would rather talk to a person than fill in a form, and older callers find copying a number from a screen into the keypad fiddly. A tap to call link turns an interested visitor into a phone call in one step.',
      fix: 'Make every phone number a link, for example <a href="tel:+441234567890">01234 567890</a>, and put it at the top of every page.',
    })
  }

  return checks
}

function shortPath(u: string): string {
  try {
    const x = new URL(u)
    return x.pathname === '/' ? 'your homepage' : x.pathname.replace(/\/$/, '')
  } catch {
    return u
  }
}

export function scoreChecks(checks: Check[]): number {
  let got = 0
  let total = 0
  for (const c of checks) {
    if (c.status === 'info') continue
    total += c.weight
    got += c.status === 'pass' ? c.weight : c.status === 'warn' ? c.weight / 2 : 0
  }
  return total ? Math.round((got / total) * 100) : 0
}

export function topFixes(checks: Check[], n = 3): { id: string; label: string; fix: string }[] {
  return checks
    .filter((c) => c.status === 'fail' || c.status === 'warn')
    .map((c) => ({ c, lost: c.weight * (c.status === 'fail' ? 1 : 0.5) }))
    .sort((a, b) => b.lost - a.lost)
    .slice(0, n)
    .map(({ c }) => ({ id: c.id, label: c.label, fix: c.fix }))
}

// Pick up to `max` inner pages worth checking: the contact page first, then a key care page.
export function innerPages(html: string, base: URL, max: number): string[] {
  const $ = cheerio.load(html)
  const baseHost = base.hostname.replace(/^www\./, '')
  const seen = new Set<string>([base.toString().replace(/[#?].*$/, '').replace(/\/$/, '')])
  const scored: { url: string; score: number; kind: string }[] = []
  $('a[href]').each((_i, n) => {
    const el = n as unknown as Element
    let u: URL
    try {
      u = new URL(el.attribs['href'] || '', base)
    } catch {
      return
    }
    if (!/^https?:$/.test(u.protocol) || u.hostname.replace(/^www\./, '') !== baseHost) return
    if (/\.(pdf|jpe?g|png|gif|webp|svg|docx?|xlsx?|zip|mp4)$/i.test(u.pathname)) return
    u.hash = ''
    const key = u.toString().replace(/\?.*$/, '').replace(/\/$/, '')
    if (seen.has(key)) return
    seen.add(key)
    const hay = `${u.pathname} ${clean($(el as never).text())}`.toLowerCase()
    if (/privacy|cookie|terms|policy|login|wp-admin|feed|cart|basket|\/tag\/|\/category\/|\/author\//.test(hay)) return
    let score = 0
    let kind = 'other'
    if (/contact|get in touch|enquir|find us/.test(hay)) { score = 10; kind = 'contact' }
    else if (/fees|our care|services|what we do|care we offer|nursing|residential|dementia|home care|about/.test(hay)) { score = 5; kind = 'care' }
    else if (/careers|jobs|vacanc|visit|gallery/.test(hay)) { score = 2; kind = 'other' }
    if (score > 0) scored.push({ url: u.toString(), score, kind })
  })
  scored.sort((a, b) => b.score - a.score)
  // One contact page and one care page where we can, then fill with whatever scored highest.
  const out: string[] = []
  for (const kind of ['contact', 'care']) {
    const best = scored.find((s) => s.kind === kind)
    if (best && out.length < max) out.push(best.url)
  }
  for (const s of scored) if (out.length < max && !out.includes(s.url)) out.push(s.url)
  return out
}

