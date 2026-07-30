'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { getAllSiteUrls } from '@/lib/site-urls'
import { submitToRalfyIndex } from '@/lib/ralfyindex'
import { filterUnsubmittedUrls, recordSubmittedUrls } from '@/lib/ralfy-submitted'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

// Submit any pages we have not submitted before (static, blog, categories, care homes, sector
// + matrix). Only NEW URLs are sent, so this never re-pushes the whole site. RalfyIndex bills
// per URL, and re-submitting already-indexed pages wastes credits.
export async function submitAllPagesToRalfyIndex(): Promise<{
  ok: boolean
  count: number
  creditsUsed?: number
  error?: string
}> {
  await requireAdmin()
  const fresh = await filterUnsubmittedUrls(await getAllSiteUrls(SITE_URL))
  if (!fresh.length) return { ok: true, count: 0 }
  const res = await submitToRalfyIndex(fresh, 'TRG Digital, new pages')
  if (res.ok) await recordSubmittedUrls(fresh)
  return { ok: res.ok, count: fresh.length, creditsUsed: res.creditsUsed, error: res.error }
}

export async function savePageSeo(path: string, formData: FormData) {
  await requireAdmin()
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const canonical = String(formData.get('canonical') ?? '').trim()

  const db = createServiceClient() as unknown as any
  const { error } = await db.from('page_seo').upsert(
    {
      path,
      title: title || null,
      description: description || null,
      canonical: canonical || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'path' },
  )
  if (error) throw new Error(error.message)

  // Refresh the cached overrides and regenerate the affected page's metadata.
  revalidateTag('page-seo')
  revalidatePath(path)
  revalidatePath('/admin/seo')
}

// The site-wide default social share image (og:image), stored under the sentinel
// path '__site__'. Used on the homepage and any page without its own image.
export async function saveSiteOgImage(formData: FormData) {
  await requireAdmin()
  const url = String(formData.get('og_image') ?? '').trim()
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('page_seo').upsert(
    { path: '__site__', og_image: url || null, updated_at: new Date().toISOString() },
    { onConflict: 'path' },
  )
  if (error) throw new Error(error.message)

  // Refresh cached SEO + regenerate the homepage and any page using the default.
  revalidateTag('page-seo')
  revalidatePath('/', 'layout')
  revalidatePath('/admin/seo')
}

// The blog author entity (name, role, bio, photo, LinkedIn). Powers the byline,
// the author card and the Person / author schema on every blog post.
export async function saveAuthor(id: string, formData: FormData) {
  await requireAdmin()
  const name = String(formData.get('name') ?? '').trim()
  const title = String(formData.get('title') ?? '').trim()
  const bio = String(formData.get('bio') ?? '').trim()
  const linkedin_url = String(formData.get('linkedin_url') ?? '').trim()
  const avatar_url = String(formData.get('avatar_url') ?? '').trim()
  if (!name) throw new Error('Author name is required.')

  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('authors')
    .update({
      name,
      title: title || null,
      bio: bio || null,
      linkedin_url: linkedin_url || null,
      avatar_url: avatar_url || null,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)

  // Every blog post embeds the author, so refresh the whole blog subtree.
  revalidatePath('/blog', 'layout')
  revalidatePath('/admin/seo')
}

export async function saveImageAlt(src: string, formData: FormData) {
  await requireAdmin()
  const alt = String(formData.get('alt') ?? '').trim().slice(0, 300)
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('image_alts').upsert(
    { src, alt, updated_at: new Date().toISOString() },
    { onConflict: 'src' },
  )
  if (error) throw new Error(error.message)
  // Refresh the cached alt map so the change shows on the site.
  revalidateTag('image-alts')
  revalidatePath('/admin/seo')
}
