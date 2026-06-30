// Case-study content for /work/[slug]. All copy lives here so it's easy to edit.
// Both homes are new builds, so the "results" section is framed as targets +
// the real empty-bed economics — no fabricated metrics (live figures get added
// as they come in). Keep two entries in sync structurally.

export type CaseStudyFact = { label: string; value: string }
export type ApproachStep = { title: string; body: string }
export type Target = { goal: string; detail: string }

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
  titleAccent: string // the highlighted word(s), rendered in brand-pop
  lede: string
  facts: CaseStudyFact[]
  /** 01 — The brief */
  briefParas: string[]
  briefPull: string
  /** 02 — The approach (exactly four pillars; icons applied in order) */
  approachIntro: string
  approach: ApproachStep[]
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
        'A fast, modern site engineered to convert. Click-to-call, callback requests, live room availability and an AI assistant make it effortless for a family to take the next step, on any device, day or night.',
    },
    {
      title: 'Benchmarked with our CQC website grader',
      body:
        'Our website grader scores a care site against what actually wins enquiries, using CQC-enriched data on the local market. Every design and content decision was evidence-led, not guesswork.',
    },
    {
      title: 'Local SEO that targets real searches',
      body:
        'We optimised for the searches families genuinely make, “care home in Lindfield”, “respite care near me”, so the home earns a steady stream of organic enquiries instead of paying for every click.',
    },
    {
      title: 'PPC landing pages that capture demand',
      body:
        'For urgent, high-intent searches, our landing-page system turns paid clicks into booked visits, each campaign on a focused page built to convert, with every enquiry tracked.',
    },
  ],
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
        'A fast, reassuring site engineered to convert. Click-to-call, callback requests, live room availability and an AI assistant let an anxious family get answers and book a visit in seconds, on any device.',
    },
    {
      title: 'Benchmarked with our CQC website grader',
      body:
        'Our website grader scores the site against what actually wins enquiries in care search, using CQC-enriched market data, so every decision about content and layout was driven by evidence.',
    },
    {
      title: 'Local SEO that targets real searches',
      body:
        'We optimised for the searches that matter, “nursing home in Crawley”, “dementia care near me”, so Ferndale is found by the right families at the moment they are looking.',
    },
    {
      title: 'PPC landing pages that capture demand',
      body:
        'For urgent, high-intent searches, our landing-page system turns paid clicks into booked visits, each on a focused, fast-loading page built to convert, with every enquiry measured.',
    },
  ],
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
