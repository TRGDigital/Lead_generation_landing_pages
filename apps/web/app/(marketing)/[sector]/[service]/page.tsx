import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { Check, ArrowRight } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { SECTORS, COLLECTION_SERVICES, getSector, getCollectionService, titleCase, firstSentence, inSentence } from '@/lib/sectors'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const revalidate = 3600
export const dynamicParams = false

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export function generateStaticParams() {
  return SECTORS.flatMap((s) => COLLECTION_SERVICES.map((svc) => ({ sector: s.slug, service: svc.slug })))
}

export async function generateMetadata({ params }: { params: { sector: string; service: string } }): Promise<Metadata> {
  const sector = getSector(params.sector)
  const svc = getCollectionService(params.service)
  if (!sector || !svc) return {}
  const lower = sector.name.toLowerCase()
  return applyPageSeo(`/${sector.slug}/${svc.slug}`, {
    title: `${titleCase(svc.name)} for ${titleCase(sector.name)}`,
    description: `Specialist ${inSentence(svc.name)} for ${lower}. ${firstSentence(sector.focus[svc.slug]?.body ?? svc.intro)}`,
    alternates: { canonical: `${SITE_URL}/${sector.slug}/${svc.slug}` },
    robots: { index: true, follow: true },
  })
}

export default function SectorService({ params }: { params: { sector: string; service: string } }) {
  const sector = getSector(params.sector)
  const svc = getCollectionService(params.service)
  if (!sector || !svc) notFound()
  const lower = sector.name.toLowerCase()
  const related = COLLECTION_SERVICES.filter((s) => s.slug !== svc.slug)

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `${svc.name} for ${sector.name}`,
            serviceType: svc.name,
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: svc.intro,
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">
              <Link href={`/${sector.slug}`} className="hover:underline">{sector.name}</Link> · {svc.name}
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              {svc.name} for <span className="text-brand-pop">{lower}</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">{svc.intro}</p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-ink-soft">{svc.angle(sector)}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">Get a free review<span className="btn-arrow" aria-hidden>→</span></Link>
              <Link href={svc.mainHref} className="btn-cta-outline">More on {inSentence(svc.name)}</Link>
            </div>
          </div>
          <div className="relative">
            <ManagedImage
              src="/hero-resident.jpg"
              width={1200}
              height={686}
              alt={`${svc.name} for ${lower}`}
              sizes="(max-width:1024px) 100vw, 50vw"
              className="h-auto w-full rounded-2xl border border-brand-line object-cover shadow-card"
              priority
            />
          </div>
        </div>
      </section>

      {/* What this service means for this care setting: unique per sector × service page */}
      {sector.focus[svc.slug] && (
        <section className="relative overflow-hidden px-6 pb-20">
          <div className="mx-auto grid max-w-6xl gap-10 rounded-2xl border border-brand-line bg-white p-8 shadow-soft sm:p-10 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">For {lower}</p>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-3xl">
                What {inSentence(svc.name)} means for {lower}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{sector.focus[svc.slug]!.body}</p>
            </div>
            <ul className="space-y-3 lg:col-span-2">
              {sector.focus[svc.slug]!.points.map((pt) => (
                <li key={pt} className="flex items-start gap-3 rounded-xl bg-brand-bg-warm px-4 py-3 text-sm font-semibold text-brand-ink">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Why this sector needs this service (from sector challenges) */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-20">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Why it matters</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              What {lower} are up against
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

      {/* What we do */}
      <section className="relative overflow-hidden px-6 py-20">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              {svc.name} that {sector.outcome}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">
              We tailor our {inSentence(svc.name)} to the realities of {lower}, so the work goes straight to the
              outcome that matters: more quality enquiries, and {sector.results}. Explore the detail on our{' '}
              <Link href={svc.mainHref} className="font-semibold text-brand-pop underline-offset-2 hover:underline">{inSentence(svc.name)} page</Link>,
              or see everything we do for{' '}
              <Link href={`/${sector.slug}`} className="font-semibold text-brand-pop underline-offset-2 hover:underline">{lower}</Link>.
            </p>
          </div>
          <div className="space-y-3">
            {svc.does.map((d) => (
              <div key={d} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related services for this sector */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">More for {lower}</p>
          <h2 className="mt-2 mb-8 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">Explore the rest of our services</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <Link key={r.slug} href={`/${sector.slug}/${r.slug}`} className="group flex items-center justify-between gap-2 rounded-xl border border-brand-line bg-white px-4 py-3 shadow-soft transition hover:border-brand-pop/40">
                <span className="text-sm font-semibold text-brand-ink">{r.name}</span>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-brand-pop transition-transform group-hover:translate-x-0.5" />
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
            {svc.name} for your {sector.singular}
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Get a free review and we will show you exactly how {inSentence(svc.name)} can grow your enquiries.
          </p>
          <Link href="/contact" className="btn-cta mt-8 inline-flex">Get a free review<span className="btn-arrow" aria-hidden>→</span></Link>
        </div>
      </section>
    </>
  )
}
