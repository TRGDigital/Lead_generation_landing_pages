// Starter templates for TRG /go/ ad landing pages — one per service, each with
// its own qualification quiz. Creating a page in /admin/go-pages copies one of
// these into an editable draft row.

import type { GoFaq, GoProofStat, GoQuizQuestion } from '@/lib/go-pages'

export type GoTemplate = {
  key: string
  service: string
  defaultSlug: string
  headline: string
  subheadline: string
  bullets: string[]
  proof: GoProofStat[]
  faqs: GoFaq[]
  quiz_intro: string
  questions: GoQuizQuestion[]
  meta_title: string
  meta_description: string
}

const SHARED_PROOF: GoProofStat[] = [
  { stat: '100%', label: 'care sector. We work with care providers and nobody else' },
  { stat: '29,000+', label: 'UK care services in our own directory, CareAssura' },
  { stat: '1 day', label: 'to get your personal recommendations after the quiz' },
]

const SHARED_FAQS: GoFaq[] = [
  {
    q: 'Is the check really free?',
    a: 'Yes. You answer a few questions, we review them personally and reply with what we would fix first. No invoice, no obligation, no pressure.',
  },
  {
    q: 'Do you only work with care homes?',
    a: 'Yes. Care homes, nursing homes and home care providers. We build care marketing, care websites and our own care platforms (CareAssura, CareStream), so you never have to explain the sector to us.',
  },
  {
    q: 'What happens after I submit?',
    a: 'A real person (not an automation) reviews your answers and replies within one working day with honest recommendations, whether or not you work with us.',
  },
]

