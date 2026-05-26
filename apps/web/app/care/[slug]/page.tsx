import { type Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { createServiceClient } from '@/lib/supabase/server'
import type { CareHomeContent, CareHomeBrand, PhoneTracking } from '@/lib/types/care-home'
import TopBar from '@/components/landing/TopBar'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import TrustStrip from '@/components/landing/TrustStrip'
import HowItWorks from '@/components/landing/HowItWorks'
import About from '@/components/landing/About'
import Testimonials from '@/components/landing/Testimonial'
import FAQs from '@/components/landing/FAQs'
import FinalCTA from '@/components/landing/FinalCTA'
import LandingFooter from '@/components/landing/LandingFooter'
import type { Tables } from '@db/types'

// ADR-002: Supabase JS v2 column-select inference doesn't work with our custom
// Database type. Cast query results explicitly.
type CareHomeRow = Tables<'care_homes'>

const getCareHome = cache(async (slug: string) => {
  const supabase = createServiceClient()
  const result = await supabase
    .from('care_homes')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return result.data as unknown as CareHomeRow | null
})

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const home = await getCareHome(params.slug)
  if (!home) return {}

  const content = home.content as unknown as CareHomeContent
  return {
    title: home.name,
    description: content.tagline,
    openGraph: {
      title: home.name,
      description: content.tagline,
      ...(home.hero_image_url ? { images: [home.hero_image_url] } : {}),
    },
  }
}

export default async function CareHomePage({ params }: { params: { slug: string } }) {
  const home = await getCareHome(params.slug)
  if (!home) notFound()

  const content = home.content as unknown as CareHomeContent
  const phoneTracking = home.phone_tracking as unknown as PhoneTracking | null

  // brand available for future per-home theming
  void (home.brand as unknown as CareHomeBrand | null)

  return (
    <main>
      <TopBar tagline={content.tagline} />
      <Header
        name={home.name}
        phoneDisplay={home.phone_display}
        phoneTracking={phoneTracking ?? undefined}
      />
      <Hero
        careHomeId={home.id}
        content={content}
        phoneDisplay={home.phone_display}
        phoneTracking={phoneTracking ?? undefined}
      />
      <TrustStrip cqcRating={home.cqc_rating} trustItems={content.trust_items} />
      <HowItWorks steps={content.how_it_works} />
      <About
        title={content.about_title}
        body={content.about_body}
        imageUrl={content.about_image_url}
      />
      {content.testimonials.length > 0 && (
        <Testimonials testimonials={content.testimonials} />
      )}
      <FAQs faqs={content.faqs} />
      <FinalCTA
        headline={content.final_cta_headline}
        body={content.final_cta_body}
        careHomeId={home.id}
        formConfig={content.form}
      />
      <LandingFooter
        name={home.name}
        footerText={content.footer_text}
        privacyUrl={content.privacy_url}
        termsUrl={content.terms_url}
      />
    </main>
  )
}
