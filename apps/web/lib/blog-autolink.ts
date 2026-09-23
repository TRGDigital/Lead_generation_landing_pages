// Contextual internal links inside blog posts.
//
// The posts were written without links to each other, so the blog reads as 18 dead ends.
// Rather than rewrite every post, this links the FIRST mention of a known phrase when the
// page renders: the stored text never changes, new posts are covered automatically, and
// removing a link is a one line edit here.
//
// Rules, so this stays useful rather than spammy:
//  - first mention of each phrase only, and each target linked at most once per post
//  - never inside an existing link, a heading, code, or the table of contents
//  - never a link to the page you are already on
//  - a hard cap per post, posts before service pages before care settings

type Target = {
  href: string
  /** Longest first: "local SEO for care homes" must win over "local SEO". */
  phrases: string[]
  /** Posts first, then services, then care settings. */
  rank: number
}

const TARGETS: Target[] = [
  // ── Other blog posts: the links the blog is missing ────────────────────────────────
  { href: '/blog/care-homes-near-me-explained', rank: 0, phrases: ['care homes near me', 'near me searches'] },
  { href: '/blog/families-asking-chatgpt-for-carehome-recommendations', rank: 0, phrases: ['ChatGPT', 'AI assistants', 'AI search'] },
  { href: '/blog/how-do-hospital-discharge-teams-find-care-homes-for-patients', rank: 0, phrases: ['hospital discharge teams', 'discharge teams', 'hospital discharge'] },
  { href: '/blog/local-pages-every-care-home-should-have', rank: 0, phrases: ['local landing pages', 'local pages', 'town pages'] },
  { href: '/blog/fill-empty-care-home-beds-faster', rank: 0, phrases: ['empty beds', 'empty bed'] },
  { href: '/blog/nursing-home-seo', rank: 0, phrases: ['nursing home SEO', 'SEO for nursing homes', 'nursing home marketing'] },
  { href: '/blog/nursing-home-weekly-funding-gap', rank: 0, phrases: ['funding gap', 'local authority rates', 'council funded residents'] },
  { href: '/blog/replying-to-care-home-enquiries', rank: 0, phrases: ['response time', 'respond to an enquiry', 'responding to enquiries'] },
  { href: '/blog/how-to-increase-nursing-home-enquiries', rank: 0, phrases: ['private pay', 'privately funded residents', 'self funders'] },
  { href: '/blog/new-care-home-website', rank: 0, phrases: ['DIY website', 'free website builder', 'website builder', 'template website', 'cheap website'] },
  { href: '/blog/care-home-website-losing-enquiries', rank: 0, phrases: ['losing enquiries', 'lost enquiries'] },
  { href: '/blog/local-seo-for-care-homes-nursing-homes', rank: 0, phrases: ['local SEO for care homes', 'local search visibility', 'local search'] },
  { href: '/blog/generate-new-care-home-enquiries', rank: 0, phrases: ['generate enquiries', 'generating enquiries', 'more enquiries', 'new enquiries'] },
  { href: '/blog/google-searches-into-care-enquiries', rank: 0, phrases: ['Google searches'] },
  { href: '/blog/nursing-home-new-website', rank: 0, phrases: ['nursing home website'] },
  { href: '/blog/how-do-care-home-discharge-teams-find-homes-like-yours', rank: 0, phrases: ['social workers', 'professional referrals', 'referral routes'] },
  { href: '/blog/introduction-to-carestreamai', rank: 0, phrases: ['CareStream'] },
  { href: '/blog/introduction-to-careassura', rank: 0, phrases: ['CareAssura'] },

  // ── Service pages ─────────────────────────────────────────────────────────────────
  { href: '/google-business-profile', rank: 1, phrases: ['Google Business Profile', 'Google profile'] },
  { href: '/website-development', rank: 1, phrases: ['website design', 'new website', 'care home website'] },
  { href: '/carer-recruitment', rank: 1, phrases: ['carer recruitment', 'recruiting carers', 'recruit carers', 'care jobs'] },
  { href: '/accessible-websites', rank: 1, phrases: ['accessible website', 'accessibility', 'WCAG'] },
  { href: '/local-seo', rank: 1, phrases: ['local SEO', 'map pack'] },
  { href: '/seo', rank: 1, phrases: ['search engine optimisation', 'organic visibility', 'organic search'] },
  { href: '/marketing', rank: 1, phrases: ['paid search', 'Google Ads', 'PPC'] },
  { href: '/conversion-rate-optimisation', rank: 1, phrases: ['conversion rate', 'enquiry form'] },
  { href: '/content-creation', rank: 1, phrases: ['content marketing'] },
  { href: '/care-tools', rank: 1, phrases: ['funding calculator', 'family tools', 'care tools'] },
  { href: '/website-build', rank: 1, phrases: ["what's included in a website build"] },
  { href: '/tools/website-grader', rank: 1, phrases: ['website grader'] },
  { href: '/tools/cqc-rating-checker', rank: 1, phrases: ['CQC rating checker'] },

  // ── Care settings ─────────────────────────────────────────────────────────────────
  { href: '/nursing-homes', rank: 2, phrases: ['nursing homes'] },
  { href: '/dementia-care', rank: 2, phrases: ['dementia care'] },
  { href: '/home-care', rank: 2, phrases: ['home care'] },
  { href: '/live-in-care', rank: 2, phrases: ['live-in care'] },
  { href: '/domiciliary-care', rank: 2, phrases: ['domiciliary care'] },
  { href: '/supported-living', rank: 2, phrases: ['supported living'] },
  { href: '/retirement-living', rank: 2, phrases: ['retirement living'] },
  { href: '/care-homes', rank: 2, phrases: ['care homes'] },
]

