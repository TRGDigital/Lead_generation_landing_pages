// The branded family-tools suite. Each tool is a self-contained calculator or guide
// (ported from the CareAssura models) that can be allocated to a client website in
// /admin/websites and embedded on their site via tools.js. Branding (colour + logo)
// comes from the website record; an optional lead is captured into organic_leads.

export type FamilyToolKey =
  | 'funding'
  | 'dpa'
  | 'fnc'
  | 'attendance-allowance'
  | 'chc-checker'
  | 'chc-dst'
  | 'la-lookup'
  | 'dementia-signs'
  | 'care-checklist'
  | 'cost-estimator'
  | 'book-visit'
  | 'funding-guide'
  | 'live-in-compare'
  | 'visit-planner'
  | 'live-in-ready'

export type FamilyTool = {
  key: FamilyToolKey
  name: string
  short: string // one-line description for the admin allocation list + tool header
  blurb: string // longer description for the public index / embed intro
  category: 'Funding' | 'NHS & nursing' | 'Benefits' | 'Local support' | 'Health & wellbeing' | 'Home & live-in care'
  nursingRelevant?: boolean // surfaced as a hint in admin (nursing homes get more value)
  captures?: boolean // tool ends with an optional "email my results" lead step
  standalone?: boolean // premium tool gated by its own panel, not the standard tools grid
  hidden?: boolean // built but not yet public: left off /care-tools, and the embed only loads for a site it is allocated to
}

export const FAMILY_TOOLS: FamilyTool[] = [
  {
    key: 'funding',
    name: 'Care funding calculator',
    short: 'Who pays for care: you, the council, or the NHS',
    blurb:
      'A full means-test estimate across England, Scotland, Wales and Northern Ireland. Shows the weekly split between the family, the local authority and the NHS, and flags Deferred Payment eligibility.',
    category: 'Funding',
    captures: true,
  },
  {
    key: 'dpa',
    name: 'Deferred Payment calculator',
    short: 'Use a home’s value to pay for care without selling now',
    blurb:
      'Estimates eligibility for a council Deferred Payment Agreement, how much equity can be deferred, and how the debt grows over time at the national interest rate.',
    category: 'Funding',
    captures: true,
  },
  {
    key: 'fnc',
    name: 'Funded Nursing Care checker',
    short: 'The weekly NHS contribution towards nursing home fees',
    blurb:
      'Checks whether someone is likely to qualify for NHS Funded Nursing Care (FNC), shows the weekly rate, and explains the next steps and how it relates to a CHC assessment.',
    category: 'NHS & nursing',
    nursingRelevant: true,
    captures: true,
  },
  {
    key: 'attendance-allowance',
    name: 'Attendance Allowance checker',
    short: 'Non-means-tested benefit for people over State Pension age',
    blurb:
      'A quick eligibility check for Attendance Allowance, the weekly benefit for people 66+ who need help with personal care, including the fast-track for terminal illness.',
    category: 'Benefits',
    captures: true,
  },
  {
    key: 'chc-checker',
    name: 'NHS Continuing Healthcare checker',
    short: 'Could the NHS fund the full cost of care?',
    blurb:
      'Screens across the NHS Continuing Healthcare care domains to indicate whether someone is likely to warrant a full CHC assessment, where the NHS can fund 100% of care costs.',
    category: 'NHS & nursing',
    nursingRelevant: true,
    captures: true,
  },
  {
    key: 'chc-dst',
    name: 'CHC Decision Support Tool guide',
    short: 'Understand the 12 care domains the NHS assesses',
    blurb:
      'A plain-English guide to the NHS CHC Decision Support Tool: the 12 care domains, the severity levels, and what evidence the assessment team looks for in each.',
    category: 'NHS & nursing',
    nursingRelevant: true,
  },
  {
    key: 'la-lookup',
    name: 'Local council & funding',
    short: 'The right council and what it pays towards care',
    blurb:
      'Shows a family the local council’s adult social care team for this client, with direct contact details, the key service pages, and the capital thresholds that decide council support in their nation.',
    category: 'Local support',
    captures: true,
  },
  {
    key: 'dementia-signs',
    name: 'Dementia signs checklist',
    short: 'A private early-signs self-check for worried families',
    blurb:
      'A short, private checklist based on the AD8 screening tool that helps a family decide whether it is worth speaking to a GP about a relative’s memory or thinking. Not a diagnosis, and nothing is stored.',
    category: 'Health & wellbeing',
    captures: true,
  },
  {
    key: 'care-checklist',
    name: 'Is it time for care?',
    short: 'A gentle self-check for families weighing up more support',
    blurb:
      'A private eight-question checklist for families wondering whether a loved one might need more support or residential care. Bands the answers into a warm, no-pressure suggestion and invites a conversation with the home. Nothing is stored.',
    category: 'Health & wellbeing',
    captures: true,
  },
  {
    key: 'cost-estimator',
    name: 'Cost of care estimator',
    short: 'Weekly, monthly and yearly cost with the means-test applied',
    blurb:
      'Families pick the care type, adjust a guide weekly fee (or enter their own quote), add savings, property and Attendance Allowance, and see the estimated cost plus who is likely to pay under the England means-test thresholds.',
    category: 'Funding',
    captures: true,
  },
  {
    key: 'book-visit',
    name: 'Book a visit',
    short: 'Visit requests with a preferred date and time, straight to the home',
    blurb:
      'A warm, simple visit-request form: name, contact details, preferred date and time. Each request lands as an enquiry in the admin and the client\'s inbox, so tours get booked instead of lost.',
    category: 'Local support',
    captures: true,
  },
  {
    key: 'funding-guide',
    name: 'Funding & care options guide',
    short: 'A short needs check that emails a branded funding guide PDF',
    blurb:
      'Premium add-on. Families answer a few questions and receive a personalised, branded "Your care and funding options" PDF, with care that may suit, an indicative cost, the home\'s live CQC rating, and how care can be paid for. Captures a warm enquiry.',
    category: 'Funding',
    captures: true,
    standalone: true,
  },
  {
    key: 'live-in-compare',
    name: 'Live-in care or a care home?',
    short: 'Compare the weekly cost of live-in care with a care home',
    blurb:
      'Families compare the weekly cost of live-in care with care home fees, for one person or a couple, using their own quotes, and see how the value of the home is treated differently in the council means test when care is given at home.',
    category: 'Home & live-in care',
    captures: true,
    hidden: true,
  },
  {
    key: 'visit-planner',
    name: 'How much care do we need?',
    short: 'Plan a week of home care visits and see the weekly hours',
    blurb:
      'Families build a week of home care visits, morning, lunch, tea and bedtime, day by day, and see the total weekly hours, with an optional estimated cost from a provider’s hourly rate. The plan can be sent straight to the provider.',
    category: 'Home & live-in care',
    captures: true,
    hidden: true,
  },
  {
    key: 'live-in-ready',
    name: 'Is our home ready for live-in care?',
    short: 'A practical checklist that builds a to do list for live-in care',
    blurb:
      'A short, practical checklist covering the carer’s room, food, daily breaks, nights and getting around, which turns anything not yet in place into a personalised to do list.',
    category: 'Home & live-in care',
    captures: true,
    hidden: true,
  },
]

export const TOOL_KEYS = FAMILY_TOOLS.map((t) => t.key)

export function getFamilyTool(key: string): FamilyTool | undefined {
  return FAMILY_TOOLS.find((t) => t.key === key)
}

export function isToolKey(key: string): key is FamilyToolKey {
  return TOOL_KEYS.includes(key as FamilyToolKey)
}
