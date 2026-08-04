'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { buildLocationContent, buildLocationMeta, slugify } from '@/lib/location-content-template'
import { submitToRalfyIndex } from '@/lib/ralfyindex'

const ALLOWED = new Set(['residential', 'nursing'])

// Switch which care-finder template a landing page shows. The chosen template's
// questions appear in the quiz on that page (and feed its funnel + leads).
export async function setPageQuestionSet(slug: string, key: string) {
  await requireAdmin()
  if (!slug || !ALLOWED.has(key)) throw new Error('Invalid input')

  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('location_pages')
    .update({ question_set: key })
    .eq('slug', slug)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/pages')
  revalidatePath(`/lp/${slug}`)
  return { ok: true as const }
}

// Parse a comma/space/newline-separated list into clean, valid email addresses.
function parseEmails(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[\s,;]+/)
        .map((e) => e.trim().toLowerCase())
        .filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)),
    ),
  )
}

// Who receives this page's leads. Empty = the site-wide default (NOTIFY_EMAIL).
export async function setPageNotifyEmails(slug: string, raw: string) {
  await requireAdmin()
  if (!slug) throw new Error('Invalid input')
  const emails = parseEmails(raw)

  const db = createServiceClient() as unknown as any
  const { error } = await db.from('location_pages').update({ notify_emails: emails }).eq('slug', slug)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/pages')
  return { ok: true as const, emails }
}

// Publish / unpublish a page. Only 'published' pages are served + statically built.
export async function setPageStatus(slug: string, status: 'published' | 'draft') {
  await requireAdmin()
  if (!slug || !['published', 'draft'].includes(status)) throw new Error('Invalid input')

  const db = createServiceClient() as unknown as any
  const { error } = await db.from('location_pages').update({ status }).eq('slug', slug)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/pages')
  revalidatePath(`/lp/${slug}`)

  // Auto-submit a newly published landing page to RalfyIndex (slug maps to its subdomain)
  if (status === 'published') {
    await submitToRalfyIndex([`https://${slug}.careassura.com/`], `Landing ${slug}`)
  }
  return { ok: true as const }
}

// Create a new landing page from an area name. Generates a full, editable draft page
// (created as 'draft' so it can be reviewed/wired to a subdomain before going live).
export async function createLandingPage(input: { areaName: string; slug?: string; questionSet: string; notifyEmails?: string }) {
  await requireAdmin()

  const areaName = (input.areaName ?? '').trim()
  const slug = slugify(input.slug?.trim() || areaName)
  const questionSet = ALLOWED.has(input.questionSet) ? input.questionSet : 'residential'
  const notifyEmails = parseEmails(input.notifyEmails ?? '')

  if (!areaName) throw new Error('Please enter an area name.')
  if (!slug) throw new Error('Could not derive a valid subdomain from that name.')

  const db = createServiceClient() as unknown as any

  const { data: existing } = await db.from('location_pages').select('slug').eq('slug', slug).maybeSingle()
  if (existing) throw new Error(`A page already exists for "${slug}". Choose a different subdomain.`)

  const meta = buildLocationMeta(areaName)
  const { error } = await db.from('location_pages').insert({
    slug,
    area_name: areaName,
    meta_title: meta.meta_title,
    meta_description: meta.meta_description,
    content: buildLocationContent(areaName),
    question_set: questionSet,
    notify_emails: notifyEmails,
    status: 'draft',
  })
  if (error) throw new Error(error.message)

  revalidatePath('/admin/pages')
  redirect(`/admin/pages?created=${slug}`)
}

// ── Content editor (mirrors the /go admin patterns) ──────────────────────────
function parseTitleBody(raw: string): Array<{ title: string; body: string }> {
  const out: Array<{ title: string; body: string }> = []
  let cur: { title?: string; body?: string } = {}
  const flush = () => { if (cur.title && cur.body) out.push({ title: cur.title, body: cur.body }); cur = {} }
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t) { flush(); continue }
    if (/^title\s*:/i.test(t)) { if (cur.title) flush(); cur.title = t.replace(/^title\s*:/i, '').trim() }
    else if (/^body\s*:/i.test(t)) cur.body = t.replace(/^body\s*:/i, '').trim()
  }
  flush()
  return out
}

function parseQa(raw: string): Array<{ question: string; answer: string }> {
  const out: Array<{ question: string; answer: string }> = []
  let q = ''
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (/^q\s*:/i.test(t)) q = t.replace(/^q\s*:/i, '').trim()
    else if (/^a\s*:/i.test(t) && q) { out.push({ question: q, answer: t.replace(/^a\s*:/i, '').trim() }); q = '' }
  }
  return out
}

const lines = (raw: string) => raw.split('\n').map(l => l.trim()).filter(Boolean)

export async function saveLocationContent(slug: string, formData: FormData) {
  await requireAdmin()
  if (!slug) throw new Error('Invalid page')
  const str = (k: string) => String(formData.get(k) ?? '').trim()

  const db = createServiceClient() as unknown as any
  const { data: existing } = await db.from('location_pages').select('content').eq('slug', slug).maybeSingle()
  if (!existing) throw new Error('Page not found')
  const content = (existing.content ?? {}) as Record<string, unknown>

  // Merge over the existing blob so unknown keys (org etc.) survive.
  const stats = lines(str('stats')).filter(l => l.includes('|')).map(l => {
    const i = l.indexOf('|')
    return { value: l.slice(0, i).trim(), label: l.slice(i + 1).trim() }
  })
  const next = {
    ...content,
    hero: {
      ...(content.hero as Record<string, unknown> ?? {}),
      eyebrow: str('hero_eyebrow'),
      headline: str('hero_headline') || undefined,
      subheadline: str('hero_subheadline'),
      bullets: lines(str('hero_bullets')),
    },
    stats,
    howItWorks: {
      ...(content.howItWorks as Record<string, unknown> ?? {}),
      eyebrow: str('hiw_eyebrow'),
      heading: str('hiw_heading'),
      steps: parseTitleBody(str('hiw_steps')),
    },
    whyUs: {
      ...(content.whyUs as Record<string, unknown> ?? {}),
      heading: str('why_heading'),
      points: parseTitleBody(str('why_points')),
    },
    faq: parseQa(str('faq')),
  }

  const { error } = await db.from('location_pages').update({
    content: next,
    meta_title: str('meta_title'),
    meta_description: str('meta_description'),
  }).eq('slug', slug)
  if (error) redirect(`/admin/pages/${slug}?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/admin/pages')
  revalidatePath(`/lp/${slug}`)
  redirect(`/admin/pages/${slug}?saved=1`)
}
