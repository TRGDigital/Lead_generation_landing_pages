// Builds the gated buyer's guide PDF: "How to choose a website agency for your care service".
// Run from apps/web:  node scripts/build-buyers-guide.mjs
// Output: public/guides/choosing-a-care-website-agency.pdf
//
// House rules for this copy (same as lib/comparisons.ts): fair to every option, no prices,
// no statistics or results that are not already on the site, no testimonials, UK English,
// and no em or en dashes. The build fails if a dash or a non-ASCII character slips in, and
// if any block would run past the bottom margin of a page.
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'public', 'guides', 'choosing-a-care-website-agency.pdf')
const SITE = 'www.trgdigital.co.uk'

// ---------- brand ----------
const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255)
const C = {
  ink: hex('#2a2620'),
  inkSoft: hex('#5a5247'),
  muted: hex('#8a8175'),
  pop: hex('#F0532B'),
  accent: hex('#FBCC33'),
  warm: hex('#f7f6f3'),
  line: hex('#ebe9e4'),
  white: rgb(1, 1, 1),
}

// ---------- content ----------
const SECTIONS = [
  {
    title: 'Your CQC rating (Regulation 20A)',
    why: [
      'Regulation 20A requires your current CQC rating to be shown clearly on your website. The official CQC widget keeps it up to date automatically, but someone has to add it, in the right places, and check it after each inspection.',
      'It is simple to do and easy to miss if nobody on the project has run a care service.',
    ],
    ask: [
      'How will our CQC rating be shown, and on which pages?',
      'Will you use the official CQC widget, so the rating updates itself?',
      'Who checks the rating is still correct after each inspection?',
      'Where will our registered manager and provider details appear?',
    ],
    good: 'The official widget, added to every page that matters, with a named person who checks it after each inspection. The agency raises Regulation 20A before you do.',
    check: { label: 'CQC Rating Display Checker', path: '/tools/cqc-rating-display-checker' },
  },
  {
    title: 'Accessibility for older visitors',
    why: [
      'Many of the people reading a care website are in their seventies or eighties, or are adult children reading on a phone late at night. Stylish templates often use light grey text, small type and thin fonts that look lovely in a preview and are hard work for the people you most need to reach.',
      'Under the Equality Act 2010, anyone providing a service to the public must make reasonable adjustments for disabled people (section 20) and must not discriminate in the way the service is provided (section 29). Your website is one of the ways you provide your service. Building to WCAG 2.2 AA is the clearest way to show you have taken this seriously.',
    ],
    ask: [
      'Will the site be built to WCAG 2.2 AA, and how will you test it?',
      'Can visitors enlarge the text, switch to high contrast, or have a page read aloud?',
      'Will text meet AA contrast, and still read on a phone in daylight?',
      'Will anything slide, fade or auto-play while someone is trying to read?',
      'Will the content system ask for alt text on every image your team adds?',
    ],
    good: 'Testing with the keyboard, screen readers and contrast checks, on phones, tablets and computers. Large, dark text, simple menus, big buttons, and no carousels.',
    check: { label: 'Care Website Accessibility Check', path: '/tools/care-website-accessibility-check' },
  },
  {
    title: 'Enquiry handling and response',
    why: [
      'A family looking for care is often under pressure, worried about money and reading on a phone. They want a person to call. A form that expires halfway through, asks for a puzzle to prove they are human, or lands in an inbox nobody watches loses them.',
      'Replying to enquiries quickly matters as much as the website itself.',
    ],
    ask: [
      'Who receives each enquiry, and how quickly will we know about it?',
      'Will there be a phone number and one obvious action on every page, in the same place?',
      'Will the form work on a phone, with no puzzle and no session that expires mid enquiry?',
      'Will each enquiry show which page and which source it came from?',
      'What will you report each month: enquiries, or just visits?',
    ],
    good: 'Enquiries go straight to named people, with the page they came from. Reporting is about enquiries, not traffic.',
    check: { label: 'Care Website Grader (scores your enquiry journey)', path: '/tools/website-grader' },
  },
  {
    title: 'Fees and availability',
    why: [
      'Families want fees, funding, the CQC rating, photos of real rooms and a person to call. Fees information families can find, and a plain funding explainer, are two of the care details most often left out of a general website brief.',
    ],
    ask: [
      'Where will our fees, or how our fees are worked out, appear on the site?',
      'Will there be a plain English guide to funding for families?',
      'Can we show current availability, and can our own team update it?',
      'Will care terms such as domiciliary, respite, CHC and FNC be explained?',
    ],
    good: 'The agency asks how you want to present fees, rather than leaving them out by default, and your team can keep availability current without calling anyone.',
    check: { label: 'Care Website Grader (checks fees and funding)', path: '/tools/website-grader' },
  },
  {
    title: 'Local search for "care homes in [town]"',
    why: [
      'Care searches in most towns are crowded with directories and large groups. Winning "care homes in [town]" takes local service pages, a strong Google Business Profile and content that answers family questions.',
      'Website platforms handle the technical basics of search well. Deciding which towns, services and questions deserve their own pages, writing them and keeping them improving is the work, and it is rarely in a build quote.',
    ],
    ask: [
      'Which towns and services will get their own pages?',
      'If we are moving from an old site, how will you protect our current Google rankings?',
      'Will our name, address and phone number match on the site, Google and directories?',
      'Is local search work part of the build, or a separate ongoing service?',
    ],
    good: 'A clear list of the local pages you will get, a plan for keeping the pages Google already knows about working, and honesty about what is ongoing work.',
    check: { label: 'Local Competitor Snapshot', path: '/tools/care-competitor-snapshot' },
  },
  {
    title: 'Care-specific schema',
    why: [
      'Search engines understand a site better with structured data that describes the service, the location and common questions. Most platforms add general markup. Care service and FAQ markup usually needs custom code, and your CQC rating should be added in the correct, compliant way.',
    ],
    ask: [
      'What structured data will each page carry: care service, location, FAQs?',
      'How will our CQC rating be represented in it?',
      'Will each vacancy carry job markup, so it can appear in Google for Jobs?',
    ],
    good: 'A specific answer naming the markup, not "the plugin handles SEO".',
    check: { label: 'Care Schema Generator', path: '/tools/care-schema-generator' },
  },
  {
    title: 'Carer recruitment pages',
    why: [
      'Most providers need a steady flow of carers as much as they need residents or clients. Carers look for work on their phones, usually between shifts. A careers page that hides the pay, sends people to a separate jobs site, or asks for a CV they do not have loses them in seconds. A single jobs page rarely ranks.',
    ],
    ask: [
      'Will every vacancy have its own page, with the pay shown up front?',
      'Will vacancies be marked up for Google for Jobs?',
      'Can someone apply on a phone, with a CV or without one?',
      'Can our team add and close vacancies themselves?',
      'Will there be careers pages for the towns we recruit in?',
    ],
    good: 'Job pages on your own website that your team runs, a quick mobile application, and pay shown on every role.',
    check: { label: 'Care Job Advert Checker', path: '/tools/care-job-advert-checker' },
  },
  {
    title: 'GDPR and care data',
    why: [
      'A family enquiry often includes health details about a relative, which is special category data under UK GDPR. The form itself is easy. Deciding what to ask, who receives it, where it is stored and what your privacy notice says takes care knowledge, not a template. Knowing exactly where family data goes also makes UK GDPR simpler.',
    ],
    ask: [
      'What will our forms ask, and what will they deliberately not ask?',
      'Where are enquiries and CVs stored, who can open them, and for how long?',
      'Is personal data encrypted in transit and at rest?',
      'Will our privacy notice cover everything the forms collect?',
      'Are you registered with the ICO, and who keeps the software patched?',
    ],
    good: 'Forms that collect only what is needed, CVs kept in a private, encrypted area and deleted after a period you choose, and a privacy notice written to match.',
  },
  {
    title: 'Who owns the domain, hosting and logins',
    why: [
      'If an agency or freelancer registered your domain, set up the hosting and holds the admin login, you depend on them staying in business and in touch. If everything is in your name, another developer can pick the site up. If it is not, getting it back can be slow. Check this now rather than when something breaks.',
    ],
    ask: [
      'Will the domain be registered in our organisation\'s name?',
      'Whose account will the hosting be in?',
      'Will we have our own admin login from day one?',
      'Who owns the words, photos and design?',
      'What happens, and what does it cost, if we leave?',
    ],
    good: 'The domain, the hosting account and every login in your organisation\'s name, with clear, written exit terms.',
  },
  {
    title: 'What happens after launch',
    why: [
      'The problems on inherited care websites are rarely about the platform. They are about what happens after launch. When the build is paid for and the maintenance is not, updates stop, and an outdated site that collects family enquiries is a data protection worry as well as a technical one.',
      'To compare quotes fairly, add hosting, maintenance, new pages and any search work to the build price, then compare the cost per enquiry over two or three years rather than the price on day one.',
    ],
    ask: [
      'Who updates the platform, theme and plugins, and how often?',
      'What exactly does your maintenance agreement cover?',
      'What will new pages cost after launch?',
      'Who covers if our contact is ill or on holiday?',
      'Who will we actually speak to week to week, and how often do we review results?',
    ],
    good: 'A written maintenance agreement, a named contact with cover, and regular reviews of enquiries.',
    check: { label: 'Enquiry Value Calculator (what one enquiry is worth)', path: '/tools/enquiry-value-calculator' },
  },
]

