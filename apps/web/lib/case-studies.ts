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

// One tool in the scrolling case-study showcase (screenshot right, writeup left).
export type CaseToolShowcaseItem = {
  key: string
  category: string
  name: string
  image: string
  alt: string
  width: number
  height: number
  blurb: string
  how: string[]
  why: string
  gateway: string
  liveHref: string
}

// Detailed local-SEO writeup (replaces the repetitive 3-screenshot grid when present).
export type CaseLocalDetail = {
  how: string[]
  why: string
  google: string
  searches: string[]
  serp: { query: string; title: string; url: string; desc: string }
}

export type CaseStudy = {
  slug: string
  name: string
  shortName: string
  type: string
  location: string
  liveUrl: string
  liveLabel: string
  mockup: string
  /** Scrolling tool showcase (replaces the tools grid when present) */
  toolShowcase?: CaseToolShowcaseItem[]
  /** Detailed local-SEO section content (new layout when present) */
  localDetail?: CaseLocalDetail
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
  mockup: '/mockups/crossways-live.jpg',
  localDetail: {
    how: [
      'A family types a real search, "residential care in Haywards Heath" or "respite care near Burgess Hill", not just "care home".',
      'They land on a page built for exactly that search: their town in the heading, the right type of care, what Crossways offers for it, and honest answers to the questions that come next, including funding.',
      'Everything they need to act is on the same page, the phone number, the enquiry form and the funding tools, no hunting through a generic homepage.',
    ],
    why:
      'Local, specific searches are lower competition and far higher intent than "care home". A page that answers the exact question a family asked beats a generic homepage every time, and with a page for every town and every care type, Crossways has a front door on each of the searches that actually bring enquiries.',
    google:
      'Each page carries its own optimised title and meta description, FAQ schema and LocalBusiness structured data, so Google understands precisely which searches it belongs in. And when a new search is worth owning, the team creates the page from the admin console, with locally grounded content, live in minutes with no developer involved.',
    searches: [
      'residential care in haywards heath',
      'respite care near burgess hill',
      'care home in cuckfield',
      'respite care lindfield',
      'residential care horsham',
      'care home balcombe',
    ],
    serp: {
      query: 'residential care in haywards heath',
      title: 'Residential Care in Haywards Heath | Crossways',
      url: 'crosswayscarehome.co.uk › haywards-heath › residential-care',
      desc: 'Residential care for older people in Haywards Heath and the surrounding area, from Crossways Residential Care Home in Lindfield, West Sussex.',
    },
  },
  toolShowcase: [
    {
      key: 'ai-chat',
      category: 'Answers on demand',
      name: 'Dedicated AI chat, built around Crossways',
      image: '/work/crossways/showcase/ai-chat.jpg',
      width: 1400,
      height: 935,
      alt: 'The Crossways AI chat assistant open on the homepage',
      blurb:
        'An AI assistant trained on Crossways itself, its care types, visiting arrangements, fees guidance and live room availability. It answers in the warm tone of the home, around the clock, on every page of the site.',
      how: [
        'A family opens the chat bubble on any page, at any hour, most do it in the evening once the house is quiet.',
        'They ask anything, from "do you offer respite?" to "can we visit on a Sunday?", and get an instant, accurate answer grounded in Crossways\u2019 own information.',
        'When the conversation warms up, the chat offers a callback request, which lands in the enquiry inbox with the family\u2019s details.',
      ],
      why:
        'Families research care at 10pm, after work and after visiting hours. The chat answers when the office cannot, so no question, and no family, is lost to an unanswered evening.',
      gateway:
        'Every conversation keeps a researching family on the Crossways site instead of bouncing back to Google, and turns anonymous readers into named, high-intent enquiries.',
      liveHref: 'https://crosswayscarehome.co.uk/',
    },
    {
      key: 'funding-calculator',
      category: 'Paying for care',
      name: 'Care funding calculator',
      image: '/work/crossways/showcase/funding-calculator.jpg',
      width: 1400,
      height: 937,
      alt: 'The Crossways care funding calculator, step one of four',
      blurb:
        'A four-step guide to the biggest question in care: who pays. It covers all four UK nations, models the real means test, and shows each family a personalised split between what they pay, what the council pays, and where the NHS can help.',
      how: [
        'The family picks their UK nation, the rules differ in each, then answers a few plain-English questions about savings, property and income.',
        'The calculator applies the real capital thresholds and shows their likely funding position, no jargon, no forms.',
        'They can email themselves the results, which captures a warm, named enquiry with full context for the home to follow up.',
      ],
      why:
        'Funding is the first and most stressful question every family has, and almost no care home answers it. Being the home that answers it honestly earns the trust that decides shortlists.',
      gateway:
        'Thousands of families search "who pays for care" every month. This tool gives Crossways a page that competes for all of that traffic and meets families at the very start of their journey, before they have shortlisted anyone.',
      liveHref: 'https://crosswayscarehome.co.uk/funding-calculator/',
    },
    {
      key: 'deferred-payment',
      category: 'Paying for care',
      name: 'Deferred payment calculator',
      image: '/work/crossways/showcase/deferred-payment.jpg',
      width: 1400,
      height: 946,
      alt: 'The Crossways deferred payment calculator',
      blurb:
        'Answers the question that stalls more care decisions than any other: do we have to sell the house? It models a Deferred Payment Agreement, whether the family is likely to qualify, how much of the fee could be secured against the home, and how the amount grows over time at the real interest rate.',
      how: [
        'The family answers the eligibility questions, permanent move, home ownership, who still lives in the property, savings position.',
        'They enter the property value and the share owned, and the calculator shows how much of the weekly fee could be deferred.',
        'They see the honest picture, including how the deferred amount builds, so they can plan with confidence rather than fear.',
      ],
      why:
        'The fear of losing the family home freezes decisions for months. Confronting it with real, honest numbers removes the single biggest blocker between an enquiry and a move-in.',
      gateway:
        'Almost no care home even mentions deferred payments. Owning this rare, genuinely useful answer wins long-tail searches and marks Crossways out as the home that tells families the truth about money.',
      liveHref: 'https://crosswayscarehome.co.uk/deferred-payment-calculator/',
    },
    {
      key: 'attendance-allowance',
      category: 'Benefits and funding',
      name: 'Attendance Allowance checker',
      image: '/work/crossways/showcase/attendance-allowance.jpg',
      width: 1400,
      height: 937,
      alt: 'The Crossways Attendance Allowance checker',
      blurb:
        'A one-minute eligibility check for the benefit most families have never heard of: a tax-free, non-means-tested payment for over-66s who need help, worth up to £108.55 a week. The checker also knows the special rules that fast-track terminally ill applicants.',
      how: [
        'Five yes-or-no questions: age, health conditions, and whether help is needed during the day or night.',
        'The checker shows instantly whether a claim looks likely, and at which weekly rate.',
        'It then walks the family through the next steps to actually make the claim.',
      ],
      why:
        'Handing a family a genuine win, money they are entitled to but were never told about, before any sales conversation, builds the kind of goodwill no brochure can buy.',
      gateway:
        'Benefit searches reach far beyond people actively choosing a care home, so this page introduces Crossways to families years before they need it, and they remember who helped.',
      liveHref: 'https://crosswayscarehome.co.uk/attendance-allowance/',
    },
    {
      key: 'local-council',
      category: 'Local support',
      name: 'Local council funding guide',
      image: '/work/crossways/showcase/local-council.jpg',
      width: 1400,
      height: 937,
      alt: 'The Crossways local council and funding guide for West Sussex',
      blurb:
        'Everything a family needs to deal with West Sussex County Council in one place: the adult social care team\u2019s direct contact details, the exact council pages families actually need, and a plain-English explanation of the means test thresholds that decide who pays.',
      how: [
        'The family sees their council, its adult social care phone number and website, without hunting through a maze of council pages.',
        'The means test is explained with the real numbers: the £23,250 upper limit and £14,250 lower limit, and what happens between them.',
        'Direct links take them straight to the right council page for a financial assessment, so they arrive informed.',
      ],
      why:
        'Council funding is a fog for most families. The home that clears the fog becomes the trusted guide, and trusted guides get the enquiry when the decision comes.',
      gateway:
        'Localised, genuinely useful council content wins the local searches families make early in their research, and keeps them on the Crossways site rather than lost in council websites.',
      liveHref: 'https://crosswayscarehome.co.uk/local-council-funding/',
    },
    {
      key: 'care-checklist',
      category: 'Health and wellbeing',
      name: 'Is it time to think about care?',
      image: '/work/crossways/showcase/care-checklist.jpg',
      width: 1400,
      height: 941,
      alt: 'The Crossways is-it-time-to-think-about-care checklist',
      blurb:
        'A gentle, completely private eight-question self-check for families quietly worrying about a parent. It bands everyday signs, struggles with washing, falls, missed medication, isolation, into an honest suggestion about whether it is time to talk to someone. Nothing is stored, and it is clearly framed as a prompt, not a diagnosis.',
      how: [
        'The family answers eight questions honestly, Often, Sometimes or Rarely, about the person they are worried about.',
        'The checklist bands the answers into a warm, honest reading of how their loved one is coping.',
        'It suggests sensible next steps: talk it through with the home, arrange a visit, or speak to a GP if health is the worry.',
      ],
      why:
        'It meets families at the very first worry, months before anyone types "care homes near me". A private, pressure-free answer at that moment builds a depth of trust no advert can reach.',
      gateway:
        'This is the earliest touchpoint a care home can own. Families arrive from worry-driven searches long before they are shortlisting, and Crossways is the name attached to the help they found.',
      liveHref: 'https://crosswayscarehome.co.uk/is-it-time-for-care/',
    },
    {
      key: 'cost-estimator',
      category: 'Paying for care',
      name: 'What will care cost?',
      image: '/work/crossways/showcase/cost-estimator.jpg',
      width: 1400,
      height: 933,
      alt: 'The Crossways cost of care estimator showing a weekly figure',
      blurb:
        'An instant, honest answer to the question families are most afraid to ask. It starts from Crossways\u2019 real guide fees, lets the family adjust to their own situation, savings, property, Attendance Allowance, and shows the weekly, monthly and yearly cost alongside who is likely to pay it.',
      how: [
        'The family picks residential or respite care and sees the guide weekly fee, which they can replace with their own quote.',
        'They add savings, property and any Attendance Allowance, and the estimator applies the England means test.',
        'They get the full picture, cost per week, month and year, plus whether the council is likely to contribute, and one tap to request a personalised fee.',
      ],
      why:
        'Most care homes hide their prices, so the home that is transparent wins the trust conversation instantly. Families reward the honesty with the enquiry.',
      gateway:
        'Cost searches carry the highest intent of any care query. This page captures them with real numbers, and its "get a personalised fee" step converts that intent into named enquiries.',
      liveHref: 'https://crosswayscarehome.co.uk/cost-of-care/',
    },
    {
      key: 'availability',
      category: 'Live availability',
      name: 'Live room availability',
      image: '/work/crossways/showcase/availability.jpg',
      width: 630,
      height: 840,
      alt: 'The one-tap room availability update panel the Crossways manager uses',
      blurb:
        'A live availability badge, "2 rooms available", shown across the whole site, the pop-up and the landing pages. Behind it sits a private one-tap update panel: the manager opens a link on their phone, taps the current status, and every surface updates instantly. No logins, no developer, no stale information.',
      how: [
        'The manager opens their private update link, on a phone, in seconds, whenever availability changes.',
        'One tap sets the status, rooms available, limited, currently full, with an optional room count and note.',
        'The website badge, enquiry pop-up and marketing landing pages all update at the same moment.',
      ],
      why:
        '"Do you have space?" is the first question every family asks. Answering it before the phone call means the calls that do come are from families the home can actually help.',
      gateway:
        'Live availability adds honest urgency, a family seeing "2 rooms available" acts today rather than next month, and it makes every ad and landing page more believable than a competitor\u2019s silence.',
      liveHref: 'https://crosswayscarehome.co.uk/',
    },
  ],
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
    { value: '25', label: 'Local landing pages', note: 'One for every town and care type, new pages live from the admin in minutes' },
    { value: '21', label: 'Articles migrated & live', note: 'Every original blog URL preserved, zero broken links' },
    { value: '8', label: 'Family tools on the site', note: 'Calculators, checkers, AI chat and live room availability' },
    { value: '40', label: 'Five-star family reviews', note: 'A 5.0 average, curated from carehome.co.uk' },
    { value: '+40%', label: 'Monthly organic traffic', note: 'Placeholder — update with live data', placeholder: true },
    { value: '+12', label: 'New online enquiries a month', note: 'Placeholder — update with live data', placeholder: true },
  ],
  statsNote:
    'Pages and articles are a live count. The site is newly launched, and live traffic and enquiry figures will be published here as they land.',
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
  mockup: '/mockups/ferndale-live.jpg',
  localDetail: {
    how: [
      'A family types an urgent, specific search, "nursing home in Horsham" or "dementia care near East Grinstead", often with a hospital discharge date looming.',
      'They land on a page built for exactly that search: their town in the heading, the right kind of nursing care, what Ferndale offers for it, and the funding answers that matter most in nursing care, from council support to NHS contributions.',
      'Everything they need to act is on the same page, the phone number, the enquiry form and the live availability badge, because in nursing care the next call is often made the same day.',
    ],
    why:
      'Nursing searches are more specific and more urgent than any other care query, and the searcher rarely has time to dig through a generic homepage. A page that answers the exact question, for the exact town, wins that moment, and with a page for every town and both types of care, Ferndale owns dozens of these moments instead of one.',
    google:
      'Each page carries its own optimised title and meta description, FAQ schema and LocalBusiness structured data, so Google knows precisely which searches it belongs in. And when a new search is worth owning, a new town, a new need, the team creates the page from the admin console, live in minutes with no developer involved.',
    searches: [
      'nursing home in horsham',
      'dementia care in east grinstead',
      'nursing care in haywards heath',
      'nursing home near redhill',
      'dementia care in reigate',
      'nursing home crawley down',
    ],
    serp: {
      query: 'nursing home in horsham',
      title: 'Nursing Care in Horsham | Ferndale Nursing Home',
      url: 'ferndalenursinghome.co.uk › horsham › nursing-care',
      desc: 'Nursing Care for older people in Horsham and the surrounding area, from Ferndale Nursing Home in Crawley, West Sussex.',
    },
  },
  toolShowcase: [
    {
      key: 'funding-calculator',
      category: 'Paying for care',
      name: 'Care funding calculator',
      image: '/work/ferndale/showcase/funding-calculator.jpg',
      width: 1400,
      height: 921,
      alt: 'The Ferndale care funding calculator, step one of four',
      blurb:
        'A four-step guide to the biggest question in nursing care: who pays. It covers all four UK nations, models the real means test, and shows each family a personalised split between what they pay, what the council pays, and where the NHS steps in, which matters far more in nursing care than anywhere else.',
      how: [
        'The family picks their UK nation, then answers plain-English questions about savings, property and income.',
        'The calculator applies the real capital thresholds and shows their likely funding position, including where NHS nursing contributions fit.',
        'They can email themselves the results, which lands a warm, named enquiry with full context for the home to follow up.',
      ],
      why:
        'Nursing care is the most expensive care there is, so funding is the first conversation every family needs. Answering it honestly, before they even call, earns the trust that decides shortlists.',
      gateway:
        'Families searching "who pays for nursing care" are at the very start of their journey. This page meets them there, weeks before they compare homes, with Ferndale\u2019s name on the answer.',
      liveHref: 'https://ferndalenursinghome.co.uk/funding-calculator/',
    },
    {
      key: 'deferred-payment',
      category: 'Paying for care',
      name: 'Deferred payment calculator',
      image: '/work/ferndale/showcase/deferred-payment.jpg',
      width: 1400,
      height: 927,
      alt: 'The Ferndale deferred payment calculator',
      blurb:
        'Answers the fear that freezes more nursing care decisions than any other: do we have to sell the house? It models a Deferred Payment Agreement, whether the family is likely to qualify, how much of the fee could be secured against the home, and how the amount builds over time.',
      how: [
        'The family answers the eligibility questions, permanent move, home ownership, who still lives in the property, savings position.',
        'They enter the property value and share owned, and see how much of the weekly fee could be deferred.',
        'They get the honest picture, including how the deferred amount grows, so they can plan with confidence rather than fear.',
      ],
      why:
        'Nursing fees make the sell-the-house fear sharper than anywhere else in care. Confronting it with real numbers removes the biggest single blocker between an enquiry and an admission.',
      gateway:
        'Almost no nursing home explains deferred payments. Owning this rare answer wins long-tail funding searches and marks Ferndale out as the home that tells families the truth about money.',
      liveHref: 'https://ferndalenursinghome.co.uk/deferred-payment-calculator/',
    },
    {
      key: 'fnc',
      category: 'NHS funding',
      name: 'Funded Nursing Care checker',
      image: '/work/ferndale/showcase/fnc.jpg',
      width: 1400,
      height: 924,
      alt: 'The Ferndale NHS-funded Nursing Care checker',
      blurb:
        'A tool only a nursing home can offer properly. If someone needs care from a registered nurse, the NHS may pay a weekly contribution toward their nursing home fees, NHS-funded Nursing Care, and huge numbers of eligible families have never heard of it. The checker shows in a minute whether it could apply.',
      how: [
        'The family picks their nation and where care is being provided, in a nursing home, moving to one, at home or in hospital.',
        'They answer whether the person has needs that require a registered nurse.',
        'The checker shows whether FNC looks likely, the current weekly NHS contribution, and how it connects to a full Continuing Healthcare assessment.',
      ],
      why:
        'FNC is money on the table for almost every nursing resident, and most families find out late or never. The home that surfaces it first is the home families trust with everything else.',
      gateway:
        'FNC searches are made almost exclusively by families arranging nursing care right now, the highest intent audience there is, and this page puts Ferndale directly in front of them.',
      liveHref: 'https://ferndalenursinghome.co.uk/funded-nursing-care/',
    },
    {
      key: 'chc-checker',
      category: 'NHS funding',
      name: 'NHS Continuing Healthcare checker',
      image: '/work/ferndale/showcase/chc-checker.jpg',
      width: 1400,
      height: 944,
      alt: 'The Ferndale NHS Continuing Healthcare checker with care domains',
      blurb:
        'For people with significant ongoing health needs, NHS Continuing Healthcare can fund the full cost of care, every penny. This checker screens across the real NHS care domains, behaviour, cognition, communication and more, and shows whether a full assessment looks worth pursuing.',
      how: [
        'The family rates the person\u2019s needs across the same care domains the NHS itself assesses, high, moderate, low or none.',
        'The checker weighs the answers the way the NHS Checklist does, including the priority domains.',
        'They see whether a full CHC assessment looks warranted, and what to ask for next.',
      ],
      why:
        'CHC can be worth the entire cost of nursing care, so families chasing it are deeply motivated. Screening against the real domains makes the result credible rather than a vague maybe.',
      gateway:
        'This is a nursing-only tool that residential competitors cannot meaningfully offer, so it wins searches, and trust, that belong almost exclusively to homes like Ferndale.',
      liveHref: 'https://ferndalenursinghome.co.uk/nhs-continuing-healthcare/',
    },
    {
      key: 'chc-dst',
      category: 'NHS funding',
      name: 'CHC Decision Support Tool guide',
      image: '/work/ferndale/showcase/chc-dst.jpg',
      width: 1400,
      height: 945,
      alt: 'The Ferndale CHC Decision Support Tool guide',
      blurb:
        'When the NHS agrees to a full Continuing Healthcare assessment, a multidisciplinary team scores the person\u2019s needs across twelve care domains using the Decision Support Tool. It is daunting and badly explained everywhere else. This guide walks families through every domain, what it covers and the evidence the assessors look for.',
      how: [
        'The family reads a plain-English explanation of each of the twelve domains, from behaviour and cognition to skin, breathing and medication.',
        'For every domain they see the severity levels used and the evidence that helps, incident logs, assessments, specialist input.',
        'They arrive at the assessment prepared, with the right records gathered and the right questions ready.',
      ],
      why:
        'Families walk into CHC assessments unprepared and lose funding they deserved. The home that prepares them becomes their advocate, an entirely different relationship from a sales prospect.',
      gateway:
        'This depth of genuinely useful content is exactly what Google rewards with rankings, and exactly what makes families choose the home that clearly knows the system inside out.',
      liveHref: 'https://ferndalenursinghome.co.uk/chc-decision-support-tool/',
    },
    {
      key: 'dementia-signs',
      category: 'Dementia support',
      name: 'Dementia signs checklist',
      image: '/work/ferndale/showcase/dementia-signs.jpg',
      width: 1400,
      height: 944,
      alt: 'The Ferndale dementia signs checklist',
      blurb:
        'A short, private checklist built on the clinically recognised AD8 screen, for families who have noticed changes in a parent or relative. Eight questions about changes over recent years, judgement, repetition, appointments, day-to-day thinking, with an honest answer about whether it is worth speaking to a doctor. Nothing is stored.',
      how: [
        'The family answers eight questions about changes caused by memory or thinking problems, yes, no, or not sure.',
        'The checklist scores the changes the way the AD8 screen does and gives an honest, gentle reading.',
        'It points them to sensible next steps, a GP conversation first, and Ferndale\u2019s specialist dementia care team when the time is right.',
      ],
      why:
        'Ferndale specialises in dementia care, and this reaches families at the very first worry, long before they search for a home. Sensitive, private help at that moment is never forgotten.',
      gateway:
        'Dementia sign searches reach a vast audience years ahead of any care decision. When that decision comes, the family already knows the nursing home that helped them first.',
      liveHref: 'https://ferndalenursinghome.co.uk/dementia-signs/',
    },
    {
      key: 'care-checklist',
      category: 'Health and wellbeing',
      name: 'Is it time to think about care?',
      image: '/work/ferndale/showcase/care-checklist.jpg',
      width: 1400,
      height: 944,
      alt: 'The Ferndale is-it-time-to-think-about-care checklist',
      blurb:
        'A gentle, completely private self-check for families quietly worrying about a parent. Eight questions about everyday life, washing, falls, medication, eating, isolation, banded into an honest suggestion about whether more support is worth discussing. Not a diagnosis, nothing saved, no pressure.',
      how: [
        'The family answers eight questions honestly, Often, Sometimes or Rarely, about the person they are worried about.',
        'The checklist bands the answers into a warm, honest reading of how their loved one is coping.',
        'It suggests next steps, talk it through with the home, arrange a visit, or speak to a GP if health is the concern.',
      ],
      why:
        'Nursing care decisions often arrive in a crisis. This tool meets families before the crisis, while there is still time to plan, and positions Ferndale as the calm guide rather than the emergency option.',
      gateway:
        'It is the earliest touchpoint a home can own, arriving from worry-driven searches months before "nursing home near me", with Ferndale\u2019s name attached to the help.',
      liveHref: 'https://ferndalenursinghome.co.uk/is-it-time-for-care/',
    },
    {
      key: 'cost-estimator',
      category: 'Paying for care',
      name: 'What will care cost?',
      image: '/work/ferndale/showcase/cost-estimator.jpg',
      width: 1400,
      height: 941,
      alt: 'The Ferndale cost of care estimator',
      blurb:
        'An instant, honest answer to the question families are most afraid to ask about nursing care. The family picks residential, nursing or respite, starts from a realistic guide fee they can replace with their own quote, adds savings, property and Attendance Allowance, and sees the weekly, monthly and yearly cost alongside who is likely to pay it.',
      how: [
        'The family picks the care type, nursing fees differ from residential, and adjusts the guide weekly fee to their own quote.',
        'They add savings, property and any Attendance Allowance, and the estimator applies the England means test.',
        'They get the full picture, cost per week, month and year, plus whether the council or NHS is likely to contribute, and one tap to request a personalised fee.',
      ],
      why:
        'Nursing costs shock unprepared families. Showing honest numbers up front, when competitors hide theirs, wins the transparency conversation instantly, and Ferndale\u2019s guide fees sit at or below the regional average.',
      gateway:
        'Cost searches carry the highest intent of any care query. This page captures them with real figures, and the personalised-fee step converts that intent into named enquiries.',
      liveHref: 'https://ferndalenursinghome.co.uk/cost-of-care/',
    },
    {
      key: 'local-council',
      category: 'Local support',
      name: 'Local council funding guide',
      image: '/work/ferndale/showcase/local-council.jpg',
      width: 1400,
      height: 942,
      alt: 'The Ferndale local council and funding guide for West Sussex',
      blurb:
        'Everything a family needs to deal with West Sussex County Council in one place: the adult social care team\u2019s direct contact details, the exact council pages families actually need, and a plain-English explanation of the means test thresholds that decide who pays.',
      how: [
        'The family sees their council, its adult social care phone number and website, without hunting through a maze of council pages.',
        'The means test is explained with the real numbers, the £23,250 upper limit and £14,250 lower limit, and what happens between them.',
        'Direct links take them straight to the right council page for a financial assessment, so they arrive informed.',
      ],
      why:
        'Council funding is a fog for most families, and in nursing care the stakes are higher. The home that clears the fog becomes the trusted guide, and trusted guides get the enquiry.',
      gateway:
        'Localised, genuinely useful council content wins the local searches families make early in their research, and keeps them on Ferndale\u2019s site rather than lost in council websites.',
      liveHref: 'https://ferndalenursinghome.co.uk/local-council-funding/',
    },
    {
      key: 'ai-chat',
      category: 'Answers on demand',
      name: 'Dedicated AI chat, built around Ferndale',
      image: '/work/ferndale/showcase/ai-chat.jpg',
      width: 1400,
      height: 929,
      alt: 'The Ferndale AI chat assistant open on the site',
      blurb:
        'An AI assistant trained on Ferndale itself, its nursing care, dementia and Parkinson\u2019s specialisms, visiting arrangements, fees guidance and live room availability. It answers in the warm tone of the home, around the clock, on every page of the site.',
      how: [
        'A family opens the chat bubble on any page, at any hour, often during a stressful evening after a hospital conversation.',
        'They ask anything, from "can you care for Parkinson\u2019s?" to "do you have a room this week?", and get an instant answer grounded in Ferndale\u2019s own information.',
        'When the conversation warms up, the chat offers a callback request, which lands in the enquiry inbox with the family\u2019s details.',
      ],
      why:
        'Nursing enquiries are urgent, often driven by a hospital discharge deadline. A home that answers at 10pm wins families that an unanswered phone loses forever.',
      gateway:
        'Every conversation keeps an urgent, researching family on Ferndale\u2019s site instead of bouncing back to Google, and converts anonymous readers into named, high-intent enquiries.',
      liveHref: 'https://ferndalenursinghome.co.uk/',
    },
    {
      key: 'availability',
      category: 'Live availability',
      name: 'Live room availability',
      image: '/work/ferndale/showcase/availability.jpg',
      width: 709,
      height: 894,
      alt: 'The one-tap room availability update panel the Ferndale manager uses',
      blurb:
        'A live availability badge, "2 rooms available", shown across the whole site, the pop-up and the landing pages. Behind it sits a private one-tap update panel: the manager opens a link on their phone, taps the current status, and every surface updates instantly. No logins, no developer, no stale information.',
      how: [
        'The manager opens their private update link, on a phone, in seconds, whenever availability changes.',
        'One tap sets the status, rooms available, limited, currently full, with an optional room count and note.',
        'The website badge, enquiry pop-up and marketing landing pages all update at the same moment.',
      ],
      why:
        'In nursing care, families arranging a hospital discharge need an answer today. "Do you have a bed?" answered before the call means every enquiry that arrives is one Ferndale can actually help.',
      gateway:
        'Live availability adds honest urgency, a family seeing "2 rooms available" during a discharge deadline acts immediately, and it makes every ad and landing page more believable than a competitor\u2019s silence.',
      liveHref: 'https://ferndalenursinghome.co.uk/',
    },
  ],
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
    { value: '42', label: 'Local landing pages', note: 'One for every town and care type, new pages live from the admin in minutes' },
    { value: '9', label: 'Articles migrated & live', note: 'Every original blog URL preserved, zero broken links' },
    { value: '11', label: 'Family tools on the site', note: 'NHS funding checkers, calculators, AI chat and live room availability' },
    { value: '+40%', label: 'Monthly organic traffic', note: 'Placeholder — update with live data', placeholder: true },
    { value: '+10', label: 'New online enquiries a month', note: 'Placeholder — update with live data', placeholder: true },
  ],
  statsNote:
    'Pages and articles are a live count. The site is newly launched, and live traffic and enquiry figures will be published here as they land.',
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
