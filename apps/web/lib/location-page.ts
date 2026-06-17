import { createServiceClient } from '@/lib/supabase/server'

export type LocationContent = {
  hero?: { eyebrow?: string; headline?: string; subheadline?: string; bullets?: string[] }
  stats?: { value: string; label: string }[]
  howItWorks?: { eyebrow?: string; heading?: string; steps?: { title: string; body: string }[] }
  whyUs?: { heading?: string; points?: { title: string; body: string }[] }
  faq?: { question: string; answer: string }[]
  careTypes?: string[]
  timeframes?: string[]
}

export type LocationPage = {
  slug: string
  area_name: string
  meta_title: string | null
  meta_description: string | null
  content: LocationContent
  question_set: string
}

export async function getLocationPage(slug: string): Promise<LocationPage | null> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('location_pages')
    .select('slug, area_name, meta_title, meta_description, content, question_set')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return (data as LocationPage | null) ?? null
}

export async function getAllLocationSlugs(): Promise<string[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('location_pages').select('slug').eq('status', 'published')
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug)
}
