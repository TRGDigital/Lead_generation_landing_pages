import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { HomeHero } from '@/components/marketing/HomeHero'
import { BrandStrip } from '@/components/marketing/BrandStrip'
import { AgencyIntro } from '@/components/marketing/AgencyIntro'
import { PrivatePayCase } from '@/components/marketing/PrivatePayCase'
import { CoreServices } from '@/components/marketing/CoreServices'
import { GetMoreEnquiries } from '@/components/marketing/GetMoreEnquiries'
import { DemoVideo } from '@/components/marketing/DemoVideo'
import { WorkFeature } from '@/components/marketing/WorkFeature'
import { CareToolsFeature } from '@/components/marketing/CareToolsFeature'
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
import { Star, Dots } from '@/components/marketing/Decor'
import PostCard from '@/components/blog/PostCard'
import { getPublishedPosts } from '@/lib/blog'

export const revalidate = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/', META)
}

const META: Metadata = {
  title: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
  description:
    'TRG Digital is a specialist agency for the UK care sector. We increase your enquiries, build your website, and develop custom software like CareStream and CareAssura.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
    description: 'Marketing, websites and custom software, built only for the UK care sector.',
    type: 'website',
    url: SITE_URL,
    // Social image is resolved by applyPageSeo: admin override > site default.
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
      {/* JSON-LD, one block per type so every validator surfaces each clearly */}
      {([
        {
          '@type': 'Organization',
          '@id': `${SITE_URL}/#organization`,
          name: 'TRG Digital',
          legalName: 'TRG Digital Ltd',
          url: SITE_URL,
          logo: `${SITE_URL}/trg-digital-2025.png`,
          image: `${SITE_URL}/trg-digital-2025.png`,
          description: 'A specialist digital agency for the UK care sector: marketing, website development, enquiry generation and custom software, built only for care.',
          email: 'hello@trgdigital.co.uk',
          telephone: '+44 20 8064 1596',
          address: { '@type': 'PostalAddress', streetAddress: 'Suite Ra01, 195-197 Wood Street', addressLocality: 'London', postalCode: 'E17 3NU', addressCountry: 'GB' },
          areaServed: { '@type': 'Country', name: 'United Kingdom' },
          knowsAbout: ['Care home marketing', 'Care sector SEO', 'Care website design', 'Pay-per-click advertising', 'Enquiry generation', 'Care technology'],
          contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: '+44 20 8064 1596', email: 'hello@trgdigital.co.uk', areaServed: 'GB', url: `${SITE_URL}/contact` },
          identifier: { '@type': 'PropertyValue', propertyID: 'Companies House', value: '11731704' },
          founder: {
            '@type': 'Person',
            '@id': `${SITE_URL}/#len-burgess`,
            name: 'Len Burgess',
            jobTitle: 'Founder',
            worksFor: { '@id': `${SITE_URL}/#organization` },
            sameAs: ['https://www.linkedin.com/in/len-burgess-262b0833'],
          },
          sameAs: ['https://www.linkedin.com/company/trg-digital/'],
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: 'TRG Digital',
          inLanguage: 'en-GB',
          publisher: { '@id': `${SITE_URL}/#organization` },
        },
        {
          '@type': 'SiteNavigationElement',
          name: ['Home', 'Website development', 'SEO', 'Google Profile and Reviews', 'Care tools and technology', 'About', 'Knowledge Hub', 'Contact'],
          url: [SITE_URL, `${SITE_URL}/website-development`, `${SITE_URL}/seo`, `${SITE_URL}/google-business-profile`, `${SITE_URL}/care-tools`, `${SITE_URL}/about`, `${SITE_URL}/blog`, `${SITE_URL}/contact`],
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${SITE_URL}/#breadcrumb`,
          itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }],
        },
      ] as Record<string, unknown>[]).map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...schema }) }}
        />
      ))}

      <HomeHero />

      <BrandStrip />

      <AgencyIntro />

      <PrivatePayCase />

      <CoreServices />

      <GetMoreEnquiries />

      <DemoVideo />

      <CareToolsFeature />

      <ShowcaseMarquee />

      <WorkFeature />

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
        <section className="relative overflow-hidden bg-brand-bg px-6 py-24">
          <Star className="absolute left-6 top-12 hidden h-20 w-20 -rotate-12 text-brand-accent lg:block" />
          <div className="relative mx-auto max-w-6xl">
            <div className="relative rounded-3xl border-2 border-brand-pop/30 p-6 sm:p-10">
              <span className="absolute -top-3.5 left-8 bg-brand-bg px-3 font-display text-sm font-bold uppercase tracking-widest text-brand-pop">
                Knowledge Hub
              </span>
              <Star className="absolute -right-7 -top-8 h-16 w-16 rotate-12 text-brand-accent" />
              <Dots className="absolute -bottom-7 -left-7 h-20 w-20 text-brand-pop/60" />
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">Insight for the care sector</h2>
                <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-pop hover:text-brand-ink">
                  View all posts <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {latest.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
            </div>
          </div>
        </section>
      )}

      <MapSection />
    </>
  )
}
