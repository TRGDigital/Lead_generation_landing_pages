import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { DESIGNS } from '@/lib/designs'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

const META: Metadata = {
  title: 'Care Website Design Examples',
  description:
    'Example care website designs you can click through: a residential care home, a home care and live-in service and a nursing home. Every design can be applied to any care service.',
  alternates: { canonical: `${SITE_URL}/designs` },
  robots: { index: true, follow: true },
}

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/designs', META)
}

const INCLUDED = [
  'An accessibility bar on every page',
  'Live room availability, where it applies',
  'Enquiry and callback journeys built in',
  'Careers pages with pay shown up front',
  'Family care tools that win search traffic',
  'Our content management system behind it',
]

export default function DesignsPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 pb-10 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Design examples</p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
            See what your new <span className="text-brand-pop">website</span> could look like
          </h1>
          <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-brand-ink-soft">
            Every build starts with a choice of homepage designs. These are complete, clickable examples, each shown
            with content for a different kind of care service. They are our own designs, built the way we build a real
            site, so what you see is what you would get.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-ink-soft">
            Any design can be applied to any care service: the settings below just make each one feel real. Every
            provider shown is fictional.
          </p>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DESIGNS.map((d) => (
            <article key={d.slug} className="flex flex-col rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">{d.setting}</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-brand-ink">{d.name}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{d.style}</p>
              <ul className="mt-5 flex-1 space-y-2">
                {d.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-brand-ink-soft">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                    {h}
                  </li>
                ))}
              </ul>
              <Link href={`/designs/${d.slug}`} className="btn-pop mt-6 h-11 px-5 text-xs">
                View the design
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-16">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              The design is the start, not the whole job
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">
              A design only earns its keep once everything behind it is right. Whichever look you choose, the build
              includes the same foundations, and you can see the full list on our{' '}
              <Link href="/website-build" className="font-semibold text-brand-pop underline-offset-2 hover:underline">
                what&apos;s included
              </Link>{' '}
              page. For real sites we have built, with the results behind them, see our{' '}
              <Link href="/work" className="font-semibold text-brand-pop underline-offset-2 hover:underline">case studies</Link>.
            </p>
          </div>
          <div className="space-y-3">
            {INCLUDED.map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{i}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Like one of these? Let&apos;s make it yours
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Tell us about your care service and we will show you how your own content, photography and colours would
            look in the design you like best.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/website-build" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              What&apos;s included →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
