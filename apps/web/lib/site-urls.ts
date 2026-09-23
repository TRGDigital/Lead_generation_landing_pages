import { getAllPublishedSlugs, getCategories, getActiveCareHomeSlugs } from '@/lib/blog'
import { SECTORS, COLLECTION_SERVICES } from '@/lib/sectors'

// Single source of truth for every canonical, indexable URL on the marketing site.
// Used by the XML sitemap AND the "submit all pages to RalfyIndex" admin action, so the
// two can never drift apart.

export type StaticPage = {
  url: string
  priority: number
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

export const STATIC_PAGES: StaticPage[] = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' },
  { url: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/our-commitment', priority: 0.5, changeFrequency: 'yearly' },
  { url: '/book-a-demo', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/work', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/work/crossways-care-home', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/work/ferndale-nursing-home', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/seo', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/local-seo', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/google-business-profile', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/refer', priority: 0.5, changeFrequency: 'monthly' },
  { url: '/content-creation', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/conversion-rate-optimisation', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/website-development', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/website-build', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/designs', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/designs/oakfield-house', priority: 0.6, changeFrequency: 'monthly' },
  { url: '/designs/brightpath-care', priority: 0.6, changeFrequency: 'monthly' },
  { url: '/designs/st-aidans', priority: 0.6, changeFrequency: 'monthly' },
  { url: '/blog/topics/filling-empty-beds', priority: 0.7, changeFrequency: 'weekly' },
  { url: '/blog/topics/being-found-locally', priority: 0.7, changeFrequency: 'weekly' },
  { url: '/blog/topics/care-websites', priority: 0.7, changeFrequency: 'weekly' },
  { url: '/carer-recruitment', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/accessible-websites', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/care-tools', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/marketing', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/development', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/rebranding', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/tools', priority: 0.8, changeFrequency: 'monthly' },
  { url: '/tools/funding-calculator', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/tools/empty-bed-calculator', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/tools/website-grader', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/tools/cqc-rating-checker', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/tools/google-preview', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/tools/care-schema-generator', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/contact', priority: 0.7, changeFrequency: 'monthly' },
  { url: '/blog', priority: 0.9, changeFrequency: 'daily' },
  { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  { url: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
]

// Every dynamic path (blog posts, categories, care homes, sector hubs + matrix pages).
export async function getDynamicPaths(): Promise<string[]> {
  const [blogSlugs, categories, careHomeSlugs] = await Promise.all([
    getAllPublishedSlugs(),
    getCategories(),
    getActiveCareHomeSlugs(),
  ])

  return [
    ...blogSlugs.map((slug) => `/blog/${slug}`),
    ...categories.map((cat) => `/blog/category/${encodeURIComponent(cat)}`),
    ...careHomeSlugs.map((slug) => `/care/${slug}`),
    ...SECTORS.flatMap((s) => [
      `/${s.slug}`,
      ...COLLECTION_SERVICES.map((svc) => `/${s.slug}/${svc.slug}`),
    ]),
  ]
}

// Absolute URLs for every page on the site, de-duplicated. Used for bulk RalfyIndex submits.
export async function getAllSiteUrls(siteUrl: string): Promise<string[]> {
  const paths = [...STATIC_PAGES.map((p) => p.url), ...(await getDynamicPaths())]
  return [...new Set(paths)].map((p) => `${siteUrl}${p}`)
}
