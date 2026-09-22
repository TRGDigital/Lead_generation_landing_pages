import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { ArrowRight } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { SECTORS, COLLECTION_SERVICES, getSector, titleCase, firstSentence } from '@/lib/sectors'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const revalidate = 3600
export const dynamicParams = false

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export function generateStaticParams() {
  return SECTORS.map((s) => ({ sector: s.slug }))
}

export async function generateMetadata({ params }: { params: { sector: string } }): Promise<Metadata> {
  const sector = getSector(params.sector)
  if (!sector) return {}
  return applyPageSeo(`/${sector.slug}`, {
    title: `${titleCase(sector.name)} Marketing & Websites`,
    description: `Specialist marketing, websites and enquiry generation for ${sector.name.toLowerCase()}. We help ${sector.audience} get found, build trust and win quality enquiries.`,
    alternates: { canonical: `${SITE_URL}/${sector.slug}` },
    robots: { index: true, follow: true },
  })
}

export default function SectorHub({ params }: { params: { sector: string } }) {
  const sector = getSector(params.sector)
  if (!sector) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `${sector.name} marketing and websites`,
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: `Marketing, websites and enquiry generation for ${sector.name.toLowerCase()}.`,
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Who we serve</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Marketing & websites for <span className="text-brand-pop">{sector.name.toLowerCase()}</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">{sector.intro}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">Get a free review<span className="btn-arrow" aria-hidden>→</span></Link>
              <Link href="/tools/website-grader" className="btn-cta-outline">Grade your website</Link>
            </div>
          </div>
          <div className="relative">
            <ManagedImage
              src="/hero-resident.jpg"
              width={1200}
              height={686}
              alt={`Marketing and websites for ${sector.name.toLowerCase()}`}
              sizes="(max-width:1024px) 100vw, 50vw"
              className="h-auto w-full rounded-2xl border border-brand-line object-cover shadow-card"
              priority
            />
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-brand-line bg-white px-4 py-3 shadow-card sm:block">
              <p className="font-display text-lg font-bold text-brand-ink">More enquiries</p>
              <p className="text-xs text-brand-ink-muted">{sector.badge}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-20">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">The challenge</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              What {sector.name.toLowerCase()} are up against
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {sector.challenges.map((c) => (
              <div key={c.title} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                <h3 className="font-display text-lg font-semibold text-brand-ink">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services for this sector */}
      <section className="relative overflow-hidden px-6 py-20">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we help</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Our services for {sector.name.toLowerCase()}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {COLLECTION_SERVICES.map((svc) => (
              <Link key={svc.slug} href={`/${sector.slug}/${svc.slug}`} className="group flex flex-col rounded-2xl border border-brand-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card">
                <h3 className="font-display text-lg font-semibold text-brand-ink">{svc.name} for {sector.name.toLowerCase()}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink-soft">{sector.focus[svc.slug] ? firstSentence(sector.focus[svc.slug]!.body) : svc.intro}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-pop">
                  Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            {sector.cta}
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Tell us about your {sector.singular} and we will show you exactly how to get found and grow your enquiries.
          </p>
          <Link href="/contact" className="btn-cta mt-8 inline-flex">Get a free review<span className="btn-arrow" aria-hidden>→</span></Link>
        </div>
      </section>
    </>
  )
}
