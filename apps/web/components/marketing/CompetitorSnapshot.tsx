'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, RotateCcw, Search, Star, Globe, Check, X, Target } from 'lucide-react'
import { ToolLeadPrompt } from '@/components/marketing/ToolLeadPrompt'

type ServiceType = 'care-home' | 'nursing-home' | 'home-care'
type Rating = 'Outstanding' | 'Good' | 'Requires improvement' | 'Inadequate' | 'Not yet rated'
type Competitor = {
  id: string
  name: string
  town: string
  postcode: string
  distance: number
  rating: Rating
  careTypes: string[]
  hasWebsite: boolean
}
type Snapshot = {
  place: { postcode: string; label: string }
  service: ServiceType
  radius: number
  total: number
  capped: boolean
  ratings: Record<Rating, number>
  withWebsite: number
  noWebsite: number
  competitors: Competitor[]
}

const SERVICES: { value: ServiceType; label: string; plural: string }[] = [
  { value: 'care-home', label: 'Care home', plural: 'care homes' },
  { value: 'nursing-home', label: 'Nursing home', plural: 'nursing homes' },
  { value: 'home-care', label: 'Home care', plural: 'home care services' },
]
const RADII = [3, 5, 10, 15]
const RATING_ORDER: Rating[] = ['Outstanding', 'Good', 'Requires improvement', 'Inadequate', 'Not yet rated']
const RATING_RANK: Record<Rating, number> = { Outstanding: 4, Good: 3, 'Requires improvement': 2, Inadequate: 1, 'Not yet rated': 0 }
const NEAREST = 10
const SHOW_FIRST = 15

function ratingStyle(r: Rating): string {
  switch (r) {
    case 'Outstanding': return 'bg-brand-accent text-brand-ink'
    case 'Good': return 'bg-green-600 text-white'
    case 'Requires improvement': return 'bg-amber-500 text-white'
    case 'Inadequate': return 'bg-red-600 text-white'
    default: return 'bg-brand-line text-brand-ink-soft'
  }
}

function barStyle(r: Rating): string {
  switch (r) {
    case 'Outstanding': return 'bg-brand-accent'
    case 'Good': return 'bg-green-600'
    case 'Requires improvement': return 'bg-amber-500'
    case 'Inadequate': return 'bg-red-600'
    default: return 'bg-brand-line'
  }
}

