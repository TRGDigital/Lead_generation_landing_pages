import type { MetadataRoute } from 'next'
import { getSiteUrls } from '@/lib/site-urls'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  return (await getSiteUrls()).map(({ url, priority, changeFrequency }) => ({
    url: `${SITE_URL}${url}`,
    priority,
    changeFrequency,
    lastModified,
  }))
}
