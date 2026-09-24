'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { toSlug, calcReadingMinutes } from '@/lib/blog'
import { submitToRalfyIndex } from '@/lib/ralfyindex'
import { recordSubmittedUrls } from '@/lib/ralfy-submitted'

const postSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  excerpt: z.string().max(500).optional(),
  body_mdx: z.string().optional(),
  category: z.string().max(100).optional(),
  tags: z.string().optional(), // comma-separated
  author_id: z.string().uuid().optional().nullable(),
  hero_image_url: z.string().url().optional().nullable().or(z.literal('')),
  hero_image_alt: z.string().max(300).optional().nullable(),
  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),
  canonical_url: z.string().url().optional().nullable().or(z.literal('')),
  faqs: z.string().optional(), // JSON array of { q, a }
  related_slugs: z.string().optional(), // comma-separated slugs, empty = automatic
  service_links: z.string().optional(), // comma-separated paths, empty = the default four
})

const faqsSchema = z.array(z.object({ q: z.string().min(1), a: z.string().min(1) })).max(5)

function parseFaqs(raw?: string): { q: string; a: string }[] {
  if (!raw) return []
  try {
    const result = faqsSchema.safeParse(JSON.parse(raw))
    return result.success
      ? result.data.map((f) => ({ q: f.q.trim(), a: f.a.trim() })).filter((f) => f.q && f.a)
      : []
  } catch {
    return []
  }
}

export type SaveResult = { ok: true } | { ok: false; error: string }

export async function saveBlogPost(
  postId: string | null,
  formData: FormData,
): Promise<SaveResult> {
  await requireAdmin()

  const raw = Object.fromEntries(formData.entries())
  const parsed = postSchema.safeParse(raw)
  if (!parsed.success) {
    // Name the fields. Next hides the message of a thrown server action error in
    // production, so anything thrown here reaches the admin as "an error occurred".
    const fields = Object.entries(parsed.error.flatten().fieldErrors)
      .map(([field, errs]) => `${field} (${(errs ?? []).join(', ')})`)
      .join('; ')
    return { ok: false, error: `Check these fields: ${fields || 'unknown field'}` }
  }

  const { title, body_mdx = '', ...rest } = parsed.data
  const slug = rest.slug || toSlug(title)
  const reading_minutes = calcReadingMinutes(body_mdx)
  const tags = rest.tags
    ? rest.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const list = (raw?: string) =>
    raw ? raw.split(',').map((v) => v.trim()).filter(Boolean) : []

  const payload = {
    title,
    slug,
    // NOT NULL in the database, with an empty-string default: passing null overrides
    // the default and the insert fails, which is what an empty excerpt box used to do.
    excerpt: rest.excerpt ?? '',
    body_mdx,
    category: rest.category ?? null,
    tags,
    author_id: rest.author_id ?? null,
    hero_image_url: rest.hero_image_url || null,
    hero_image_alt: rest.hero_image_alt ?? null,
    meta_title: rest.meta_title ?? null,
    meta_description: rest.meta_description ?? null,
    canonical_url: rest.canonical_url || null,
    faqs: parseFaqs(rest.faqs),
    related_slugs: list(rest.related_slugs).slice(0, 3),
    service_links: list(rest.service_links),
    reading_minutes,
    updated_at: new Date().toISOString(),
  }

  const db = createServiceClient() as unknown as any

  let newId = ''
  if (postId) {
    const { error } = await db.from('blog_posts').update(payload).eq('id', postId)
    if (error) return { ok: false, error: error.message }
  } else {
    const { data, error } = await db
      .from('blog_posts')
      .insert({ ...payload, is_published: false })
      .select('id')
      .single()
    if (error) return { ok: false, error: error.message }
    newId = data.id as string
  }

  revalidatePath('/admin/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/blog')
  // redirect() throws NEXT_REDIRECT internally, so it stays out of any try/catch and
  // happens once everything else has succeeded.
  if (newId) redirect(`/admin/blog/${newId}/edit`)
  return { ok: true }
}

export async function publishBlogPost(postId: string) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { data, error } = await db
    .from('blog_posts')
    .update({ is_published: true, published_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', postId)
    .select('slug')
    .single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')

  // Auto-submit the new post to RalfyIndex for faster indexing, and record it so the
  // deploy-time auto-indexer never re-submits the same URL.
  if (data?.slug) {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
    const urls = [`${base}/blog/${data.slug}`, `${base}/blog`]
    const res = await submitToRalfyIndex(urls, `TRG blog ${data.slug}`)
    if (res.ok) await recordSubmittedUrls(urls)
  }
}

export async function unpublishBlogPost(postId: string) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('blog_posts')
    .update({ is_published: false, updated_at: new Date().toISOString() })
    .eq('id', postId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
}

export async function deleteBlogPost(postId: string) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('blog_posts').delete().eq('id', postId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
}
