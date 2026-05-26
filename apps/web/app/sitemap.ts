import type { MetadataRoute } from 'next'
import { getAllPublishedSlugs, getCategories } from '@/lib/blog'
import { getActiveCareHomeSlugs } from '@/lib/blog'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

const STATIC_PAGES = [
  { url: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { url: '/how-it-works', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/pricing', priority: 0.8, changeFrequency: 'monthly' as const },
  { url: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  { url: '/blog', priority: 0.9, changeFrequency: 'daily' as const },
  { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  { url: '/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, categories, careHomeSlugs] = await Promise.all([
    getAllPublishedSlugs(),
    getCategories(),
    getActiveCareHomeSlugs(),
  ])

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(({ url, priority, changeFrequency }) => ({
    url: `${SITE_URL}${url}`,
    priority,
    changeFrequency,
    lastModified: new Date(),
  }))

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    priority: 0.7,
    changeFrequency: 'monthly' as const,
    lastModified: new Date(),
  }))

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/blog/category/${encodeURIComponent(cat)}`,
    priority: 0.6,
    changeFrequency: 'weekly' as const,
    lastModified: new Date(),
  }))

  const careHomeEntries: MetadataRoute.Sitemap = careHomeSlugs.map((slug) => ({
    url: `${SITE_URL}/care/${slug}`,
    priority: 0.5,
    changeFrequency: 'weekly' as const,
    lastModified: new Date(),
  }))

  return [...staticEntries, ...blogEntries, ...categoryEntries, ...careHomeEntries]
}