const MAX_LINKS = 6

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Phrases, longest first within each rank, so the most specific wording wins. */
function orderedPhrases(currentPath: string): { href: string; phrase: string; re: RegExp }[] {
  return TARGETS.filter((t) => t.href !== currentPath)
    .sort((a, b) => a.rank - b.rank)
    .flatMap((t) =>
      [...t.phrases]
        .sort((a, b) => b.length - a.length)
        .map((phrase) => ({
          href: t.href,
          phrase,
          // Word boundaries either side, so "occupancy" never matches inside another word.
          re: new RegExp(`(^|[^\\w-])(${escapeRe(phrase)})(?![\\w-])`, 'i'),
        })),
    )
}

/** Tags we never link inside: existing links, headings, code and the table of contents. */
const BLOCKED = /^(a|h1|h2|h3|h4|h5|h6|code|pre|nav|script|style|figcaption)$/i

export function autolinkHtml(html: string, currentPath: string): string {
  if (!html) return html

  const candidates = orderedPhrases(currentPath)
  const usedHrefs = new Set<string>()
  let placed = 0

  // Walk the HTML as alternating tags and text, so a phrase is only ever linked in body
  // text and never inside an attribute or a blocked element.
  const parts = html.split(/(<[^>]+>)/)
  let blockedDepth = 0
  let inToc = false

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!
    if (part.startsWith('<')) {
      const closing = part.startsWith('</')
      const name = part.replace(/^<\/?/, '').split(/[\s/>]/)[0] ?? ''
      if (/class="[^"]*blog-toc/.test(part)) inToc = true
      else if (inToc && closing && /^(nav|div|ol|ul)$/i.test(name)) inToc = false
      if (BLOCKED.test(name) && !part.endsWith('/>')) blockedDepth += closing ? -1 : 1
      if (blockedDepth < 0) blockedDepth = 0
      continue
    }
    if (blockedDepth > 0 || inToc || placed >= MAX_LINKS || !part.trim()) continue

    // Several links can sit in one long paragraph, but never close together, so the text
    // still reads as prose rather than a list of links.
    const MIN_GAP = 140
    let text = part
    const takenAt: number[] = []
    let changed = true
    while (changed && placed < MAX_LINKS) {
      changed = false
      for (const c of candidates) {
        if (placed >= MAX_LINKS) break
        if (usedHrefs.has(c.href)) continue
        const m = c.re.exec(text)
        if (!m) continue
        const before = m[1] ?? ''
        const phrase = m[2] ?? ''
        const start = m.index + before.length
        if (takenAt.some((t) => Math.abs(t - start) < MIN_GAP)) continue
        const link = `<a href="${c.href}">${phrase}</a>`
        text = text.slice(0, start) + link + text.slice(start + phrase.length)
        // Positions after this insertion shift by the markup we added.
        for (let k = 0; k < takenAt.length; k++) if (takenAt[k]! > start) takenAt[k]! += link.length - phrase.length
        takenAt.push(start)
        usedHrefs.add(c.href)
        placed++
        changed = true
        break
      }
    }
    parts[i] = text
  }

  return parts.join('')
}
