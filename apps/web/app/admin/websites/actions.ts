'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { isToolKey } from '@/lib/family-tools'

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
}

// Premium Funding & Care Options guide settings (per client).
export async function saveFundingGuide(id: string, formData: FormData) {
  await requireAdmin()
  const num = (v: FormDataEntryValue | null) => {
    const n = parseInt(String(v ?? '').replace(/[^0-9]/g, ''), 10)
    return Number.isFinite(n) ? n : null
  }
  let content: unknown = {}
  try {
    content = JSON.parse(String(formData.get('funding_guide_content') ?? '{}'))
  } catch {
    content = {}
  }
  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('websites')
    .update({
      funding_guide_enabled: formData.get('funding_guide_enabled') === 'on',
      funding_guide_cqc: String(formData.get('funding_guide_cqc') ?? '').trim(),
      funding_guide_fee_low: num(formData.get('funding_guide_fee_low')),
      funding_guide_fee_high: num(formData.get('funding_guide_fee_high')),
      funding_guide_calculator_url: String(formData.get('funding_guide_calculator_url') ?? '').trim(),
      funding_guide_book_url: String(formData.get('funding_guide_book_url') ?? '').trim(),
      funding_guide_content: content,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${id}`)
}

export async function addWebsite(formData: FormData) {
  await requireAdmin()
  const name = String(formData.get('name') ?? '').trim()
  let url = String(formData.get('url') ?? '').trim()
  if (!name || !url) throw new Error('Name and URL are required')
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url
  let slug = slugify(String(formData.get('slug') ?? '') || name) || 'site'

  const db = createServiceClient() as unknown as any
  // ensure unique slug
  const { data: existing } = await db.from('websites').select('slug').like('slug', `${slug}%`)
  const taken = new Set(((existing as { slug: string }[]) ?? []).map((r) => r.slug))
  if (taken.has(slug)) {
    let n = 2
    while (taken.has(`${slug}-${n}`)) n++
    slug = `${slug}-${n}`
  }

  const { data, error } = await db.from('websites').insert({ name, url, slug }).select('id').single()
  if (error) throw new Error(error.message)

  revalidatePath('/admin/websites')
  redirect(`/admin/websites/${data.id}`)
}

export async function saveOverlaySettings(id: string, formData: FormData) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any

  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    url: String(formData.get('url') ?? '').trim(),
    overlay_enabled: formData.get('overlay_enabled') === 'on',
    overlay_trigger: String(formData.get('overlay_trigger') ?? 'exit'),
    overlay_scroll_pct: Math.min(95, Math.max(10, Number(formData.get('overlay_scroll_pct')) || 50)),
    overlay_heading: String(formData.get('overlay_heading') ?? '').trim(),
    overlay_body: String(formData.get('overlay_body') ?? '').trim(),
    overlay_button: String(formData.get('overlay_button') ?? '').trim(),
    overlay_success: String(formData.get('overlay_success') ?? '').trim(),
    overlay_color: String(formData.get('overlay_color') ?? '#F0532B').trim(),
    overlay_logo_url: String(formData.get('overlay_logo_url') ?? '').trim(),
    client_email: String(formData.get('client_email') ?? '').trim(),
    overlay_max_shows: Math.min(20, Math.max(0, Number(formData.get('overlay_max_shows')) || 0)),
    overlay_cooldown_days: Math.min(90, Math.max(0, Number(formData.get('overlay_cooldown_days')) || 0)),
    overlay_min_pages: Math.min(20, Math.max(1, Number(formData.get('overlay_min_pages')) || 1)),
    overlay_exit_sensitivity: String(formData.get('overlay_exit_sensitivity') ?? 'medium'),
    overlay_delay_seconds: Math.min(120, Math.max(0, Number(formData.get('overlay_delay_seconds')) || 0)),
    overlay_timeout_seconds: Math.min(600, Math.max(0, Number(formData.get('overlay_timeout_seconds')) || 0)),
    overlay_devices: String(formData.get('overlay_devices') ?? 'all'),
    overlay_include_paths: String(formData.get('overlay_include_paths') ?? '').trim(),
    overlay_exclude_paths: String(formData.get('overlay_exclude_paths') ?? '').trim(),
    overlay_audience: String(formData.get('overlay_audience') ?? 'all'),
    overlay_image_url: String(formData.get('overlay_image_url') ?? '').trim(),
    overlay_gamified: formData.get('overlay_gamified') === 'on',
    overlay_show_availability: formData.get('overlay_show_availability') === 'on',
  }

  const { error } = await db.from('websites').update(payload).eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/websites')
  revalidatePath(`/admin/websites/${id}`)
}

export async function saveQuizQuestions(id: string, questionsJson: string) {
  await requireAdmin()
  let parsed: unknown
  try {
    parsed = JSON.parse(questionsJson)
  } catch {
    throw new Error('Invalid questions')
  }
  const clean = (Array.isArray(parsed) ? parsed : [])
    .filter((x): x is { q: unknown; options: unknown } => !!x && typeof (x as { q?: unknown }).q === 'string')
    .map((x) => ({
      q: String(x.q).slice(0, 200).trim(),
      options: (Array.isArray(x.options) ? x.options : [])
        .map((o) => String(o).slice(0, 120).trim())
        .filter(Boolean)
        .slice(0, 12),
    }))
    .filter((x) => x.q && x.options.length)
    .slice(0, 25)

  const db = createServiceClient() as unknown as any
  const { error } = await db.from('websites').update({ overlay_questions: clean }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${id}`)
}

export async function saveToolAllocation(id: string, formData: FormData) {
  await requireAdmin()
  const enabled = Array.from(new Set(formData.getAll('tools').map(String).filter(isToolKey)))
  const capture = formData.get('tools_capture_leads') === 'on'
  const laSlug = String(formData.get('tools_la_slug') ?? '').trim()
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('websites').update({ tools_enabled: enabled, tools_capture_leads: capture, tools_la_slug: laSlug }).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${id}`)
}

export async function saveLandingPage(id: string, formData: FormData) {
  await requireAdmin()
  const str = (k: string) => String(formData.get(k) ?? '').trim()
  const bullets = str('lp_bullets').split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 8)

  const payload = {
    lp_enabled: formData.get('lp_enabled') === 'on',
    lp_headline: str('lp_headline'),
    lp_subheadline: str('lp_subheadline'),
    lp_intro: str('lp_intro'),
    lp_bullets: bullets,
    lp_hero_image_url: str('lp_hero_image_url'),
    lp_phone: str('lp_phone'),
    lp_address: str('lp_address'),
    lp_cqc_url: str('lp_cqc_url'),
    lp_show_funding: formData.get('lp_show_funding') === 'on',
  }

  const db = createServiceClient() as unknown as any
  const { error } = await db.from('websites').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${id}`)
}

