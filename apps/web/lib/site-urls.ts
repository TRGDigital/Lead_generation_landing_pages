import { getAllPublishedSlugs, getCategories, getActiveCareHomeSlugs } from '@/lib/blog'
import { SECTORS, COLLECTION_SERVICES } from '@/lib/sectors'
import { countySlugs } from '@/lib/locations'
import { DESIGNS } from '@/lib/designs'
import { CASE_STUDIES } from '@/lib/case-studies'
import { TOPICS } from '@/lib/blog-topics'
import { TOOLS } from '@/lib/tools'
import { COMPARISONS } from '@/lib/comparisons'
import staticRoutes from '@/lib/generated/static-routes.json'

// Single source of truth for every canonical, indexable URL on the marketing site.
// Used by the XML sitemap AND the RalfyIndex submits (manual + auto), so they can never drift.
//
// Nothing here needs editing when a page is added:
// - static pages are discovered from app/(marketing) by scripts/gen-static-routes.mjs at build
// - blog posts, categories and counties come from the database
// - tools, comparisons, designs, case studies and topics come from their registries in lib/

export type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export type SiteUrl = {
  url: string
  priority: number
  changeFrequency: ChangeFrequency
}

// Only pages that differ from the 0.8 / monthly default.
const OVERRIDES: Record<string, Omit<SiteUrl, 'url'>> = {
  '/': { priority: 1.0, changeFrequency: 'weekly' },
  '/blog': { priority: 0.9, changeFrequency: 'daily' },
  '/site-audit': { priority: 0.9, changeFrequency: 'monthly' },
  '/about': { priority: 0.7, changeFrequency: 'monthly' },
  '/contact': { priority: 0.7, changeFrequency: 'monthly' },
  '/why-a-care-specialist': { priority: 0.7, changeFrequency: 'monthly' },
  '/our-commitment': { priority: 0.5, changeFrequency: 'yearly' },
  '/refer': { priority: 0.5, changeFrequency: 'monthly' },
  '/privacy': { priority: 0.3, changeFrequency: 'yearly' },
  '/terms': { priority: 0.3, changeFrequency: 'yearly' },
  '/cookies': { priority: 0.3, changeFrequency: 'yearly' },
}

const page = (url: string, priority = 0.8, changeFrequency: ChangeFrequency = 'monthly'): SiteUrl => ({
  url,
  ...(OVERRIDES[url] ?? { priority, changeFrequency }),
})

export async function getSiteUrls(): Promise<SiteUrl[]> {
  const [blogSlugs, categories, careHomeSlugs, counties] = await Promise.all([
    getAllPublishedSlugs(),
    getCategories(),
    getActiveCareHomeSlugs(),
    countySlugs(),
  ])

  const all: SiteUrl[] = [
    ...(staticRoutes as string[]).map((url) => page(url, url.startsWith('/tools/') ? 0.7 : 0.8)),
    ...TOOLS.map((t) => page(t.href, 0.7)),
    ...COMPARISONS.map((c) => page(`/compare/${c.slug}`, 0.7)),
    ...DESIGNS.map((d) => page(`/designs/${d.slug}`, 0.6)),
    ...CASE_STUDIES.map((c) => page(`/work/${c.slug}`, 0.7)),
    ...TOPICS.map((t) => page(`/blog/topics/${t.slug}`, 0.7, 'weekly')),
    ...blogSlugs.map((slug) => page(`/blog/${slug}`, 0.7)),
    ...categories.map((cat) => page(`/blog/category/${encodeURIComponent(cat)}`, 0.6, 'weekly')),
    ...careHomeSlugs.map((slug) => page(`/care/${slug}`, 0.5, 'weekly')),
    // "Who we serve" sector hubs plus the service × sector matrix.
    ...SECTORS.flatMap((s) => [
      page(`/${s.slug}`, 0.75),
      ...COLLECTION_SERVICES.map((svc) => page(`/${s.slug}/${svc.slug}`, 0.65)),
    ]),
    // County hub plus the two service pages per county.
    ...counties.flatMap((slug) => [
      page(`/locations/${slug}`, 0.7),
      page(`/care-website-design/${slug}`, 0.8),
      page(`/care-seo/${slug}`, 0.8),
    ]),
  ]

  // First entry wins, so a page listed twice keeps its more specific settings.
  const seen = new Set<string>()
  return all.filter((u) => !seen.has(u.url) && seen.add(u.url))
}

// Absolute URLs for every page on the site. Used for bulk RalfyIndex submits.
export async function getAllSiteUrls(siteUrl: string): Promise<string[]> {
  return (await getSiteUrls()).map((u) => `${siteUrl}${u.url}`)
}
