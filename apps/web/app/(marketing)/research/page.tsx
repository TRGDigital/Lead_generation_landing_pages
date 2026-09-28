import type { Metadata } from 'next'
import Link from 'next/link'
import { BarChart3, FileSearch, Quote } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { countySlugs, pct } from '@/lib/locations'
import { Star, Squiggle, Dots } from '@/components/marketing/Decor'
import { DarkStats, EndCta, Faqs, FaqJsonLd } from '@/components/marketing/county/CountySections'
import national from '@/lib/data/national-snapshot.json'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'

// The research hub. The figures come from CareAssura, which holds every CQC registered
// service in England, counted by scripts/build-national.mjs into a dated snapshot. A
// snapshot rather than a live read because this page would otherwise pull all 29,000 rows
// on every cache miss, and CareAssura has been starved by crawler load before.
//
// This is the page the care press and associations can cite, so every figure carries the
// date it was counted and the source line says how to credit it.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/research'

export const revalidate = 3600

type Area = { slug: string; name: string; services: number; noWebsite: number }
type Group = { name: string; services: number; noWebsite: number }

const N = national as unknown as {
  countedAt: string
  services: number
  noWebsite: number
  types: Record<'residential' | 'nursing' | 'homeCare' | 'dementia', { services: number; noWebsite: number }>
  ratings: { outstanding: number; good: number; requiresImprovement: number; inadequate: number; notRated: number }
  regions: Group[]
  areas: Area[]
}

const fmt = (n: number) => n.toLocaleString('en-GB')
const counted = new Date(N.countedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// The register is England's. A couple of records carry a Welsh region, which is noise.
const REGIONS = N.regions.filter((r) => r.services >= 100)

// Below this an area's percentage swings on a handful of services, so it is not ranked.
const MIN_FOR_SHARE = 150

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, {
    title: 'Care Market Research: UK Care Services in Numbers',
    description: `${fmt(N.services)} CQC registered care services in England and ${pct(N.noWebsite, N.services)}% have no website. Figures by care type, region and area, from our own care directory.`,
    alternates: { canonical: `${SITE_URL}${PATH}` },
  })
}

