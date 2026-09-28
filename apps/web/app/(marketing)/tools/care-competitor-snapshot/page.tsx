import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Radar, Check } from 'lucide-react'
import { CompetitorSnapshot } from '@/components/marketing/CompetitorSnapshot'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/care-competitor-snapshot', META)
}

const META: Metadata = {
  title: 'Local Care Competitor Snapshot | Free Tool for Care Providers',
  description:
    'Enter your postcode and see every registered care home, nursing home or home care service near you, with CQC ratings, care types and which ones have a website. Free, no sign-up.',
  alternates: { canonical: `${SITE_URL}/tools/care-competitor-snapshot` },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Where does the competitor data come from?',
    a: 'Every service in the snapshot is registered with the Care Quality Commission. We read it from CareAssura, our care directory, which holds the public CQC register for England along with the care types each service offers and whether it lists a website. It is public information about registered businesses, nothing private.',
  },
  {
    q: 'Which services count as competitors?',
    a: 'We match the type of service you pick. Care home shows services registered for residential care, nursing home shows services registered for nursing care, and home care shows domiciliary care agencies. A home that offers both residential and nursing care will appear under both, because families searching for either will find it.',
  },
  {
    q: 'Why does it matter how many competitors have a website?',
    a: 'Most families now start their search for care online. A competitor with a clear, well-found website will usually be contacted before one without, whatever their rating. If most of your local competitors are online, your website and search visibility become what sets you apart. If few are, there is a real opening for the service that is easy to find.',
  },
  {
    q: 'Does the tool check how good each competitor website is?',
    a: 'Not yet. This version shows whether a website is listed for each service, not its quality. To see how your own site measures up, try our free website grader or ask us for a free site audit, which looks at your site and your local search results in detail.',
  },
  {
    q: 'Is the competitor snapshot free?',
    a: 'Yes, completely free with no sign-up. Enter a postcode, pick your type of service and a radius, and the snapshot appears straight away. It covers care services in England, because that is where the CQC regulates.',
  },
]

const POINTS = [
  'Every CQC registered service near your postcode',
  'CQC ratings, care types and distance',
  'Who has a website, and who does not',
  'Pick your own service to see where you stand',
]

export default function CompetitorSnapshotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Local Care Competitor Snapshot',
            url: `${SITE_URL}/tools/care-competitor-snapshot`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'Free tool that shows the registered care services near a postcode, with CQC ratings, care types and which have a website.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
            provider: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
          }),
        }}
      />

      <section className="relative overflow-x-clip px-6 pb-16 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-10 right-8 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-6xl">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-4 grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24 lg:self-start lg:pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                <Radar className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Local Competitor Snapshot
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Enter your postcode and see the registered care services competing for the same families as you: how
                many there are, how they are rated, and how many of them can actually be found online.
              </p>
              <ul className="mt-6 space-y-2.5">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-brand-ink">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop/10"><Check className="h-3 w-3 text-brand-pop" /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <ToolTracker tool="care-competitor-snapshot"><CompetitorSnapshot /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the competitor snapshot
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              When a family searches for care, they are not only looking at you. They are comparing every service within
              a sensible drive or visiting distance, often on a phone, often in a hurry. This snapshot shows you that
              same field: the care homes, nursing homes or home care agencies registered with the CQC near your
              postcode, how far away each one is, the rating each one holds, the kinds of care they offer and whether
              they list a website at all.
            </p>
            <p>
              Pick your type of service and a radius that matches how far families travel to you. Three miles suits a
              busy town, ten or fifteen suits a rural area. If your own service appears in the list, select it and the
              figures change to show only your competitors, with a short read on where you stand: how many hold a
              higher rating, how many are online, and how crowded your immediate area is.
            </p>
            <p>
              The number that tends to surprise people is the website count. In some areas almost every competitor is
              online, so what separates you is how well your site is found and how quickly it turns a visit into an
              enquiry. In others, a good share of services have no website listed, which is an opening for anyone who
              is easy to find. Either way, the next step is a free site audit, where we look at your website and your
              local search results side by side.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Questions about the snapshot
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-brand-line bg-white px-6 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-ink">
                  {q}
                  <span className="shrink-0 text-lg leading-none text-brand-pop transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Be the one families find first
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We build websites and run local SEO for care providers only. A free site audit shows how you compare with
            the services on this list and what to fix first.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/site-audit" className="btn-cta">
              Get my free site audit
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/tools" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              More free tools →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
