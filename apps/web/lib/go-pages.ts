import { createServiceClient } from '@/lib/supabase/server'

// TRG Google Ads landing pages (trgdigital.co.uk/go/<slug>) — one per service,
// each with a gamified qualification quiz. Managed in /admin/go-pages.

export type GoQuizQuestion = { q: string; options: string[] }
export type GoProofStat = { stat: string; label: string }
export type GoFaq = { q: string; a: string }
export type GoReview = { quote: string; name: string; role: string }

export type GoPage = {
  id: string
  slug: string
  service: string
  status: 'draft' | 'published'
  headline: string
  subheadline: string
  bullets: string[]
  proof: GoProofStat[]
  faqs: GoFaq[]
  quiz_intro: string
  questions: GoQuizQuestion[]
  cta_label: string
  reviews: GoReview[]
  founder_note: string
  risk_reversal: string
  exit_heading: string
  exit_body: string
  sticky_cta: string
  meta_title: string
  meta_description: string
  notify_emails: string[]
}

export async function getGoPage(slug: string): Promise<GoPage | null> {
  if (!slug) return null
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('trg_go_pages').select('*').eq('slug', slug).maybeSingle()
  return (data as GoPage) ?? null
}

export async function getAllGoPages(): Promise<GoPage[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('trg_go_pages').select('*').order('service', { ascending: true })
  return (data as GoPage[]) ?? []
}
