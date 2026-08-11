import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { PoundSterling, Check } from 'lucide-react'
import { FeeBreakEvenCalculator } from '@/components/marketing/FeeBreakEvenCalculator'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/care-fee-break-even-calculator', META)
}

const META: Metadata = {
  title: 'Care Fee Break-Even Calculator | Fee & Occupancy to Break Even',
  description:
    'Free care home break-even calculator. Enter your beds, occupancy, weekly costs and fee to see the weekly surplus or deficit, and the fee and occupancy you need to break even.',
  alternates: { canonical: `${SITE_URL}/tools/care-fee-break-even-calculator` },
  robots: { index: true, follow: true },
}

const POINTS = [
  'See your weekly surplus or deficit instantly',
  'Find the fee you need to break even',
  'Find the occupancy you need to break even',
  'Plan fees and occupancy with confidence',
]

const FAQS = [
  { q: 'How do I work out my care home break-even?', a: 'Add up your total weekly running costs (all staff and non-staff costs), then divide by the number of occupied beds to get the weekly fee per bed you need to break even. To find break-even occupancy, divide your total weekly costs by your full-capacity revenue (beds times fee) and multiply by 100. This calculator does both for you the moment you enter your figures.' },
  { q: 'What weekly fee should I charge?', a: 'At a minimum your average weekly fee needs to cover your running costs at your actual occupancy, that is your break-even fee. Sustainable homes price above that to fund reinvestment, contingency and profit. The calculator shows your break-even fee per bed so you can see the floor and build a margin on top.' },
  { q: 'What occupancy do I need to be profitable?', a: 'Break-even occupancy is the point where revenue at your current fee exactly covers your costs. Anything above that is surplus. The calculator shows your break-even occupancy percentage and how far your current occupancy sits above or below it, so you know how many beds you need to fill to move into profit.' },
]

export default function FeeBreakEvenCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Care Fee Break-Even Calculator',
        url: `${SITE_URL}/tools/care-fee-break-even-calculator`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: 'Free tool that works out the weekly fee and occupancy a care home needs to break even.',
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
                <PoundSterling className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Care fee break-even calculator
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                What fee and occupancy do you need to break even? Enter your beds, occupancy, weekly costs and fee,
                and see your weekly surplus or deficit alongside the fee and occupancy that would clear your costs.
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

            <ToolTracker tool="care-fee-break-even-calculator"><FeeBreakEvenCalculator /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the care fee break-even calculator
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Break-even is the point where the fees your home brings in exactly cover what it costs to run. Below it
              you&apos;re losing money on every week; above it every occupied bed adds to your surplus. Knowing that
              number is the foundation of sound fee-setting and occupancy planning. This free calculator turns four
              simple inputs, your beds, current occupancy, total weekly running costs and current weekly fee, into
              a clear picture: your weekly surplus or deficit, the fee per bed you&apos;d need to break even at today&apos;s
              occupancy, and the occupancy you&apos;d need to break even at today&apos;s fee.
            </p>
            <p>
              Use it to test decisions before you make them. See how filling two more beds moves you into profit, how
              much a fee uplift is worth, or how far a rise in staffing or energy costs pushes up the occupancy you
              need. It is deliberately simple and transparent so you can sanity-check the maths and adapt it to your
              own home. The figures are a planning estimate based on what you enter, not financial advice, so pair
              them with your own accounts and professional judgement.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Break-even, explained
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
            From break-even to full beds
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            See what your empty beds are costing you, then let TRG help you fill them and protect your margin.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/tools/empty-bed-calculator" className="btn-cta">
              See what empty beds cost you
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