export async function saveChat(id: string, formData: FormData) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('websites')
    .update({
      chat_enabled: formData.get('chat_enabled') === 'on',
      chat_greeting: String(formData.get('chat_greeting') ?? '').trim().slice(0, 300) || 'Hi! How can I help?',
      chat_knowledge: String(formData.get('chat_knowledge') ?? '').slice(0, 12000),
      chat_prompt: String(formData.get('chat_prompt') ?? '').slice(0, 4000),
      chat_color: String(formData.get('chat_color') ?? '').trim().slice(0, 9),
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${id}`)
}

// Pull the client site's homepage text to seed the chat assistant's knowledge.
export async function fetchChatKnowledge(id: string): Promise<string> {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { data: site } = await db.from('websites').select('url').eq('id', id).single()
  const url = site?.url as string | undefined
  if (!url || !/^https?:\/\//i.test(url)) return ''
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(10000) })
    const html = await res.text()
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    return text.slice(0, 6000)
  } catch {
    return ''
  }
}

export async function saveCallbar(id: string, formData: FormData) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('websites')
    .update({
      callbar_enabled: formData.get('callbar_enabled') === 'on',
      callbar_phone: String(formData.get('callbar_phone') ?? '').trim(),
      callbar_label: String(formData.get('callbar_label') ?? '').trim() || 'Speak to our team',
      callbar_desktop: formData.get('callbar_desktop') === 'on',
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${id}`)
}

