// Registry of editable marketing pages, used by /admin/seo to list every page whose
// title, description and canonical can be overridden. Blog posts are excluded (they have
// their own per-post SEO fields). Keep paths in sync with the (marketing) routes.

import { SECTORS, COLLECTION_SERVICES } from '@/lib/sectors'

export type SitePage = { path: string; label: string; group: string }

const STATIC_PAGES: SitePage[] = [
  { path: '/', label: 'Home', group: 'Main' },
  { path: '/about', label: 'About', group: 'Main' },
  { path: '/how-it-works', label: 'How it works', group: 'Main' },
  { path: '/contact', label: 'Contact', group: 'Main' },
  { path: '/blog', label: 'Blog index', group: 'Main' },
  { path: '/refer', label: 'Refer a home', group: 'Main' },

  { path: '/marketing', label: 'Marketing', group: 'Services' },
  { path: '/seo', label: 'SEO', group: 'Services' },
  { path: '/local-seo', label: 'Local SEO', group: 'Services' },
  { path: '/google-business-profile', label: 'Google Profile & Reviews', group: 'Services' },
  { path: '/content-creation', label: 'Content creation', group: 'Services' },
  { path: '/conversion-rate-optimisation', label: 'Conversion rate optimisation', group: 'Services' },
  { path: '/website-development', label: 'Website development', group: 'Services' },
  { path: '/care-tools', label: 'Care tools & technology', group: 'Services' },
  { path: '/development', label: 'Software development', group: 'Services' },
  { path: '/rebranding', label: 'Rebranding', group: 'Services' },

  { path: '/tools', label: 'Free tools hub', group: 'Tools' },
  { path: '/tools/funding-calculator', label: 'Funding calculator', group: 'Tools' },
  { path: '/tools/website-grader', label: 'Website grader', group: 'Tools' },
  { path: '/tools/google-preview', label: 'Google preview', group: 'Tools' },
  { path: '/tools/cqc-rating-checker', label: 'CQC rating checker', group: 'Tools' },
  { path: '/tools/empty-bed-calculator', label: 'Empty bed calculator', group: 'Tools' },
  { path: '/tools/care-home-dependency-tool', label: 'Care home dependency tool', group: 'Tools' },
  { path: '/tools/staffing-calculator', label: 'Staffing calculator', group: 'Tools' },
  { path: '/tools/agency-staff-cost-calculator', label: 'Agency cost calculator', group: 'Tools' },
  { path: '/tools/staff-turnover-cost-calculator', label: 'Staff turnover cost calculator', group: 'Tools' },
  { path: '/tools/care-fee-break-even-calculator', label: 'Fee break-even calculator', group: 'Tools' },
  { path: '/tools/cqc-inspection-readiness', label: 'CQC inspection readiness', group: 'Tools' },
  { path: '/tools/mandatory-training-checker', label: 'Mandatory training checker', group: 'Tools' },
  { path: '/tools/funding-mix-calculator', label: 'LA vs private funding mix', group: 'Tools' },
  { path: '/tools/care-schema-generator', label: 'Care schema generator', group: 'Tools' },

  { path: '/privacy', label: 'Privacy', group: 'Legal' },
  { path: '/terms', label: 'Terms', group: 'Legal' },
  { path: '/cookies', label: 'Cookies', group: 'Legal' },
]

// Programmatic "who we serve" collection pages: each sector hub + its service pages,
// grouped by sector so they're easy to find and edit in /admin/seo.
const SECTOR_PAGES: SitePage[] = SECTORS.flatMap((s) => [
  { path: `/${s.slug}`, label: `${s.name} (hub)`, group: s.name },
  ...COLLECTION_SERVICES.map((svc) => ({ path: `/${s.slug}/${svc.slug}`, label: `${svc.name}`, group: s.name })),
])

export const SITE_PAGES: SitePage[] = [...STATIC_PAGES, ...SECTOR_PAGES]

export const SITE_PAGE_GROUPS: string[] = ['Main', 'Services', 'Tools', 'Legal', ...SECTORS.map((s) => s.name)]
