import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Wallet, Check } from 'lucide-react'
import { AgencyCostCalculator } from '@/components/marketing/AgencyCostCalculator'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/agency-staff-cost-calculator', META)
}

const META: Metadata = {
  title: 'Agency Staff Cost Calculator | What Is Agency Really Costing Your Care Home?',
  description:
    'Free agency staff cost calculator for care homes. See your annual agency spend, the premium you pay over permanent staff, and what cutting agency reliance could save you each year.',
  alternates: { canonical: `${SITE_URL}/tools/agency-staff-cost-calculator` },
  robots: { index: true, follow: true },
}

const POINTS = [
  'See your true annual agency spend',
  'Reveal the premium you pay over permanent staff',
  'Model the saving from cutting agency reliance',
  'Build the business case for permanent recruitment',
]

const FAQS = [
  { q: 'How much does agency staffing cost a care home?', a: 'It varies widely, but agency care hours often cost £25 to £35 an hour once the agency margin is added, against a permanent cost of around £13 to £17 an hour including on-costs. Enter your own hours and rates above to see your real weekly and annual agency spend.' },
  { q: 'Agency versus permanent, what is the premium?', a: 'The premium is the extra you pay for an agency hour compared with covering the same hour with permanent staff. If agency is £28 an hour and your permanent cost is £15, the premium is £13 an hour, which adds up fast across a full year of shifts. This tool shows that premium annualised.' },
  { q: 'How do I reduce agency reliance?', a: 'The most reliable levers are stronger permanent recruitment and retention, a well filled bank of your own staff, and better rota planning so shifts are covered without last-minute agency calls. Set a realistic reduction target above to see what moving that share back to permanent could save.' },
]

export default function AgencyCostCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Agency Staff Cost Calculator',
        url: `${SITE_URL}/tools/agency-staff-cost-calculator`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: 'Free tool that shows a care home its annual agency spend and the saving from reducing agency reliance.',
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
                <Wallet className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Agency staff cost calculator
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                What is agency really costing you? Put in your agency hours and rates to see your annual spend, the
                premium you pay over permanent staff, and what cutting agency reliance could save your home each year.
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

            <ToolTracker tool="agency-staff-cost-calculator"><AgencyCostCalculator /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the agency staff cost calculator
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Agency staffing is one of the biggest and least visible costs in a care home. A single line on the rota
              can look manageable week to week, but annualised, and set against what the same hours would cost with
              permanent staff, the numbers tell a very different story. This free calculator makes that cost plain:
              enter your agency hours per week, your agency rate, your permanent cost per hour including on-costs, and a
              realistic reduction target, and it works out your annual agency spend, the premium you pay over permanent
              staff, and the saving from moving a share of those hours back in house.
            </p>
            <p>
              It is deliberately simple so you can use it to build a credible business case for permanent recruitment
              and retention, or to see quickly whether investing in better rota planning and a stronger staff bank
              would pay for itself. The figures are an estimate based on what you enter, not a guarantee, so pair them
              with your own payroll data and professional judgement. Care homes, nursing homes and specialist providers
              use it to keep agency reliance, and the risk it brings to continuity of care, under control.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Agency costs, explained
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
            Ready to cut agency for good?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Stronger recruitment, better rotas and the right technology all reduce agency reliance. Let us help you
            build the plan.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get help reducing agency
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