const RED_FLAGS = [
  'They cannot show you care websites they have built, or how those sites perform.',
  'The domain, hosting or admin login will be in their name, not yours.',
  'Nobody mentions the CQC rating or Regulation 20A until you do.',
  'The design leans on light grey text, small type, sliders or auto-playing video.',
  'The quote covers the build but says nothing about updates, security or maintenance.',
  'Monthly reports count visits but never enquiries.',
  'A new site is planned with no plan for the pages Google already knows about.',
  'Enquiry forms ask for health details with no privacy notice to match.',
  'One person holds every login and there is no cover when they are away.',
  'Vague answers about what happens, and what it costs, if you leave.',
]

const RIGHT_CHOICE = [
  ['A DIY builder such as Wix or Squarespace', 'A sensible start for a new service that needs something presentable this month, or when the budget is small. Add the CQC widget, a clear phone number and a simple enquiry form.'],
  ['A WordPress freelancer', 'Excellent value if they have built care websites, answer the phone and offer a proper maintenance agreement.'],
  ['A general web agency', 'A good fit if they have built care sites before and can show how they perform, or if care is one part of a wider group.'],
  ['Directory listings', 'The fastest way to be found and a strong source of reviews. Best alongside a website you own, not instead of one.'],
]

const SCORE_ROWS = [
  'CQC rating shown with the official widget, and checked after each inspection',
  'Built to WCAG 2.2 AA and tested for older visitors',
  'Enquiries reach named people quickly, with a phone number on every page',
  'Fees, funding and availability easy for families to find',
  'Local pages for our towns and services, with current rankings protected',
  'Care service, FAQ and job markup included',
  'Careers pages with pay shown and a quick mobile application',
  'Care data handled carefully: lean forms, secure storage, matching privacy notice',
  'Domain, hosting and every login in our name',
  'Clear maintenance, updates and security after launch',
  'Monthly reporting on enquiries, not just visits',
  'Has built care websites and can show how they perform',
  'Clear, fair terms if we leave',
]

