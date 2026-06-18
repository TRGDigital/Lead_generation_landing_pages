import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator, Check } from 'lucide-react'
import { FundingCalculator } from '@/components/marketing/FundingCalculator'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Free Care Funding Calculator | Care Home Costs & Funding | TRG Digital',
  description:
    'Free care funding calculator for the UK. Estimate care home or nursing care costs and who pays — your contribution, local authority support and NHS funding — for England, Scotland, Wales and Northern Ireland.',
  alternates: { canonical: `${SITE_URL}/tools/funding-calculator` },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'How much does a care home cost in the UK?', a: 'Residential care typically costs around £800–£1,200 per week and nursing care £1,000–£1,500+ per week, varying significantly by region. London and the South East are usually higher.' },
  { q: 'What is the capital threshold for care funding?', a: 'In England and Northern Ireland, if your total assets (savings plus property, where assessable) are below £23,250 your local authority must contribute. Below £14,250 you pay nothing from capital. Scotland and Wales use different thresholds.' },
  { q: 'Does the NHS pay towards a nursing home?', a: 'If you have a primary health need, NHS Continuing Healthcare can fund the full cost. Separately, in a registered nursing home the NHS pays a weekly Funded Nursing Care (FNC) contribution directly to the home — this isn’t means tested.' },
  { q: 'What is a Deferred Payment Agreement?', a: 'A DPA lets you use your home’s value to pay for care without selling it now — the local authority pays your fees and recovers the cost later, usually when the property is sold.' },
]

const POINTS = [
  'Covers England, Scotland, Wales & NI',
  'Residential and nursing care',
  'Your contribution vs council vs NHS',
  'Flags Deferred Payment eligibility',
]

export default function FundingCalculatorPage() {
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

      {/* ── Hero + calculator ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-10 right-8 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-6xl">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-4 grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                <Calculator className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Care funding calculator
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Work out how much care will cost and who pays — your contribution, local authority support and NHS
                funding. A clear, no-sign-up estimate in under a minute.
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

            <FundingCalculator />
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Care funding, explained
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

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Helping families understand funding?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We build the websites and tools that turn confused enquirers into confident, qualified leads for your home.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Start your project
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
