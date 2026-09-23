import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { StartProject } from '@/components/marketing/StartProject'
import { Star, Squiggle } from '@/components/marketing/Decor'
import { CASE_STUDIES } from '@/lib/case-studies'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

const META: Metadata = {
  title: 'Our Work: Care Provider Case Studies',
  description:
    'How TRG Digital builds new websites for care and nursing homes and uses the CQC website grader, local SEO and PPC landing pages to turn online searches into enquiries and fill empty beds faster.',
  alternates: { canonical: `${SITE_URL}/work` },
  robots: { index: true, follow: true },
}

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/work', META)
}

export default function WorkIndexPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-12 pt-16">
        <Star className="absolute right-8 top-12 hidden h-14 w-14 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Our work</p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
            Websites built to <span className="text-brand-pop">fill beds</span>
          </h1>
          <Squiggle className="mx-auto mt-5 h-6 w-56 text-brand-pop" />
          <p className="mt-6 text-lg leading-relaxed text-brand-ink-soft">
            New websites, our CQC website grader, local SEO and PPC landing pages, working as one enquiry engine for
            care and nursing homes. Here is how we do it.
          </p>
        </div>
      </section>

      {/* ── Case study grid ───────────────────────────────────────────── */}
      <section className="px-6 pb-20 pt-6">
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2">
          {CASE_STUDIES.map((cs) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-bg-warm">
                <ManagedImage
                  src={cs.mockup}
                  alt={`The ${cs.name} website`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-pop">{cs.type}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-brand-ink">{cs.name}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink-soft">{cs.lede}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
                  Read case study{' '}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-6xl rounded-2xl border border-brand-line bg-brand-bg-warm p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Design examples</p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            Not in care homes? See the designs
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">
            Clickable example designs for a residential care home, a home care and live-in service and a nursing home,
            each built the way we build a real site.
          </p>
          <Link href="/designs" className="btn-pop mt-6 h-11 px-6 text-xs">
            See the design examples
            <span className="btn-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <StartProject />
    </>
  )
}
