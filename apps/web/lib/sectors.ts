// The taxonomy behind TRG's programmatic "who we serve" pages: care settings × services.
// Each sector and service carries genuinely unique content so the matrix pages are
// differentiated and useful, not thin duplicates. Drives the hub pages (/[sector]) and
// the matrix pages (/[sector]/[service]), the sitemap, and the Page SEO registry.

export type Sector = {
  slug: string
  name: string // "Care homes"
  singular: string // "care home"
  audience: string // "residential care home owners and managers"
  intro: string
  challenges: { title: string; body: string }[]
  // Outcome wording, so home-based services never read "beds".
  badge: string // hero card sub line, e.g. "Fewer empty beds"
  outcome: string // "{service} that ..." heading, e.g. "fills beds"
  results: string // "more quality enquiries, and ..." e.g. "more filled beds"
  cta: string // hub CTA heading
}

export const SECTORS: Sector[] = [
  {
    slug: 'care-homes',
    name: 'Care homes',
    singular: 'care home',
    audience: 'residential care home owners and managers',
    intro:
      'Residential care is chosen at an emotional, often urgent moment, and almost always after a Google search. We help care homes get found, build trust quickly, and turn anxious families into confident enquiries that fill beds.',
    challenges: [
      { title: 'Empty beds cost you every day', body: 'An unfilled bed is revenue you never get back. The faster families find and trust you, the faster you fill.' },
      { title: 'Families shortlist before they call', body: 'They compare three or four homes on Google before picking up the phone. If you are not visible, you are not on the list.' },
      { title: 'Trust has to land instantly', body: 'Families are nervous and time-pressured. Your reviews, your website and your first impression decide whether they enquire.' },
    ],
    badge: 'Fewer empty beds',
    outcome: 'fills beds',
    results: 'more filled beds',
    cta: 'Ready to fill more beds?',
  },
  {
    slug: 'nursing-homes',
    name: 'Nursing homes',
    singular: 'nursing home',
    audience: 'nursing home owners and registered managers',
    intro:
      'Nursing placements are complex, higher-value and often arranged at speed from a hospital discharge. We help nursing homes show their clinical credibility online and reach families and professionals at the moment of need.',
    challenges: [
      { title: 'Higher-value placements, higher stakes', body: 'Nursing fees are significant, so every lost enquiry is costly. Being found first directly protects revenue.' },
      { title: 'You serve two audiences', body: 'Families and discharge teams both research you online. Your site has to reassure both at once.' },
      { title: 'Clinical trust is hard to convey', body: 'CQC ratings, nursing expertise and outcomes need to come across clearly, without sounding cold.' },
    ],
    badge: 'Fewer empty beds',
    outcome: 'fills beds',
    results: 'more filled beds',
    cta: 'Ready to fill more beds?',
  },
  {
    slug: 'dementia-care',
    name: 'Dementia care',
    singular: 'dementia care home',
    audience: 'dementia and memory care providers',
    intro:
      'Families seeking dementia care are often exhausted, grieving and unsure what to look for. We help specialist dementia providers be found with empathy, and answer the questions families do not always know how to ask.',
    challenges: [
      { title: 'Families arrive overwhelmed', body: 'They need reassurance and clarity fast. Confusing or cold websites lose them at the worst possible moment.' },
      { title: 'Specialism must be obvious', body: 'Your dementia expertise, environment and approach are your differentiator, but only if families can find and feel it.' },
      { title: 'Long, anxious research journeys', body: 'Dementia decisions take weeks of searching. You need to stay visible and helpful across that whole journey.' },
    ],
    badge: 'Fewer empty places',
    outcome: 'fills places',
    results: 'more filled places',
    cta: 'Ready to fill more places?',
  },
  {
    slug: 'home-care',
    name: 'Home care',
    singular: 'home care provider',
    audience: 'domiciliary and home care providers',
    intro:
      'Home care is a local, high-volume, trust-led business, and almost every new client and carer starts with a search. We help domiciliary providers win local visibility and a steady flow of both care enquiries and recruitment.',
    challenges: [
      { title: 'You compete on local search', body: 'Clients want care near them. If you are not on the local map, a competitor a postcode away wins the call.' },
      { title: 'Two pipelines, one website', body: 'You need care enquiries and carer applications. Your site and campaigns have to serve both well.' },
      { title: 'Volume needs a system', body: 'Ad-hoc marketing cannot keep a home care business full. You need a reliable, measurable engine.' },
    ],
    badge: 'More clients and carers',
    outcome: 'wins clients and carers',
    results: 'more carer applications',
    cta: 'Ready to win more clients and carers?',
  },  {
    slug: 'live-in-care',
    name: 'Live-in care',
    singular: 'live-in care provider',
    audience: 'live-in care providers',
    intro:
      'Live-in care is a considered, high-value decision, usually made by a family weighing it up against a move into a care home. We help live-in care providers explain how it works, show what it costs, and recruit the experienced live-in carers every placement depends on.',
    challenges: [
      { title: 'Families are comparing it with a care home', body: 'Most families have never arranged live-in care. They need to understand how it works, what it costs and why it can be the better choice before they enquire.' },
      { title: 'Every placement needs the right carer', body: 'You cannot take on a client without an experienced live-in carer ready to start, so recruitment matters as much as enquiries.' },
      { title: 'You cover a wide area', body: 'Live-in providers often work across whole counties. You need to be found in every town you cover, not just the one your office is in.' },
    ],
    badge: 'More placements and carers',
    outcome: 'wins placements and carers',
    results: 'more experienced live-in carers',
    cta: 'Ready to win more live-in placements?',
  },

  {
    slug: 'supported-living',
    name: 'Supported living',
    singular: 'supported living service',
    audience: 'supported living and learning disability providers',
    intro:
      'Supported living referrals come from families, social workers and commissioners, and all of them check you online first. We help providers present their model clearly and reach the right referrers for the right vacancies.',
    challenges: [
      { title: 'Referrers research before they refer', body: 'Local authorities and families look you up. A weak or unclear web presence quietly costs you referrals.' },
      { title: 'Your model needs explaining', body: 'Supported living is widely misunderstood. Clear, confident content wins trust and the right placements.' },
      { title: 'Filling specific vacancies', body: 'You need the right person for a particular service, which means precise visibility, not broad noise.' },
    ],
    badge: 'The right referrals',
    outcome: 'wins the right referrals',
    results: 'more of the right placements',
    cta: 'Ready for the right referrals?',
  },
  {
    slug: 'retirement-living',
    name: 'Retirement living',
    singular: 'retirement living community',
    audience: 'retirement and extra-care living operators',
    intro:
      'Retirement living is a considered, lifestyle-led purchase that buyers research for months. We help operators market the lifestyle, fill units faster and nurture enquiries through a long, deliberate decision.',
    challenges: [
      { title: 'Long, considered decisions', body: 'Buyers take months and compare widely. You need to stay visible and build desire across the whole journey.' },
      { title: 'Selling a lifestyle, not just care', body: 'Your community, amenities and independence are the draw. Your marketing has to show, not just tell.' },
      { title: 'Slow sales cost carrying charges', body: 'Empty units carry real cost. A faster, better-nurtured pipeline protects your margins.' },
    ],
    badge: 'Fewer empty units',
    outcome: 'fills units',
    results: 'more units sold and let',
    cta: 'Ready to fill more units?',
  },
]

