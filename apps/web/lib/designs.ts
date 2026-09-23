// Design examples: complete homepage designs a prospect can click through, each shown with
// content for a different kind of care service.
//
// Every provider here is FICTIONAL. Nothing on these pages may be presented as a real home,
// a real rating or a real person's words: each page carries a permanent "example design"
// bar, the reviews are marked as examples, and the CQC line says it is an example rating.
// Any design can be applied to any care service; the settings just make each one feel real.

export type Design = {
  slug: string
  /** The design's name, as we present it in a pitch. */
  name: string
  /** One line on the style, for the index page. */
  style: string
  /** The care setting the example content is written for. */
  setting: string
  /** The fictional provider shown in the design. */
  provider: {
    name: string
    strapline: string
    town: string
    county: string
    phone: string
    intro: string
  }
  /** Shown on the index card. */
  highlights: string[]
}

export const DESIGNS: Design[] = [
  {
    slug: 'oakfield-house',
    name: 'Oakfield',
    style: 'Traditional and warm. Serif type, deep green and cream, photography led.',
    setting: 'Residential care home',
    provider: {
      name: 'Oakfield House',
      strapline: 'A family run home in the heart of the village',
      town: 'Alderbury',
      county: 'Wiltshire',
      phone: '01722 000 000',
      intro:
        'Oakfield House is a 32 bedroom residential and respite home, where people keep their routines, their friendships and their independence, with help exactly where they need it.',
    },
    highlights: ['Room availability shown live', 'Visit booking on every page', 'Fees explained openly'],
  },
  {
    slug: 'brightpath-care',
    name: 'Brightpath',
    style: 'Friendly and modern. Rounded shapes, teal and white, built around two audiences.',
    setting: 'Home care and live-in care',
    provider: {
      name: 'Brightpath Care',
      strapline: 'Care at home, from people who turn up when they say they will',
      town: 'Melrose Green',
      county: 'Suffolk',
      phone: '01394 000 000',
      intro:
        'Brightpath provides hourly home care and live-in care across east Suffolk, planned by a nurse and delivered by a small team of familiar faces.',
    },
    highlights: ['Separate routes for families and carers', 'Care assessment request built in', 'Careers with pay up front'],
  },
  {
    slug: 'st-aidans',
    name: "St Aidan's",
    style: 'Clean and clinical. Navy and sky blue, crisp grid, built for trust at speed.',
    setting: 'Nursing home',
    provider: {
      name: "St Aidan's Nursing Home",
      strapline: 'Nursing care, around the clock',
      town: 'Northbrook',
      county: 'Cheshire',
      phone: '01625 000 000',
      intro:
        "St Aidan's provides 24 hour nursing, dementia and palliative care, with a clinical team that can assess and admit quickly when a family or a discharge team needs an answer today.",
    },
    highlights: ['Written for families and discharge teams', 'Fast admissions enquiry', 'Clinical services set out clearly'],
  },
]

export function getDesign(slug: string): Design | undefined {
  return DESIGNS.find((d) => d.slug === slug)
}
