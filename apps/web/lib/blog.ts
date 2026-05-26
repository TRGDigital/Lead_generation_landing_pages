import { createServiceClient } from '@/lib/supabase/server'
import type { Tables } from '@db/types'

export type BlogPost = Tables<'blog_posts'>
export type Author = Tables<'authors'>

export type PostWithAuthor = BlogPost & { author: Author | null }

const PAGE_SIZE = 10

export function calcReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function getPublishedPosts(
  page = 1,
  category?: string
): Promise<{ posts: PostWithAuthor[]; total: number }> {
  const db = createServiceClient() as unknown as any
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let q = db
    .from('blog_posts')
    .select('*, author:authors(*)', { count: 'exact' })
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(from, to)

  if (category) q = q.eq('category', category)

  const { data, count } = await q
  return { posts: (data ?? []) as PostWithAuthor[], total: count ?? 0 }
}

export async function getPostBySlug(slug: string): Promise<PostWithAuthor | null> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('blog_posts')
    .select('*, author:authors(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data as PostWithAuthor | null
}

export async function getRelatedPosts(
  category: string | null,
  excludeId: string
): Promise<PostWithAuthor[]> {
  if (!category) return []
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('blog_posts')
    .select('*, author:authors(*)')
    .eq('is_published', true)
    .eq('category', category)
    .neq('id', excludeId)
    .order('published_at', { ascending: false })
    .limit(3)
  return (data ?? []) as PostWithAuthor[]
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('blog_posts')
    .select('slug')
    .eq('is_published', true)
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug)
}

export async function getCategories(): Promise<string[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('blog_posts')
    .select('category')
    .eq('is_published', true)
    .not('category', 'is', null)
  const cats = ((data ?? []) as { category: string }[]).map((r) => r.category)
  return [...new Set(cats)].sort()
}

export async function getAllPostsForAdmin(): Promise<PostWithAuthor[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('blog_posts')
    .select('*, author:authors(*)')
    .order('updated_at', { ascending: false })
  return (data ?? []) as PostWithAuthor[]
}

export async function getPostByIdForAdmin(id: string): Promise<PostWithAuthor | null> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('blog_posts')
    .select('*, author:authors(*)')
    .eq('id', id)
    .single()
  return data as PostWithAuthor | null
}

export async function getAllAuthors(): Promise<Author[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('authors').select('*').order('name')
  return (data ?? []) as Author[]
}

export async function getActiveCareHomeSlugs(): Promise<string[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('care_homes')
    .select('slug')
    .eq('is_active', true)
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug)
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}
