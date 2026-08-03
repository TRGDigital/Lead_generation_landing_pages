import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Scale, Check } from 'lucide-react'
import { FundingMixCalculator } from '@/components/marketing/FundingMixCalculator'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/funding-mix-calculator', META)
}

const META: Metadata = {
  title: 'Local Authority vs Private Fees Calculator | Care Home Funding | TRG Digital',
  description:
    'Free calculator showing how much less local-authority (social services) funded residents earn your care home than private residents, per month, quarter, 6 months and year, and how your funding mix affects the bottom line.',
  alternates: { canonical: `${SITE_URL}/tools/funding-mix-calculator` },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'Why do local authority residents earn less than private residents?',
    a: 'Council (social services) fee rates are set by the local authority and are typically well below private self-funder fees, often 20% or more lower. The cost of actually caring for the resident, staff, food, heating, laundry, is the same either way, so almost the entire difference is revenue you never receive.',
  },
  {
    q: 'Do local authority residents actually lose the home money?',
    a: 'Not usually on their own. A council-funded resident normally still covers their own running costs and contributes something towards your fixed overheads, so they beat leaving the bed empty. But they earn far less than a private resident would in the same bed, and if too many of your beds are council-funded the home can tip into an overall loss. The calculator shows both the revenue gap and your net position.',
  },
  {
    q: 'What is the self-funder cross-subsidy?',
    a: 'Because councils pay below the true cost of care, most homes rely on higher private fees to balance the books, so private residents effectively subsidise council-funded ones. It is one of the biggest financial pressures in the sector, and this tool puts a number on it for your specific home.',
  },
  {
    q: 'How much less do councils pay than private families?',
    a: 'It varies by local authority and region, but council rates commonly sit at around 60 to 80 percent of private fees. Enter your own private fee and council rate, as a percentage or a set weekly amount, to see the exact difference for your home.',
  },
]

const POINTS = [
  'Compare private vs social-services revenue side by side',
  'See the loss per month, quarter, 6 and 12 months',
  'Scale it across as many beds as you like',
  'Residential and nursing modes, including FNC',
]

export default function FundingMixPage() {
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
            name: 'Local Authority vs Private Fees Calculator',
            url: `${SITE_URL}/tools/funding-mix-calculator`,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            description:
              'Free tool that shows how much less local-authority funded residents earn a care home than private residents, across a month, quarter, six months and a year.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
            provider: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
          }),
        }}
      />

      <section className="relative px-6 pb-16 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-10 right-8 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-6xl">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-4 grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24 lg:self-start lg:pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                <Scale className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Local authority vs private fees
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Council-funded residents pay far less than private residents, yet cost you the same to care for. See
                exactly what your funding mix is costing you, per bed and across the whole home, from a month to a year.
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

            <ToolTracker tool="funding-mix-calculator"><FundingMixCalculator /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the local authority vs private fees calculator
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Every care manager feels it, but few have put a precise number on it: a local-authority funded resident
              earns the home far less than a private, self-funding resident, even though the cost of caring for them,
              the staff hours, the food, the heating, the laundry, is identical. Councils set their own fee rates and
              those rates typically sit well below private fees, so the shortfall lands squarely on your bottom line.
              This free calculator turns your own beds, fees and funding mix into the real figure you&apos;re giving up,
              across a month, a quarter, six months and a full year.
            </p>
            <p>
              It only takes a moment. Choose residential or nursing, enter how many of your beds are social-services
              funded and how many are private, then your private fee and the council rate, as a percentage or a set
              weekly amount. The tool instantly shows the revenue gap on those council beds, how much a private and a
              council resident each bring in per week, and your home&apos;s overall net profit at that mix, including the
              point at which too many council beds would push the home into a loss. It&apos;s the business case for
              protecting and growing your private occupancy, in black and white.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Funding mix, explained
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
            Grow your private occupancy
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We put your home in front of the private, self-funding families searching for care near you, and deliver
            pre-qualified enquiries straight to your door.
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
