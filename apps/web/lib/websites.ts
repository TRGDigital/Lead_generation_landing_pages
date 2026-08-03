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
  accessibility_intro: string
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
  // WordPress connection (publishing content onto the client's own site) + the
  // per-site facts that ground AI-generated content.
  wp_api_url: string
  wp_username: string
  wp_app_password: string
  site_facts: string
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

export type OverlayEvent = {
  event: 'impression' | 'start' | 'close' | 'submit' | 'preview'
  via: string | null
  device: string | null
  path: string | null
  visitor_id: string | null
  created_at: string
}

export type OverlayStats = {
  days: number
  impressions: number
  starts: number
  closes: number
  submits: number
  previews: number // admin "Preview pop" views — shown separately, never counted in the metrics
  uniqueVisitors: number
  engagementRate: number // starts / impressions
  submitRate: number // submits / impressions
  byTrigger: { via: string; impressions: number }[]
  byDevice: { device: string; impressions: number }[]
  topPages: { path: string; impressions: number; starts: number; submits: number }[]
}

// How the pop overlay is performing on a site: impressions, engagement, closes, submissions.
export async function getOverlayStats(websiteId: string, days = 30, pageLimit = 20): Promise<OverlayStats> {
  const db = createServiceClient() as unknown as any
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await db
    .from('overlay_events')
    .select('event, via, device, path, visitor_id, created_at')
    .eq('website_id', websiteId)
    .gte('created_at', since)
    .limit(20000)
  const rows = (data as OverlayEvent[]) ?? []

  const count = (e: string) => rows.reduce((n, r) => n + (r.event === e ? 1 : 0), 0)
  const impressions = count('impression')
  const starts = count('start')
  const closes = count('close')
  const submits = count('submit')
  const previews = count('preview')
  const uniqueVisitors = new Set(
    rows.filter((r) => r.event !== 'preview').map((r) => r.visitor_id).filter(Boolean),
  ).size

  const triggerMap: Record<string, number> = {}
  const deviceMap: Record<string, number> = {}
  const pageMap: Record<string, { path: string; impressions: number; starts: number; submits: number }> = {}
  for (const r of rows) {
    if (r.event === 'impression') {
      const v = r.via || 'unknown'
      triggerMap[v] = (triggerMap[v] || 0) + 1
      const d = r.device || 'unknown'
      deviceMap[d] = (deviceMap[d] || 0) + 1
    }
    const p = r.path || '/'
    const pm = (pageMap[p] ||= { path: p, impressions: 0, starts: 0, submits: 0 })
    if (r.event === 'impression') pm.impressions++
    else if (r.event === 'start') pm.starts++
    else if (r.event === 'submit') pm.submits++
  }

  return {
    days,
    impressions,
    starts,
    closes,
    submits,
    previews,
    uniqueVisitors,
    engagementRate: impressions ? starts / impressions : 0,
    submitRate: impressions ? submits / impressions : 0,
    byTrigger: Object.entries(triggerMap).map(([via, impressions]) => ({ via, impressions })).sort((a, b) => b.impressions - a.impressions),
    byDevice: Object.entries(deviceMap).map(([device, impressions]) => ({ device, impressions })).sort((a, b) => b.impressions - a.impressions),
    topPages: Object.values(pageMap).sort((a, b) => b.impressions - a.impressions).slice(0, pageLimit),
  }
}