export async function saveAccessibility(id: string, formData: FormData) {
  await requireAdmin()
  const position = String(formData.get('accessibility_position') ?? 'bottom-right')
  const intro = String(formData.get('accessibility_intro') ?? '').slice(0, 20000)
  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('websites')
    .update({
      accessibility_enabled: formData.get('accessibility_enabled') === 'on',
      accessibility_position: ['bottom-right', 'bottom-left'].includes(position) ? position : 'bottom-right',
      accessibility_intro: intro,
    })
    .eq('id', id)
  if (error) throw new Error(error.message)

  // Regenerate the neural "Listen to page" audio for the new welcome text and
  // store it in Supabase, so the site immediately uses the saved version. Never
  // let a TTS hiccup block the save (the site can still fall back / generate later).
  try {
    const { ensureWelcomeAudio } = await import('@/lib/tts-cache')
    await ensureWelcomeAudio(id, intro)
  } catch (e) {
    console.error('saveAccessibility: TTS pre-warm failed', e)
  }

  revalidatePath(`/admin/websites/${id}`)
}

export async function saveAvailability(id: string, formData: FormData) {
  await requireAdmin()
  const STATUSES = ['available', 'limited', 'full', 'unknown']
  const status = String(formData.get('availability_status') ?? 'unknown')
  const payload = {
    availability_status: STATUSES.includes(status) ? status : 'unknown',
    rooms_available: Math.min(999, Math.max(0, Number(formData.get('rooms_available')) || 0)),
    availability_note: String(formData.get('availability_note') ?? '').slice(0, 300).trim(),
    availability_updated_at: new Date().toISOString(),
  }
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('websites').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${id}`)
}

export async function deleteWebsite(id: string) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('websites').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/websites')
  redirect('/admin/websites')
}

// ── Call tracking (DNI) — Phase 1: one static tracking number per site ───────
export async function saveCallTracking(id: string, formData: FormData) {
  await requireAdmin()
  const canonical = String(formData.get('canonical_numbers') ?? '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('tracking_numbers').upsert(
    {
      website_id: id,
      enabled: formData.get('enabled') === 'on',
      twilio_number: String(formData.get('twilio_number') ?? '').trim(),
      display_number: String(formData.get('display_number') ?? '').trim(),
      forward_to: String(formData.get('forward_to') ?? '').trim(),
      canonical_numbers: canonical,
      notes: String(formData.get('notes') ?? '').trim(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'website_id' },
  )
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${id}`)
}

// ── WordPress connection + client area pages (content/SEO on customer sites) ──

export async function saveWordPress(id: string, formData: FormData) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('websites')
    .update({
      wp_api_url: String(formData.get('wp_api_url') ?? '').trim().replace(/\/+$/, ''),
      wp_username: String(formData.get('wp_username') ?? '').trim(),
      wp_app_password: String(formData.get('wp_app_password') ?? '').trim(),
      site_facts: String(formData.get('site_facts') ?? '').trim(),
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${id}`)
}

export async function testWordPress(id: string): Promise<{ ok: boolean; detail: string }> {
  await requireAdmin()
  const { getWebsite } = await import('@/lib/websites')
  const site = await getWebsite(id)
  if (!site) return { ok: false, detail: 'Unknown website' }
  if (!site.wp_api_url || !site.wp_username || !site.wp_app_password) {
    return { ok: false, detail: 'Fill in the site URL, username and application password first (and save).' }
  }
  const { testWordPressConnection } = await import('@/lib/wordpress')
  return testWordPressConnection({ apiUrl: site.wp_api_url, username: site.wp_username, appPassword: site.wp_app_password })
}

export async function createAreaDraft(websiteId: string, formData: FormData) {
  await requireAdmin()
  const town = String(formData.get('town') ?? '').trim()
  const service = String(formData.get('service') ?? '').trim()
  const keyword = String(formData.get('keyword') ?? '').trim() || `${service.toLowerCase()} ${town}`.trim()
  if (!town || !service) throw new Error('Town and service are required')
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('client_area_pages').insert({
    website_id: websiteId,
    town,
    service,
    target_keyword: keyword,
    slug: slugify(`${service} in ${town}`),
    heading: `${service} in ${town}`,
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${websiteId}`)
}