const FAQS: [string, string][] = [
  [
    'Where do these figures come from?',
    'From CareAssura, the care directory we built and run. It holds every care service registered with the Care Quality Commission in England, with its care types, rating and website where one exists. We count the whole register, not a sample.',
  ],
  [
    'What counts as having no website?',
    'A service with no website recorded against it. Some of those belong to a group whose main site covers them, so the figure is best read as "families cannot find a site for this service", which is what matters when they search.',
  ],
  [
    'Can I use these figures in an article or report?',
    'Yes. Please credit "TRG Digital, from CareAssura data" with the date counted and a link to this page. If you need a breakdown we have not published, get in touch and we will run it.',
  ],
  [
    'How often are they updated?',
    'We recount when the register has moved enough to change the story, and the date on the page always shows when the current figures were counted.',
  ],
]

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white shadow-soft">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="bg-brand-bg-warm text-xs uppercase tracking-wider text-brand-ink-muted">
          <tr>
            {head.map((h, i) => (
              <th key={h} className={`px-4 py-3 font-semibold ${i > 0 ? 'text-right' : ''}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-line">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={`px-4 py-3 ${j > 0 ? 'text-right tabular-nums' : 'font-medium text-brand-ink'}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Block({ eyebrow, heading, intro, children, warm }: { eyebrow: string; heading: string; intro: React.ReactNode; children: React.ReactNode; warm?: boolean }) {
  return (
    <section className={`px-6 py-14 ${warm ? 'bg-brand-bg-warm' : ''}`}>
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">{eyebrow}</p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">{heading}</h2>
        <div className="mt-3 max-w-3xl text-base leading-relaxed text-brand-ink-soft">{intro}</div>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

/**
 * The hero card: share of services with no website, by region, highest first. One series,
 * so one colour and no legend; the region table further down is the accessible version,
 * and each bar carries its figures on hover.
 */
function RegionCard({ regions }: { regions: Group[] }) {
  const max = Math.max(...regions.map((r) => r.noWebsite / r.services))
  return (
    <div className="rounded-3xl border-2 border-brand-ink bg-white p-5 shadow-[6px_6px_0_0_#2a2620] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">England, counted {counted}</p>
      <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">
        Services with no website, by region
      </p>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-5xl font-bold text-brand-pop">{pct(N.noWebsite, N.services)}%</span>
        <span className="text-sm text-brand-ink-soft">
          of {fmt(N.services)} services, {fmt(N.noWebsite)} in all
        </span>
      </p>
      <ul className="mt-5 space-y-[2px]" aria-label="Share of services with no website, by region">
        {regions.map((r) => {
          const share = r.noWebsite / r.services
          return (
            <li
              key={r.name}
              className="grid grid-cols-[8.5rem_1fr_2.5rem] items-center gap-3 py-1 text-sm"
              title={`${r.name}: ${fmt(r.noWebsite)} of ${fmt(r.services)} services have no website`}
            >
              <span className="truncate text-brand-ink-soft">{r.name.replace('Yorkshire & Humberside', 'Yorkshire and Humber')}</span>
              <span className="h-3 rounded-r bg-brand-bg-warm">
                <span className="block h-3 rounded-r bg-brand-pop" style={{ width: `${(share / max) * 100}%` }} />
              </span>
              <span className="text-right font-semibold tabular-nums text-brand-ink">{pct(r.noWebsite, r.services)}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default async function ResearchPage() {
  const live = new Set(await countySlugs())
  const areaName = (a: Area) =>
    live.has(a.slug) ? (
      <Link href={`/locations/${a.slug}`} className="text-brand-pop underline underline-offset-2">
        {a.name}
      </Link>
    ) : (
      a.name
    )

  const biggest = N.areas.slice(0, 15)
  const leastOnline = N.areas
    .filter((a) => a.services >= MIN_FOR_SHARE)
    .sort((a, b) => b.noWebsite / b.services - a.noWebsite / a.services)
    .slice(0, 10)
  const regionsByGap = [...REGIONS].sort((a, b) => b.noWebsite / b.services - a.noWebsite / a.services)
  // The snapshot always has regions; the fallback only satisfies the type checker.
  const none: Group = { name: '', services: 1, noWebsite: 0 }
  const worstRegion = regionsByGap[0] ?? none
  const bestRegion = regionsByGap[regionsByGap.length - 1] ?? none

  const types: { label: string; key: keyof typeof N.types }[] = [
    { label: 'Home care', key: 'homeCare' },
    { label: 'Residential care homes', key: 'residential' },
    { label: 'Nursing homes', key: 'nursing' },
    { label: 'Services offering dementia care', key: 'dementia' },
  ]

  const rated = N.ratings.outstanding + N.ratings.good + N.ratings.requiresImprovement + N.ratings.inadequate

  return (
    <main>
      <Breadcrumbs trail={[['Research', '/research']]} />
      <FaqJsonLd faqs={FAQS} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Dataset',
            name: 'CQC registered care services in England: websites, care types and ratings',
            description: `Counts of ${fmt(N.services)} CQC registered care services in England by care type, region and local authority area, including the share with no website.`,
            url: `${SITE_URL}${PATH}`,
            creator: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            dateModified: N.countedAt,
            spatialCoverage: { '@type': 'Place', name: 'England' },
            isAccessibleForFree: true,
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-14 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute right-10 bottom-8 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-pop">
            <BarChart3 className="h-4 w-4" />
            Research
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
            The care market, <span className="text-brand-pop">in numbers</span>
          </h1>
          <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
          <div className="mt-5 max-w-3xl space-y-4 text-lg leading-relaxed text-brand-ink-soft">
            <p>
              We run CareAssura, a directory of every care service registered with the CQC in England. That gives
              us something most agencies do not have: the whole market, counted, rather than a survey of a few
              hundred.
            </p>
            <p>
              These are the figures we use to decide where care providers are hardest to find online. They are
              free to use with a credit. Counted {counted}.
            </p>
          </div>
          </div>
          <RegionCard regions={regionsByGap} />
        </div>
      </section>

      <DarkStats
        heading="England at a glance"
        note={`Every CQC registered care service in England, counted ${counted}.`}
        cards={[
          { n: fmt(N.services), l: 'registered care services' },
          { n: `${pct(N.noWebsite, N.services)}%`, l: 'have no website a family can find' },
          { n: fmt(N.noWebsite), l: 'services with no website at all' },
          { n: String(N.areas.length), l: 'local authority areas' },
        ]}
      />

      <Block
        eyebrow="By care type"
        heading="Home care is the least visible"
        intro={
          <p>
            Home care is the largest part of the register and the part families find hardest to see online. A care
            home has a building people can drive past. A home care agency with no website has almost nothing.
          </p>
        }
      >
        <Table
          head={['Care type', 'Services', 'No website', 'Share']}
          rows={types.map(({ label, key }) => [
            label,
            fmt(N.types[key].services),
            fmt(N.types[key].noWebsite),
            `${pct(N.types[key].noWebsite, N.types[key].services)}%`,
          ])}
        />
        <p className="mt-3 text-xs text-brand-ink-muted">
          A service can offer more than one type of care, so the rows add up to more than the total.
        </p>
      </Block>

      <Block
        warm
        eyebrow="By region"
        heading="Where the gap is widest"
        intro={
          <p>
            {worstRegion.name} has the highest share of services with no website, at{' '}
            {pct(worstRegion.noWebsite, worstRegion.services)}%. {bestRegion.name} has the lowest, at{' '}
            {pct(bestRegion.noWebsite, bestRegion.services)}%.
          </p>
        }
      >
        <Table
          head={['Region', 'Services', 'No website', 'Share']}
          rows={REGIONS.map((r) => [r.name, fmt(r.services), fmt(r.noWebsite), `${pct(r.noWebsite, r.services)}%`])}
        />
      </Block>

      <Block
        eyebrow="By area"
        heading="The biggest local markets"
        intro={
          <p>
            The fifteen local authority areas with the most registered services. Where we have written up an area
            in detail, the name links to it.
          </p>
        }
      >
        <Table
          head={['Area', 'Services', 'No website', 'Share']}
          rows={biggest.map((a) => [areaName(a), fmt(a.services), fmt(a.noWebsite), `${pct(a.noWebsite, a.services)}%`])}
        />
      </Block>

      <Block
        warm
        eyebrow="By area"
        heading="Where families will struggle most"
        intro={
          <p>
            The areas with the highest share of services that have no website, counting only areas with at least{' '}
            {MIN_FOR_SHARE} services so a handful of records cannot skew the order.
          </p>
        }
      >
        <Table
          head={['Area', 'Services', 'No website', 'Share']}
          rows={leastOnline.map((a) => [areaName(a), fmt(a.services), fmt(a.noWebsite), `${pct(a.noWebsite, a.services)}%`])}
        />
      </Block>

      <Block
        eyebrow="Quality"
        heading="Most services are rated Good"
        intro={
          <p>
            Of the {fmt(rated)} services with a published rating, {pct(N.ratings.good + N.ratings.outstanding, rated)}%
            are Good or Outstanding. That is why a Good rating rarely wins a family on its own: most of the services
            they compare have one too. What separates them is how easy they are to find and to understand.
          </p>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['Outstanding', N.ratings.outstanding],
            ['Good', N.ratings.good],
            ['Requires improvement', N.ratings.requiresImprovement],
            ['Inadequate', N.ratings.inadequate],
            ['Not yet rated', N.ratings.notRated],
          ].map(([l, n]) => (
            <div key={l as string} className="rounded-2xl border border-brand-line bg-white p-5 shadow-soft">
              <p className="font-display text-3xl font-bold text-brand-ink">{fmt(n as number)}</p>
              <p className="mt-1 text-sm text-brand-ink-soft">{l}</p>
            </div>
          ))}
        </div>
      </Block>

      {/* Coming next */}
      <section className="px-6 pb-14">
        <div className="mx-auto max-w-5xl rounded-3xl border-2 border-brand-ink bg-white p-8 shadow-[4px_4px_0_0_#2a2620]">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-pop">
            <FileSearch className="h-4 w-4" />
            Coming this autumn
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
            How accessible are care provider websites?
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-brand-ink-soft">
            We have tested hundreds of live care provider websites against the checks that matter most to older
            readers and their families: text size, contrast, tap targets, forms and information locked in PDFs.
            The findings, split by care setting, will be published here.
          </p>
          <Link href="/accessible-websites" className="mt-5 inline-block text-sm font-semibold text-brand-pop underline underline-offset-2">
            Why accessibility matters on a care website
          </Link>
        </div>
      </section>

      {/* Using the figures */}
      <section className="bg-brand-bg-warm px-6 py-14">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
              Using these figures
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Journalists, care associations and researchers are welcome to use anything on this page. If you need a
              breakdown we have not published, by area, care type or rating, ask and we will run it.
            </p>
            <Link href="/contact" className="btn-cta mt-6">
              Ask for a breakdown
              <span className="btn-arrow" aria-hidden>
                →
              </span>
            </Link>
          </div>
          <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">
              <Quote className="h-4 w-4" />
              How to credit
            </p>
            <p className="mt-3 font-mono text-sm leading-relaxed text-brand-ink">
              Source: TRG Digital, from CareAssura data covering all CQC registered care services in England, counted{' '}
              {counted}. {SITE_URL.replace('https://', '')}
              {PATH}
            </p>
          </div>
        </div>
      </section>

      <Faqs heading="About the data" faqs={FAQS} />

      <EndCta
        title="Is your service easy to find?"
        body="We check how your site shows up against the other services families compare you with, and tell you what to fix first."
        primary={{ label: 'Get a free audit', href: '/site-audit' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </main>
  )
}