function RatingBadge({ rating }: { rating: Rating }) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${ratingStyle(rating)}`}>
      {rating === 'Outstanding' && <Star className="h-3 w-3" fill="currentColor" />}
      {rating}
    </span>
  )
}

function Stat({ value, label, tone }: { value: string; label: string; tone?: 'pop' }) {
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-4">
      <p className={`font-display text-3xl font-bold leading-none ${tone === 'pop' ? 'text-brand-pop' : 'text-brand-ink'}`}>{value}</p>
      <p className="mt-2 text-xs font-semibold leading-snug text-brand-ink-soft">{label}</p>
    </div>
  )
}

const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0)
const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)

export function CompetitorSnapshot() {
  const [postcode, setPostcode] = useState('')
  const [service, setService] = useState<ServiceType>('care-home')
  const [radius, setRadius] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Snapshot | null>(null)
  const [mineId, setMineId] = useState('')
  const [showAll, setShowAll] = useState(false)

  async function search(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResult(null)
    setMineId('')
    setShowAll(false)
    try {
      const res = await fetch('/api/competitor-snapshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postcode, service, radius }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Something went wrong. Please try again.')
      else setResult(data)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Everything below is worked out with "your" service taken out, once one is picked,
  // so the figures describe the competition rather than the market including you.
  const view = useMemo(() => {
    if (!result) return null
    const mine = result.competitors.find((c) => c.id === mineId) ?? null
    const rivals = mine ? result.competitors.filter((c) => c.id !== mine.id) : result.competitors
    const total = result.total - (mine ? 1 : 0)
    const ratings = { ...result.ratings }
    if (mine) ratings[mine.rating] = Math.max(0, ratings[mine.rating] - 1)
    const withWebsite = result.withWebsite - (mine?.hasWebsite ? 1 : 0)
    const noWebsite = total - withWebsite
    const nearest = rivals.slice(0, NEAREST)
    const nearestWithSite = nearest.filter((c) => c.hasWebsite).length
    const goodOrBetter = ratings.Outstanding + ratings.Good
    return { mine, rivals, total, ratings, withWebsite, noWebsite, nearest, nearestWithSite, goodOrBetter }
  }, [result, mineId])

  if (result && view) {
    const svc = SERVICES.find((s) => s.value === result.service) ?? SERVICES[0]!
    const { mine, rivals, total, ratings, withWebsite, noWebsite, nearest, nearestWithSite, goodOrBetter } = view
    const listed = showAll ? rivals : rivals.slice(0, SHOW_FIRST)
    const more = result.capped ? '+' : ''
    const ratedTotal = RATING_ORDER.reduce((s, r) => s + ratings[r], 0)

    const standing = mine
      ? (() => {
          const higher = rivals.filter((c) => RATING_RANK[c.rating] > RATING_RANK[mine.rating]).length
          const closer = rivals.filter((c) => c.distance < 3).length
          return { higher, closer }
        })()
      : null

    const summaryLine = `${total}${more} ${svc.plural} within ${result.radius} miles of ${result.place.postcode}. ${withWebsite} list a website, ${noWebsite} do not. ${nearestWithSite} of the ${nearest.length} nearest have a website.${mine ? ` Their service: ${mine.name}, rated ${mine.rating}, ${mine.hasWebsite ? 'has' : 'no'} website listed.` : ''}`

    return (
      <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your local snapshot</p>
        <p className="mt-1 font-display text-xl font-bold leading-tight text-brand-ink">
          {svc.label} competition within {result.radius} miles
        </p>
        <p className="mt-1 inline-flex items-center gap-1 text-sm text-brand-ink-soft">
          <MapPin className="h-3.5 w-3.5" /> {result.place.label}
        </p>

        {result.total === 0 ? (
          <div className="mt-6 rounded-2xl bg-brand-bg-warm/60 p-5 text-center">
            <p className="font-display text-lg font-bold uppercase tracking-tight text-brand-ink">No registered {svc.plural} found</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-brand-ink-soft">
              We could not find any within {result.radius} miles. Try a wider radius or a different type of service.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Stat value={`${total}${more}`} label={`${plural(total, svc.label.toLowerCase(), svc.plural)} ${mine ? 'competing with you' : 'registered nearby'}`} />
              <Stat value={`${pct(withWebsite, total)}%`} label={`list a website (${withWebsite} of ${total}${more})`} />
              <Stat value={String(noWebsite)} label={`have no website listed at all`} tone="pop" />
              <Stat value={String(goodOrBetter)} label="rated Good or Outstanding by the CQC" />
            </div>

            {nearest.length > 0 && (
              <div className="mt-4 rounded-2xl bg-brand-ink p-5 text-white">
                <p className="font-display text-lg font-bold leading-snug">
                  {nearestWithSite} of your {nearest.length} nearest competitors {plural(nearestWithSite, 'has', 'have')} a website.
                </p>
                <p className="mt-1 text-sm text-white/70">
                  {nearestWithSite === nearest.length
                    ? 'Every close competitor can be found online, so the quality of your website and your search visibility is what sets you apart.'
                    : nearestWithSite >= nearest.length / 2
                      ? 'Most close competitors are online. Families comparing services will judge you side by side with them.'
                      : 'Few close competitors are properly online, which is a real opening for a service that is easy to find.'}
                </p>
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">CQC rating mix</p>
              <div className="mt-2 flex h-3 w-full overflow-hidden rounded-full bg-brand-line" role="img" aria-label="CQC rating mix">
                {RATING_ORDER.map((r) =>
                  ratings[r] > 0 ? <div key={r} className={barStyle(r)} style={{ width: `${(ratings[r] / Math.max(ratedTotal, 1)) * 100}%` }} /> : null,
                )}
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-brand-ink-soft">
                {RATING_ORDER.map((r) => (
                  <li key={r} className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${barStyle(r)}`} />
                    <span className="flex-1">{r}</span>
                    <span className="font-semibold text-brand-ink">{ratings[r]}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.competitors.length > 0 && (
              <div className="mt-6 rounded-2xl border border-brand-line bg-brand-bg-warm/50 p-4">
                <label htmlFor="cs-mine" className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
                  <Target className="h-4 w-4 text-brand-pop" /> Is your service in this list?
                </label>
                <select
                  id="cs-mine"
                  value={mineId}
                  onChange={(e) => setMineId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-brand-line bg-white px-3 py-2.5 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
                >
                  <option value="">Pick your service to see where you stand</option>
                  {result.competitors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.town ? `, ${c.town}` : ''}
                    </option>
                  ))}
                </select>

                {mine && standing && (
                  <div className="mt-4 space-y-2 text-sm text-brand-ink">
                    <p className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{mine.name}</span>
                      <RatingBadge rating={mine.rating} />
                    </p>
                    <p className="flex items-start gap-2">
                      {mine.hasWebsite ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />}
                      {mine.hasWebsite
                        ? `You list a website, like ${withWebsite} of your ${total}${more} competitors. Now the question is whether yours shows up first.`
                        : `No website is listed for your service, while ${withWebsite} of your ${total}${more} competitors have one. Families searching online will find them first.`}
                    </p>
                    <p className="flex items-start gap-2">
                      <Star className="mt-0.5 h-4 w-4 shrink-0 text-brand-pop" />
                      {standing.higher === 0
                        ? `No nearby competitor holds a higher CQC rating than you. That is worth putting front and centre online.`
                        : `${standing.higher} of the ${rivals.length} nearest competitors ${plural(standing.higher, 'holds', 'hold')} a higher CQC rating than you.`}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-pop" />
                      {standing.closer} {plural(standing.closer, 'competitor is', 'competitors are')} within 3 miles of {result.place.postcode}.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
                Nearest {mine ? 'competitors' : svc.plural}
              </p>
              <ul className="mt-2 divide-y divide-brand-line rounded-2xl border border-brand-line">
                {listed.map((c) => (
                  <li key={c.id} className="p-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-brand-ink">{c.name}</p>
                        <p className="mt-0.5 text-xs text-brand-ink-soft">
                          {c.town || c.postcode}
                          <span aria-hidden> · </span>
                          {c.distance.toFixed(1)} miles
                        </p>
                      </div>
                      <RatingBadge rating={c.rating} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          c.hasWebsite ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
                        <Globe className="h-3 w-3" /> {c.hasWebsite ? 'Website' : 'No website'}
                      </span>
                      {c.careTypes.slice(0, 4).map((t) => (
                        <span key={t} className="rounded-full bg-brand-bg-warm px-2 py-0.5 text-[11px] font-medium text-brand-ink-soft">
                          {t}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              {rivals.length > SHOW_FIRST && (
                <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-2 w-full text-center text-sm font-semibold text-brand-pop hover:underline">
                  {showAll ? 'Show fewer' : `Show all ${rivals.length} nearest`}
                </button>
              )}
              {result.capped && (
                <p className="mt-2 text-xs text-brand-ink-muted">
                  This is a busy area, so the counts above are a minimum. Try a smaller radius for an exact figure.
                </p>
              )}
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Link href="/site-audit" className="btn-pop">
                Get a free site audit <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/contact" className="btn-cta-outline">
                Speak to TRG
              </Link>
            </div>

            <ToolLeadPrompt
              toolName="Local Competitor Snapshot"
              summary={summaryLine}
              heading="Want the full picture for your area?"
              body="Leave your details and we will send you a short read on how to stand out against these competitors online, with the quick wins first."
              cta="Send me the rundown"
              tone="dark"
            />
          </>
        )}

        <button
          type="button"
          onClick={() => {
            setResult(null)
            setMineId('')
          }}
          className="btn-cta-outline mt-4 w-full"
        >
          <RotateCcw className="h-4 w-4" /> Search again
        </button>
        <p className="mt-3 text-center text-xs text-brand-ink-muted">
          From the public CQC register via CareAssura. Website shows whether one is listed for the service, not how good it is.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={search} className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <label htmlFor="cs-postcode" className="block text-sm font-semibold text-brand-ink">Your postcode</label>
      <div className="relative mt-2">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
        <input
          id="cs-postcode"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="e.g. RH10 1AA"
          autoComplete="postal-code"
          maxLength={10}
          className="w-full rounded-lg border border-brand-line py-3 pl-9 pr-3 text-sm uppercase placeholder:normal-case focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
        />
      </div>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-brand-ink">Type of service</legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {SERVICES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setService(s.value)}
              aria-pressed={service === s.value}
              className={`rounded-lg border px-2 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
                service === s.value ? 'border-brand-pop bg-brand-pop text-white' : 'border-brand-line text-brand-ink hover:border-brand-pop'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-brand-ink">Search radius</legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {RADII.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRadius(r)}
              aria-pressed={radius === r}
              className={`rounded-lg border px-2 py-2.5 text-sm font-semibold transition-colors ${
                radius === r ? 'border-brand-pop bg-brand-pop text-white' : 'border-brand-line text-brand-ink hover:border-brand-pop'
              }`}
            >
              {r} miles
            </button>
          ))}
        </div>
      </fieldset>

      <button type="submit" disabled={loading || !postcode.trim()} className="btn-pop mt-6 w-full disabled:opacity-50">
        {loading ? 'Finding competitors…' : 'Show my competitors'}
        {!loading && <span className="btn-arrow" aria-hidden>→</span>}
      </button>
      {error && <p className="mt-3 rounded-lg bg-brand-pop/10 px-3 py-2 text-sm text-brand-pop">{error}</p>}
      {!loading && !error && (
        <p className="mt-4 text-xs text-brand-ink-muted">
          Covers every CQC registered service in England. Free, no sign-up.
        </p>
      )}
    </form>
  )
}