export const GO_TEMPLATES: GoTemplate[] = [
  {
    key: 'marketing',
    service: 'Care Home Marketing',
    defaultSlug: 'care-home-marketing',
    headline: 'Fill your empty beds with families who choose you first',
    subheadline:
      'We help UK care homes win more enquiries with marketing built only for the care sector. Take the 60-second enquiry check to see exactly where your home is losing families.',
    bullets: [
      'Specialists in care, not a generalist agency learning on your budget',
      'Measured on enquiries and filled beds, not clicks and impressions',
      'Everything under one roof: website, SEO, Google profile, ads and follow-up',
    ],
    proof: SHARED_PROOF,
    faqs: SHARED_FAQS,
    quiz_intro: 'How many enquiries is your home missing?',
    questions: [
      { q: 'How full is your home right now?', options: ['Full, with a waiting list', '1–2 empty beds', '3–5 empty beds', 'More than 5 empty beds'] },
      { q: 'Where do most of your enquiries come from today?', options: ['Word of mouth', 'Our website / Google', 'Paid directories (carehome.co.uk etc.)', 'Local authority placements', 'Honestly not sure'] },
      { q: 'When a family Googles “care home near me”, where do you show up?', options: ['Top 3 on the map', 'Somewhere on page one', 'Page two or beyond', 'Never checked'] },
      { q: 'How quickly does your team respond to a new enquiry?', options: ['Within the hour', 'Same day', 'Within a few days', 'It varies a lot'] },
      { q: 'What is your biggest frustration with marketing?', options: ['Not enough enquiries', 'Enquiries are the wrong fit', 'We rely too much on one source', 'No time to do any of it'] },
    ],
    meta_title: 'Care Home Marketing That Fills Beds | TRG Digital',
    meta_description: 'Marketing built only for UK care homes. Take the free 60-second enquiry check and see where your home is losing families.',
  },
  {
    key: 'seo',
    service: 'Care Home SEO',
    defaultSlug: 'care-home-seo',
    headline: 'Be the care home families find first on Google',
    subheadline:
      'Local SEO built only for the care sector, built to rank for the searches that actually bring tours and enquiries. Take the 60-second visibility check to see where you stand.',
    bullets: [
      'Rank for “care home in your town”, not vanity keywords',
      'Google Business Profile, reviews, local pages and technical fixes handled for you',
      'Reported in enquiries and calls, not just positions',
    ],
    proof: SHARED_PROOF,
    faqs: SHARED_FAQS,
    quiz_intro: 'How visible is your home on Google?',
    questions: [
      { q: 'Search “care home in your town”. Where do you appear?', options: ['Top 3 map results', 'Page one, below the map', 'Page two or beyond', 'Never checked'] },
      { q: 'How many Google reviews does your home have?', options: ['50+', '20–50', 'Under 20', 'Not sure'] },
      { q: 'When did your website last get new content?', options: ['This month', 'In the last 6 months', 'Over a year ago', 'What content?'] },
      { q: 'Who looks after your SEO today?', options: ['An agency', 'Someone in-house', 'Nobody, really', 'A directory does it for us'] },
      { q: 'How many enquiries a month come from Google search?', options: ['10+', '3–10', '1–2', 'No idea, we can’t track it'] },
    ],
    meta_title: 'Care Home SEO, Get Found First | TRG Digital',
    meta_description: 'Local SEO built only for UK care homes. Free 60-second visibility check shows where families are finding your competitors instead of you.',
  },
  {
    key: 'websites',
    service: 'Care Home Websites',
    defaultSlug: 'care-home-websites',
    headline: 'A care home website that turns visitors into visits',
    subheadline:
      'Fast, warm, mobile-first websites built from scratch for care homes, no WordPress templates. Take the 60-second website check to see what yours is costing you.',
    bullets: [
      'Built from scratch. Fast, secure, no page-builder bloat',
      'Designed around the questions families actually ask',
      'Enquiry forms, tours, fees tools and live availability built in',
    ],
    proof: SHARED_PROOF,
    faqs: SHARED_FAQS,
    quiz_intro: 'Is your website winning or losing families?',
    questions: [
      { q: 'How old is your current website?', options: ['Under 2 years', '2–5 years', 'Over 5 years', 'We don’t really have one'] },
      { q: 'On your phone right now, how does it feel?', options: ['Fast and easy', 'A bit slow or fiddly', 'Embarrassing', 'Never tried it'] },
      { q: 'Can families see fees, rooms or availability online?', options: ['Yes, clearly', 'Some of it', 'No, they have to call', 'Not sure'] },
      { q: 'How many enquiries does the website generate monthly?', options: ['10+', '3–10', 'Barely any', 'We can’t tell'] },
      { q: 'What runs your current site?', options: ['WordPress', 'A directory-provided site', 'Custom build', 'No idea'] },
    ],
    meta_title: 'Care Home Website Design & Build | TRG Digital',
    meta_description: 'Custom-built care home websites that turn visitors into tours. Free 60-second check shows what your current site is costing you.',
  },
  {
    key: 'ppc',
    service: 'Google & Facebook Ads',
    defaultSlug: 'care-home-ads',
    headline: 'Ads that fill beds, not budgets',
    subheadline:
      'Google and Meta campaigns run by care-sector specialists, measured on enquiries and tours, not clicks. Take the 60-second ads check to see what your spend should be returning.',
    bullets: [
      'Campaigns built around real family search behaviour in your area',
      'Call tracking and lead tracking, so every pound is accountable',
      'Landing pages, follow-up and missed-call rescue included',
    ],
    proof: SHARED_PROOF,
    faqs: SHARED_FAQS,
    quiz_intro: 'Is your ad spend filling beds?',
    questions: [
      { q: 'Are you running paid ads today?', options: ['Yes, Google', 'Yes, Facebook and Instagram', 'Both', 'Not yet'] },
      { q: 'Roughly what do you spend a month?', options: ['Under £500', '£500–£1,500', 'Over £1,500', 'Nothing yet'] },
      { q: 'Do you know your cost per enquiry?', options: ['Yes, exactly', 'A rough idea', 'No', 'What’s a cost per enquiry?'] },
      { q: 'Where do your ad clicks land?', options: ['A dedicated landing page', 'Our homepage', 'A directory profile', 'Not sure'] },
      { q: 'Can you tell which calls came from ads?', options: ['Yes, call tracking', 'No, calls are calls', 'We get few calls', 'Not sure'] },
    ],
    meta_title: 'Google Ads for Care Homes That Fill Beds | TRG Digital',
    meta_description: 'Care-sector PPC measured on enquiries, not clicks. Free 60-second ads check shows what your spend should be returning.',
  },
  {
    key: 'stack',
    service: 'Get More Enquiries (Full Stack)',
    defaultSlug: 'get-more-enquiries',
    headline: 'Every enquiry captured, answered and followed up, automatically',
    subheadline:
      'CRM, Voice AI, chat, call tracking, missed-call text-back, funnels and ads. The complete enquiry engine for care homes, built and run by TRG. See what you’re missing in 60 seconds.',
    bullets: [
      'One system: CRM, AI receptionist, chat, forms, funnels and ads together',
      'Missed-call text-back recovers enquiries you already paid for',
      'Built only for the care sector, by the team behind CareAssura and CareStream',
    ],
    proof: SHARED_PROOF,
    faqs: SHARED_FAQS,
    quiz_intro: 'How many enquiries slip through your net?',
    questions: [
      { q: 'What happens when a call goes unanswered?', options: ['They get a text back instantly', 'Voicemail', 'Nothing, we hope they call back', 'Not sure'] },
      { q: 'Where do new enquiries get recorded?', options: ['A CRM', 'A spreadsheet', 'Email inbox / paper', 'They don’t, really'] },
      { q: 'Who answers questions on your website at 9pm?', options: ['AI chat', 'A contact form', 'Nobody', 'What website questions?'] },
      { q: 'How do you follow up an enquiry that goes quiet?', options: ['Automated sequence', 'Someone remembers to call', 'We usually don’t', 'Varies'] },
      { q: 'How many enquiries do you think you lose a month?', options: ['None', '1–2', '3–5', 'Honestly, no idea'] },
    ],
    meta_title: 'Get More Care Home Enquiries, The Full Stack | TRG Digital',
    meta_description: 'CRM, Voice AI, chat, call tracking and ads in one care-sector enquiry engine. Free 60-second check shows what you’re missing.',
  },
]
