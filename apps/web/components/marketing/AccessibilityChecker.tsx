'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Globe, CheckCircle2, AlertTriangle, XCircle, Info, RotateCcw } from 'lucide-react'
import { ToolLeadPrompt } from '@/components/marketing/ToolLeadPrompt'

type Status = 'pass' | 'warn' | 'fail' | 'info'
type Check = { id: string; label: string; status: Status; detail: string; why: string; fix: string; benchmark?: string; examples?: string[] }
type Result = {
  url: string
  score: number
  band: 'good' | 'fair' | 'poor'
  checks: Check[]
  topFixes: { id: string; label: string; fix: string }[]
  counts: { pass: number; warn: number; fail: number }
  jsHeavy: boolean
  a11yTools: string[]
  study: { measured: number; cleanSites: number; contrastPct: number; toolSites: number; toolSitesStillFailing: number }
  pagesChecked: { url: string; ok: boolean }[]
}

const BAND: Record<Result['band'], { label: string; ring: string; text: string }> = {
  good: { label: 'Good foundations', ring: 'border-green-600', text: 'text-green-700' },
  fair: { label: 'Room to improve', ring: 'border-amber-500', text: 'text-amber-600' },
  poor: { label: 'Needs work', ring: 'border-red-600', text: 'text-red-600' },
}

const STATUS_ORDER: Record<Status, number> = { fail: 0, warn: 1, pass: 2, info: 3 }

function StatusIcon({ s }: { s: Status }) {
  if (s === 'pass') return <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" aria-label="Pass" />
  if (s === 'warn') return <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" aria-label="Needs attention" />
  if (s === 'fail') return <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" aria-label="Fail" />
  return <Info className="h-5 w-5 flex-shrink-0 text-brand-ink-muted" aria-label="Not tested" />
}

function shortUrl(u: string): string {
  try {
    const x = new URL(u)
    return (x.hostname.replace(/^www\./, '') + x.pathname).replace(/\/$/, '')
  } catch {
    return u
  }
}