// ---------- guard: no dashes, WinAnsi-safe ASCII only ----------
function assertClean(s) {
  if (/[\u2013\u2014]/.test(s)) throw new Error(`Dash in copy: ${s}`)
  if (/[^\x20-\x7E]/.test(s)) throw new Error(`Non-ASCII character in copy: ${s}`)
  return s
}

// ---------- layout engine ----------
const W = 595.28
const H = 841.89
const M = 56 // side margin
const TOP = H - 86 // first baseline area under the header
const BOTTOM = 64 // footer zone
const CW = W - M * 2

const doc = await PDFDocument.create()
doc.setTitle('How to choose a website agency for your care service')
doc.setAuthor('TRG Digital')
doc.setSubject('A practical checklist for UK care providers choosing who builds their website')
doc.setCreator('TRG Digital')
doc.setProducer('TRG Digital')
doc.setKeywords(['care home website', 'care website agency', 'CQC', 'buyer guide'])

const F = await doc.embedFont(StandardFonts.Helvetica)
const FB = await doc.embedFont(StandardFonts.HelveticaBold)
const logo = await doc.embedPng(readFileSync(join(root, 'public', 'trg-digital-2025-t.png')))
const logoWhite = await doc.embedPng(readFileSync(join(root, 'public', 'trg-digital-footer.png')))

