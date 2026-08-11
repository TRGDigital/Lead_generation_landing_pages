import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { RefreshCw, Check } from 'lucide-react'
import { TurnoverCostCalculator } from '@/components/marketing/TurnoverCostCalculator'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/staff-turnover-cost-calculator', META)
}

const META: Metadata = {
  title: 'Staff Turnover Cost Calculator | See What Losing Care Staff Costs You',
  description:
    'Free staff turnover cost calculator for care homes. See the hidden cost of losing care staff each year, and how much you could save by improving retention.',
  alternates: { canonical: `${SITE_URL}/tools/staff-turnover-cost-calculator` },
  robots: { index: true, follow: true },
}

const POINTS = [
  'See what staff turnover really costs you each year',
  'Include recruitment, induction and agency backfill',
  'Set a target turnover and see the potential saving',
  'A clear number to take to your leadership team',
]

const FAQS = [
  { q: 'How much does staff turnover cost a care home?', a: 'The cost of replacing one care worker is often put at several thousand pounds once you add up advertising and recruitment, DBS and onboarding, induction and training time, agency backfill while the role is empty and the lost productivity of a new starter. Multiply that by the number of leavers each year and the annual bill quickly runs into tens of thousands of pounds, even for a single home.' },
  { q: "What's the average care-sector turnover rate?", a: 'Turnover in adult social care has typically run around 25 to 30% a year, higher than most other sectors, though it varies a lot by role, region and provider. Care assistant roles usually see the highest turnover. Use your own figure in the calculator if you have it, and compare it against a realistic target for your home.' },
  { q: 'How do I reduce turnover in my care home?', a: 'The biggest wins come from a strong induction, good supervision and clear career progression, plus recognising and listening to staff. Reducing avoidable admin and making training and onboarding quick and consistent also helps new starters settle and stay. Tools like CareStream support retention by streamlining onboarding, training and everyday staff tasks so your team can focus on care.' },
]

export default function TurnoverCostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Staff Turnover Cost Calculator',
        url: `${SITE_URL}/tools/staff-turnover-cost-calculator`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: 'Free tool that estimates the annual cost of care staff turnover and the potential saving from improved retention.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        provider: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
      }) }} />

      <section className="relative px-6 pb-16 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-10 right-8 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-6xl">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-4 grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24 lg:self-start lg:pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                <RefreshCw className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                What is staff turnover really costing you?
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Every care worker who leaves takes recruitment, induction, agency and lost productivity costs with
                them. See the hidden annual cost of turnover in your home, and how much you could save by keeping
                more of your team.
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

            <ToolTracker tool="staff-turnover-cost-calculator"><TurnoverCostCalculator /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the staff turnover cost calculator
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Staff turnover is one of the biggest hidden costs in social care, yet it rarely shows up as a single
              line in the budget. Each leaver quietly adds recruitment and advertising, DBS and onboarding,
              induction and training time, agency cover while the post is empty and the lost productivity of a new
              starter finding their feet. This free calculator brings those costs together into one honest number,
              so you can see what turnover is costing your home each year, and what a lower rate would save.
            </p>
            <p>
              Enter your team size, your current turnover rate and a realistic cost to replace one staff member,
              then set a target you would like to reach. The tool shows your annual turnover cost, the cost at your
              target rate and the potential saving in between. It is a planning guide to support a retention
              conversation with your leadership team, not an exact forecast. Care homes, nursing homes and group
              providers use it to build the case for investing in onboarding, training and the everyday tools that
              help good people stay.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Turnover, explained
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
            Keep more of your team
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            See how CareStream streamlines onboarding, training and everyday staff tasks, so good people settle in
            and stay.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/book-a-demo" className="btn-cta">
              Book a demo
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
