import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { PhoneIncoming, Check } from 'lucide-react'
import { EnquiryValueCalculator } from '@/components/marketing/EnquiryValueCalculator'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/enquiry-value-calculator', META)
}

const META: Metadata = {
  title: 'Enquiry Value Calculator | What Is a Care Enquiry Worth?',
  description:
    'Free calculator for care homes and home care services. Put a pound figure on every enquiry, every new resident or client, and the enquiries you lose at each stage from first call to admission.',
  alternates: { canonical: `${SITE_URL}/tools/enquiry-value-calculator` },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'How much is a care home enquiry worth?',
    a: 'Take the fees one resident pays over their whole stay and multiply by the share of enquiries that end in an admission. At £1,300 a week, a two year stay and one admission for every five enquiries, each enquiry is worth around £27,000 in lifetime fees. Your own figure depends on your fees, your length of stay and how well you convert, which is what the calculator works out.',
  },
  {
    q: 'What is a good enquiry to admission rate?',
    a: 'Many care homes convert somewhere between one in four and one in eight enquiries into an admission. Well run homes that answer quickly, book a viewing on the first call and follow up afterwards tend to sit at the top of that range. Home care services often convert a higher share, because fewer enquiries are early research. Track your own for three months and use that.',
  },
  {
    q: 'Does this work for home care as well as care homes?',
    a: 'Yes. Choose Home care and the calculator works from your hourly rate, the hours a typical client has each week and how long a package usually runs. The funnel becomes enquiry, assessment and care start rather than enquiry, viewing and admission.',
  },
  {
    q: 'Why use lifetime fees rather than a single month?',
    a: 'Because one admission or new client keeps paying for as long as they stay with you. Looking only at the first month makes a lost enquiry look cheap, when in reality it can be tens of thousands of pounds of income. If you would rather see profit than fees, switch on the contribution margin.',
  },
  {
    q: 'How can I get more enquiries without paying directories?',
    a: 'Your own website is the one channel where you do not pay for every lead. A site that ranks locally, answers the questions families actually ask, shows fees and your CQC rating clearly and makes it easy to call or book a visit will bring in direct enquiries that often convert better than directory leads.',
  },
]

const POINTS = [
  'The pound value of a single enquiry',
  'Lifetime fees from one resident or client',
  'Your funnel, from enquiry to admission, visualised',
  'What you lose at each stage, and what a small lift is worth',
]

const METHOD = [
  ['Lifetime value', 'Weekly fee (or hourly rate x hours a week) x average stay in weeks. We use 52 weeks a year, so one month is 4.33 weeks.'],
  ['Enquiry value', 'Lifetime value x your enquiry to viewing rate x your viewing to admission rate. This is the headline figure.'],
  ['Admissions', 'Enquiries a month x both conversion rates, then x 12 for the year.'],
  ['Lost before a viewing', 'Enquiries that never book a viewing or assessment, each valued at what a viewing is worth to you (lifetime value x viewing to admission rate).'],
  ['Lost after a viewing', 'Viewings or assessments that do not convert, each valued at one full lifetime value.'],
  ['What if', 'Extra admissions from converting a set percentage more, or from extra enquiries at your current rates, each x lifetime value.'],
]

export default function EnquiryValuePage() {
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
            name: 'Enquiry Value Calculator',
            url: `${SITE_URL}/tools/enquiry-value-calculator`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'Free tool that shows care homes and home care services what a single enquiry is worth in lifetime fees, and what lost enquiries cost them each year.',
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
                <PhoneIncoming className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                What is an enquiry worth?
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Every phone call and web form could be a resident or client who stays with you for years. Put a pound
                figure on each enquiry, see where they drop away, and find out what a small improvement is really worth.
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

            <ToolTracker tool="enquiry-value-calculator"><EnquiryValueCalculator /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the enquiry value calculator
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Most managers know roughly how many enquiries they get, but very few know what one is worth. That makes
              it hard to judge whether a missed call, a slow reply or a viewing that never gets followed up really
              matters. It does. A resident who stays for two years, or a home care client with a steady package, can
              bring in tens of thousands of pounds, and each enquiry carries a share of that value.
            </p>
            <p>
              Choose residential, nursing or home care, enter your fees, how long people typically stay, how many
              enquiries you get and how many turn into viewings and admissions. The tool shows the value of one
              enquiry, one viewing and one new resident or client, draws your funnel, and prices the enquiries that
              slip away at each stage. The what if panel shows what converting a few more, or winning a few extra
              enquiries each month, would add over a year.
            </p>
          </div>

          <h2 className="mb-6 mt-16 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            How we worked this out
          </h2>
          <dl className="space-y-3">
            {METHOD.map(([term, desc]) => (
              <div key={term} className="rounded-xl border border-brand-line bg-white px-5 py-4">
                <dt className="text-sm font-semibold text-brand-ink">{term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-brand-ink-soft">{desc}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">
            The starting figures are typical UK values, not yours: around £1,300 a week for residential care and
            £1,550 for nursing, stays of about two years in residential and one year in nursing, and £30 an hour for
            ten hours a week over a twelve month package in home care. Conversion rates start at 40% of enquiries to a
            viewing and 50% of viewings to an admission for care homes, and 50% and 60% for home care. Change any of
            them to match your own records. Figures are fee income unless you switch on the contribution margin, and
            the tool assumes you have the room or carer hours to take on anyone you win.
          </p>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Enquiry value, explained
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
            More enquiries from your own website
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Directories charge you for every lead and list your competitors right beside you. We build care websites
            and local SEO that bring families straight to you, so every enquiry is yours at no extra cost.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/marketing" className="btn-cta">
              See how we grow enquiries
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
