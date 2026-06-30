import { createServiceClient } from '@/lib/supabase/server'

export type Website = {
  id: string
  name: string
  url: string
  slug: string
  created_at: string
  overlay_enabled: boolean
  overlay_trigger: 'exit' | 'scroll' | 'both'
  overlay_scroll_pct: number
  overlay_heading: string
  overlay_body: string
  overlay_button: string
  overlay_success: string
  overlay_color: string
  overlay_logo_url: string
  client_email: string
  overlay_max_shows: number
  overlay_cooldown_days: number
  overlay_min_pages: number
  overlay_exit_sensitivity: 'low' | 'medium' | 'high'
  overlay_delay_seconds: number
  overlay_timeout_seconds: number
  overlay_devices: 'all' | 'desktop' | 'mobile'
  overlay_include_paths: string
  overlay_exclude_paths: string
  overlay_audience: 'all' | 'new' | 'returning'
  overlay_image_url: string
  overlay_gamified: boolean
  overlay_show_availability: boolean
  overlay_questions: { q: string; options: string[] }[]
  tools_enabled: string[]
  tools_capture_leads: boolean
  tools_la_slug: string
  accessibility_enabled: boolean
  accessibility_position: 'bottom-right' | 'bottom-left'
  callbar_enabled: boolean
  callbar_phone: string
  callbar_label: string
  callbar_desktop: boolean
  chat_enabled: boolean
  chat_greeting: string
  chat_knowledge: string
  chat_prompt: string
  chat_color: string
  // Room availability (client self-updates via a token link)
  availability_status: 'available' | 'limited' | 'full' | 'unknown'
  rooms_available: number
  availability_note: string
  availability_updated_at: string | null
  availability_token: string
  // Per-client PPC landing page
  lp_enabled: boolean
  lp_headline: string
  lp_subheadline: string
  lp_intro: string
  lp_bullets: string[]
  lp_hero_image_url: string
  lp_phone: string
  lp_address: string
  lp_cqc_url: string
  lp_show_funding: boolean
  // Funding & Care Options guide (premium add-on, the branded interactive PDF lead magnet)
  funding_guide_enabled: boolean
  funding_guide_cqc: string // CQC location id (e.g. "1-107126433") or location URL
  funding_guide_fee_low: number | null
  funding_guide_fee_high: number | null
  funding_guide_calculator_url: string
  funding_guide_book_url: string
  funding_guide_content: FundingGuideContent
}

export type FundingGuideContent = {
  strapline?: string
  intro?: string
  included?: string
  manager?: { name?: string; role?: string; photo?: string; quote?: string }
  homeImage?: string
  careOptions?: { title: string; body: string }[]
  careDetails?: { title: string; body: string }[]
}

export const AVAILABILITY_LABELS: Record<Website['availability_status'], { label: string; tone: 'good' | 'warn' | 'bad' | 'muted' }> = {
  available: { label: 'Rooms available', tone: 'good' },
  limited: { label: 'Limited availability', tone: 'warn' },
  full: { label: 'Currently full', tone: 'bad' },
  unknown: { label: 'Enquire for availability', tone: 'muted' },
}

export type OrganicLead = {
  id: string
  website_id: string
  name: string | null
  email: string | null
  phone: string | null
  message: string | null
  trigger: string | null
  page_url: string | null
  consent: boolean
  created_at: string
}

export type WebsiteWithStats = Website & { leadCount: number; leads7d: number }

export async function getWebsites(): Promise<WebsiteWithStats[]> {
  const db = createServiceClient() as unknown as any
  const { data: sites } = await db.from('websites').select('*').order('created_at', { ascending: true })
  const list = (sites as Website[]) ?? []

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const withStats: WebsiteWithStats[] = []
  for (const s of list) {
    const { count: total } = await db.from('organic_leads').select('id', { count: 'exact', head: true }).eq('website_id', s.id)
    const { count: recent } = await db.from('organic_leads').select('id', { count: 'exact', head: true }).eq('website_id', s.id).gte('created_at', weekAgo)
    withStats.push({ ...s, leadCount: total ?? 0, leads7d: recent ?? 0 })
  }
  return withStats
}

export async function getWebsite(id: string): Promise<Website | null> {
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('websites').select('*').eq('id', id).maybeSingle()
  return (data as Website) ?? null
}

export type QuizPreset = { key: string; name: string; questions: { q: string; options: string[] }[] }

// The pre-built landing-page quizzes (question_sets), converted to the simple
// overlay format so they can be loaded into a site's popup quiz.
export async function getQuizPresets(): Promise<QuizPreset[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('question_sets').select('key, name, questions')
  const sets = (data as Array<{ key: string; name: string; questions: unknown }>) ?? []
  return sets
    .map((s) => ({
      key: s.key,
      name: s.name,
      questions: (Array.isArray(s.questions) ? s.questions : [])
        .filter((q: { type?: string; options?: unknown[] }) => (q.type === 'single' || q.type === 'multi') && Array.isArray(q.options) && q.options.length > 0)
        .map((q: { title?: string; options: { label?: string; value?: string }[] }) => ({
          q: String(q.title ?? '').trim(),
          options: q.options.map((o) => String(o.label ?? o.value ?? '').trim()).filter(Boolean),
        }))
        .filter((q) => q.q && q.options.length),
    }))
    .filter((p) => p.questions.length)
}

export async function getWebsiteBySlug(slug: string): Promise<Website | null> {
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('websites').select('*').eq('slug', slug).maybeSingle()
  return (data as Website) ?? null
}

export async function getWebsiteByToken(token: string): Promise<Website | null> {
  if (!token) return null
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('websites').select('*').eq('availability_token', token).maybeSingle()
  return (data as Website) ?? null
}

export type OrganicLeadWithSite = OrganicLead & { website: { name: string; slug: string } | null }

// Every client-site lead (pop-up / tools / landing) across all websites, with the site name.
export async function getAllOrganicLeads(limit = 1000): Promise<OrganicLeadWithSite[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('organic_leads')
    .select('id, website_id, name, email, phone, message, trigger, page_url, consent, created_at, website:websites(name, slug)')
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as OrganicLeadWithSite[]) ?? []
}

export async function getOrganicLeads(websiteId: string, limit = 200): Promise<OrganicLead[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('organic_leads')
    .select('*')
    .eq('website_id', websiteId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data as OrganicLead[]) ?? []
}
