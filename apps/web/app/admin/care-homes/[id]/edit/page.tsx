import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import CareHomeForm from '@/components/admin/CareHomeForm'
import type { Tables } from '@db/types'
import type { CareHomeContent, CareHomeBrand } from '@/lib/types/care-home'

type HomeRow = Tables<'care_homes'>

async function getCareHome(id: string) {
  const supabase = createServiceClient()
  const { data } = await supabase.from('care_homes').select('*').eq('id', id).single()
  return data as unknown as HomeRow | null
}

export default async function EditCareHomePage({ params }: { params: { id: string } }) {
  const home = await getCareHome(params.id)
  if (!home) notFound()

  const content = home.content as unknown as CareHomeContent
  const brand = home.brand as unknown as CareHomeBrand | null

  const defaultValues = {
    name: home.name,
    slug: home.slug,
    location: home.location,
    postcode: home.postcode,
    phone_display: home.phone_display,
    cqc_rating: home.cqc_rating ?? '',
    bed_target: home.bed_target,
    weekly_bed_value_pennies: home.weekly_bed_value_pennies ?? undefined,
    is_active: home.is_active,
    hero_image_url: home.hero_image_url ?? '',
    brand_primary_color: brand?.primary_color ?? '',
    brand_accent_color: brand?.accent_color ?? '',
    brand_logo_url: brand?.logo_url ?? '',
    tagline: content.tagline,
    headline: content.headline,
    subheadline: content.subheadline,
    hero_points: content.hero_points.map((text) => ({ text })),
    about_title: content.about_title,
    about_body: content.about_body,
    about_image_url: content.about_image_url ?? '',
    trust_items: content.trust_items,
    how_it_works: content.how_it_works,
    testimonials: content.testimonials.map((t) => ({
      quote: t.quote,
      author: t.name,
      relation: t.relation,
      rating: t.rating,
    })),
    faqs: content.faqs.map((f) => ({ question: f.q, answer: f.a })),
    final_cta_headline: content.final_cta_headline,
    final_cta_body: content.final_cta_body,
    footer_text: content.footer_text ?? '',
    privacy_url: content.privacy_url ?? '',
    terms_url: content.terms_url ?? '',
    form_title: content.form.title,
    form_subtitle: content.form.subtitle,
    form_cta_label: content.form.cta_label,
    care_type_options_raw: content.form.care_type_options.join('\n'),
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit {home.name}</h1>
      <CareHomeForm homeId={home.id} defaultValues={defaultValues} />
    </div>
  )
}
