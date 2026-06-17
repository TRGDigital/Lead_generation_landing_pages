import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HomeHero } from '@/components/marketing/HomeHero'
import { BrandStrip } from '@/components/marketing/BrandStrip'
import { AgencyIntro } from '@/components/marketing/AgencyIntro'
import { CoreServices } from '@/components/marketing/CoreServices'
import { StatementBand } from '@/components/marketing/StatementBand'
import { ScrollingBanner } from '@/components/marketing/ScrollingBanner'
import { ShowcaseMarquee } from '@/components/marketing/ShowcaseMarquee'
import { ComplicatedIndustry } from '@/components/marketing/ComplicatedIndustry'
import { ProvenResults } from '@/components/marketing/ProvenResults'
import { OwnProducts } from '@/components/marketing/OwnProducts'
import { StartProject } from '@/components/marketing/StartProject'
import { Testimonials } from '@/components/marketing/Testimonials'
import { TechStack } from '@/components/marketing/TechStack'
import { MapSection } from '@/components/marketing/MapSection'
import PostCard from '@/components/blog/PostCard'
import { getPublishedPosts } from '@/lib/blog'

export const revalidate = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
  description:
    'TRG Digital is a specialist agency for the UK care sector. We increase your enquiries, build your website, and develop custom software like CareStream and CareAssura.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
    description: 'Marketing, websites and custom software, built only for the UK care sector.',
    type: 'website',
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
    description: 'Marketing, websites and custom software, built only for the UK care sector.',
  },
  robots: { index: true, follow: true },
}

export default async function HomePage() {
  const { posts } = await getPublishedPosts(1)
  const latest = posts.slice(0, 4)
  return (
    <>
      {/* JSON-LD — Organization */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'TRG Digital',
            url: SITE_URL,
            description: 'A specialist digital agency for the UK care sector: marketing, website development and custom software.',
            address: { '@type': 'PostalAddress', streetAddress: 'Suite Ra01, 195-197 Wood Street', addressLocality: 'London', postalCode: 'E17 3NU', addressCountry: 'GB' },
            contactPoint: { '@type': 'ContactPoint', contactType: 'sales', url: `${SITE_URL}/contact` },
          }),
        }}
      />

      <HomeHero />

      <BrandStrip />

      <AgencyIntro />

      <CoreServices />

      <ShowcaseMarquee />

      <ComplicatedIndustry />

      <ProvenResults />

      <OwnProducts />

      <ScrollingBanner />

      <StartProject />

      {/* Renders only when real quotes exist */}
      <Testimonials />

      <StatementBand
        tone="pop"
        sub="Stop losing enquiries to competitors who simply show up first. Let's get your home found, chosen and full."
        cta={{ label: 'Start your project', href: '#start' }}
      >
        Ready to outrank your competition and reduce empty beds?
      </StatementBand>

      <TechStack />

      {/* ── Knowledge Hub ─────────────────────────────────────────────── */}
      {latest.length > 0 && (
        <section className="bg-brand-bg-warm px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Knowledge Hub</p>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">Insight for the care sector</h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:text-brand-pop">
                View all posts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </div>
        </section>
      )}

      <MapSection />
    </>
  )
}
