import { Globe, Search, Target, MessageSquareText, Code2, Palette, MapPin, PenLine, MousePointerClick, Boxes, Star, Users, Accessibility, LayoutTemplate, type LucideIcon } from 'lucide-react'

// The single source of truth for TRG Digital's services, used by the nav mega-menu,
// the homepage, and the About page so they never drift apart.
export type Service = {
  icon: LucideIcon
  title: string
  short: string // one-liner for the nav dropdown
  body: string // fuller description for cards
  href: string
}

export const SERVICES: Service[] = [
  {
    icon: Palette,
    title: 'Full Rebranding',
    short: 'New logo, identity & website',
    body: 'A complete rebrand, strategy, logo, full visual identity, guidelines and a redesigned, rebuilt website that families trust.',
    href: '/rebranding',
  },
  {
    icon: Globe,
    title: 'New website',
    short: 'Fast, modern sites built to convert',
    body: 'Fast, modern, search-optimised sites built around the questions families actually ask, designed to turn visitors into enquiries.',
    href: '/website-development',
  },
  {
    icon: LayoutTemplate,
    title: 'Design examples',
    short: 'See what your new site could look like',
    body: 'Complete, clickable example designs for a care home, a home care service and a nursing home, each built the way we build a real site.',
    href: '/designs',
  },
  {
    icon: Users,
    title: 'Carer recruitment',
    short: 'Recruit carers from your own website',
    body: 'Careers pages with pay up front, job pages listed free in Google for Jobs and a quick mobile application with optional CV upload.',
    href: '/carer-recruitment',
  },
  {
    icon: Accessibility,
    title: 'Accessible websites',
    short: 'WCAG 2.2 AA, easier for older visitors',
    body: 'Websites built to WCAG 2.2 AA with an accessibility bar for larger text, high contrast, a readable font and listen to page.',
    href: '/accessible-websites',
  },
  {
    icon: Search,
    title: 'Search Engine Optimisation (SEO)',
    short: 'Get found before your competitors',
    body: 'Get found first. We grow your organic visibility so the right families discover you before your competitors do.',
    href: '/seo',
  },
  {
    icon: MapPin,
    title: 'Local SEO',
    short: 'Get found by local families',
    body: 'Get to the top of the local map. We build your local presence so families searching for care in your area find you first.',
    href: '/local-seo',
  },
  {
    icon: Star,
    title: 'Google Profile & Reviews',
    short: 'Win the local map and family trust',
    body: 'Done-for-you Google Business Profile and reviews management, so you rank on the local map and earn the reviews families trust.',
    href: '/google-business-profile',
  },
  {
    icon: PenLine,
    title: 'Content creation',
    short: 'Ongoing content that ranks',
    body: 'Regular, care-aware content that answers families’ questions and grows your organic traffic month after month.',
    href: '/content-creation',
  },
  {
    icon: MousePointerClick,
    title: 'Conversion rate optimisation',
    short: 'Turn more visitors into enquiries',
    body: 'We turn more of your existing visitors into enquiries with clearer journeys, stronger calls to action and testing.',
    href: '/conversion-rate-optimisation',
  },
  {
    icon: Target,
    title: 'PPC advertising',
    short: 'Paid campaigns measured on enquiries',
    body: 'Targeted Google and social campaigns that put you in front of families actively searching for care, measured on enquiries, not clicks.',
    href: '/marketing',
  },
  {
    icon: MessageSquareText,
    title: 'Enquiry generation',
    short: 'High-converting pages that win enquiries',
    body: 'High-converting landing pages and lead capture that turn visitors into quality, ready-to-act enquiries.',
    href: '/marketing',
  },
  {
    icon: Boxes,
    title: 'Care tools & technology',
    short: 'Gateway tools that win families & enquiries',
    body: 'Our own family care tools, funding calculators, NHS checkers and a local-council guide, plus live room availability and built-in accessibility, added to your site to draw families in and turn them into enquiries.',
    href: '/care-tools',
  },
  {
    icon: Code2,
    title: 'Software development',
    short: 'Bespoke tools for the care sector',
    body: 'Bespoke tools and platforms for the care sector, the same capability behind our own products, CareStream and CareAssura.',
    href: '/development',
  },
]
