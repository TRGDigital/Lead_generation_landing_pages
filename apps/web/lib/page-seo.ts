import { unstable_cache } from 'next/cache'
import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase/server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

// Per-page SEO overrides for the marketing site, editable in /admin/seo. Each marketing
// page calls applyPageSeo('<path>', defaults) from generateMetadata; any fields set in
// the page_seo table win over the page's built-in defaults. Cached and tagged so edits
// go live via revalidateTag('page-seo') on save.

export type PageSeoRow = {
  path: string
  title: string | null
  description: string | null
  canonical: string | null
  og_image: string | null
}

const loadAll = unstable_cache(
  async (): Promise<Record<string, PageSeoRow>> => {
    const db = createServiceClient() as unknown as any
    const { data } = await db.from('page_seo').select('path, title, description, canonical, og_image')
    const map: Record<string, PageSeoRow> = {}
    for (const r of (data ?? []) as PageSeoRow[]) map[r.path] = r
    return map
  },
  ['page-seo-all'],
  { tags: ['page-seo'], revalidate: 3600 },
)

export async function getPageSeoMap(): Promise<Record<string, PageSeoRow>> {
  return loadAll()
}

// The site-wide default social share image (og:image) used whenever a page has no
// image of its own. Set in /admin/seo; stored under the sentinel path '__site__'.
// Falls back to a TRG-branded asset so shares are never broken/irrelevant.
export const SITE_OG_FALLBACK = `${SITE_URL}/trg-digital-2025.png`

export async function getSiteOgImage(): Promise<string> {
  try {
    const o = (await loadAll())['__site__']
    if (o?.og_image) return o.og_image
  } catch { /* fall through */ }
  return SITE_OG_FALLBACK
}

export async function applyPageSeo(path: string, defaults: Metadata): Promise<Metadata> {
  let o: PageSeoRow | undefined
  try {
    o = (await loadAll())[path]
  } catch {
    o = undefined
  }

  const md: Metadata = { ...defaults }
  if (o?.title) md.title = o.title
  if (o?.description) md.description = o.description

  // Always emit a canonical: admin override > the page's own default > a self-referencing
  // URL built from the path. This guarantees every editable page has a canonical tag.
  const existing = typeof defaults.alternates?.canonical === 'string' ? defaults.alternates.canonical : undefined
  const canonical = o?.canonical || existing || `${SITE_URL}${path === '/' ? '' : path}`
  md.alternates = { ...(defaults.alternates ?? {}), canonical }

  // Resolve the social image: this page's admin override > the page's built-in
  // openGraph image > the site-wide default. This guarantees every page shares a
  // relevant, working image (never the missing /og-home.jpg).
  const pageDefaultImages = (defaults.openGraph as any)?.images
  const ogImage = o?.og_image || undefined
  const images = ogImage ? [ogImage] : (pageDefaultImages ?? [await getSiteOgImage()])

  md.openGraph = {
    ...(defaults.openGraph ?? {}),
    ...(o?.title ? { title: o.title } : {}),
    ...(o?.description ? { description: o.description } : {}),
    images,
  }
  // Mirror onto the Twitter card so LinkedIn/X and others all get a large image.
  md.twitter = {
    card: 'summary_large_image',
    ...(defaults.twitter ?? {}),
    ...(o?.title ? { title: o.title } : {}),
    ...(o?.description ? { description: o.description } : {}),
    images,
  } as Metadata['twitter']

  return md
}
