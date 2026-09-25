// County pages for TRG.
//
// The point of difference is the data. We own CareAssura, which holds every CQC
// registered care service in the country, so a county page can state how many
// services there are, the rating split, and how many have no website at all. That is
// checkable, locally specific, and no other agency can publish it, which also solves
// the problem these pages usually have: forty near-identical pages with the place
// name swapped.
//
// The figures are taken from the CareAssura directory and carry the date they were
// taken, because a number without a date is a claim rather than a fact.

export type CountyStats = {
  services: number
  towns: number
  residential: number
  nursing: number
  homeCare: number
  dementia: number
  outstanding: number
  good: number
  requiresImprovement: number
  notRated: number
  noWebsite: number
  /** Biggest markets first. */
  topTowns: { name: string; services: number }[]
}

export type County = {
  slug: string
  name: string
  /** Where we actually are in relation to it, in a sentence. Never invented. */
  standing: string
  /** Real local work, named. Empty is better than vague. */
  proof?: { name: string; where: string; url: string; what: string }[]
  stats: CountyStats
}

/** When the directory figures on these pages were counted. */
export const STATS_AS_AT = 'September 2026'

export const COUNTIES: Record<string, County> = {
  'west-sussex': {
    slug: 'west-sussex',
    name: 'West Sussex',
    standing:
      'We are based in West Sussex, and two of the care websites we run are here: Crossways in Lindfield and Ferndale in Crawley. This is not a county we have added to a list.',
    proof: [
      {
        name: 'Crossways Residential Care Home',
        where: 'Lindfield',
        url: 'https://crosswayscarehome.co.uk',
        what: 'Rebuilt from WordPress, with funding tools, live room availability and an accessibility toolbar.',
      },
      {
        name: 'Ferndale Nursing Home',
        where: 'Crawley',
        url: 'https://ferndalenursinghome.co.uk',
        what: 'Nursing home site built from scratch, with local pages for the towns around Crawley.',
      },
    ],
    stats: {
      services: 545,
      towns: 42,
      residential: 225,
      nursing: 120,
      homeCare: 206,
      dementia: 338,
      outstanding: 16,
      good: 380,
      requiresImprovement: 64,
      notRated: 85,
      noWebsite: 231,
      topTowns: [
        { name: 'Worthing', services: 116 },
        { name: 'Bognor Regis', services: 66 },
        { name: 'Crawley', services: 66 },
        { name: 'Chichester', services: 64 },
        { name: 'Littlehampton', services: 45 },
        { name: 'Horsham', services: 38 },
        { name: 'Haywards Heath', services: 26 },
        { name: 'Burgess Hill', services: 22 },
      ],
    },
  },
}

export function getCounty(slug: string): County | undefined {
  return COUNTIES[slug]
}

export function countySlugs(): string[] {
  return Object.keys(COUNTIES)
}

/** The share with no website, rounded, because 42.38% reads like a spreadsheet. */
export function pctNoWebsite(stats: CountyStats) {
  return Math.round((stats.noWebsite / stats.services) * 100)
}