function wrap(text, font, size, width) {
  assertClean(text)
  const words = text.split(/\s+/).filter(Boolean)
  const lines = []
  let line = ''
  for (const w of words) {
    const t = line ? `${line} ${w}` : w
    if (font.widthOfTextAtSize(t, size) <= width) line = t
    else {
      if (line) lines.push(line)
      if (font.widthOfTextAtSize(w, size) > width) throw new Error(`Word too wide: ${w}`)
      line = w
    }
  }
  if (line) lines.push(line)
  return lines
}

let page
let y
const contentPages = []
const sectionPages = {}

function header(p) {
  const lw = 78
  p.drawImage(logo, { x: M, y: H - 46, width: lw, height: (lw * logo.height) / logo.width })
  const t = 'How to choose a website agency for your care service'
  p.drawText(t, { x: W - M - F.widthOfTextAtSize(t, 8), y: H - 40, size: 8, font: F, color: C.muted })
  p.drawRectangle({ x: M, y: H - 58, width: CW, height: 1.2, color: C.line })
}

function newPage() {
  page = doc.addPage([W, H])
  contentPages.push(page)
  header(page)
  y = TOP
}

function ensure(h) {
  if (h > TOP - BOTTOM) throw new Error(`Block of height ${h} cannot fit on any page`)
  if (y - h < BOTTOM) newPage()
}

function para(text, { size = 10, font = F, color = C.inkSoft, lead = 1.42, indent = 0, width = CW - indent, gap = 8 } = {}) {
  const lines = wrap(text, font, size, width)
  const h = lines.length * size * lead + gap
  ensure(h)
  for (const l of lines) {
    y -= size * lead
    page.drawText(l, { x: M + indent, y: y + size * 0.3, size, font, color })
  }
  y -= gap
}

function measurePara(text, size = 10, font = F, width = CW, lead = 1.42, gap = 8) {
  return wrap(text, font, size, width).length * size * lead + gap
}

function checkbox(text) {
  const size = 10
  const lead = 1.4
  const lines = wrap(text, F, size, CW - 22)
  const h = lines.length * size * lead + 4
  ensure(h)
  const top = y
  page.drawRectangle({ x: M + 2, y: top - size * lead + 1, width: 9, height: 9, borderColor: C.pop, borderWidth: 1.2 })
  for (const l of lines) {
    y -= size * lead
    page.drawText(l, { x: M + 20, y: y + size * 0.3, size, font: F, color: C.ink })
  }
  y -= 4
}

function label(text, color = C.pop) {
  ensure(22)
  y -= 14
  page.drawText(assertClean(text.toUpperCase()), { x: M, y, size: 8.5, font: FB, color })
  y -= 6
}

