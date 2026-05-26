'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { toSlug, calcReadingMinutes } from '@/lib/blog'

const postSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(),
  excerpt: z.string().max(500).optional(),
  body_mdx: z.string().optional(),
  category: z.string().max(100).optional(),
  tags: z.string().optional(), // comma-separated
  author_id: z.string().uuid().optional().nullable(),
  hero_image_url: z.string().url().optional().nullable().or(z.literal('')),
  meta_title: z.string().max(255).optional().nullable(),
  meta_description: z.string().max(500).optional().nullable(),
  canonical_url: z.string().url().optional().nullable().or(z.literal('')),
})

export async function saveBlogPost(postId: string | null, formData: FormData) {
  await requireAdmin()

  const raw = Object.fromEntries(formData.entries())
  const parsed = postSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error('Invalid form data: ' + JSON.stringify(parsed.error.flatten()))
  }

  const { title, body_mdx = '', ...rest } = parsed.data
  const slug = rest.slug || toSlug(title)
  const reading_minutes = calcReadingMinutes(body_mdx)
  const tags = rest.tags
    ? rest.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const payload = {
    title,
    slug,
    excerpt: rest.excerpt ?? null,
    body_mdx,
    category: rest.category ?? null,
    tags,
    author_id: rest.author_id ?? null,
    hero_image_url: rest.hero_image_url || null,
    meta_title: rest.meta_title ?? null,
    meta_description: rest.meta_description ?? null,
    canonical_url: rest.canonical_url || null,
    reading_minutes,
    updated_at: new Date().toISOString(),
  }

  const db = createServiceClient() as unknown as any

  if (postId) {
    const { error } = await db.from('blog_posts').update(payload).eq('id', postId)
    if (error) throw new Error(error.message)
  } else {
    const { data, error } = await db
      .from('blog_posts')
      .insert({ ...payload, is_published: false })
      .select('id')
      .single()
    if (error) throw new Error(error.message)
    revalidatePath('/admin/blog')
    redirect(`/admin/blog/${data.id}/edit`)
  }

  revalidatePath('/admin/blog')
  revalidatePath(`/blog/${slug}`)
  revalidatePath('/blog')
}

export async function publishBlogPost(postId: string) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('blog_posts')
    .update({ is_published: true, published_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', postId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/blog')
  revalidatePath('/blog')
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
