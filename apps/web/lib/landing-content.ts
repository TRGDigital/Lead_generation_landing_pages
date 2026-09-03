import type { CareType } from '@/lib/landing-regions'

// The content a new promoted page starts with.
//
// Built from the Haywards Heath page, which converts, so a new area starts from something
// proven rather than something blank. It is generated rather than written by a model: the
// structure is fixed and every sentence is the same argument with the area and care type
// swapped, so a template gives the same result instantly, for nothing, and cannot invent a
// claim about a town it knows nothing about. Everything here is editable afterwards in
// /admin/pages, and should be edited: local detail is what makes a page feel local.

type Words = {
  label: string        // "care home"
  plural: string       // "care homes"
  provider: string     // "homes" / "agencies"
  visit: string        // "arrange a visit"
  careTypes: string[]
}

const WORDS: Record<CareType, Words> = {
  residential: {
    label: 'care home',
    plural: 'care homes',
    provider: 'homes',
    visit: 'arrange a visit',
    careTypes: ['Residential care', 'Dementia care', 'Respite / short stay', 'Nursing care', 'Not sure yet'],
  },
  nursing: {
    label: 'nursing home',
    plural: 'nursing homes',
    provider: 'homes',
    visit: 'arrange a visit',
    careTypes: ['Nursing care', 'Dementia nursing', 'Palliative or end of life care', 'Respite / short stay', 'Not sure yet'],
  },
  homecare: {
    label: 'home care agency',
    plural: 'home care agencies',
    provider: 'agencies',
    visit: 'arrange a first visit',
    careTypes: ['Help at home (visits)', 'Live in care', 'Dementia support at home', 'Respite for a family carer', 'Not sure yet'],
  },
}

export function buildLandingContent(area: string, care: CareType) {
  const w = WORDS[care]
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  return {
    hero: {
      eyebrow: `${cap(w.plural)} in ${area}`,
      subheadline: `Finding the right ${w.label} should not mean ringing round for hours. Tell us what you need and we will pass your details to ${w.plural} in the ${area} area that have genuine availability. The right ${w.provider} then get in touch with you directly to ${w.visit}. It is free, with no obligation.`,
      bullets: [
        `We share your details with local ${w.provider} that have genuine availability`,
        `${cap(w.plural)} in the ${area} area contact you directly to ${w.visit}`,
        'Free for families, with no obligation at any stage',
      ],
    },
    stats: [
      { value: 'Local', label: `advisers who know ${area} ${w.provider}` },
      { value: 'CQC', label: `ratings checked on every ${w.label}` },
      { value: 'Free', label: 'for families, always' },
    ],
    whyUs: {
      heading: 'Why families choose CareAssura',
      points: [
        {
          title: 'Real availability only',
          body: `We only pass your details to ${area} ${w.provider} that actually have a place, so you are not chasing dead ends.`,
        },
        {
          title: 'One enquiry, less legwork',
          body: `Fill in one short form and let suitable local ${w.provider} come to you, instead of ringing round yourself.`,
        },
        {
          title: 'Free for families',
          body: 'Our service is completely free for you, with no obligation at any stage.',
        },
        {
          title: `Local to ${area}`,
          body: `We focus on ${w.plural} in and around ${area}, so the ${w.provider} that contact you are genuinely nearby.`,
        },
      ],
    },
    howItWorks: {
      eyebrow: 'How it works',
      heading: `Finding ${care === 'homecare' ? 'care at home' : 'care'} in ${area}, made simple`,
      steps: [
        {
          title: 'Tell us what you need',
          body: 'A two-minute form: the type of care, the timing, and anything that matters to your family.',
        },
        {
          title: 'We pass on your details',
          body: `We share your enquiry with ${w.plural} in the ${area} area that have genuine availability and fit what you are looking for.`,
        },
        {
          title: `${cap(w.provider)} get in touch`,
          body: `The right local ${w.provider} contact you directly to answer your questions and ${w.visit}, so you can choose with confidence.`,
        },
      ],
    },
    careTypes: w.careTypes,
    timeframes: ['Urgently (within 2 weeks)', 'Within the next month', '1 to 3 months', 'Just researching'],
    faq: [
      {
        question: 'How much does this cost?',
        answer: 'Nothing. Our help is completely free for families. There is never any charge or obligation.',
      },
      {
        question: `Which ${w.plural} do you cover?`,
        answer: care === 'homecare'
          ? `We cover home care agencies serving ${area} and the surrounding area, including live in care and dementia support at home.`
          : `We cover ${care === 'nursing' ? 'nursing and dementia nursing' : 'residential, nursing and dementia'} ${w.provider} in ${area} and the surrounding area.`,
      },
      {
        question: 'How quickly can you help?',
        answer: `Often the same day. If care is needed urgently, tell us and we will prioritise ${w.provider} with immediate availability.`,
      },
      {
        question: `Are you tied to particular ${w.provider}?`,
        answer: `No. We are independent and impartial, and only suggest ${w.provider} that genuinely suit your needs.`,
      },
    ],
  }
}

export function buildMeta(area: string, care: CareType) {
  const w = WORDS[care]
  return {
    meta_title: `${w.plural.charAt(0).toUpperCase() + w.plural.slice(1)} in ${area}`,
    meta_description: `Find ${w.plural} in ${area} with genuine availability. Tell us what you need and local ${w.provider} contact you directly. Free for families, no obligation.`,
  }
}
