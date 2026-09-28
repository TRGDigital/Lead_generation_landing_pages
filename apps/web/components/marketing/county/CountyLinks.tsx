import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { County } from '@/lib/locations'
import { COUNTY_PAGE, countyHref, liveCountyList, nearbyCounties, type CountyKind } from '@/lib/county-links'

// The links that stop the county pages being islands: neighbours on each county page, and
// the full list on the service pages. Both read the live list, so new counties join in.

const KINDS: CountyKind[] = ['locations', 'website', 'seo']

/** On a county page: the nearest counties, led by the same kind of page as this one. */
export async function NearbyCounties({ county, kind }: { county: County; kind: CountyKind }) {
  const near = await nearbyCounties(county)
  if (near.length === 0) return null
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Nearby</p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
          Counties near {county.name}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {near.map((c) => (
            <div key={c.slug} className="rounded-2xl border border-brand-line bg-white p-5 shadow-soft">
              <Link
                href={countyHref(kind, c.slug)}
                className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-tight text-brand-ink hover:text-brand-pop"
              >
                <MapPin className="h-4 w-4 text-brand-pop" />
                {COUNTY_PAGE[kind].label(c.name)}
              </Link>
              <ul className="mt-3 space-y-1.5 text-sm">
                {KINDS.filter((k) => k !== kind).map((k) => (
                  <li key={k}>
                    <Link href={countyHref(k, c.slug)} className="text-brand-ink-soft underline-offset-2 hover:text-brand-pop hover:underline">
                      {COUNTY_PAGE[k].label(c.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link href="/locations" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-pop underline-offset-2 hover:underline">
          Every area we cover <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}

/** On a service page: every live county, each linking to its page for this service. */
export async function CountyLinkGrid({ kind, heading, intro }: { kind: CountyKind; heading: string; intro: string }) {
  const counties = await liveCountyList()
  if (counties.length === 0) return null
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">{heading}</h2>
        <p className="mt-2 max-w-2xl text-brand-ink-soft">{intro}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {counties.map((c) => (
            <li key={c.slug}>
              <Link
                href={countyHref(kind, c.slug)}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop"
              >
                <MapPin className="h-3.5 w-3.5 text-brand-pop" />
                {COUNTY_PAGE[kind].label(c.name)}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/locations" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-pop underline-offset-2 hover:underline">
          Every area we cover <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
