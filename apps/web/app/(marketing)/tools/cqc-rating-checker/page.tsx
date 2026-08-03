import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Award, Check } from 'lucide-react'
import { CqcChecker } from '@/components/marketing/CqcChecker'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/cqc-rating-checker', META)
}

const META: Metadata = {
  title: 'CQC Rating Checker | Look Up Any Care Home Rating | TRG Digital',
  description:
    'Free CQC rating checker for care homes, nursing homes and home care agencies. Search by name and see the latest overall rating, the five key-question ratings and the report date, read live from the CQC register.',
  alternates: { canonical: `${SITE_URL}/tools/cqc-rating-checker` },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'What is a CQC rating?', a: 'The Care Quality Commission inspects care services in England and rates each one Outstanding, Good, Requires improvement or Inadequate. Alongside the overall rating, they rate five key questions: is the service safe, effective, caring, responsive and well-led. It is the single most trusted measure of care quality in England.' },
  { q: 'How do I check a care home CQC rating?', a: 'Type the care home, nursing home or home care agency name into the checker above and we read the latest rating live from the public CQC register. If the name is common, add the town to narrow it down, then pick the right service from the matches.' },
  { q: 'Is the CQC rating checker free?', a: 'Yes, completely free with no sign-up. We pull the information straight from the public CQC register, so you always see the current published rating.' },
  { q: 'Why should I show my CQC rating on my website?', a: 'Your CQC rating is the number-one trust signal families look for. Showing it clearly on your homepage reassures families, helps you stand out from competitors who hide it, and turns more visits into enquiries. If yours is hard to find, that is costing you.' },
]

const POINTS = [
  'Search any provider by name',
  'Overall plus all five key-question ratings',
  'Read live from the public CQC register',
  'Care homes, nursing homes and home care',
]

export default function CqcRatingPage() {
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
            name: 'CQC Rating Checker',
            url: `${SITE_URL}/tools/cqc-rating-checker`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Free tool to look up the latest CQC rating for a care home, nursing home or care provider.',
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
                <Award className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                CQC Rating Checker
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Look up any care home, nursing home or home care agency and see its latest CQC rating in seconds, the
                overall result and all five key-question ratings, read live from the public register.
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

            <ToolTracker tool="cqc-rating-checker"><CqcChecker /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          {/* About / how-to (SEO) */}
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the CQC rating checker
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              The Care Quality Commission rating is the most trusted measure of care quality in England, and it is the
              first thing many families check when they are choosing care for someone they love. Our free CQC rating
              checker lets you look up any registered care home, nursing home or home care agency by name and see its
              latest rating straight away, the overall result plus how it scored on the five key questions the CQC
              inspects: is the service safe, effective, caring, responsive and well-led. Everything is read live from
              the public CQC register, so you always see the current published position.
            </p>
            <p>
              Using it takes seconds. Type the provider name into the search box, add the town if the name is a common
              one, and pick the right service from the matches. You will see the overall rating, each key-question
              rating and the date the report was published, with a link straight through to the full CQC page. Care
              operators use it to check their own listing and their competitors, and families use it to compare homes
              with confidence. If your rating is strong, the next step is making sure every family who searches for you
              online sees it, which is exactly what a well-built care website does.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            CQC ratings, explained
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
            Make your rating work harder
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            A great CQC rating only wins enquiries if families see it. We build care websites that put it front and centre.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get a website that shows this off
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
