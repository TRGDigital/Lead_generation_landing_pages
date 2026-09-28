'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Globe, Search, CheckCircle2, AlertTriangle, XCircle, ExternalLink, RotateCcw, Copy, Check, X } from 'lucide-react'
import { ToolLeadPrompt } from '@/components/marketing/ToolLeadPrompt'

type Status = 'pass' | 'warn' | 'fail'
type Verdict = 'pass' | 'attention' | 'fail'
type Match = { id: string; name: string; type: string; postcode: string; overall: string }
type Result = {
  url: string
  verdict: Verdict
  headline: string
  checks: { id: string; label: string; status: Status; detail: string }[]
  fixes: { text: string; code?: string }[]
  jsHeavy: boolean
  widget: { page: string; onHomepage: boolean; locationId: string | null; type: string | null; inFooter: boolean } | null
  shownRatings: string[]
  live: { id: string; name: string; overall: string; published: string; url: string; postcode: string } | null
  locationSource: 'selected' | 'widget' | 'link' | null
  pagesChecked: { url: string; ok: boolean; widget: boolean; mention: boolean }[]
}

const VERDICT: Record<Verdict, { label: string; box: string; Icon: typeof CheckCircle2 }> = {
  pass: { label: 'Pass', box: 'bg-green-600 text-white', Icon: CheckCircle2 },
  attention: { label: 'Needs attention', box: 'bg-amber-500 text-white', Icon: AlertTriangle },
  fail: { label: 'Fail', box: 'bg-red-600 text-white', Icon: XCircle },
}

function StatusIcon({ s }: { s: Status }) {
  if (s === 'pass') return <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" aria-label="Pass" />
  if (s === 'warn') return <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" aria-label="Needs attention" />
  return <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" aria-label="Fail" />
}

function shortUrl(u: string): string {
  try {
    const x = new URL(u)
    return (x.hostname.replace(/^www\./, '') + x.pathname).replace(/\/$/, '')
  } catch {
    return u
  }
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="relative mt-2">
      <pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-brand-ink p-3 pr-10 text-[11px] leading-relaxed text-white/90">{code}</pre>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }).catch(() => {})
        }}
        className="absolute right-2 top-2 rounded-md bg-white/10 p-1.5 text-white hover:bg-white/20"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}

