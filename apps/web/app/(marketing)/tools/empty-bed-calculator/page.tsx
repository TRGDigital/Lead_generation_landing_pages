import type { Metadata } from 'next'
import Link from 'next/link'
import { BedDouble, Check } from 'lucide-react'
import { EmptyBedCalculator } from '@/components/marketing/EmptyBedCalculator'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Cost of an Empty Bed Calculator | Care Home Occupancy | TRG Digital',
  description:
    'Free calculator showing how much empty beds cost your care home — per week, month and year. See the revenue you lose to vacancies, and what filling them is worth.',
  alternates: { canonical: `${SITE_URL}/tools/empty-bed-calculator` },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'How much does an empty care home bed cost?', a: 'It’s simply the weekly fee you’d charge, lost for every week the bed sits empty. At £1,100 per week, a single empty bed costs around £57,200 a year — and most homes have more than one vacancy at a time.' },
  { q: 'How long do beds usually stay empty?', a: 'Without proactive marketing, vacancies often take 8–12 weeks to fill through word of mouth and referrals — every week of which is revenue gone for good.' },
  { q: 'How can I fill empty beds faster?', a: 'Targeted advertising and a high-converting website put your home in front of families actively searching for care nearby, and deliver pre-qualified enquiries — turning weeks of vacancy into days.' },
]

const POINTS = [
  'See the true weekly, monthly & yearly cost',
  'Account for how long beds sit empty',
  'Updates instantly as you type',
  'Turn the number into a plan to fill them',
]

export default function EmptyBedPage() {
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

      <section className="relative overflow-hidden px-6 pb-16 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-10 right-8 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-6xl">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-4 grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                <BedDouble className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                The cost of an empty bed
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Every empty bed is revenue gone for good. Enter your fee, how many beds are empty and for how long —
                and see exactly what those vacancies are costing you.
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

            <EmptyBedCalculator />
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Empty beds, explained
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
            Stop losing money to empty beds
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We deliver pre-qualified enquiries straight to your home — you only pay per qualified lead.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/marketing" className="btn-cta">
              See how we fill beds
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
