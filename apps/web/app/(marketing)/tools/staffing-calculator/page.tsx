import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { UsersRound, Check } from 'lucide-react'
import { StaffingCalculator } from '@/components/marketing/StaffingCalculator'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/staffing-calculator', META)
}

const META: Metadata = {
  title: 'Staffing Calculator | How Many Care Staff Does Your Home Need?',
  description:
    'Free care home staffing calculator. Turn your weekly care hours into the care staff you need, a whole-time-equivalent figure plus indicative staff on duty by day and night, to support safe-staffing planning.',
  alternates: { canonical: `${SITE_URL}/tools/staffing-calculator` },
  robots: { index: true, follow: true },
}

const POINTS = [
  'Turn care hours into staff numbers instantly',
  'See the whole-time-equivalent (WTE) you need',
  'Get indicative staff on duty, day and night',
  'Pairs with our care home dependency tool',
]

const FAQS = [
  { q: 'How many staff does a care home need?', a: 'It depends on how dependent your residents are, not just how many beds you have. The starting point is the care hours your home delivers each week. Divide that by the productive hours each contracted staff member actually works (after holiday, sickness and training) and you get the whole-time-equivalent, or WTE, staff your home needs. This calculator does that maths for you and then estimates the staff you need on duty by day and night.' },
  { q: 'How is whole-time equivalent (WTE) calculated?', a: 'One WTE is a single full-time contract, for example 37.5 hours a week. Because nobody is available every contracted hour, we apply a cover uplift for holiday, sickness and training (commonly around 20 to 25 percent) to work out the productive hours each WTE really delivers. Required WTE is then your weekly care hours divided by those productive hours per WTE.' },
  { q: 'What is a safe staff-to-resident ratio?', a: 'There is no single fixed ratio in England. CQC does not set numbers; it expects providers to use a recognised dependency tool and professional judgement to determine safe staffing for their own residents, layout and skill mix. A ratio that suits a residential home can be unsafe in a home with high dependency or complex nursing needs, so start from care hours and dependency rather than a blanket ratio.' },
  { q: 'Is this a CQC-compliant staffing assessment?', a: 'No. It is a free, indicative planning guide, not a substitute for a full, evidence-based staffing assessment or professional judgement. CQC expects providers to use a recognised dependency tool and a multi-professional approach to set and evidence safe staffing.' },
]

export default function StaffingCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Staffing Calculator',
        url: `${SITE_URL}/tools/staffing-calculator`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: 'Free tool that turns a care home\'s weekly care hours into the care staff needed, in whole-time equivalents and staff on duty.',
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
                <UsersRound className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Staffing calculator
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                How many staff do you actually need? Turn your weekly care hours into the care staff your home
                requires, a whole-time-equivalent figure plus the staff you need on duty day and night.
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

            <ToolTracker tool="staffing-calculator"><StaffingCalculator /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the staffing calculator
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Safe staffing starts with care hours, not bed numbers. Once you know how many care hours your home
              delivers each week, this calculator turns that into the care staff you need, a whole-time-equivalent
              figure that already accounts for the time your team spends on holiday, off sick or in training. It then
              estimates the staff you need on duty by day and night, so you can sanity-check your rota against the care
              your residents actually require.
            </p>
            <p>
              It pairs directly with our care home dependency tool. Assess your residents there to get the weekly care
              hours your home needs, then drop that figure straight into this calculator to see the staff behind it.
              Together they give managers a clear, transparent line from resident dependency to care hours to staff
              numbers, the foundation of a credible safe-staffing case for commissioners and inspectors. The figures
              are indicative and shown openly so you can adjust every assumption to your own home, care model and skill
              mix, alongside your professional judgement rather than in place of it.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Staffing, explained
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
            Lighten the load on your rotas
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            See where technology can take the strain out of staffing, training and compliance, so your team can spend
            more time on care.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/book-a-demo" className="btn-cta">
              See how CareStream lightens rotas
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/tools/care-home-dependency-tool" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              Start with dependency →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