function box(title, text) {
  const size = 10
  const lines = wrap(text, F, size, CW - 28)
  const h = 16 + 14 + lines.length * size * 1.42 + 12
  ensure(h + 8)
  y -= 4
  page.drawRectangle({ x: M, y: y - h, width: CW, height: h, color: C.warm })
  page.drawRectangle({ x: M, y: y - h, width: 3, height: h, color: C.accent })
  let yy = y - 18
  page.drawText(assertClean(title.toUpperCase()), { x: M + 14, y: yy, size: 8.5, font: FB, color: C.ink })
  yy -= 6
  for (const l of lines) {
    yy -= size * 1.42
    page.drawText(l, { x: M + 14, y: yy + 3, size, font: F, color: C.inkSoft })
  }
  y -= h + 8
}

function checkLine(check) {
  const size = 10
  const pre = 'Check it yourself, free: '
  const txt = `${check.label}, ${SITE}${check.path}`
  const lines = wrap(pre + txt, F, size, CW)
  ensure(lines.length * size * 1.45 + 6)
  // Draw prefix bold, rest in orange; wrap-aware by rendering line by line.
  let first = true
  for (const l of lines) {
    y -= size * 1.45
    if (first && l.startsWith(pre)) {
      page.drawText(pre, { x: M, y: y + 3, size, font: FB, color: C.ink })
      page.drawText(l.slice(pre.length), { x: M + FB.widthOfTextAtSize(pre, size), y: y + 3, size, font: F, color: C.pop })
    } else {
      page.drawText(l, { x: M, y: y + 3, size, font: F, color: C.pop })
    }
    first = false
  }
  y -= 6
}

function sectionHeading(n, title, firstParaHeight) {
  const size = 17
  const lines = wrap(title, FB, size, CW - 40)
  const h = 18 + lines.length * size * 1.2 + 12
  ensure(h + firstParaHeight)
  y -= 18
  // number badge
  page.drawCircle({ x: M + 13, y: y - 7, size: 13, color: C.pop })
  const ns = String(n)
  page.drawText(ns, { x: M + 13 - FB.widthOfTextAtSize(ns, 12) / 2, y: y - 11.5, size: 12, font: FB, color: C.white })
  for (const l of lines) {
    y -= size * 1.2
    page.drawText(l, { x: M + 36, y: y + 7, size, font: FB, color: C.ink })
  }
  y -= 12
  sectionPages[title] = doc.getPageCount()
}

function pageTitle(eyebrow, title) {
  label(eyebrow)
  const lines = wrap(title, FB, 22, CW)
  ensure(lines.length * 27 + 12)
  for (const l of lines) {
    y -= 27
    page.drawText(l, { x: M, y: y + 6, size: 22, font: FB, color: C.ink })
  }
  y -= 12
}

