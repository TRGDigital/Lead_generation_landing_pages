import { createServiceClient } from '@/lib/supabase/server'
import type { Tables } from '@db/types'

export type BlogPost = Tables<'blog_posts'>
export type Author = Tables<'authors'>

export type PostWithAuthor = BlogPost & { author: Author | null }

const PAGE_SIZE = 10

export function calcReadingMinutes(body: string): number {
  const text = body.replace(/<[^>]+>/g, ' ').trim()
  const words = text ? text.split(/\s+/).length : 0
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

// Recommendations at the foot of a post.
//
// Category alone is too thin here: 18 posts across 8 categories left four posts with no
// recommendations at all and several with one. This scores every other published post on
// shared tags first, then category, then words shared with the title, and always returns
// three, falling back to the most recent posts. So no post is ever a dead end.
const STOP_WORDS = new Set([
  'the','and','for','with','your','you','are','that','what','why','how','from','into','their','this','does','do',
  'a','an','of','in','on','to','is','it','be','can','care','home','homes','nursing','digital','trg','guide','actually',
])

function keywords(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w))
}

function normalise(values: string[] | null | undefined): string[] {
  return (values ?? []).map((v) => v.trim().toLowerCase()).filter(Boolean)
}

export function scoreRelated(post: PostWithAuthor, candidates: PostWithAuthor[], limit = 3): PostWithAuthor[] {
  const tags = new Set(normalise(post.tags))
  const category = (post.category ?? '').trim().toLowerCase()
  const words = new Set(keywords(post.title))

  const scored = candidates
    .filter((c) => c.id !== post.id)
    .map((c) => {
      let score = 0
      for (const t of normalise(c.tags)) if (tags.has(t)) score += 3
      if (category && (c.category ?? '').trim().toLowerCase() === category) score += 2
      let shared = 0
      for (const w of keywords(c.title)) if (words.has(w) && shared < 3) { score += 1; shared++ }
      return { post: c, score, when: c.published_at ?? '' }
    })
    .sort((a, b) => b.score - a.score || (a.when < b.when ? 1 : -1))

  return scored.slice(0, limit).map((s) => s.post)
}

export async function getRelatedPostsFor(post: PostWithAuthor, limit = 3): Promise<PostWithAuthor[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('blog_posts')
    .select('*, author:authors(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(200)
  return scoreRelated(post, (data ?? []) as PostWithAuthor[], limit)
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
