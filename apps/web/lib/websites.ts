import { createServiceClient } from '@/lib/supabase/server'
import { getFamilyTool } from '@/lib/family-tools'

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
  callbar_callback_enabled: boolean
  callbar_hours: Record<string, [string, string] | null> | null
  callbar_callback_note: string | null
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

// ── Family-tools usage for one client site (embedded tools log to tool_events
// with the site slug). Powers the "Tool usage" panel on the website detail page.
export type SiteToolStat = { tool: string; toolName: string; views: number; engaged: number; ctas: number; engagementRate: number }

export async function getSiteToolStats(slug: string, days = 30): Promise<{ tools: SiteToolStat[]; totalViews: number }> {
  const db = createServiceClient() as unknown as any
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await db
    .from('tool_events')
    .select('tool, event, created_at')
    .eq('site', slug)
    .gte('created_at', since)
    .limit(20000)
  const events = (data ?? []) as { tool: string; event: string }[]

  const map = new Map<string, SiteToolStat>()
  for (const e of events) {
    const row = map.get(e.tool) ?? { tool: e.tool, toolName: getFamilyTool(e.tool)?.name ?? e.tool, views: 0, engaged: 0, ctas: 0, engagementRate: 0 }
    if (e.event === 'view') row.views++
    else if (e.event === 'engaged') row.engaged++
    else if (e.event === 'cta') row.ctas++
    map.set(e.tool, row)
  }
  const tools = [...map.values()].map((r) => ({ ...r, engagementRate: r.views ? Math.round((r.engaged / r.views) * 100) : 0 }))
    .sort((a, b) => b.views - a.views)
  return { tools, totalViews: tools.reduce((n, t) => n + t.views, 0) }
}

// ── Per-question overlay quiz performance (drop-off + answer distribution).
// Uses the 'question' events the widget fires on each option choice.
export type OverlayQuestionStat = {
  step: number
  question: string
  answered: number // unique visitors who answered this question
  dropOffPct: number // % of quiz starters lost by this question
  options: { option: string; count: number; pct: number }[]
}

export async function getOverlayQuestionStats(
  websiteId: string,
  range?: { from?: string; to?: string; days?: number },
): Promise<{ starts: number; questions: OverlayQuestionStat[] }> {
  const db = createServiceClient() as unknown as any
  let q = db
    .from('overlay_events')
    .select('event, visitor_id, step, question, option, created_at')
    .eq('website_id', websiteId)
    .in('event', ['start', 'question'])
  if (range?.from) q = q.gte('created_at', `${range.from}T00:00:00Z`)
  else if (range?.days) q = q.gte('created_at', new Date(Date.now() - range.days * 86_400_000).toISOString())
  if (range?.to) q = q.lte('created_at', `${range.to}T23:59:59Z`)
  const { data } = await q.limit(20000)
  const rows = (data ?? []) as { event: string; visitor_id: string | null; step: number | null; question: string | null; option: string | null }[]

  const starts = new Set(rows.filter((r) => r.event === 'start').map((r) => r.visitor_id).filter(Boolean)).size

  // Group by question, preserving step order.
  const byQ = new Map<string, { step: number; question: string; visitors: Set<string>; opts: Map<string, number>; total: number }>()
  for (const r of rows) {
    if (r.event !== 'question' || !r.question) continue
    const key = r.question
    const g = byQ.get(key) ?? { step: r.step ?? 999, question: r.question, visitors: new Set<string>(), opts: new Map<string, number>(), total: 0 }
    if (r.visitor_id) g.visitors.add(r.visitor_id)
    const opt = r.option || '—'
    g.opts.set(opt, (g.opts.get(opt) ?? 0) + 1)
    g.total++
    byQ.set(key, g)
  }

  const questions: OverlayQuestionStat[] = [...byQ.values()]
    .sort((a, b) => a.step - b.step)
    .map((g) => ({
      step: g.step,
      question: g.question,
      answered: g.visitors.size,
      dropOffPct: starts > 0 ? Math.max(0, Math.round(((starts - g.visitors.size) / starts) * 100)) : 0,
      options: [...g.opts.entries()]
        .map(([option, count]) => ({ option, count, pct: g.total ? Math.round((count / g.total) * 100) : 0 }))
        .sort((a, b) => b.count - a.count),
    }))
  return { starts, questions }
}

// ── Daily performance time-series for the GSC-style chart: overlay funnel
// (pop shown / started / submitted) plus captured leads, bucketed by UTC day.
export type PerfDay = { date: string; impressions: number; starts: number; submits: number; leads: number }

export async function getOverlayTimeSeries(websiteId: string, days = 28): Promise<PerfDay[]> {
  const db = createServiceClient() as unknown as any
  const now = new Date()
  const startMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - (days - 1) * 86_400_000
  const sinceIso = new Date(startMs).toISOString()

  const [ovRes, ldRes] = await Promise.all([
    db.from('overlay_events').select('event, created_at').eq('website_id', websiteId).gte('created_at', sinceIso).limit(50000),
    db.from('organic_leads').select('created_at').eq('website_id', websiteId).gte('created_at', sinceIso).limit(50000),
  ])
  const ov = (ovRes.data ?? []) as { event: string; created_at: string }[]
  const ld = (ldRes.data ?? []) as { created_at: string }[]

  const map = new Map<string, PerfDay>()
  for (let i = 0; i < days; i++) {
    const key = new Date(startMs + i * 86_400_000).toISOString().slice(0, 10)
    map.set(key, { date: key, impressions: 0, starts: 0, submits: 0, leads: 0 })
  }
  for (const e of ov) {
    const day = map.get(String(e.created_at).slice(0, 10))
    if (!day) continue
    if (e.event === 'impression') day.impressions++
    else if (e.event === 'start') day.starts++
    else if (e.event === 'submit') day.submits++
  }
  for (const l of ld) {
    const day = map.get(String(l.created_at).slice(0, 10))
    if (day) day.leads++
  }
  return [...map.values()]
}

