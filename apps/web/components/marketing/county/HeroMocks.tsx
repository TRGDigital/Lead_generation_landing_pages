import { Star as StarIcon } from 'lucide-react'
import type { CountyStats } from '@/lib/locations'

// The hero illustrations for the county pages. All three are drawn in markup rather than
// exported as images, so they stay sharp, weigh nothing and can carry live county figures.
//
// Every one of them is labelled as an illustration and marked aria-hidden where the same
// information is already in the page text, because a screen reader should not have to sit
// through a decorative mock of a website.

const FRAME =
  'overflow-hidden rounded-2xl border-2 border-brand-ink bg-white shadow-[8px_8px_0_0_#2a2620]'

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b-2 border-brand-ink bg-brand-bg-warm px-3 py-2">
      <span className="h-2 w-2 rounded-full bg-red-400" />
      <span className="h-2 w-2 rounded-full bg-amber-300" />
      <span className="h-2 w-2 rounded-full bg-green-400" />
      <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">{url}</span>
    </div>
  )
}

/**
 * What a family sees on a care website that does its job: a rating, a fee range,
 * availability this week and a way to book a visit tonight. The service is unnamed on
 * purpose, because it is an illustration rather than a client.
 */
export function CareSiteMock({ townName }: { townName: string }) {
  return (
    <div className={FRAME} aria-hidden data-nosnippet>
      <BrowserChrome url="yourcarehome.co.uk" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-brand-ink">
              Residential &amp; nursing care
            </p>
            <p className="text-xs text-brand-ink-muted">{townName}, West Sussex</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase text-green-800">
            <StarIcon className="h-3 w-3" />
            CQC Good
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {[
            ['Weekly fees from', '£1,150'],
            ['Rooms available this week', '2'],
            ['Nursing care', 'Yes'],
            ['Dementia care', 'Early to moderate'],
          ].map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-3 rounded-xl border border-brand-line px-3.5 py-2.5"
            >
              <span className="text-xs text-brand-ink-soft">{k}</span>
              <span className="text-xs font-bold text-brand-ink">{v}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <span className="flex-1 rounded-xl bg-brand-pop px-3 py-2.5 text-center text-xs font-bold uppercase text-white">
            Book a visit
          </span>
          <span className="rounded-xl border-2 border-brand-ink px-3 py-2.5 text-center text-xs font-bold uppercase text-brand-ink">
            Fees guide
          </span>
        </div>
        <p className="mt-3 text-center text-[10px] text-brand-ink-muted">
          Answered in 4 seconds, at 10.40pm, on a phone
        </p>
      </div>
    </div>
  )
}

/**
 * A Google results page for the search a family actually makes. Two directory listings
 * sit above a provider, which is the normal state of affairs, and the provider result is
 * the one with the fees, the rating and the availability in it.
 */
export function SerpMockup({
  query,
  resultCount,
  variant = 'care-home',
}: {
  query: string
  resultCount: number
  /** Which kind of provider wins the result, so the mock matches the search above it. */
  variant?: 'care-home' | 'home-care'
}) {
  const town = query.split(' in ')[1] ?? 'your town'
  const homeCare = variant === 'home-care'
  const listTitle = homeCare ? `Home care agencies in ${town}` : `12 best care homes in ${town}`
  const listTitle2 = homeCare
    ? `Care at home in ${town}: rates and reviews`
    : `Care homes in ${town}: reviews and fees`
  const winner = homeCare
    ? {
        site: 'Your home care agency',
        url: 'yourcareagency.co.uk › home-care',
        title: `Home care in ${town}, from £28 an hour`,
        desc: 'Hourly and live in care across the area, with a named team, visits from 30 minutes, and a start within 48 hours where we can.',
        rating: '4.9 · 41 reviews · Rates · Areas',
        links: ['Our rates', 'Areas we cover', 'Live in care', 'Join our team'],
      }
    : {
        site: 'Your care home',
        url: 'yourcarehome.co.uk › fees',
        title: `Care home fees and availability, ${town}`,
        desc: 'Weekly fees from £1,150, two rooms available this week, rated Good by the CQC. Book a visit online.',
        rating: '4.8 · 26 reviews · Fees · Visiting',
        links: ['Our fees', 'Availability', 'Dementia care', 'Book a visit'],
      }

  return (
    <div className={FRAME} role="img" aria-label={`An illustration of a Google results page for the search ${query}`}>
      <BrowserChrome url={`google.co.uk/search?q=${query.replace(/\s+/g, '+')}`} />
      <div className="p-5" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="flex items-center gap-2 rounded-full border border-brand-line px-4 py-2.5">
          <span className="text-sm text-[#70757a]">⌕</span>
          <span className="text-[13.5px] text-[#202124]">{query}</span>
        </div>
        <p className="mt-2 text-[11px] text-[#70757a]">
          About {resultCount.toLocaleString()} results. The first two are lists. The third is{' '}
          {homeCare ? 'an agency' : 'a home'}.
        </p>

        <div className="mt-4 space-y-4">
          {[
            { site: 'A national care directory', url: `directory.example.co.uk › ${homeCare ? 'home-care' : 'care-homes'}`, title: listTitle, desc: 'Compare providers near you. Request a brochure and a member of our team will call you back.', tag: 'Directory' },
            { site: 'Another directory', url: 'listings.example.com › providers', title: listTitle2, desc: 'Browse verified listings, read reviews and enquire online. Sponsored placements available.', tag: 'Directory' },
          ].map((r) => (
            <div key={r.site} className="opacity-60">
              <div className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-bg-warm text-[9px] font-bold text-brand-ink-muted">
                  {r.site.charAt(0)}
                </span>
                <p className="text-[11.5px] leading-tight text-[#202124]">{r.site}</p>
                <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-neutral-500">
                  {r.tag}
                </span>
              </div>
              <p className="mt-0.5 text-[10.5px] text-[#4d5156]">{r.url}</p>
              <p className="text-[15px] leading-snug text-[#1a0dab]">{r.title}</p>
              <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#4d5156]">{r.desc}</p>
            </div>
          ))}

          <div className="relative rounded-xl border-2 border-brand-pop bg-brand-pop/5 p-3.5">
            <span className="absolute -top-2.5 right-3 rounded-full bg-brand-pop px-2 py-0.5 text-[9px] font-bold uppercase text-white">
              You
            </span>
            <div className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-ink text-[9px] font-bold text-white">
                Y
              </span>
              <p className="text-[11.5px] leading-tight text-[#202124]">{winner.site}</p>
            </div>
            <p className="mt-0.5 text-[10.5px] text-[#4d5156]">{winner.url}</p>
            <p className="text-[15px] leading-snug text-[#1a0dab]">{winner.title}</p>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#4d5156]">{winner.desc}</p>
            <p className="mt-1.5 text-[11px] text-[#70757a]">
              <span className="tracking-[0.5px] text-[#e7711b]">★★★★★</span> {winner.rating}
            </p>
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              {winner.links.map((s) => (
                <span key={s} className="text-[11px] text-[#1a0dab] underline underline-offset-2">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-brand-ink-muted">
          An illustration. Google decides which enhancements it shows for any search.
        </p>
      </div>
    </div>
  )
}

/**
 * The county in a card: the figures behind the page, presented as the snapshot a provider
 * would actually want. Real numbers, so this one is not aria-hidden.
 */
export function MarketSnapshotMock({
  countyName,
  stats,
  asAt,
}: {
  countyName: string
  stats: CountyStats
  asAt: string
}) {
  const withSite = stats.services - stats.noWebsite
  const sitePct = Math.round((withSite / Math.max(stats.services, 1)) * 100)
  const bars = stats.topTowns.slice(0, 6)
  const biggest = Math.max(1, ...bars.map((b) => b.services))

  return (
    <div className={FRAME} data-nosnippet>
      <div className="flex items-center justify-between gap-3 border-b-2 border-brand-ink bg-brand-ink px-4 py-2.5">
        <p className="font-display text-xs font-bold uppercase tracking-widest text-white">
          {countyName} snapshot
        </p>
        <span className="text-[10px] text-white/60">{asAt}</span>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4">
          {[
            { n: stats.services.toLocaleString(), l: 'registered services' },
            { n: stats.noWebsite.toLocaleString(), l: 'with no website' },
            { n: stats.towns.toLocaleString(), l: 'towns' },
            { n: `${sitePct}%`, l: 'have a website of some kind' },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-brand-line px-3.5 py-2.5">
              <p className="font-display text-2xl font-bold text-brand-pop">{s.n}</p>
              <p className="text-[11px] leading-tight text-brand-ink-soft">{s.l}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-brand-ink-muted">
          Services by town
        </p>
        <div className="mt-2 space-y-1.5">
          {bars.map((b) => (
            <div key={b.name} className="flex items-center gap-2.5">
              <span className="w-24 shrink-0 truncate text-[11px] text-brand-ink-soft">{b.name}</span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-brand-bg-warm">
                <span
                  className="block h-full rounded-full bg-brand-ink"
                  style={{ width: `${Math.max(6, (b.services / biggest) * 100)}%` }}
                />
              </span>
              <span className="w-7 shrink-0 text-right text-[11px] font-bold text-brand-ink">{b.services}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-brand-ink-muted">
          Counted from CareAssura, our own directory of every registered service in the country.
        </p>
      </div>
    </div>
  )
}
