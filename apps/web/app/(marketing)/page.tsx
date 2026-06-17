import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Megaphone, Globe, Code2, ArrowRight } from 'lucide-react'
import { HomeHero } from '@/components/marketing/HomeHero'
import { BrandStrip } from '@/components/marketing/BrandStrip'
import { AgencyIntro } from '@/components/marketing/AgencyIntro'
import { StatementBand } from '@/components/marketing/StatementBand'
import { ScrollingBanner } from '@/components/marketing/ScrollingBanner'
import { ShowcaseMarquee } from '@/components/marketing/ShowcaseMarquee'
import { ComplicatedIndustry } from '@/components/marketing/ComplicatedIndustry'
import { ProvenResults } from '@/components/marketing/ProvenResults'
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

const SERVICES = [
  {
    Icon: Megaphone,
    title: 'More enquiries, faster',
    kicker: 'Marketing',
    body: 'Targeted PPC and high-converting landing pages that bring qualified enquiries to your door and fill empty beds on demand.',
    includes: ['Google & Meta Ads', 'SEO', 'Landing pages'],
    href: '/marketing',
  },
  {
    Icon: Globe,
    title: 'Websites that win business',
    kicker: 'Website Development',
    body: 'Modern, fast, search-optimised websites built specifically for care providers, designed to grow your exposure and turn visitors into enquiries.',
    includes: ['Mobile-first', 'SEO-built', 'Fast & secure'],
    href: '/website-development',
  },
  {
    Icon: Code2,
    title: 'Software built for care',
    kicker: 'Custom Development',
    body: 'Bespoke tools and platforms for the sector, including our own products CareStream and CareAssura.',
    includes: ['Custom platforms', 'AI tools', 'Integrations'],
    href: '/development',
  },
]

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

      {/* ── Services ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Three ways we grow your care business
            </h2>
            <p className="mt-4 text-brand-ink-soft">
              From the first enquiry to the software that runs behind the scenes, we cover the digital
              side of care so you can focus on delivering it.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SERVICES.map(({ Icon, title, kicker, body, includes, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl border border-brand-line bg-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 transition-colors group-hover:bg-brand-pop">
                  <Icon className="h-6 w-6 text-brand-pop transition-colors group-hover:text-white" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-brand-pop">{kicker}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {includes.map((tag) => (
                    <span key={tag} className="rounded-full bg-brand-bg-warm px-2.5 py-1 text-xs font-medium text-brand-ink-soft">{tag}</span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-pop">
                  Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ShowcaseMarquee />

      <ComplicatedIndustry />

      <ProvenResults />

      {/* ── Our own products ──────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-pop">Built by us</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              We build our own software for care
            </h2>
            <p className="mt-4 text-brand-ink-soft">
              We do not just talk about custom development, we ship it. Two of our own products are live
              and used across the sector today.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { name: 'CareStreamAI', logo: '/products/carestream-logo.png', logoW: 700, logoH: 210, logoClass: 'h-14', body: 'Policies, training, audits and CQC tools, answered for care staff in over 60 languages, grounded in the provider’s own documents.', href: 'https://carestreamai.com' },
              { name: 'CareAssura', logo: '/products/careassura-logo.webp', logoW: 364, logoH: 91, logoClass: 'h-14', body: 'A UK care home directory that helps families find, compare and choose the right care with confidence.', href: 'https://careassura.co.uk' },
            ].map(({ name, logo, logoW, logoH, logoClass, body, href }) => (
              <div key={name} className="rounded-2xl border border-brand-line bg-white p-8 shadow-soft">
                <Image src={logo} alt={name} width={logoW} height={logoH} className={`${logoClass} w-auto`} />
                <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-pop hover:text-brand-ink">
                    Visit site <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/development" className="text-brand-ink-soft hover:text-brand-ink">Read more</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