// ---------- cover ----------
{
  const p = doc.addPage([W, H])
  p.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.ink })
  p.drawRectangle({ x: 0, y: H - 10, width: W, height: 10, color: C.pop })
  const lw = 150
  p.drawImage(logoWhite, { x: M, y: H - 100, width: lw, height: (lw * logoWhite.height) / logoWhite.width })

  // tag
  const tag = "FREE BUYER'S GUIDE FOR UK CARE PROVIDERS"
  const tw = FB.widthOfTextAtSize(tag, 9)
  p.drawRectangle({ x: M, y: H - 232, width: tw + 20, height: 22, color: C.accent })
  p.drawText(tag, { x: M + 10, y: H - 225, size: 9, font: FB, color: C.ink })

  let cy = H - 290
  for (const l of wrap('How to choose a website agency', FB, 38, CW)) {
    p.drawText(l, { x: M, y: cy, size: 38, font: FB, color: C.white })
    cy -= 44
  }
  for (const l of wrap('for your care service', FB, 38, CW)) {
    p.drawText(l, { x: M, y: cy, size: 38, font: FB, color: C.pop })
    cy -= 44
  }
  cy -= 10
  for (const l of wrap(
    'The questions worth asking any agency, freelancer or platform before you sign, whoever you choose. With a one page scorecard to compare them side by side.',
    F,
    13,
    CW - 40,
  )) {
    p.drawText(l, { x: M, y: cy, size: 13, font: F, color: rgb(0.85, 0.83, 0.8) })
    cy -= 19
  }

  cy -= 26
  p.drawText('INSIDE', { x: M, y: cy, size: 9, font: FB, color: C.accent })
  cy -= 20
  const inside = [
    'CQC rating display and Regulation 20A',
    'Accessibility for older visitors',
    'Enquiries, fees and availability',
    'Local search, schema and recruitment pages',
    'GDPR, ownership, hosting and life after launch',
    'Red flags and a side by side scorecard',
  ]
  for (const i of inside) {
    p.drawRectangle({ x: M, y: cy + 2, width: 6, height: 6, color: C.pop })
    p.drawText(assertClean(i), { x: M + 16, y: cy, size: 11.5, font: F, color: C.white })
    cy -= 20
  }

  p.drawRectangle({ x: M, y: 70, width: CW, height: 0.8, color: rgb(0.35, 0.33, 0.3) })
  p.drawText(SITE, { x: M, y: 50, size: 10, font: FB, color: C.white })
  const r = 'Websites and SEO for UK care providers'
  p.drawText(r, { x: W - M - F.widthOfTextAtSize(r, 10), y: 50, size: 10, font: F, color: rgb(0.75, 0.73, 0.7) })
}

// ---------- contents + how to use (content drawn at the end, once page numbers are known) ----------
newPage()
const contentsPage = page
y = BOTTOM // force the sections onto a fresh page

// ---------- sections ----------
newPage()
SECTIONS.forEach((s, i) => {
  const firstH = measurePara(s.why[0])
  sectionHeading(i + 1, s.title, firstH + 10)
  label('Why it matters')
  for (const w of s.why) para(w)
  label('Ask any agency')
  for (const q of s.ask) checkbox(q)
  box('A good answer sounds like', s.good)
  if (s.check) checkLine(s.check)
  y -= 2
})

// ---------- red flags + fair alternatives ----------
// Flows on from the last section rather than forcing a page, so the guide stays short.
y -= 16
ensure(160)
pageTitle('Before you sign', 'Red flags to watch for')
sectionPages['Red flags'] = doc.getPageCount()
para('None of these on its own means an agency is bad. Two or three together are worth a careful conversation before you commit.')
for (const f of RED_FLAGS) {
  const size = 10.5
  const lines = wrap(f, F, size, CW - 22)
  ensure(lines.length * size * 1.42 + 5)
  const top = y
  page.drawText('!', { x: M + 4, y: top - size * 1.42 + 3, size: 11, font: FB, color: C.pop })
  for (const l of lines) {
    y -= size * 1.42
    page.drawText(l, { x: M + 20, y: y + 3, size, font: F, color: C.ink })
  }
  y -= 5
}
y -= 10
ensure(80)
label('Being fair: when another option is the right one')
sectionPages['When another option is right'] = doc.getPageCount()
para('A care specialist is not the right answer for everyone. These are the situations where another route often makes more sense.', { gap: 6 })
for (const [h, b] of RIGHT_CHOICE) {
  const hh = measurePara(h, 10.5, FB, CW, 1.4, 1) + measurePara(b, 10, F, CW, 1.42, 8)
  ensure(hh)
  para(h, { font: FB, color: C.ink, gap: 1, lead: 1.4 })
  para(b, { size: 10, lead: 1.42 })
}

