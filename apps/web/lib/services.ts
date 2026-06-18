import { Globe, Search, Target, MessageSquareText, Code2, Palette, type LucideIcon } from 'lucide-react'

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
    icon: Search,
    title: 'Search Engine Optimisation (SEO)',
    short: 'Get found before your competitors',
    body: 'Get found first. We grow your organic visibility so the right families discover you before your competitors do.',
    href: '/seo',
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
    short: 'High-converting pages that fill beds',
    body: 'High-converting landing pages and lead capture that fill empty beds with quality, ready-to-act enquiries.',
    href: '/marketing',
  },
  {
    icon: Code2,
    title: 'Software development',
    short: 'Bespoke tools for the care sector',
    body: 'Bespoke tools and platforms for the care sector, the same capability behind our own products, CareStream and CareAssura.',
    href: '/development',
  },
]
