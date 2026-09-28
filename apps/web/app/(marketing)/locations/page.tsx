import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { getCountyFigures, pctNoWebsite } from '@/lib/locations'
import { COUNTY_PAGE, countyHref, liveCountyList } from '@/lib/county-links'
import { CountyHero, EndCta } from '@/components/marketing/county/CountySections'
import { JsonLd } from '@/components/JsonLd'
import { ORG_REF, WEBSITE_REF, SCHEMA_SITE } from '@/lib/schema'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'

// The hub for every county: the one page that links to all of them, so none is an island.
// Reads the live list, so a county the publishing cron switches on appears here by itself.

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/locations'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, {
    title: 'Areas We Cover: Care Websites and SEO by County',
    description:
      'Care websites and care SEO county by county, with the number of registered care services in each area and how many have no website at all.',
    alternates: { canonical: `${SITE_URL}${PATH}` },
  })
}

export default async function LocationsHubPage() {
  const counties = await liveCountyList()
  const figures = await Promise.all(
    counties.map(async (c) => {
      try {
        return (await getCountyFigures(c)).stats
      } catch {
        return null
      }
    }),
  )

  return (
    <main>
      <Breadcrumbs trail={[['Areas we cover', PATH]]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Areas we cover',
          url: `${SCHEMA_SITE}${PATH}`,
          isPartOf: WEBSITE_REF,
          publisher: ORG_REF,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: counties.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `The care market in ${c.name}`,
              url: `${SCHEMA_SITE}/locations/${c.slug}`,
            })),
          },
        }}
      />

      <CountyHero
        eyebrow="Areas we cover"
        before="Care websites and search,"
        highlight="county by county"
        intro={
          <>
            <p>
              Every county has its own care market: its own towns, its own mix of care homes and home care, its own
              council and its own directories to beat. Each page below starts from the figures for that area.
            </p>
            <p>
              Ready now? You can{' '}
              <Link href="/start-building-your-new-website" className="font-semibold text-brand-pop underline underline-offset-2">
                start building your new website
              </Link>{' '}
              today, and the local figures come with it.
            </p>
          </>
        }
        points={['Figures for every county', 'Websites and SEO per area', 'New areas added as we go']}
        primary={{ label: 'Start your new website', href: '/start-building-your-new-website' }}
        secondary={{ label: 'Free audit', href: '/site-audit' }}
      />

      <section className="px-6 pb-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {counties.map((c, i) => {
            const s = figures[i]
            return (
              <div key={c.slug} className="flex flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
                <Link
                  href={countyHref('locations', c.slug)}
                  className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-tight text-brand-ink hover:text-brand-pop"
                >
                  <MapPin className="h-5 w-5 text-brand-pop" />
                  {c.name}
                </Link>
                {s && (
                  <p className="mt-2 text-sm text-brand-ink-soft">
                    {s.services.toLocaleString('en-GB')} registered care services, {pctNoWebsite(s)} in every hundred with no website.
                  </p>
                )}
                <ul className="mt-4 space-y-1.5 border-t border-brand-line pt-4 text-sm">
                  {(['locations', 'website', 'seo'] as const).map((k) => (
                    <li key={k}>
                      <Link href={countyHref(k, c.slug)} className="font-semibold text-brand-ink underline-offset-2 hover:text-brand-pop hover:underline">
                        {COUNTY_PAGE[k].label(c.name)} <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <EndCta
        title="Not in a county listed yet?"
        body="These are the counties where we have published local figures so far. If yours is not here yet, tell us where you are and we will start from your own area."
        primary={{ label: 'Start building your new website', href: '/start-building-your-new-website' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </main>
  )
}