// ---------- scorecard ----------
newPage()
sectionPages['Scorecard'] = doc.getPageCount()
pageTitle('One page scorecard', 'Compare agencies side by side')
para('Score each agency 0 (no or unclear), 1 (partly) or 2 (yes, clearly) on every line, using their answers to the questions in this guide. Print this page for each round of calls.', { size: 10 })
{
  const colW = 62
  const critW = CW - colW * 3
  const size = 9.5
  // header row
  const hh = 34
  ensure(hh)
  page.drawRectangle({ x: M, y: y - hh, width: CW, height: hh, color: C.ink })
  page.drawText('WHAT TO LOOK FOR', { x: M + 8, y: y - 21, size: 8.5, font: FB, color: C.white })
  ;['Agency A', 'Agency B', 'Agency C'].forEach((a, i) => {
    const x = M + critW + colW * i
    page.drawText(a, { x: x + (colW - FB.widthOfTextAtSize(a, 8.5)) / 2, y: y - 21, size: 8.5, font: FB, color: C.white })
  })
  y -= hh
  // name row
  const nh = 22
  page.drawRectangle({ x: M, y: y - nh, width: CW, height: nh, color: C.warm })
  page.drawText('Name', { x: M + 8, y: y - 15, size, font: FB, color: C.ink })
  y -= nh
  SCORE_ROWS.forEach((r, idx) => {
    const lines = wrap(r, F, size, critW - 16)
    const rh = Math.max(26, lines.length * size * 1.35 + 12)
    ensure(rh)
    if (idx % 2 === 1) page.drawRectangle({ x: M, y: y - rh, width: CW, height: rh, color: C.warm })
    let ly = y - 6
    for (const l of lines) {
      ly -= size * 1.35
      page.drawText(l, { x: M + 8, y: ly + 2, size, font: F, color: C.ink })
    }
    for (let i = 0; i < 3; i++) {
      const x = M + critW + colW * i
      page.drawRectangle({ x: x + colW / 2 - 12, y: y - rh / 2 - 9, width: 24, height: 18, borderColor: C.muted, borderWidth: 0.8, color: C.white })
    }
    page.drawRectangle({ x: M, y: y - rh, width: CW, height: 0.6, color: C.line })
    y -= rh
  })
  const th = 32
  ensure(th)
  page.drawRectangle({ x: M, y: y - th, width: CW, height: th, color: C.pop })
  page.drawText(`TOTAL (out of ${SCORE_ROWS.length * 2})`, { x: M + 8, y: y - 20, size: 9, font: FB, color: C.white })
  for (let i = 0; i < 3; i++) {
    const x = M + critW + colW * i
    page.drawRectangle({ x: x + colW / 2 - 15, y: y - th / 2 - 10, width: 30, height: 20, color: C.white })
  }
  y -= th + 12
}
para('A high total is a good sign, but read the answers too. A lower scoring agency that is honest about what it does not do can be a safer choice than one that says yes to everything.', { size: 9.5, color: C.muted })

// ---------- about TRG (closing) ----------
newPage()
sectionPages['About TRG Digital'] = doc.getPageCount()
pageTitle('About the authors', 'Ask us the same questions')
para('TRG Digital builds websites and SEO for UK care providers, and nothing else. Our founder has more than 20 years in digital and years working inside care, which shapes how we build. It is fair to judge us on the work rather than the claim, so please put every question in this guide to us too, and hold us to the answers.')
para('If a DIY builder, a freelancer or your current agency is the better fit for you right now, we would rather tell you so. We only work in care, and that is the point.')
label('Free tools to check any website, including ours')
const TOOLS = [
  ['CQC Rating Display Checker', '/tools/cqc-rating-display-checker'],
  ['Care Website Accessibility Check', '/tools/care-website-accessibility-check'],
  ['Your Care Website Grader', '/tools/website-grader'],
  ['Local Competitor Snapshot', '/tools/care-competitor-snapshot'],
  ['Care Schema Generator', '/tools/care-schema-generator'],
  ['Care Job Advert Checker', '/tools/care-job-advert-checker'],
]
for (const [t, path] of TOOLS) {
  ensure(18)
  y -= 16
  page.drawRectangle({ x: M, y: y + 3, width: 5, height: 5, color: C.pop })
  page.drawText(t, { x: M + 14, y, size: 10.5, font: FB, color: C.ink })
  page.drawText(`${SITE}${path}`, { x: M + 14 + FB.widthOfTextAtSize(t, 10.5) + 8, y, size: 10, font: F, color: C.pop })
}
y -= 24
{
  const bh = 150
  ensure(bh)
  page.drawRectangle({ x: M, y: y - bh, width: CW, height: bh, color: C.ink })
  page.drawRectangle({ x: M, y: y - bh, width: CW, height: 5, color: C.accent })
  let by = y - 34
  page.drawText('Ready to talk about a new website?', { x: M + 22, y: by, size: 17, font: FB, color: C.white })
  by -= 22
  for (const l of wrap('Tell us about your service and we will come back with ideas for your new website. A reply from a person within one working day.', F, 10.5, CW - 44)) {
    page.drawText(l, { x: M + 22, y: by, size: 10.5, font: F, color: rgb(0.85, 0.83, 0.8) })
    by -= 15
  }
  by -= 10
  page.drawText(`${SITE}/start-building-your-new-website`, { x: M + 22, y: by, size: 12, font: FB, color: C.pop })
  by -= 20
  page.drawText('Or call 020 8064 1596', { x: M + 22, y: by, size: 10.5, font: F, color: C.white })
  y -= bh
}

