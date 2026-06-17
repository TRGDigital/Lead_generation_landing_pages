import type { LocationContent } from '@/lib/location-page'

// Generates a complete, ready-to-edit landing page from just an area name, modelled
// on the proven Haywards Heath page. Every line is templated with the area so a new
// page reads naturally out of the box; the admin can then tweak any wording.

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildLocationMeta(area: string): { meta_title: string; meta_description: string } {
  return {
    meta_title: `Care Homes in ${area} | Free, Impartial Help | CareAssura`,
    meta_description: `Find and compare brilliant care homes in ${area}. Free, impartial help from a local CareAssura adviser, covering residential, nursing and dementia care.`,
  }
}

export function buildLocationContent(area: string): LocationContent {
  return {
    hero: {
      eyebrow: `Care homes in ${area}`,
      subheadline: `Finding the right care home should not mean ringing round for hours. Tell us what you need and we will pass your details to care homes in the ${area} area that have genuine availability. The right homes then get in touch with you directly to arrange a visit. It is free, with no obligation.`,
      bullets: [
        'We share your details with local homes that have genuine availability',
        `Homes in the ${area} area contact you directly to arrange a visit`,
        'Free for families, with no obligation at any stage',
      ],
    },
    stats: [
      { value: 'Local', label: `advisers who know ${area} homes` },
      { value: 'CQC', label: 'ratings checked on every home' },
      { value: 'Free', label: 'for families, always' },
    ],
    howItWorks: {
      eyebrow: 'How it works',
      heading: `Finding care in ${area}, made simple`,
      steps: [
        { title: 'Tell us what you need', body: 'A two-minute form: the type of care, the timing, and anything that matters to your family.' },
        { title: 'We pass on your details', body: `We share your enquiry with care homes in the ${area} area that have genuine availability and fit what you are looking for.` },
        { title: 'Homes get in touch', body: 'The right local homes contact you directly to answer your questions and arrange a visit, so you can choose with confidence.' },
      ],
    },
    whyUs: {
      heading: 'Why families choose CareAssura',
      points: [
        { title: 'Real availability only', body: `We only pass your details to ${area} homes that actually have a place, so you are not chasing dead ends.` },
        { title: 'One enquiry, less legwork', body: 'Fill in one short form and let suitable local homes come to you, instead of ringing round yourself.' },
        { title: 'Free for families', body: 'Our service is completely free for you, with no obligation at any stage.' },
        { title: `Local to ${area}`, body: `We focus on care homes in and around ${area}, so the homes that contact you are genuinely nearby.` },
      ],
    },
    faq: [
      { question: 'How much does this cost?', answer: 'Nothing. Our help is completely free for families. There is never any charge or obligation.' },
      { question: 'Which care homes do you cover?', answer: `We cover residential, nursing and dementia care homes in ${area} and the surrounding area.` },
      { question: 'How quickly can you help?', answer: 'Often the same day. If care is needed urgently, tell us and we will prioritise homes with immediate availability.' },
      { question: 'Are you tied to particular homes?', answer: 'No. We are independent and impartial, and only suggest homes that genuinely suit your needs.' },
    ],
    careTypes: ['Residential care', 'Nursing care', 'Dementia care', 'Respite / short stay', 'Not sure yet'],
    timeframes: ['Urgently (within 2 weeks)', 'Within the next month', '1 to 3 months', 'Just researching'],
  }
}
