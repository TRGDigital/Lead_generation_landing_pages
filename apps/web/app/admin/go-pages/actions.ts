'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { GO_TEMPLATES } from '@/lib/go-templates'
import type { GoFaq, GoProofStat, GoQuizQuestion } from '@/lib/go-pages'

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

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

// "Q: question" followed by "- option" lines, blocks separated by blank lines.
function parseQuestions(raw: string): GoQuizQuestion[] {
  const out: GoQuizQuestion[] = []
  let current: GoQuizQuestion | null = null
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (/^q\s*:/i.test(t)) {
      if (current && current.options.length) out.push(current)
      current = { q: t.replace(/^q\s*:/i, '').trim(), options: [] }
    } else if (/^[-•*]\s*/.test(t) && current) {
      const opt = t.replace(/^[-•*]\s*/, '').trim()
      if (opt) current.options.push(opt)
    }
  }
  if (current && current.options.length) out.push(current)
  return out
}

// "Q: …" line followed by "A: …" line per FAQ.
function parseFaqs(raw: string): GoFaq[] {
  const out: GoFaq[] = []
  let q = ''
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (/^q\s*:/i.test(t)) q = t.replace(/^q\s*:/i, '').trim()
    else if (/^a\s*:/i.test(t) && q) {
      out.push({ q, a: t.replace(/^a\s*:/i, '').trim() })
      q = ''
    }
  }
  return out
}

// "stat | label" per line.
function parseProof(raw: string): GoProofStat[] {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.includes('|'))
    .map((l) => {
      const i = l.indexOf('|')
      return { stat: l.slice(0, i).trim(), label: l.slice(i + 1).trim() }
    })
    .filter((p) => p.stat && p.label)
}

export async function createGoPage(formData: FormData) {
  await requireAdmin()
  const templateKey = String(formData.get('template') ?? '')
  const tpl = GO_TEMPLATES.find((t) => t.key === templateKey)
  if (!tpl) throw new Error('Pick a service template.')

  const slug = slugify(String(formData.get('slug') ?? '') || tpl.defaultSlug)
  if (!slug) throw new Error('Could not derive a valid slug.')
  const notifyEmails = parseEmails(String(formData.get('notify_emails') ?? ''))

  const db = createServiceClient() as unknown as any
  const { data: existing } = await db.from('trg_go_pages').select('slug').eq('slug', slug).maybeSingle()
  if (existing) throw new Error(`A page already exists at /go/${slug}.`)

  const { error } = await db.from('trg_go_pages').insert({
    slug,
    service: tpl.service,
    status: 'draft',
    headline: tpl.headline,
    subheadline: tpl.subheadline,
    bullets: tpl.bullets,
    proof: tpl.proof,
    faqs: tpl.faqs,
    quiz_intro: tpl.quiz_intro,
    questions: tpl.questions,
    meta_title: tpl.meta_title,
    meta_description: tpl.meta_description,
    notify_emails: notifyEmails,
  })
  if (error) throw new Error(error.message)

  revalidatePath('/admin/go-pages')
  redirect(`/admin/go-pages/${slug}`)
}

export async function saveGoPage(slug: string, formData: FormData) {
  await requireAdmin()
  if (!slug) throw new Error('Invalid page')
  const str = (k: string) => String(formData.get(k) ?? '').trim()

  // Never let one field's parse failure nuke the whole save: if the quiz text
  // doesn't parse, keep the existing questions and tell the user.
  const questions = parseQuestions(str('questions'))
  const warn = questions.length
    ? ''
    : 'quiz-format'

  const update: Record<string, unknown> = {
    service: str('service'),
    headline: str('headline'),
    subheadline: str('subheadline'),
    bullets: str('bullets').split('\n').map((b) => b.trim()).filter(Boolean),
    proof: parseProof(str('proof')),
    faqs: parseFaqs(str('faqs')),
    quiz_intro: str('quiz_intro'),
    cta_label: str('cta_label') || 'See my results',
    meta_title: str('meta_title'),
    meta_description: str('meta_description'),
    notify_emails: parseEmails(str('notify_emails')),
    updated_at: new Date().toISOString(),
  }
  if (questions.length) update.questions = questions

  const db = createServiceClient() as unknown as any
  const { error } = await db.from('trg_go_pages').update(update).eq('slug', slug)
  if (error) redirect(`/admin/go-pages/${slug}?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/admin/go-pages')
  revalidatePath(`/admin/go-pages/${slug}`)
  revalidatePath(`/go/${slug}`)
  redirect(`/admin/go-pages/${slug}?saved=1${warn ? `&warn=${warn}` : ''}`)
}

export async function setGoPageStatus(slug: string, status: 'published' | 'draft') {
  await requireAdmin()
  if (!slug || !['published', 'draft'].includes(status)) throw new Error('Invalid input')
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('trg_go_pages').update({ status }).eq('slug', slug)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/go-pages')
  revalidatePath(`/go/${slug}`)
  return { ok: true as const }
}

export async function deleteGoPage(slug: string) {
  await requireAdmin()
  if (!slug) throw new Error('Invalid page')
  const db = createServiceClient() as unknown as any
  const { error } = await db.from('trg_go_pages').delete().eq('slug', slug)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/go-pages')
  redirect('/admin/go-pages')
}
