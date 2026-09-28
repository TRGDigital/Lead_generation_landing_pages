import { Calculator, BedDouble, Gauge, Award, MonitorSmartphone, Scale, Code2, ClipboardList, UsersRound, Wallet, RefreshCw, PoundSterling, ShieldCheck, GraduationCap, BadgeCheck, Radar, PhoneIncoming, Accessibility, Megaphone, MessageSquareReply, type LucideIcon } from 'lucide-react'

// The single source of truth for the free Care Toolkit, used by the nav mega-menu
// and the /tools hub so they never drift apart.
export type Tool = {
  icon: LucideIcon
  title: string
  short: string // one-liner for the nav dropdown
  body: string // fuller description for the hub cards
  href: string
}

export const TOOLS: Tool[] = [
  {
    icon: ClipboardList,
    title: 'Care Home Dependency Tool',
    short: 'Measure resident dependency & care hours',
    body: 'Assess your residents across six care domains and see your home’s dependency mix and the care hours it requires, the basis for safe staffing.',
    href: '/tools/care-home-dependency-tool',
  },
  {
    icon: UsersRound,
    title: 'Staffing Calculator',
    short: 'Turn care hours into staff numbers',
    body: 'Turn your care hours into the care staff you need, in whole-time equivalents and on duty per shift, day and night.',
    href: '/tools/staffing-calculator',
  },
  {
    icon: Wallet,
    title: 'Agency Cost Calculator',
    short: 'What agency is really costing you',
    body: 'See your annual agency spend, the premium over permanent staff, and what you could save by cutting reliance.',
    href: '/tools/agency-staff-cost-calculator',
  },
  {
    icon: RefreshCw,
    title: 'Staff Turnover Cost',
    short: 'The hidden cost of losing staff',
    body: 'Reveal what staff turnover costs your home each year, and what reducing it would save.',
    href: '/tools/staff-turnover-cost-calculator',
  },
  {
    icon: PoundSterling,
    title: 'Fee Break-Even Calculator',
    short: 'The fee & occupancy you need',
    body: 'Work out the weekly fee and occupancy your home needs to break even, and where you stand today.',
    href: '/tools/care-fee-break-even-calculator',
  },
  {
    icon: ShieldCheck,
    title: 'CQC Inspection Readiness',
    short: 'How ready are you to be inspected?',
    body: 'Self-assess against the five CQC key questions and see where the gaps are before the inspector does.',
    href: '/tools/cqc-inspection-readiness',
  },
  {
    icon: GraduationCap,
    title: 'Mandatory Training Checker',
    short: 'Are your staff up to date?',
    body: 'Check staff compliance across the mandatory training topics and see exactly where the gaps are.',
    href: '/tools/mandatory-training-checker',
  },
  {
    icon: Calculator,
    title: 'Care Funding Calculator',
    short: 'Who pays for care, and how much',
    body: 'Estimate care costs and who pays, your contribution, council support and NHS funding, for all four UK nations.',
    href: '/tools/funding-calculator',
  },
  {
    icon: BedDouble,
    title: 'Cost of an Empty Bed',
    short: 'What vacancies really cost you',
    body: 'See exactly how much each empty bed costs you per week, month and year, and what filling them is worth.',
    href: '/tools/empty-bed-calculator',
  },
  {
    icon: Scale,
    title: 'Local Authority vs Private',
    short: 'What your funding mix costs you',
    body: 'See how much less social-services funded residents earn you than private ones, per bed and across the whole home, month to year.',
    href: '/tools/funding-mix-calculator',
  },
  {
    icon: BadgeCheck,
    title: 'CQC Rating Display Checker',
    short: 'Is your CQC rating on your website?',
    body: 'Check your website shows your current CQC rating or the official CQC widget, spot out of date ratings, and get plain-English fixes.',
    href: '/tools/cqc-rating-display-checker',
  },
  {
    icon: Radar,
    title: 'Local Competitor Snapshot',
    short: 'See every care service near your postcode',
    body: 'Enter your postcode and see the care homes, nursing homes or home care services competing with you, with CQC ratings, care types, distance and which ones have a website.',
    href: '/tools/care-competitor-snapshot',
  },
  {
    icon: PhoneIncoming,
    title: 'Enquiry Value Calculator',
    short: 'What every enquiry is worth to you',
    body: 'Put a pound figure on every enquiry and every lost one. See your funnel from first call to admission, and what converting a few more is worth over a year.',
    href: '/tools/enquiry-value-calculator',
  },
  {
    icon: Accessibility,
    title: 'Care Website Accessibility Check',
    short: 'How your site works for older visitors',
    body: 'Enter your web address and we check your homepage and key pages for missing image descriptions, unlabelled enquiry forms, blocked zoom, headings and tap to call. You get a score out of 100 and your top three fixes.',
    href: '/tools/care-website-accessibility-check',
  },
  {
    icon: Megaphone,
    title: 'Care Job Advert Checker',
    short: 'Score your carer job advert out of 100',
    body: 'Paste a care assistant, senior carer, nurse or home care advert and see what stops carers applying: hidden pay, missing shifts, thin benefits, jargon and barriers for new starters. Get plain-English fixes instantly, and an optional rewrite with a job board ready title.',
    href: '/tools/care-job-advert-checker',
  },
  {
    icon: MessageSquareReply,
    title: 'Care Review Reply Helper',
    short: 'Draft safe, sincere replies to reviews',
    body: 'Paste a review from Google, carehome.co.uk, homecare.co.uk or Facebook and get a short reply that never confirms who you care for, takes complaints offline and flags safeguarding concerns.',
    href: '/tools/care-review-reply-helper',
  },
  {
    icon: Gauge,
    title: 'Your Care Website Grader',
    short: 'Score your site like families do',
    body: 'Score your care website the way families judge it, CQC rating, fees, enquiry journey, speed, accessibility and more.',
    href: '/tools/website-grader',
  },
  {
    icon: Award,
    title: 'CQC Rating Checker',
    short: 'Look up any provider rating',
    body: 'Look up any care provider’s latest CQC rating and the five key-question ratings at a glance.',
    href: '/tools/cqc-rating-checker',
  },
  {
    icon: MonitorSmartphone,
    title: 'How You Look on Google',
    short: 'Your search and social preview',
    body: 'See your live Google search result and social share preview, then write a better title and description.',
    href: '/tools/google-preview',
  },
  {
    icon: Code2,
    title: 'Care Schema Generator',
    short: 'Free JSON-LD structured data',
    body: 'Generate schema.org structured data for a care home, nursing home or home care agency, with your CQC rating added the correct, compliant way. Copy and paste, free.',
    href: '/tools/care-schema-generator',
  },
]