// ── Family-tools daily time-series for the tools performance chart: total opens
// per day, plus a per-tool breakdown embedded on each day (keyed by tool slug),
// and the per-tool totals for the drill-down list.
export type ToolPerfPoint = { date: string; total: number; [tool: string]: number | string }

export async function getToolTimeSeries(slug: string, days = 28): Promise<{ series: ToolPerfPoint[]; tools: SiteToolStat[] }> {
  const db = createServiceClient() as unknown as any
  const now = new Date()
  const startMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - (days - 1) * 86_400_000
  const sinceIso = new Date(startMs).toISOString()

  const { data } = await db
    .from('tool_events')
    .select('tool, event, created_at')
    .eq('site', slug)
    .gte('created_at', sinceIso)
    .limit(50000)
  const events = (data ?? []) as { tool: string; event: string; created_at: string }[]

  const dayMap = new Map<string, ToolPerfPoint>()
  for (let i = 0; i < days; i++) {
    const key = new Date(startMs + i * 86_400_000).toISOString().slice(0, 10)
    dayMap.set(key, { date: key, total: 0 })
  }
  const toolMap = new Map<string, SiteToolStat>()
  for (const e of events) {
    const t = toolMap.get(e.tool) ?? { tool: e.tool, toolName: getFamilyTool(e.tool)?.name ?? e.tool, views: 0, engaged: 0, ctas: 0, engagementRate: 0 }
    const day = dayMap.get(String(e.created_at).slice(0, 10))
    if (e.event === 'view') {
      t.views++
      if (day) { day.total = (day.total as number) + 1; day[e.tool] = ((day[e.tool] as number) || 0) + 1 }
    } else if (e.event === 'engaged') t.engaged++
    else if (e.event === 'cta') t.ctas++
    toolMap.set(e.tool, t)
  }
  const tools = [...toolMap.values()]
    .map((t) => ({ ...t, engagementRate: t.views ? Math.round((t.engaged / t.views) * 100) : 0 }))
    .sort((a, b) => b.views - a.views)
  return { series: [...dayMap.values()], tools }
}

// ── Overlay questions daily time-series + per-question stats for the questions
// performance chart. Answers per day (total + per-question keyed by step), plus
// each question's drop-off and answer distribution.
export async function getOverlayQuestionSeries(
  websiteId: string,
  days = 28,
): Promise<{ starts: number; questions: OverlayQuestionStat[]; series: Array<{ date: string; total: number; [k: string]: number | string }> }> {
  const db = createServiceClient() as unknown as any
  const now = new Date()
  const startMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - (days - 1) * 86_400_000
  const sinceIso = new Date(startMs).toISOString()

  const { data } = await db
    .from('overlay_events')
    .select('event, visitor_id, step, question, option, created_at')
    .eq('website_id', websiteId)
    .in('event', ['start', 'question'])
    .gte('created_at', sinceIso)
    .limit(50000)
  const rows = (data ?? []) as { event: string; visitor_id: string | null; step: number | null; question: string | null; option: string | null; created_at: string }[]

  const starts = new Set(rows.filter((r) => r.event === 'start').map((r) => r.visitor_id).filter(Boolean)).size

  const dayMap = new Map<string, { date: string; total: number; [k: string]: number | string }>()
  for (let i = 0; i < days; i++) {
    const key = new Date(startMs + i * 86_400_000).toISOString().slice(0, 10)
    dayMap.set(key, { date: key, total: 0 })
  }
  const byQ = new Map<number, { step: number; question: string; visitors: Set<string>; opts: Map<string, number>; total: number }>()
  for (const r of rows) {
    if (r.event !== 'question' || !r.question) continue
    const step = r.step ?? 999
    const day = dayMap.get(String(r.created_at).slice(0, 10))
    if (day) { day.total = (day.total as number) + 1; day['q' + step] = ((day['q' + step] as number) || 0) + 1 }
    const g = byQ.get(step) ?? { step, question: r.question, visitors: new Set<string>(), opts: new Map<string, number>(), total: 0 }
    if (r.visitor_id) g.visitors.add(r.visitor_id)
    const opt = r.option || '—'
    g.opts.set(opt, (g.opts.get(opt) ?? 0) + 1)
    g.total++
    byQ.set(step, g)
  }
  const questions: OverlayQuestionStat[] = [...byQ.values()]
    .sort((a, b) => a.step - b.step)
    .map((g) => ({
      step: g.step,
      question: g.question,
      answered: g.visitors.size,
      dropOffPct: starts > 0 ? Math.max(0, Math.round(((starts - g.visitors.size) / starts) * 100)) : 0,
      options: [...g.opts.entries()].map(([option, count]) => ({ option, count, pct: g.total ? Math.round((count / g.total) * 100) : 0 })).sort((a, b) => b.count - a.count),
    }))
  return { starts, questions, series: [...dayMap.values()] }
}