export type CollectionService = {
  slug: string
  name: string // "Website design"
  mainHref: string // the deep service page to link to
  intro: string
  does: string[]
  angle: (s: Sector) => string
}

export const COLLECTION_SERVICES: CollectionService[] = [
  {
    slug: 'website-design',
    name: 'Website design',
    mainHref: '/website-development',
    intro: 'A fast, modern, mobile-first website built around the questions families actually ask, and engineered to turn visits into enquiries.',
    does: [
      'Mobile-first design families instantly trust',
      'Built for speed and Core Web Vitals',
      'Clear enquiry journeys and strong calls to action',
      'Accessible for older and less confident users',
      'Live room availability and care tools built in',
    ],
    angle: (s) => `For ${s.audience}, your website is the first real impression, and the place an enquiry is won or lost.`,
  },
  {
    slug: 'seo',
    name: 'SEO',
    mainHref: '/seo',
    intro: 'Specialist search engine optimisation that grows your organic visibility for the searches that actually bring enquiries, month after month.',
    does: [
      'Keyword strategy around real care searches',
      'On-page and technical SEO',
      'Care-aware content that ranks',
      'Authority building and clean indexing',
      'Honest reporting on rankings and enquiries',
    ],
    angle: (s) => `Rank once for the terms ${s.audience} should own, and get found for years without paying per click.`,
  },
  {
    slug: 'local-seo',
    name: 'Local SEO',
    mainHref: '/local-seo',
    intro: 'Local-first SEO and Google Business Profile work that puts you at the top of the map for families searching for care in your area.',
    does: [
      'Google Business Profile optimisation',
      'Local landing pages for your catchment',
      'Citations, listings and consistency',
      'Reviews that lift your local ranking',
      'Map-pack visibility where it counts',
    ],
    angle: (s) => `Care is a local decision, so we get you to the top of the map exactly where ${s.audience} are being searched for.`,
  },
  {
    slug: 'ppc',
    name: 'PPC advertising',
    mainHref: '/marketing',
    intro: 'Targeted Google and social campaigns that put you in front of families actively searching right now, measured on enquiries, not clicks.',
    does: [
      'High-intent Google Search campaigns',
      'Geo-targeted to your catchment',
      'Landing pages built to convert',
      'Call and form tracking',
      'Measured on cost per enquiry, not clicks',
    ],
    angle: (s) => `When you need enquiries this month, paid campaigns put you in front of the families ${s.audience} most want to reach.`,
  },
  {
    slug: 'lead-generation',
    name: 'Enquiry generation',
    mainHref: '/marketing',
    intro: 'A complete enquiry engine, high-converting pages, lead capture and follow-up, designed to turn more of your visitors into quality, ready-to-act enquiries.',
    does: [
      'High-converting landing pages',
      'Pop-ups, tools and live availability',
      'Every enquiry captured and tracked',
      'Phone, form and chat enquiries together',
      'Clear reporting on enquiries and ROI',
    ],
    angle: (s) => `We turn your visibility into a steady, measurable flow of enquiries, the lifeblood of ${s.audience}.`,
  },
]

// "Live-in care" -> "Live-in Care", for page titles.
export function titleCase(s: string): string {
  return s.replace(/(^|\s)(\S)/g, (_m, sp: string, c: string) => sp + c.toUpperCase())
}

export function getSector(slug: string): Sector | undefined {
  return SECTORS.find((s) => s.slug === slug)
}
export function getCollectionService(slug: string): CollectionService | undefined {
  return COLLECTION_SERVICES.find((s) => s.slug === slug)
}
