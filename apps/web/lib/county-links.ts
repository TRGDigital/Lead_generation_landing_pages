import { liveCounties, type County } from '@/lib/locations'
import { TOWN_COORDS, type LatLng } from '@/lib/data/town-coords'

// How the county pages link to each other and to the rest of the site. Everything reads the
// live list, so a county the publishing cron switches on appears in the hub, the footer
// hub, the "nearby" blocks and the service page blocks without a deploy.

export type CountyKind = 'locations' | 'seo' | 'website'

export const COUNTY_PAGE: Record<CountyKind, { prefix: string; label: (name: string) => string }> = {
  locations: { prefix: '/locations', label: (n) => `The care market in ${n}` },
  website: { prefix: '/care-website-design', label: (n) => `Care websites in ${n}` },
  seo: { prefix: '/care-seo', label: (n) => `Care SEO in ${n}` },
}

export const countyHref = (kind: CountyKind, slug: string) => `${COUNTY_PAGE[kind].prefix}/${slug}`

/** Every live county, A to Z. */
export async function liveCountyList(): Promise<County[]> {
  try {
    return Object.values(await liveCounties()).sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    // A failed read must not take the service pages down with it; the blocks just hide.
    return []
  }
}

/** The middle of a county's towns, from the geocoded town list. Null when it has none. */
function centre(county: County): LatLng | null {
  const towns = Object.values(TOWN_COORDS[county.dataSlug ?? county.slug] ?? {})
  if (towns.length === 0) return null
  const lat = towns.reduce((s, t) => s + t[0], 0) / towns.length
  const lng = towns.reduce((s, t) => s + t[1], 0) / towns.length
  return [lat, lng]
}

// Rough distance in km. Plenty for ranking neighbours; nobody sees the number.
function km(a: LatLng, b: LatLng): number {
  const x = (b[1] - a[1]) * Math.cos(((a[0] + b[0]) / 2) * (Math.PI / 180))
  const y = b[0] - a[0]
  return Math.sqrt(x * x + y * y) * 111
}

/** The live counties nearest to this one, closest first. */
export async function nearbyCounties(county: County, count = 3): Promise<County[]> {
  const here = centre(county)
  if (!here) return []
  const others = (await liveCountyList()).filter((c) => c.slug !== county.slug)
  return others
    .map((c) => ({ c, at: centre(c) }))
    .filter((x): x is { c: County; at: LatLng } => x.at !== null)
    .sort((a, b) => km(here, a.at) - km(here, b.at))
    .slice(0, count)
    .map((x) => x.c)
}