export function AccessibilityChecker() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  async function check(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/care-website-accessibility-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
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
    const band = BAND[result.band]
    const checks = [...result.checks].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
    return (
      <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
        <div className="flex items-center gap-5">
          <div className={`flex h-24 w-24 flex-shrink-0 flex-col items-center justify-center rounded-full border-[6px] ${band.ring}`}>
            <span className={`font-display text-3xl font-bold leading-none ${band.text}`}>{result.score}</span>
            <span className="mt-0.5 text-[11px] font-semibold text-brand-ink-muted">out of 100</span>
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-widest ${band.text}`}>{band.label}</p>
            <p className="font-display text-xl font-bold leading-tight text-brand-ink">Accessibility check</p>
            <p className="mt-1 break-all text-sm text-brand-ink-soft">{shortUrl(result.url)}</p>
            <p className="mt-1 text-xs text-brand-ink-muted">
              {result.counts.pass} passed, {result.counts.warn} to review, {result.counts.fail} failed
            </p>
          </div>
        </div>

        {result.jsHeavy && (
          <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Your homepage builds most of its content with JavaScript, so we could only read part of it. Treat this score as a rough guide.
          </p>
        )}

        {result.topFixes.length > 0 && (
          <div className="mt-6 rounded-2xl bg-brand-bg-warm p-5">
            <p className="font-display text-base font-bold uppercase tracking-tight text-brand-ink">Your top {result.topFixes.length === 1 ? 'fix' : `${result.topFixes.length} fixes`}</p>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm text-brand-ink-soft">
              {result.topFixes.map((f) => (
                <li key={f.id}>
                  <span className="font-semibold text-brand-ink">{f.label}.</span> {f.fix}
                </li>
              ))}
            </ol>
          </div>
        )}

        <ul className="mt-6 space-y-3">
          {checks.map((c) => (
            <li key={c.id} className="rounded-xl border border-brand-line p-4">
              <div className="flex gap-3">
                <StatusIcon s={c.status} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-ink">{c.label}</p>
                  <p className="mt-0.5 break-words text-sm text-brand-ink-soft">{c.detail}</p>
                </div>
              </div>
              <details className="mt-2 pl-8 text-sm">
                <summary className="cursor-pointer text-xs font-semibold text-brand-pop">Why this matters{c.status === 'fail' || c.status === 'warn' ? ' and how to fix it' : ''}</summary>
                <p className="mt-2 text-brand-ink-soft">{c.why}</p>
                {(c.status === 'fail' || c.status === 'warn') && <p className="mt-2 text-brand-ink-soft"><span className="font-semibold text-brand-ink">How to fix it:</span> {c.fix}</p>}
                {c.examples && c.examples.length > 0 && (c.status === 'fail' || c.status === 'warn') && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-brand-ink">Examples for your web developer</p>
                    <ul className="mt-1 space-y-1">
                      {c.examples.map((x) => (
                        <li key={x} className="break-all rounded bg-brand-bg-warm px-2 py-1 font-mono text-[11px] text-brand-ink-soft">{x}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {c.benchmark && <p className="mt-2 text-xs text-brand-ink-muted">{c.benchmark}</p>}
              </details>
            </li>
          ))}
        </ul>

        {result.a11yTools.length > 0 && (
          <p className="mt-5 rounded-xl border border-brand-line px-4 py-3 text-sm text-brand-ink-soft">
            We spotted {result.a11yTools.join(' and ')} on your site.{' '}
            {result.counts.fail + result.counts.warn === 0
              ? 'Good news: the page underneath passes our checks too, which is what really counts.'
              : `A toolbar or listen button can help some visitors, but it does not fix the page underneath it. In our study, all ${result.study.toolSitesStillFailing} of the ${result.study.toolSites} sites running one still failed at least one basic check.`}
          </p>
        )}

        <div className="mt-5 rounded-xl border border-dashed border-brand-line px-4 py-3 text-xs leading-relaxed text-brand-ink-soft">
          <p className="font-semibold text-brand-ink">What this check cannot see</p>
          <p className="mt-1">
            An automated scan catches only part of the accessibility guidelines (WCAG), and this is not a full audit. We read the page code, so we do not test colour contrast, keyboard use, focus, captions or how the page behaves in a real browser. Contrast is the most common problem of all: in our study of {result.study.measured} care provider websites, {result.study.contrastPct}% had text that failed the contrast standard, and only {result.study.cleanSites} passed all of our automated checks.
          </p>
        </div>

        <details className="mt-4 rounded-xl border border-brand-line px-4 py-3 text-sm">
          <summary className="cursor-pointer font-semibold text-brand-ink">Pages we checked ({result.pagesChecked.length})</summary>
          <ul className="mt-2 space-y-1.5">
            {result.pagesChecked.map((p) => (
              <li key={p.url} className="break-all text-xs text-brand-ink-soft">
                {shortUrl(p.url)} {!p.ok && <span className="text-brand-ink-muted">(could not load)</span>}
              </li>
            ))}
          </ul>
        </details>

        <ToolLeadPrompt
          toolName="care website accessibility check"
          summary={`Checked ${shortUrl(result.url)}: scored ${result.score}/100 (${result.counts.fail} failed, ${result.counts.warn} to review).${result.topFixes.length ? ` Top fixes: ${result.topFixes.map((f) => f.label).join('; ')}.` : ''}`}
          heading="Want a hand putting it right?"
          body="Leave your details and we will send you a short note on the fixes that matter most for your visitors, plus other quick wins for your site."
          cta="Send me the fixes"
          tone="dark"
        />

        <p className="mt-4 text-center text-sm text-brand-ink-soft">
          Want the full picture? <Link href="/site-audit" className="font-semibold text-brand-pop hover:underline">Get a free site audit</Link> or see{' '}
          <Link href="/accessible-websites" className="font-semibold text-brand-pop hover:underline">how we build accessible care websites</Link>.
        </p>

        <button type="button" onClick={() => { setResult(null); setError(null) }} className="btn-cta-outline mt-4 w-full">
          <RotateCcw className="h-4 w-4" /> Check another site
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={check} className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <label htmlFor="a11y-url" className="block text-sm font-semibold text-brand-ink">Your website address</label>
      <div className="relative mt-2">
        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" aria-hidden />
        <input
          id="a11y-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g. www.yourcareservice.co.uk"
          inputMode="url"
          autoComplete="url"
          className="w-full rounded-lg border border-brand-line py-3 pl-9 pr-3 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
        />
      </div>
      <button type="submit" disabled={loading || !url.trim()} className="btn-pop mt-5 w-full disabled:opacity-50">
        {loading ? 'Checking your site…' : 'Check my website'}
        {!loading && <span className="btn-arrow" aria-hidden>→</span>}
      </button>
      {error && <p className="mt-3 rounded-lg bg-brand-pop/10 px-3 py-2 text-sm text-brand-pop" role="alert">{error}</p>}
      {loading && <p className="mt-4 text-center text-sm text-brand-ink-soft" aria-live="polite">Reading your homepage and two key pages, this usually takes a few seconds…</p>}
      {!loading && !error && <p className="mt-4 text-xs text-brand-ink-muted">We check your homepage, contact page and one other key page for the accessibility problems that affect older visitors most. Free, no sign-up.</p>}
    </form>
  )
}