export async function generateAreaDraft(pageId: string): Promise<{ ok: boolean; detail: string }> {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { data: page } = await db.from('client_area_pages').select('*').eq('id', pageId).maybeSingle()
  if (!page) return { ok: false, detail: 'Draft not found' }
  const { getWebsite } = await import('@/lib/websites')
  const site = await getWebsite(page.website_id)
  if (!site) return { ok: false, detail: 'Unknown website' }

  try {
    const { generateClientAreaContent } = await import('@/lib/client-content')
    const gen = await generateClientAreaContent({
      siteName: site.name,
      siteUrl: site.url,
      facts: site.site_facts,
      town: page.town,
      service: page.service,
      keyword: page.target_keyword,
    })
    const { error } = await db
      .from('client_area_pages')
      .update({
        meta_title: gen.metaTitle,
        meta_description: gen.metaDescription,
        heading: gen.heading,
        intro_html: gen.intro,
        body_html: gen.body,
        offer_points: gen.offerPoints,
        faqs: gen.faqs,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pageId)
    if (error) return { ok: false, detail: error.message }
    revalidatePath(`/admin/websites/${page.website_id}`)
    return { ok: true, detail: 'Draft content generated — review and edit before publishing.' }
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : 'Generation failed' }
  }
}

export async function saveAreaDraft(pageId: string, formData: FormData) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  let faqs: unknown = null
  const faqsRaw = String(formData.get('faqs') ?? '').trim()
  if (faqsRaw) {
    try { faqs = JSON.parse(faqsRaw) } catch { throw new Error('FAQs must be valid JSON') }
  }
  const points = String(formData.get('offer_points') ?? '')
    .split('\n').map((s) => s.trim()).filter(Boolean)
  const { data: page, error } = await db
    .from('client_area_pages')
    .update({
      town: String(formData.get('town') ?? '').trim(),
      service: String(formData.get('service') ?? '').trim(),
      target_keyword: String(formData.get('keyword') ?? '').trim(),
      slug: slugify(String(formData.get('slug') ?? '')),
      meta_title: String(formData.get('meta_title') ?? '').trim(),
      meta_description: String(formData.get('meta_description') ?? '').trim(),
      heading: String(formData.get('heading') ?? '').trim(),
      intro_html: String(formData.get('intro_html') ?? '').trim(),
      body_html: String(formData.get('body_html') ?? '').trim(),
      offer_points: points.length ? points : null,
      faqs,
      updated_at: new Date().toISOString(),
    })
    .eq('id', pageId)
    .select('website_id')
    .single()
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${page.website_id}`)
}

export async function publishAreaDraft(pageId: string): Promise<{ ok: boolean; detail: string; link?: string }> {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { data: page } = await db.from('client_area_pages').select('*').eq('id', pageId).maybeSingle()
  if (!page) return { ok: false, detail: 'Draft not found' }
  const { getWebsite } = await import('@/lib/websites')
  const site = await getWebsite(page.website_id)
  if (!site) return { ok: false, detail: 'Unknown website' }
  if (!site.wp_api_url || !site.wp_username || !site.wp_app_password) {
    return { ok: false, detail: 'Connect WordPress first (in the WordPress connection panel).' }
  }
  if (!page.heading || !page.intro_html) {
    return { ok: false, detail: 'The draft has no content yet — generate or write it first.' }
  }

  const { publishWpPage, areaPageHtml } = await import('@/lib/wordpress')
  const result = await publishWpPage(
    { apiUrl: site.wp_api_url, username: site.wp_username, appPassword: site.wp_app_password },
    {
      title: page.heading,
      slug: page.slug || '',
      contentHtml: areaPageHtml(page),
      metaTitle: page.meta_title,
      metaDescription: page.meta_description,
      wpPageId: page.wp_page_id,
    },
  )
  if (!result.ok) return { ok: false, detail: result.error }

  const { error } = await db
    .from('client_area_pages')
    .update({ status: 'published', wp_page_id: result.pageId, wp_link: result.link, updated_at: new Date().toISOString() })
    .eq('id', pageId)
  if (error) return { ok: false, detail: error.message }
  revalidatePath(`/admin/websites/${page.website_id}`)
  return { ok: true, detail: `Published to the client site.`, link: result.link }
}

export async function deleteAreaDraft(pageId: string) {
  await requireAdmin()
  const db = createServiceClient() as unknown as any
  const { data: page, error } = await db.from('client_area_pages').delete().eq('id', pageId).select('website_id').single()
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/websites/${page.website_id}`)
}
