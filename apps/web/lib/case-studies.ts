// Case-study content for /work/[slug]. All copy lives here so it's easy to edit.
// Both homes are new builds, so traffic/enquiry stats are clearly-flagged
// placeholders (replace with live data) — only the "pages & articles" count is a
// real, current figure. No fabricated performance metrics.

export type CaseStudyFact = { label: string; value: string }
export type ApproachStep = { title: string; body: string; points: string[] }
export type Target = { goal: string; detail: string }

export type ShowcaseTool = { name: string; desc: string; image: string }
export type ShowcaseLocal = { label: string; image: string }
export type Stat = { value: string; label: string; note?: string; placeholder?: boolean }

export type CaseStudy = {
  slug: string
  name: string
  shortName: string
  type: string
  location: string
  liveUrl: string
  liveLabel: string
  mockup: string
  /** Hero */
  eyebrow: string
  title: string
  titleAccent: string
  lede: string
  facts: CaseStudyFact[]
  /** 01 — The brief */
  briefParas: string[]
  briefPull: string
  /** 02 — The approach (exactly four pillars; icons applied in order) */
  approachIntro: string
  approach: ApproachStep[]
  /** Showcase — the real pages we built */
  tools: {
    intro: string
    featured: { name: string; desc: string; desktop: string; mobile: string }
    others: ShowcaseTool[]
  }
  local: {
    intro: string
    mobile: string
    items: ShowcaseLocal[]
  }
  blog: {
    intro: string
    image: string
  }
  /** Stats band */
  stats: Stat[]
  statsNote: string
  /** 03 — The economics + what success looks like */
  economicsLede: string
  economicsPoints: string[]
  targets: Target[]
  /** Testimonial (placeholder until the home gives us their own words) */
  testimonialQuote: string
  testimonialName: string
  testimonialRole: string
}

