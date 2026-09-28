import type { Metadata } from 'next'
import Link from 'next/link'
import { applyPageSeo } from '@/lib/page-seo'
import { TESTIMONIALS } from '@/lib/testimonials'
import { TestimonialCard } from '@/components/marketing/Testimonials'
import { CountyHero, EndCta } from '@/components/marketing/county/CountySections'

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
