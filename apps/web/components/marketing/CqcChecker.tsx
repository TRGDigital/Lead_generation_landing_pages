'use client'
import { ToolLeadPrompt } from '@/components/marketing/ToolLeadPrompt'

import { useState } from 'react'
import { Search, Star, ExternalLink, RotateCcw, MapPin } from 'lucide-react'

type KeyRating = { name: string; rating: string }
type Match = { id: string; name: string; type: string; postcode: string; overall: string; keyRatings: KeyRating[]; published: string; url: string }
type Result = { query: string; matches: Match[] }

function ratingStyle(r: string): string {
  switch (r) {
    case 'Outstanding': return 'bg-brand-accent text-brand-ink'
    case 'Good': return 'bg-green-600 text-white'
    case 'Requires improvement': return 'bg-amber-500 text-white'
    case 'Inadequate': return 'bg-red-600 text-white'
    default: return 'bg-brand-line text-brand-ink-soft'
  }
}

function RatingBadge({ rating, large }: { rating: string; large?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wide ${ratingStyle(rating)} ${large ? 'px-4 py-1.5 text-sm' : 'px-2.5 py-1 text-xs'}`}>
      {rating === 'Outstanding' && <Star className={large ? 'h-4 w-4' : 'h-3 w-3'} fill="currentColor" />}
      {rating || 'Not rated'}
    </span>
  )
}

export function CqcChecker() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [selected, setSelected] = useState(0)

  async function search(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResult(null)
    setSelected(0)
    try {
      const res = await fetch('/api/cqc-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
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

  if (result) {
    const m = result.matches[selected]
    return (
      <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
        {result.matches.length === 0 || !m ? (
          <div className="py-6 text-center">
            <p className="font-display text-lg font-bold uppercase tracking-tight text-brand-ink">No CQC match found</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-brand-ink-soft">We could not find a registered care service for &ldquo;{result.query}&rdquo;. Try the full registered name, or add the town.</p>
          </div>
        ) : (
          <>
            {result.matches.length > 1 && (
              <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">{result.matches.length} matches, pick yours</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.matches.map((opt, i) => (
                    <button key={opt.id} type="button" onClick={() => setSelected(i)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${i === selected ? 'border-brand-pop bg-brand-pop text-white' : 'border-brand-line text-brand-ink hover:border-brand-pop'}`}>
                      {opt.name}{opt.postcode ? `, ${opt.postcode}` : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-brand-line bg-brand-bg-warm/50 p-5">
              <p className="font-display text-xl font-bold leading-tight text-brand-ink">{m.name}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-brand-ink-soft">
                <span className="font-semibold text-brand-pop">{m.type}</span>
                {m.postcode && (<><span aria-hidden>·</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{m.postcode}</span></>)}
              </p>

              <div className="mt-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Overall rating</span>
                <RatingBadge rating={m.overall} large />
              </div>

              {m.keyRatings.length > 0 && (
                <div className="mt-5 space-y-2 border-t border-brand-line pt-5">
                  {m.keyRatings.map((k) => (
                    <div key={k.name} className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-brand-ink">{k.name}</span>
                      <RatingBadge rating={k.rating} />
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-brand-line pt-4 text-xs text-brand-ink-muted">
                <span>{m.published ? `Report published ${m.published}` : 'From the CQC register'}</span>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-brand-pop hover:underline">
                  View on CQC <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <ToolLeadPrompt
              toolName="CQC rating checker"
              summary={`Checked ${m.name} (${m.postcode}), rated ${m.overall}.`}
              heading="A great rating deserves to be seen"
              body="Most family searches start online. Leave your details and we will send you what homes with a rating like this do to turn it into enquiries."
              cta="Send me the rundown"
              tone="dark"
            />
          </>
        )}

        <button type="button" onClick={() => { setResult(null); setQuery('') }} className="btn-cta-outline mt-4 w-full">
          <RotateCcw className="h-4 w-4" /> Search again
        </button>
        <p className="mt-3 text-center text-xs text-brand-ink-muted">Ratings are read live from the public CQC register. Always confirm on cqc.org.uk.</p>
      </div>
    )
  }

  return (
    <form onSubmit={search} className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <label className="block text-sm font-semibold text-brand-ink">Care provider name</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Ferndale Nursing Home"
            className="w-full rounded-lg border border-brand-line py-3 pl-9 pr-3 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
          />
        </div>
        <button type="submit" disabled={loading || !query.trim()} className="btn-pop disabled:opacity-50">
          {loading ? 'Searching…' : 'Check rating'}
          {!loading && <span className="btn-arrow" aria-hidden>→</span>}
        </button>
      </div>
      {error && <p className="mt-3 rounded-lg bg-brand-pop/10 px-3 py-2 text-sm text-brand-pop">{error}</p>}
      {loading && <p className="mt-4 text-center text-sm text-brand-ink-soft">Looking up the CQC register…</p>}
      {!loading && !error && <p className="mt-4 text-xs text-brand-ink-muted">Search any CQC-registered care home, nursing home or home care agency by name. Add the town if the name is common. Free, no sign-up.</p>}
    </form>
  )
}
