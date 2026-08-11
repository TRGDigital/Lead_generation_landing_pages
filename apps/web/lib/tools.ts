import { Calculator, BedDouble, Gauge, Award, MonitorSmartphone, Scale, Code2, ClipboardList, type LucideIcon } from 'lucide-react'

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