export function CqcDisplayChecker() {
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [searching, setSearching] = useState(false)
  const [matches, setMatches] = useState<Match[] | null>(null)
  const [picked, setPicked] = useState<Match | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  async function findService() {
    if (!name.trim()) return
    setSearching(true)
    setMatches(null)
    setError(null)
    try {
      const res = await fetch('/api/cqc-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: name }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'We could not search the CQC register just now.')
      else setMatches(data.matches || [])
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  async function check(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/cqc-rating-display-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, locationId: picked?.id }),
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

  function reset() {
    setResult(null)
    setError(null)
  }

  if (result) {
    const v = VERDICT[result.verdict]
    const live = result.live
    return (
      <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
        <div className={`flex items-start gap-3 rounded-2xl p-5 ${v.box}`}>
          <v.Icon className="mt-0.5 h-7 w-7 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-90">{v.label}</p>
            <p className="font-display text-xl font-bold leading-tight">{result.headline}</p>
            <p className="mt-1 break-all text-sm opacity-90">{shortUrl(result.url)}</p>
          </div>
        </div>

        {live && (
          <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-brand-line bg-brand-bg-warm/50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Live CQC rating</p>
              <p className="font-semibold text-brand-ink">{live.name}</p>
              <p className="text-xs text-brand-ink-soft">
                {live.published ? `Published ${live.published}` : 'From the CQC register'}
                {result.locationSource === 'widget' && ', matched from your widget'}
                {result.locationSource === 'link' && ', matched from a CQC link on your site'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-brand-ink px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">{live.overall || 'Not rated'}</span>
              <a href={live.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-brand-pop hover:underline">
                CQC page <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}

        <ul className="mt-5 space-y-3">
          {result.checks.map((c) => (
            <li key={c.id} className="flex gap-3 rounded-xl border border-brand-line p-4">
              <StatusIcon s={c.status} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-ink">{c.label}</p>
                <p className="mt-0.5 break-words text-sm text-brand-ink-soft">{c.detail}</p>
              </div>
            </li>
          ))}
        </ul>

        {result.fixes.length > 0 && (
          <div className="mt-6">
            <p className="font-display text-base font-bold uppercase tracking-tight text-brand-ink">How to fix it</p>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm text-brand-ink-soft">
              {result.fixes.map((f) => (
                <li key={f.text}>
                  {f.text}
                  {f.code && <CodeBlock code={f.code} />}
                </li>
              ))}
            </ol>
          </div>
        )}

        <details className="mt-5 rounded-xl border border-brand-line px-4 py-3 text-sm">
          <summary className="cursor-pointer font-semibold text-brand-ink">Pages we checked ({result.pagesChecked.length})</summary>
          <ul className="mt-2 space-y-1.5">
            {result.pagesChecked.map((p) => (
              <li key={p.url} className="flex flex-wrap items-center gap-x-2 text-xs text-brand-ink-soft">
                <span className="break-all">{shortUrl(p.url)}</span>
                {!p.ok && <span className="text-brand-ink-muted">(could not load)</span>}
                {p.widget && <span className="rounded-full bg-green-600/10 px-2 py-0.5 font-semibold text-green-700">widget</span>}
                {p.mention && <span className="rounded-full bg-brand-pop/10 px-2 py-0.5 font-semibold text-brand-pop">rating mentioned</span>}
              </li>
            ))}
          </ul>
        </details>

        <ToolLeadPrompt
          toolName="CQC rating display checker"
          summary={`Checked ${shortUrl(result.url)}: ${VERDICT[result.verdict].label.toLowerCase()}, ${result.headline}.${live ? ` Live rating ${live.overall}.` : ''}`}
          heading="Want us to sort it for you?"
          body="Leave your details and we will send you a short note on how to get your rating showing properly, plus other quick wins for your site."
          cta="Send me the fixes"
          tone="dark"
        />

        <p className="mt-4 text-center text-sm text-brand-ink-soft">
          Want the full picture? <Link href="/site-audit" className="font-semibold text-brand-pop hover:underline">Get a free site audit</Link> or{' '}
          <Link href="/contact" className="font-semibold text-brand-pop hover:underline">speak to us</Link>.
        </p>

        <button type="button" onClick={reset} className="btn-cta-outline mt-4 w-full">
          <RotateCcw className="h-4 w-4" /> Check another site
        </button>
        <p className="mt-3 text-center text-xs text-brand-ink-muted">
          We read your pages the way a search engine does. A widget added by a tag manager or loaded after the page opens may not show here. Always confirm on cqc.org.uk.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={check} className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <label htmlFor="cqcd-url" className="block text-sm font-semibold text-brand-ink">Your website address</label>
      <div className="relative mt-2">
        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
        <input
          id="cqcd-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g. www.yourcarehome.co.uk"
          inputMode="url"
          autoComplete="url"
          className="w-full rounded-lg border border-brand-line py-3 pl-9 pr-3 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
        />
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-brand-line p-4">
        <p className="text-sm font-semibold text-brand-ink">Your CQC service <span className="font-normal text-brand-ink-muted">(optional, recommended)</span></p>
        <p className="mt-0.5 text-xs text-brand-ink-muted">Pick your service so we can compare your site with your live CQC rating.</p>
        {picked ? (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-brand-bg-warm px-3 py-2 text-sm">
            <span className="min-w-0">
              <span className="font-semibold text-brand-ink">{picked.name}</span>
              <span className="text-brand-ink-soft">{picked.postcode ? `, ${picked.postcode}` : ''}{picked.overall ? `, rated ${picked.overall}` : ''}</span>
            </span>
            <button type="button" onClick={() => setPicked(null)} className="rounded p-1 text-brand-ink-muted hover:text-brand-ink" aria-label="Clear service">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      findService()
                    }
                  }}
                  placeholder="Service name, e.g. Ferndale Nursing Home"
                  aria-label="CQC service name"
                  className="w-full rounded-lg border border-brand-line py-2.5 pl-9 pr-3 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
                />
              </div>
              <button type="button" onClick={findService} disabled={searching || !name.trim()} className="btn-cta-outline disabled:opacity-50">
                {searching ? 'Searching…' : 'Find'}
              </button>
            </div>
            {matches && matches.length === 0 && <p className="mt-2 text-xs text-brand-ink-soft">No match found. Try the full registered name, or add the town.</p>}
            {matches && matches.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {matches.map((m) => (
                  <button key={m.id} type="button" onClick={() => { setPicked(m); setMatches(null) }} className="rounded-full border border-brand-line px-3 py-1.5 text-left text-xs font-semibold text-brand-ink transition-colors hover:border-brand-pop">
                    {m.name}{m.postcode ? `, ${m.postcode}` : ''}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <button type="submit" disabled={loading || !url.trim()} className="btn-pop mt-5 w-full disabled:opacity-50">
        {loading ? 'Checking your site…' : 'Check my website'}
        {!loading && <span className="btn-arrow" aria-hidden>→</span>}
      </button>
      {error && <p className="mt-3 rounded-lg bg-brand-pop/10 px-3 py-2 text-sm text-brand-pop">{error}</p>}
      {loading && <p className="mt-4 text-center text-sm text-brand-ink-soft">Reading your homepage and a few key pages, this takes up to 20 seconds…</p>}
      {!loading && !error && <p className="mt-4 text-xs text-brand-ink-muted">We check your homepage and up to four likely pages for the official CQC widget or a written rating. Free, no sign-up.</p>}
    </form>
  )
}