const crossways: CaseStudy = {
  slug: 'crossways-care-home',
  name: 'Crossways Residential Care Home',
  shortName: 'Crossways',
  type: 'Residential care home · Website, SEO & PPC',
  location: 'Lindfield, West Sussex',
  liveUrl: 'https://www.crosswayscarehome.co.uk',
  liveLabel: 'crosswayscarehome.co.uk',
  mockup: '/mockups/crossways.png',
  eyebrow: 'Care home website · SEO · PPC',
  title: 'A new website built to fill',
  titleAccent: 'empty beds',
  lede:
    'Crossways is a warm, family-run residential home in Lindfield with an outstanding local reputation, but a website that was not turning that reputation into enquiries. We rebuilt it as a fast, search-optimised enquiry engine, then put SEO and PPC behind it to bring families to the door.',
  facts: [
    { label: 'Home', value: 'Residential & respite care, 65+' },
    { label: 'Beds', value: '25' },
    { label: 'Area served', value: 'Lindfield, Haywards Heath, Mid Sussex' },
    { label: 'CQC rating', value: 'Good' },
  ],
  briefParas: [
    'Families choosing a care home almost always start online, often in a hurry and at a stressful moment. Crossways had the care, the reputation and the word-of-mouth, but its old website was slow, hard to find in search, and gave families no easy way to ask about a room or book a visit.',
    'Meanwhile every empty bed was quietly costing the home money. The brief was simple: turn the home’s real-world reputation into a steady stream of online enquiries, and shorten the time a free room sits empty.',
  ],
  briefPull:
    'Great care, an invisible website. The reputation was there; the enquiries were not.',
  approachIntro:
    'We treated the website as a single enquiry engine, not a brochure, and wrapped our own care-sector technology around it: a CQC-enriched grader to benchmark it, local SEO to be found, and PPC landing pages to capture paid demand.',
  approach: [
    {
      title: 'A new, search-built website',
      body:
        'A fast, modern site engineered to convert, so it is effortless for a family to take the next step, on any device, day or night.',
      points: [
        'Server-rendered for instant loading and strong rankings',
        'Click-to-call, callback forms, live room availability and an AI assistant on every page',
        'Helpful funding tools that answer real questions and capture the enquiry',
      ],
    },
    {
      title: 'Benchmarked with our CQC website grader',
      body:
        'Our website grader scores a care site against what actually wins enquiries, so every decision was evidence-led, not guesswork.',
      points: [
        'Scored against the things that drive care enquiries',
        'Uses CQC-enriched data on the local market to set the bar',
        'Re-graded as we built, so nothing shipped below standard',
      ],
    },
    {
      title: 'Local SEO that targets real searches',
      body:
        'Families do not search for “a care home”. They search by town and by type of care, so we built a page for each.',
      points: [
        'A dedicated, optimised page for every town and every care type',
        'Technical SEO and structured data so Google trusts the site',
        'A growing blog answering the questions families actually ask',
      ],
    },
    {
      title: 'PPC landing pages that capture demand',
      body:
        'For urgent, high-intent searches, paid clicks land on focused pages built to convert, with every enquiry tracked.',
      points: [
        'A dedicated landing page per campaign, built to convert',
        'Budget aimed only at searches that lead to visits',
        'Every call and form measured back to the click',
      ],
    },
  ],
  tools: {
    intro:
      'The website does more than look good. It answers the questions families are already Googling, with interactive tools that give a genuinely helpful answer and capture an enquiry at the same time, on desktop and on mobile.',
    featured: {
      name: 'Care funding calculator',
      desc: 'Works out a guide to care costs and the funding a family may be entitled to, then offers a friendly callback. The same experience, built to convert, on every screen size.',
      desktop: '/work/crossways/tool-funding-d.jpg',
      mobile: '/work/crossways/tool-funding-m.jpg',
    },
    others: [
      { name: 'Deferred payment calculator', desc: 'Shows how a deferred payment agreement could work against the value of a home.', image: '/work/crossways/tool-deferred-d.jpg' },
      { name: 'Attendance Allowance guide', desc: 'Helps families check what they could claim, and how to apply.', image: '/work/crossways/tool-attendance-d.jpg' },
      { name: 'Local council funding', desc: 'Explains means testing and what the council may contribute.', image: '/work/crossways/tool-council-d.jpg' },
    ],
  },
  local: {
    intro:
      'A family does not search for “care home”. They search for “residential care in Haywards Heath” or “respite care near Burgess Hill”. So we built a dedicated, optimised page for every town and every type of care we offer, the searches that actually bring enquiries.',
    mobile: '/work/crossways/local-1-m.jpg',
    items: [
      { label: 'Residential care in Haywards Heath', image: '/work/crossways/local-1-d.jpg' },
      { label: 'Residential care in Burgess Hill', image: '/work/crossways/local-2-d.jpg' },
      { label: 'Residential care in Horsham', image: '/work/crossways/local-3-d.jpg' },
    ],
  },
  blog: {
    intro:
      'A steady stream of genuinely useful articles, on choosing a home, funding, visiting and dementia, keeps the site fresh, builds trust with families, and wins the long-tail searches that turn into enquiries.',
    image: '/work/crossways/blog-d.jpg',
  },
  stats: [
    { value: '46', label: 'New local pages & articles', note: '25 local-area pages + 21 articles, live now' },
    { value: '+40%', label: 'Monthly organic traffic', note: 'Placeholder — update with live data', placeholder: true },
    { value: '+12', label: 'New online enquiries a month', note: 'Placeholder — update with live data', placeholder: true },
  ],
  statsNote:
    'Pages and articles are a live count. Traffic and enquiry figures are placeholders for now and will be updated with real data as the campaign runs.',
  economicsLede:
    'For a care home, marketing is not a cost, it is the cheapest bed-filler there is. The maths is simple and it is the home’s own.',
  economicsPoints: [
    'A single residential room at roughly £1,200 a week is over £60,000 of income a year.',
    'Every week that room sits empty is income the home never gets back.',
    'Filling one room just a few weeks sooner can pay for a full year of website, SEO and PPC, several times over.',
  ],
  targets: [
    { goal: 'More online enquiries every month', detail: 'A predictable flow of callback requests and visit bookings from search, not just word of mouth.' },
    { goal: 'Page-one local rankings', detail: 'Visible for the high-intent “care home in…” searches families make in the area.' },
    { goal: 'Fewer days to fill a free room', detail: 'A shorter gap between a room becoming free and a new resident moving in.' },
  ],
  testimonialQuote:
    'From the first conversation, TRG understood our home and what matters to the families who come to us. The new website finally reflects the care we give, and it makes it easy for people to get in touch.',
  testimonialName: 'Kelvin Amoorthasamy',
  testimonialRole: 'Registered Manager, Crossways',
}

