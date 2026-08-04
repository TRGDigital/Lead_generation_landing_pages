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
  plan_items: string[]
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

// ── Quiz performance (Performance tab in /admin/go-pages) ────────────────────
export type GoQuestionStat = {
  question: string
  answered: number
  dropOffPct: number // % of quiz starters lost BY this question
  options: Array<{ option: string; count: number; pct: number }>
}
export type GoQuizStats = {
  views: number
  starts: number
  contacts: number
  submits: number
  questions: GoQuestionStat[]
}

export async function getGoQuizStats(slug: string, pageQuestions: GoQuizQuestion[]): Promise<GoQuizStats> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('go_quiz_events')
    .select('session_id, event, question, option')
    .eq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(20000)
  const rows = (data as Array<{ session_id: string; event: string; question: string | null; option: string | null }>) ?? []

  const uniq = (event: string) => new Set(rows.filter(r => r.event === event).map(r => r.session_id)).size
  const views = uniq('view')
  const starts = uniq('start')
  const contacts = uniq('contact')
  const submits = uniq('submit')

  const questions: GoQuestionStat[] = pageQuestions.map((q) => {
    const answers = rows.filter(r => r.event === 'answer' && r.question === q.q)
    const sessions = new Set(answers.map(a => a.session_id)).size
    const counts = new Map<string, number>()
    for (const a of answers) counts.set(a.option ?? '?', (counts.get(a.option ?? '?') ?? 0) + 1)
    const total = answers.length || 1
    return {
      question: q.q,
      answered: sessions,
      dropOffPct: starts > 0 ? Math.max(0, Math.round(((starts - sessions) / starts) * 100)) : 0,
      options: [...q.options, ...[...counts.keys()].filter(o => !q.options.includes(o))].map(option => ({
        option,
        count: counts.get(option) ?? 0,
        pct: Math.round(((counts.get(option) ?? 0) / total) * 100),
      })),
    }
  })

  return { views, starts, contacts, submits, questions }
}

export type GoLead = {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  message: string
  created_at: string
}

export async function getGoLeads(slug: string, limit = 100): Promise<GoLead[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('marketing_leads')
    .select('id, name, email, phone, company, message, created_at')
    .eq('source', `/go/${slug}`)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as GoLead[]) ?? []
}
