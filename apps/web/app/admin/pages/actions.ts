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