const ferndale: CaseStudy = {
  slug: 'ferndale-nursing-home',
  name: 'Ferndale Nursing Home',
  shortName: 'Ferndale',
  type: 'Nursing home · Website, SEO & PPC',
  location: 'Crawley, West Sussex',
  liveUrl: 'https://www.ferndalenursinghome.co.uk',
  liveLabel: 'ferndalenursinghome.co.uk',
  mockup: '/mockups/ferndale.png',
  eyebrow: 'Nursing home website · SEO · PPC',
  title: 'A nursing home website built to win',
  titleAccent: 'enquiries',
  lede:
    'Ferndale provides 24-hour nursing, dementia and Parkinson’s care in Crawley. Families searching for that level of care need to find the home quickly and feel confident fast. We built a new site designed to do exactly that, then drove qualified families to it with SEO and PPC.',
  facts: [
    { label: 'Home', value: '24-hour nursing, dementia & respite, 65+' },
    { label: 'Beds', value: '28' },
    { label: 'Area served', value: 'Crawley, Horsham, Mid Sussex, Gatwick' },
    { label: 'CQC rating', value: 'Good' },
  ],
  briefParas: [
    'Choosing nursing care is often urgent and emotional, frequently arranged at short notice from a hospital discharge or a sudden change in a relative’s health. Families need to find a trusted home fast, understand the care on offer, and make contact without friction.',
    'Ferndale’s previous web presence did not make that easy, and the home was relying on referrals rather than its own enquiry pipeline. The brief: build an enquiry engine that surfaces Ferndale at the moment families are searching, and convert that interest into visits, so beds fill faster.',
  ],
  briefPull:
    'When nursing care is urgent, families pick the home they can find and trust first.',
  approachIntro:
    'We applied the same enquiry-first playbook we use across the sector: a conversion-built website, benchmarked with our CQC-enriched grader, found through local SEO, and amplified with PPC landing pages for high-intent searches.',
  approach: [
    {
      title: 'A new, search-built website',
      body:
        'A fast, reassuring site engineered to convert, so an anxious family can get answers and book a visit in seconds, on any device.',
      points: [
        'Server-rendered for instant loading and strong rankings',
        'Click-to-call, callback forms, live room availability and an AI assistant on every page',
        'Helpful funding tools that answer real questions and capture the enquiry',
      ],
    },
    {
      title: 'Benchmarked with our CQC website grader',
      body:
        'Our website grader scores the site against what actually wins enquiries in care search, so every decision was driven by evidence.',
      points: [
        'Scored against the things that drive care enquiries',
        'Uses CQC-enriched market data to set the bar',
        'Re-graded as we built, so nothing shipped below standard',
      ],
    },
    {
      title: 'Local SEO that targets real searches',
      body:
        'Families search by town and by type of care, so we built an optimised page for each one across the Crawley area.',
      points: [
        'A dedicated page for every town and every care type',
        'Technical SEO and structured data so Google trusts the site',
        'A growing blog answering the questions families actually ask',
      ],
    },
    {
      title: 'PPC landing pages that capture demand',
      body:
        'For urgent, high-intent searches, paid clicks land on focused, fast-loading pages built to convert, with every enquiry measured.',
      points: [
        'A dedicated landing page per campaign, built to convert',
        'Budget aimed only at searches that lead to visits',
        'Every call and form measured back to the click',
      ],
    },
  ],
  tools: {
    intro:
      'The website answers the questions families are already Googling, with interactive tools that give a genuinely helpful answer and capture an enquiry at the same time, on desktop and on mobile.',
    featured: {
      name: 'Care funding calculator',
      desc: 'Works out a guide to nursing care costs and the funding a family may be entitled to, then offers a friendly callback. The same experience, built to convert, on every screen size.',
      desktop: '/work/ferndale/tool-funding-d.jpg',
      mobile: '/work/ferndale/tool-funding-m.jpg',
    },
    others: [
      { name: 'Deferred payment calculator', desc: 'Shows how a deferred payment agreement could work against the value of a home.', image: '/work/ferndale/tool-deferred-d.jpg' },
      { name: 'Local council funding', desc: 'Explains means testing and what the council may contribute towards nursing care.', image: '/work/ferndale/tool-council-d.jpg' },
    ],
  },
  local: {
    intro:
      'A family does not search for “nursing home”. They search for “nursing care in Horsham” or “dementia care near East Grinstead”. So we built a dedicated, optimised page for every town and every type of care we offer.',
    mobile: '/work/ferndale/local-1-m.jpg',
    items: [
      { label: 'Nursing care in Horsham', image: '/work/ferndale/local-1-d.jpg' },
      { label: 'Nursing care in Maidenbower', image: '/work/ferndale/local-2-d.jpg' },
      { label: 'Nursing care in East Grinstead', image: '/work/ferndale/local-3-d.jpg' },
    ],
  },
  blog: {
    intro:
      'A steady stream of genuinely useful articles, on nursing and dementia care, funding and visiting, keeps the site fresh, builds trust with families, and wins the long-tail searches that turn into enquiries.',
    image: '/work/ferndale/blog-d.jpg',
  },
  stats: [
    { value: '51', label: 'New local pages & articles', note: '42 local-area pages + 9 articles, live now' },
    { value: '+40%', label: 'Monthly organic traffic', note: 'Placeholder — update with live data', placeholder: true },
    { value: '+10', label: 'New online enquiries a month', note: 'Placeholder — update with live data', placeholder: true },
  ],
  statsNote:
    'Pages and articles are a live count. Traffic and enquiry figures are placeholders for now and will be updated with real data as the campaign runs.',
  economicsLede:
    'In nursing care the cost of an empty bed is even higher, which makes a working enquiry engine one of the best investments a home can make.',
  economicsPoints: [
    'A single nursing bed at roughly £1,450 a week is over £75,000 of income a year.',
    'Every week a bed sits empty is income that cannot be recovered.',
    'Filling one bed only a few weeks sooner can cover a full year of website, SEO and PPC, many times over.',
  ],
  targets: [
    { goal: 'More online enquiries every month', detail: 'A steady flow of callback requests and visit bookings from search, alongside referrals.' },
    { goal: 'Page-one local rankings', detail: 'Found for high-intent nursing and dementia care searches across the Crawley area.' },
    { goal: 'Fewer days to fill a free bed', detail: 'A shorter gap between a bed becoming available and a new resident moving in.' },
  ],
  testimonialQuote:
    'TRG took the time to understand the nursing care we provide and the families who rely on us. The new website is clear, calm and easy to use, and it makes enquiring simple at a difficult time.',
  testimonialName: 'Ramesh Mannick',
  testimonialRole: 'Director & Registered Manager, Ferndale',
}

export const CASE_STUDIES: CaseStudy[] = [crossways, ferndale]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug)
}

export function otherCaseStudy(slug: string): CaseStudy {
  return CASE_STUDIES.find((c) => c.slug !== slug) ?? CASE_STUDIES[0]!
}
