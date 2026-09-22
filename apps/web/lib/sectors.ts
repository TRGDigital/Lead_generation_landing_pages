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
  // What each service means for this care setting: unique copy per matrix page, so the
  // 40 sector × service pages are genuinely different rather than templated duplicates.
  focus: Record<string, { body: string; points: string[] }>
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
    focus: {
      'website-design': {
        body: "Families choosing a residential home want to see the rooms, the lounge, the garden and the people before they visit. We build care home websites around the tour: real photography, a clear room and fees section, your CQC rating shown live, and a visit request that takes a minute on a phone.",
        points: ["Rooms, fees and availability made clear", "A book a visit journey that works on a phone", "Your live CQC rating and reviews up front"],
      },
      'seo': {
        body: "Care home searches are specific: residential, respite, dementia, by town and by budget. We build a page for each care type you offer, answer the questions families ask about fees and funding, and make sure Google understands your registration and location.",
        points: ["A page for residential, respite and every care type", "Fees and funding content families search for", "Clean structured data for your home"],
      },
      'local-seo': {
        body: "Most families choose a home within a few miles of where they or their parent live. We make sure you appear in the map for care homes near every town and village in your catchment, with a Google Business Profile that shows real photos and recent reviews.",
        points: ["Map pack visibility for care homes near me", "Pages for the towns families search from", "A steady flow of recent Google reviews"],
      },
      'ppc': {
        body: "When a bed is empty, organic search is too slow. Paid search puts your home in front of families searching for residential or respite care in your area this week, with campaigns you can pause the moment the room is filled.",
        points: ["Campaigns switched on when a room is free", "Targeted to your catchment and care types", "Cost per enquiry reported, not clicks"],
      },
      'lead-generation': {
        body: "A family ready to enquire should never hit a dead end. We add live room availability, a visit request, funding tools and a callback option to your site, and make sure every enquiry reaches the manager straight away.",
        points: ["Live room availability on your site", "Visit requests and callbacks captured", "Every enquiry sent to the right inbox fast"],
      },
    },
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
    focus: {
      'website-design': {
        body: "Nursing placements are often arranged in days, by families and discharge teams under pressure. Your website has to show clinical capability clearly: the nursing care you provide, the conditions you support, your nurse led team and how quickly you can assess.",
        points: ["Clinical services and conditions set out clearly", "A page written for hospital discharge teams", "Fast assessment and admission information"],
      },
      'seo': {
        body: "Nursing searches are clinical and urgent: nursing home, FNC, end of life care, specific conditions. We build content that answers them properly, including how Funded Nursing Care and Continuing Healthcare work, so families find you when they need you most.",
        points: ["Content on FNC, CHC and nursing costs", "Pages for the conditions you support", "Structured data that states your nursing registration"],
      },
      'local-seo': {
        body: "Families want a nursing home close to the hospital, the GP and home. We build your local presence around the hospitals and towns you take admissions from, so you appear when a discharge is being arranged nearby.",
        points: ["Visibility near the hospitals you admit from", "Local pages for your admission catchment", "Reviews that speak to clinical care"],
      },
      'ppc': {
        body: "Nursing beds carry high fees, so a single placement pays for a campaign many times over. We run tightly targeted search campaigns for nursing care and discharge related searches in your area, with calls tracked back to the ad.",
        points: ["High intent nursing and discharge searches", "Budgets matched to the value of a placement", "Every call and form tracked to the campaign"],
      },
      'lead-generation': {
        body: "Discharge teams and families need an answer quickly. We give them a fast route to you: a clear admissions contact, a referral form for professionals, and tools such as the FNC and CHC checkers that turn research into a real enquiry.",
        points: ["A referral route for professionals", "FNC and CHC checkers for families", "Urgent enquiries flagged and routed fast"],
      },
    },
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
    focus: {
      'website-design': {
        body: "Families looking for dementia care need reassurance before anything else. We design calm, easy to read websites that explain your approach, your environment and your team's training, and show daily life in a way that helps a family picture their loved one there.",
        points: ["Your dementia approach explained simply", "Photography of real daily life and spaces", "Calm, accessible design for tired visitors"],
      },
      'seo': {
        body: "Dementia research journeys last weeks and start with questions, not provider names. We build helpful content around those questions: signs of dementia, when to consider care, what specialist care looks like, so you are found long before a family is ready to call.",
        points: ["Content for every stage of the journey", "Questions families actually search for", "Specialist expertise Google can recognise"],
      },
      'local-seo': {
        body: "Moving someone with dementia far from familiar people and places is hard, so families search locally. We make sure you appear for dementia care in each town you serve, and that your Google profile shows your specialism clearly.",
        points: ["Dementia care visibility town by town", "A Google profile that shows your specialism", "Reviews from families who have been there"],
      },
      'ppc': {
        body: "Dementia decisions can suddenly become urgent after a fall or a hospital stay. Paid campaigns catch those moments, with ads that lead to a reassuring landing page rather than a hard sell.",
        points: ["Campaigns for urgent dementia care searches", "Landing pages written with empathy", "Measured on enquiries, not clicks"],
      },
      'lead-generation': {
        body: "Families are often not ready to call. A dementia signs checklist, an is it time for care checklist and a gentle callback option let them take the next step privately, and give your team a warm enquiry when they are ready.",
        points: ["Dementia signs and readiness checklists", "A gentle, no pressure callback option", "Warm enquiries from families who are ready"],
      },
    },
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
    focus: {
      'website-design': {
        body: "People looking for home care want to know three things: what help you give, when your carers come, and whether you cover their street. We build home care websites that answer all three on the first screen, with a service area search and a simple way to book a care assessment.",
        points: ["Visit types and times explained clearly", "A clear list of the areas you cover", "A care assessment request on every page"],
      },
      'seo': {
        body: "Home care searches are highly local and highly specific: home care, dementia home care, companionship, help after hospital. We build a page for each service you offer and the questions families ask about costs and funding, including Attendance Allowance.",
        points: ["A page for every home care service", "Cost and Attendance Allowance content", "Structured data for your registered service"],
      },
      'local-seo': {
        body: "A home care client is only worth taking on if your carers can reach them. We build visibility in the towns and villages where your rounds already run, so new clients arrive where you have capacity.",
        points: ["Visibility where your rounds already run", "Pages for every town and village you cover", "A Google profile that shows your service area"],
      },
      'ppc': {
        body: "Home care is often needed quickly, after a fall or a hospital discharge. Paid search puts you in front of those families in the areas you can cover this week, and can be switched to recruitment ads when you are short of carers.",
        points: ["Campaigns limited to areas with capacity", "Switch between client and carer campaigns", "Cost per enquiry and per applicant reported"],
      },
      'lead-generation': {
        body: "Your website has two jobs: winning clients and recruiting carers. We build both journeys properly, with a visit planner and funding tools for families, and a careers section with job pages and a quick application for carers.",
        points: ["A visit planner and funding tools for families", "A careers section with a fast application", "Client and carer enquiries kept separate"],
      },
    },
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
    focus: {
      'website-design': {
        body: "Families considering live-in care are usually comparing it with a care home, and most have never arranged it before. We build websites that explain how live-in care works day to day, what the carer needs, what it costs and why it can be the better choice.",
        points: ["How live-in care works, step by step", "A clear comparison with moving into a care home", "Separate routes for families and live-in carers"],
      },
      'seo': {
        body: "Live-in care searches are research heavy: live-in care cost, live-in care vs care home, live-in dementia care, couples care. We build content that answers those questions honestly, so you are the provider families trust by the time they are ready to decide.",
        points: ["Content on live-in care costs and funding", "Live-in care vs care home explained", "Pages for dementia, couples and respite live-in care"],
      },
      'local-seo': {
        body: "Live-in providers often cover whole counties, but families still search by town. We build visibility across every town in your coverage area, rather than just the one your office is in.",
        points: ["Visibility across your whole coverage area", "Town pages that state your live-in coverage", "A consistent profile and reviews everywhere"],
      },
      'ppc': {
        body: "A single live-in placement is a significant, long term contract, so paid search can pay back quickly. We run campaigns on live-in care searches across your coverage area, and recruitment campaigns for experienced live-in carers when you need them.",
        points: ["Campaigns across your coverage area", "Recruitment campaigns for live-in carers", "Measured on placements and applicants"],
      },
      'lead-generation': {
        body: "Families need help deciding before they enquire. A live-in care or care home cost comparison and an is our home ready for live-in care checklist turn that research into a warm enquiry, while a dedicated careers route brings in live-in carers.",
        points: ["A live-in vs care home cost comparison", "A live-in readiness checklist for families", "A careers route for experienced live-in carers"],
      },
    },
  },

  {
    slug: 'domiciliary-care',
    name: 'Domiciliary care',
    singular: 'domiciliary care agency',
    audience: 'domiciliary care agencies',
    intro:
      'Domiciliary care agencies are judged by commissioners, by CQC and by the carers they need to recruit, as well as by the families they support. We help domiciliary providers show their quality to local authorities and self-funding clients, fill their care rounds efficiently and recruit carers at the volume the business needs.',
    challenges: [
      { title: 'Commissioners and clients both check you', body: 'Local authority commissioners, CQC and self-funding families all look you up online. Your website has to show quality and governance, not just friendliness.' },
      { title: 'Recruitment is the bottleneck', body: 'You cannot take on new hours without carers to cover them. A steady flow of local applicants matters as much as new clients.' },
      { title: 'Rounds run on geography', body: 'A new client is most valuable where your carers already work. Your marketing needs to win clients and carers in the right places.' },
    ],
    badge: 'Fuller rounds and more carers',
    outcome: 'fills rounds and recruits carers',
    results: 'fuller care rounds and more carers',
    cta: 'Ready to fill your rounds?',
    focus: {
      'website-design': {
        body: "A domiciliary care agency's website is checked by commissioners, CQC, self-funding clients and the carers you want to employ. We build websites that show your quality and governance clearly, explain your services and areas, and give carers a quick way to apply.",
        points: ["Quality, governance and CQC rating up front", "Services and coverage areas set out clearly", "A careers section built for high volume hiring"],
      },
      'seo': {
        body: "Domiciliary care has two search audiences: people looking for help at home, and carers looking for work. We build content for both, from services and funding pages to care jobs pages for each area you recruit in.",
        points: ["Service pages for self-funding clients", "Care jobs pages for every area you hire in", "Structured data for your services and vacancies"],
      },
      'local-seo': {
        body: "Domiciliary care runs on geography. New clients and new carers are both most valuable where your rounds already operate, so we build local visibility area by area, matched to where you have capacity and where you need staff.",
        points: ["Local visibility matched to your rounds", "Area pages for clients and for carers", "Consistent listings across every branch"],
      },
      'ppc': {
        body: "Most domiciliary agencies need carers as much as clients. We run recruitment campaigns that bring in local applicants at a measurable cost per applicant, and client campaigns for self-funded care when you have spare capacity.",
        points: ["Recruitment campaigns with cost per applicant", "Client campaigns when you have capacity", "Separate reporting for each pipeline"],
      },
      'lead-generation': {
        body: "Every application and enquiry should land in one place, with nothing lost in an inbox. We build job pages that appear in Google for Jobs, a short mobile application with optional CV upload, and client enquiry forms routed to the right branch.",
        points: ["Job pages listed free in Google for Jobs", "A short mobile application with optional CV", "Enquiries routed to the right branch"],
      },
    },
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
    focus: {
      'website-design': {
        body: "Supported living is often misunderstood, and referrals depend on commissioners, social workers and families understanding exactly what you offer. We build websites that explain your model, your services and your current vacancies in plain language.",
        points: ["Your support model explained plainly", "Current vacancies shown clearly", "Easy read and accessible design"],
      },
      'seo': {
        body: "People search for supported living by need and by place: learning disabilities, autism, mental health, by town. We build pages for the people you support and the areas you work in, so the right referrers find you.",
        points: ["Pages for each group of people you support", "Content that explains supported living clearly", "Visibility for referrer searches"],
      },
      'local-seo': {
        body: "Referrals usually come from the local authorities and teams in your area. We build your presence around the places your services are, so you are visible to local commissioners and families alike.",
        points: ["Visibility in each area your services operate", "Accurate listings for every service address", "Reviews and profiles that build trust"],
      },
      'ppc': {
        body: "Supported living vacancies are specific, so broad advertising wastes money. We run small, precise campaigns aimed at the searches and areas that match a particular vacancy, and turn them off once it is filled.",
        points: ["Campaigns matched to specific vacancies", "Precise targeting by need and area", "Switched off once a vacancy is filled"],
      },
      'lead-generation': {
        body: "Referrers need a simple, professional way to contact you. We add a referral form for professionals, a separate route for families, and a vacancies section that is easy to keep up to date.",
        points: ["A referral form for professionals", "A separate route for families", "A vacancies section your team can update"],
      },
    },
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
    focus: {
      'website-design': {
        body: "Retirement living is a lifestyle choice researched over months. We build websites that sell the life, not just the apartment: the community, the facilities, the location and the independence, with clear information on buying or renting.",
        points: ["The lifestyle and community shown first", "Clear buying and renting information", "A brochure and viewing request on every page"],
      },
      'seo': {
        body: "Buyers research retirement living long before they visit. We build content on costs, service charges, downsizing and the questions buyers and their families ask, so you stay visible throughout a long decision.",
        points: ["Content on costs, charges and downsizing", "Pages for each development and location", "Visibility across a long research journey"],
      },
      'local-seo': {
        body: "Most buyers move within an area they already know. We make sure each development appears for retirement living searches in the surrounding towns, with a profile that shows the setting and facilities.",
        points: ["Visibility for each development's area", "Profiles that show the setting and facilities", "Reviews from residents and their families"],
      },
      'ppc': {
        body: "Paid campaigns keep viewings flowing while organic visibility builds, and can be focused on the developments with the most units to fill.",
        points: ["Campaigns focused on units to fill", "Targeted by area and buyer profile", "Measured on viewings and enquiries"],
      },
      'lead-generation': {
        body: "Retirement buyers rarely buy on the first visit. We capture brochure requests and viewing bookings, then help you stay in touch through a long, considered decision.",
        points: ["Brochure requests and viewing bookings", "Follow up that respects a long decision", "Every enquiry tracked through to a viewing"],
      },
    },
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

// A service name for use mid-sentence: lowercases words but keeps acronyms such as SEO and
// PPC in capitals ("PPC advertising" -> "PPC advertising", "Local SEO" -> "local SEO").
export function inSentence(name: string): string {
  return name
    .split(' ')
    .map((w) => (w.length > 1 && w === w.toUpperCase() ? w : w.toLowerCase()))
    .join(' ')
}

// The first sentence of a block of copy, always ending in a single full stop.
export function firstSentence(text: string): string {
  return `${text.split('. ')[0]!.replace(/\.$/, '')}.`
}

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
