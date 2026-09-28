import type { Metadata } from 'next'
import Link from 'next/link'
import { Quote } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { TESTIMONIALS } from '@/lib/testimonials'
import { TestimonialCard } from '@/components/marketing/Testimonials'
import { CountyHero, EndCta } from '@/components/marketing/county/CountySections'
import { JsonLd } from '@/components/JsonLd'
import { ORG_REF, WEBSITE_REF, SCHEMA_SITE } from '@/lib/schema'

// Every client quote in one place. Reads lib/testimonials.ts, the same list as the homepage.
//
// No Review or AggregateRating schema on purpose: Google treats reviews a business
// publishes about itself as self-serving and ignores or penalises that markup.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/reviews'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, {
    title: 'Reviews: What Care Providers Say About Us',
    description:
      'What care homes, nursing homes and care providers say about working with TRG Digital on their websites and SEO, in their own words.',
    alternates: { canonical: `${SITE_URL}${PATH}` },
  })
}

// The hero card: one line from each real quote, word for word, with who said it. No stars or
// scores, because nobody gave us any; the quotes are the evidence.
const HIGHLIGHTS: { line: string; who: string; org: string }[] = [
  { line: '5-10 new enquiries weekly', who: 'Bryoni', org: 'Crossways Care Home' },
  { line: 'fully occupied with a waiting list', who: 'Bryoni', org: 'Crossways Care Home' },
  { line: 'seamless from start to finish', who: 'A. Arbery', org: 'Ferndale Nursing Home' },
  { line: 'enquiries has increased dramatically', who: 'A. Arbery', org: 'Ferndale Nursing Home' },
  { line: 'their understanding of the sector is vast', who: 'R. Mannick', org: 'F Healthcare Ltd' },
]

function HighlightsCard() {
  return (
    <div className="rounded-3xl border-2 border-brand-ink bg-white p-4 shadow-[6px_6px_0_0_#2a2620] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">In their words</p>
      <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">What clients told us</p>
      <ul className="mt-4 divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line">
        {HIGHLIGHTS.map((h) => (
          <li key={h.line} className="flex items-start gap-3 px-3 py-3 sm:px-4">
            <Quote className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" aria-hidden />
            <span className="min-w-0">
              <span className="block text-sm font-bold text-brand-ink">“{h.line}”</span>
              <span className="mt-0.5 block text-xs text-brand-ink-soft">
                {h.who}, {h.org}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">Lines taken word for word from the reviews below.</p>
    </div>
  )
}

export default function ReviewsPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Reviews', item: `${SITE_URL}${PATH}` },
    ],
  }

  return (
    <main>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {/* An AboutPage about us, not Review markup: reviews a business publishes about itself are not eligible. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'What care providers say about TRG Digital',
          url: `${SCHEMA_SITE}${PATH}`,
          isPartOf: WEBSITE_REF,
          about: ORG_REF,
        }}
      />

      <CountyHero
        eyebrow="Reviews"
        before="What care providers"
        highlight="say about us"
        intro={
          <>
            <p>
              We only work in care, so the people best placed to tell you what we are like are the managers and owners
              we work for. These are their words, with their names on them.
            </p>
            <p>
              Want the detail behind a review? Where there is a case study, it is linked under the quote. You can also
              see{' '}
              <Link href="/work" className="font-semibold text-brand-pop underline underline-offset-2">
                our work
              </Link>{' '}
              and{' '}
              <Link href="/designs" className="font-semibold text-brand-pop underline underline-offset-2">
                example designs
              </Link>
              .
            </p>
          </>
        }
        points={['Real clients, named', 'Websites and SEO', 'Case studies where we have them']}
        primary={{ label: 'Start building your new website', href: '/start-building-your-new-website' }}
        secondary={{ label: 'See our work', href: '/work' }}
        mock={<HighlightsCard />}
      />

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </section>

      <EndCta
        title="Want results like these?"
        body="Tell us about your service and we will come back with ideas for your new website, and an honest view of what it could do for your enquiries."
        primary={{ label: 'Start building your new website', href: '/start-building-your-new-website' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </main>
  )
}
