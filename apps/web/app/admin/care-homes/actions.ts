'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as Sentry from '@sentry/nextjs'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { syncCampaignStatus } from '@/lib/google-ads'
import { CareHomeFormSchema } from '@lib/schemas'
import type { CareHomeContent, CareHomeBrand } from '@/lib/types/care-home'

export async function createCareHome(formData: FormData) {
  await requireAdmin()

  const raw = Object.fromEntries(formData)
  const parsed = CareHomeFormSchema.safeParse(coerceFormValues(raw))
  if (!parsed.success) {
    return { error: 'Validation failed', issues: parsed.error.issues }
  }

  const { content, brand } = buildJsonFields(parsed.data)
  // ADR-002: cast supabase to any — care_homes insert/update types resolve to never
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any

  const { data, error } = await db.from('care_homes').insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    location: parsed.data.location,
    postcode: parsed.data.postcode,
    phone_display: parsed.data.phone_display,
    cqc_rating: parsed.data.cqc_rating ?? null,
    care_types: parsed.data.care_type_options_raw.split('\n').map((s: string) => s.trim()).filter(Boolean),
    hero_image_url: parsed.data.hero_image_url || null,
    brand,
    content,
    is_active: parsed.data.is_active,
    bed_target: parsed.data.bed_target,
    weekly_bed_value_pennies: parsed.data.weekly_bed_value_pennies ?? null,
  }).select('id').single()

  if (error) return { error: (error as { message: string }).message }

  revalidatePath('/admin/care-homes')
  redirect(`/admin/care-homes/${(data as { id: string }).id}/edit`)
}

export async function updateCareHome(id: string, formData: FormData) {
  await requireAdmin()

  const raw = Object.fromEntries(formData)
  const parsed = CareHomeFormSchema.safeParse(coerceFormValues(raw))
  if (!parsed.success) {
    return { error: 'Validation failed', issues: parsed.error.issues }
  }

  const { content, brand } = buildJsonFields(parsed.data)
  // ADR-002: cast supabase to any — care_homes update types resolve to never
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any

  const { error } = await db
    .from('care_homes')
    .update({
      slug: parsed.data.slug,
      name: parsed.data.name,
      location: parsed.data.location,
      postcode: parsed.data.postcode,
      phone_display: parsed.data.phone_display,
      cqc_rating: parsed.data.cqc_rating ?? null,
      care_types: parsed.data.care_type_options_raw.split('\n').map((s: string) => s.trim()).filter(Boolean),
      hero_image_url: parsed.data.hero_image_url || null,
      brand,
      content,
      is_active: parsed.data.is_active,
      bed_target: parsed.data.bed_target,
      weekly_bed_value_pennies: parsed.data.weekly_bed_value_pennies ?? null,
    })
    .eq('id', id)

  if (error) return { error: (error as { message: string }).message }

  revalidatePath('/admin/care-homes')
  revalidatePath(`/admin/care-homes/${id}/edit`)
  return { success: true }
}

export async function toggleCareHomeActive(id: string, isActive: boolean) {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { error } = await db.from('care_homes').update({ is_active: isActive }).eq('id', id)
  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/admin/care-homes')
  revalidatePath('/admin/campaigns')

  // Sync Google Ads campaign status — non-blocking; failure must not break the toggle
  void (async () => {
    try {
      const { data: home } = await db
        .from('care_homes')
        .select('google_ads_customer_id, google_ads_campaign_id')
        .eq('id', id)
        .single()
      if (home?.google_ads_customer_id && home?.google_ads_campaign_id) {
        await syncCampaignStatus(home.google_ads_customer_id, home.google_ads_campaign_id, isActive)
      }
    } catch (err) {
      Sentry.captureException(err, { extra: { homeId: id, isActive } })
      console.error('[toggleCareHomeActive] Google Ads sync failed (non-fatal):', err)
    }
  })()

  return { success: true }
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function coerceFormValues(raw: Record<string, FormDataEntryValue>) {
  return {
    ...raw,
    bed_target: raw['bed_target'] ? Number(raw['bed_target']) : undefined,
    weekly_bed_value_pennies: raw['weekly_bed_value_pennies']
      ? Number(raw['weekly_bed_value_pennies'])
      : undefined,
    is_active: raw['is_active'] === 'true' || raw['is_active'] === 'on',
    hero_points: parseJsonField(raw['hero_points']),
    trust_items: parseJsonField(raw['trust_items']),
    how_it_works: parseJsonField(raw['how_it_works']),
    testimonials: parseJsonField(raw['testimonials']),
    faqs: parseJsonField(raw['faqs']),
  }
}

function parseJsonField(value: FormDataEntryValue | undefined): unknown {
  if (!value || typeof value !== 'string') return []
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

function buildJsonFields(data: ReturnType<typeof CareHomeFormSchema.parse>) {
  const content: CareHomeContent = {
    tagline: data.tagline,
    headline: data.headline,
    subheadline: data.subheadline,
    hero_points: data.hero_points.map((p) => p.text),
    about_title: data.about_title,
    about_body: data.about_body,
    about_image_url: data.about_image_url || undefined,
    trust_items: data.trust_items,
    how_it_works: data.how_it_works,
    testimonials: data.testimonials.map((t) => ({
      quote: t.quote,
      name: t.author,
      relation: t.relation,
      rating: t.rating,
    })),
    faqs: data.faqs.map((f) => ({ q: f.question, a: f.answer })),
    final_cta_headline: data.final_cta_headline,
    final_cta_body: data.final_cta_body,
    footer_text: data.footer_text,
    privacy_url: data.privacy_url || undefined,
    terms_url: data.terms_url || undefined,
    form: {
      title: data.form_title,
      subtitle: data.form_subtitle,
      cta_label: data.form_cta_label,
      care_type_options: data.care_type_options_raw
        .split('\n')
        .map((s: string) => s.trim())
        .filter(Boolean),
      timeframe_options: [
        'As soon as possible',
        'Within 1 month',
        'Within 3 months',
        'Within 6 months',
        'Just exploring options',
      ],
    },
  }

  const brand: CareHomeBrand | null =
    data.brand_primary_color || data.brand_accent_color || data.brand_logo_url
      ? {
          primary_color: data.brand_primary_color || undefined,
          accent_color: data.brand_accent_color || undefined,
          logo_url: data.brand_logo_url || undefined,
        }
      : null

  return { content, brand }
}