// ---------- contents page ----------
{
  const saved = { page, y }
  page = contentsPage
  y = TOP
  pageTitle('Start here', 'How to use this guide')
  para('Choosing who builds your website is a decision you live with for years. This guide lists the questions worth asking any website agency, freelancer or platform before you sign, whoever you choose, including us.')
  para('Each section explains why the topic matters for a care service, what to ask, what a good answer sounds like and, where there is one, a free way to check a website yourself. At the end there is a list of red flags and a one page scorecard to compare up to three agencies side by side.')
  para('It applies to care homes, nursing homes, home care agencies, supported living and other care services. Where it says "care home", read your own service.', { gap: 14 })
  label('Contents')
  const entries = [
    ...SECTIONS.map((s, i) => [`${i + 1}. ${s.title}`, sectionPages[s.title]]),
    ['Red flags to watch for', sectionPages['Red flags']],
    ['When another option is the right one', sectionPages['When another option is right']],
    ['Scorecard: compare agencies side by side', sectionPages['Scorecard']],
    ['About TRG Digital', sectionPages['About TRG Digital']],
  ]
  for (const [t, n] of entries) {
    ensure(22)
    y -= 20
    page.drawText(assertClean(t), { x: M, y, size: 11, font: F, color: C.ink })
    const ns = String(n)
    page.drawText(ns, { x: W - M - FB.widthOfTextAtSize(ns, 11), y, size: 11, font: FB, color: C.pop })
    const x0 = M + F.widthOfTextAtSize(t, 11) + 8
    const x1 = W - M - FB.widthOfTextAtSize(ns, 11) - 8
    for (let x = x0; x < x1; x += 4) page.drawCircle({ x, y: y + 2.5, size: 0.5, color: C.muted })
  }
  if (doc.getPages().indexOf(page) !== 1) throw new Error('Contents overflowed its page')
  page = saved.page
  y = saved.y
}

// ---------- footers ----------
const total = doc.getPageCount()
doc.getPages().forEach((p, i) => {
  if (i === 0) return
  p.drawRectangle({ x: M, y: 44, width: CW, height: 0.8, color: C.line })
  p.drawText(SITE, { x: M, y: 30, size: 8, font: F, color: C.muted })
  const t = `Page ${i + 1} of ${total}`
  p.drawText(t, { x: W - M - F.widthOfTextAtSize(t, 8), y: 30, size: 8, font: F, color: C.muted })
})

mkdirSync(dirname(OUT), { recursive: true })
const bytes = await doc.save()
writeFileSync(OUT, bytes)
console.log(`buyer's guide: ${total} pages, ${(bytes.length / 1024).toFixed(0)} KB -> ${OUT}`)
console.log('section pages:', JSON.stringify(sectionPages))
