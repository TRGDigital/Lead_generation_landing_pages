import type { County, CountyStats } from '@/lib/locations'
import { hasTowns, mainTown, pctNoWebsite } from '@/lib/locations'

// The path, title, description and canonical for every county page, in one place.
//
// The pages call this from generateMetadata and the admin calls it to show what each page
// writes for itself, so the placeholder in /admin/blog is always exactly what is live
// rather than an approximation of it.
//
// Titles never contain "TRG Digital": the root layout appends it to string titles, and a
// title that already carries the brand ends up with it twice. Canonicals never carry a
// trailing slash, because the trailing slash form redirects.

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export type CountyPageKind = 'hub' | 'website' | 'seo'

export const COUNTY_PAGE_KINDS: { kind: CountyPageKind; label: 'Hub' | 'New website' | 'SEO' }[] = [
  { kind: 'hub', label: 'Hub' },
  { kind: 'website', label: 'New website' },
  { kind: 'seo', label: 'SEO' },
]

export function countyPath(kind: CountyPageKind, slug: string) {
  if (kind === 'website') return `/care-website-design/${slug}`
  if (kind === 'seo') return `/care-seo/${slug}`
  return `/locations/${slug}`
}

export function countySeo(kind: CountyPageKind, county: County, stats: CountyStats) {
  const path = countyPath(kind, county.slug)
  const canonical = `${SITE_URL}${path}`
  const busiest = mainTown(stats)

  if (kind === 'website') {
    return {
      path,
      canonical,
      title: `New Care Website Design in ${county.name}`,
      description: `Care home, nursing home and home care websites built from scratch for providers in ${county.name}. ${stats.noWebsite} of the ${stats.services} registered services here have no website at all. Fixed price, ${county.name} based.`,
    }
  }

  if (kind === 'seo') {
    return {
      path,
      canonical,
      title: `Care SEO in ${county.name}`,
      description: `Local SEO for care homes, nursing homes and home care providers in ${county.name}. ${stats.services} registered services${hasTowns(stats) ? ` across ${stats.towns} towns` : ''}${busiest ? `, ${busiest.services} of them in ${busiest.name} alone` : ''}. Ranked by town, reported in enquiries.`,
    }
  }

  return {
    path,
    canonical,
    title: `Care Website Design & SEO in ${county.name}`,
    description: `Websites and search for care providers across ${county.name}. ${stats.services} care services here, ${pctNoWebsite(stats)}% with no website at all. Free 60-second check.`,
  }
}
