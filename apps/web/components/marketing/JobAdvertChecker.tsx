'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, RotateCcw, Copy, Check, Loader2, Sparkles, ClipboardList } from 'lucide-react'
import { ToolLeadGate } from '@/components/marketing/ToolLeadGate'
import { scoreAdvert, ADVERT_MAX_CHARS, ADVERT_MIN_CHARS, type AdvertResult, type AdvertStatus } from '@/lib/job-advert-checker'

const TOOL_NAME = 'Care Job Advert Checker'

const BAND_STYLE: Record<AdvertResult['band'], string> = {
  strong: 'bg-green-600 text-white',
  good: 'bg-brand-pop text-white',
  'needs-work': 'bg-amber-500 text-white',
  struggling: 'bg-red-600 text-white',
}

const BAND_LINE: Record<AdvertResult['band'], string> = {
  strong: 'Carers will find most of what they need here. A few tweaks could still lift your response.',
  good: 'A solid start, but there are gaps carers will notice when they compare you with other adverts.',
  'needs-work': 'Carers are likely to scroll past this one. The fixes below are quick and make a real difference.',
  struggling: 'This advert is missing the basics carers look for. Fixing pay, hours and benefits first will help most.',
}

function StatusIcon({ s }: { s: AdvertStatus }) {
  if (s === 'pass') return <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" aria-label="Pass" />
  if (s === 'warn') return <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-500" aria-label="Could be better" />
  if (s === 'na') return <MinusCircle className="h-5 w-5 flex-shrink-0 text-brand-ink-muted" aria-label="Not applicable" />
  return <XCircle className="h-5 w-5 flex-shrink-0 text-red-600" aria-label="Missing" />
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }).catch(() => {})
      }}
      className="no-print inline-flex items-center gap-1.5 rounded-lg border border-brand-line px-3 py-1.5 text-xs font-semibold text-brand-ink hover:border-brand-pop hover:text-brand-pop"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  )
}

type Rewrite = { jobTitle: string; advert: string; placeholders: string[]; notes: string[]; newScore: number }

// Rendered by ToolLeadGate only once the lead has been saved, so mounting it is
// the signal to request the rewrite. The API re-checks the lead server side.
function RewritePanel({ advert }: { advert: string }) {
  const [state, setState] = useState<{ loading: boolean; error: string; data: Rewrite | null }>({ loading: true, error: '', data: null })
  const started = useRef(false)

  async function run() {
    setState({ loading: true, error: '', data: null })
    try {
      const res = await fetch('/api/job-advert-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advert }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setState({ loading: false, error: data.error || 'Something went wrong. Please try again.', data: null })
      else setState({ loading: false, error: '', data: data as Rewrite })
    } catch {
      setState({ loading: false, error: 'Network error. Please try again.', data: null })
    }
  }

  useEffect(() => {
    if (started.current) return
    started.current = true
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (state.loading) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-line bg-white p-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand-pop" />
        <p className="text-sm font-semibold text-brand-ink">Rewriting your advert</p>
        <p className="text-xs text-brand-ink-muted">This usually takes 10 to 20 seconds.</p>
      </div>
    )
  }
  if (state.error || !state.data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-700">{state.error}</p>
        <button type="button" onClick={run} className="btn-cta-outline mt-4">Try again</button>
      </div>
    )
  }

  const d = state.data
  return (
    <div className="rounded-2xl border border-brand-line bg-white p-5 text-left sm:p-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-brand-pop" />
        <p className="font-display text-lg font-bold text-brand-ink">Your rewritten advert</p>
      </div>

      {d.jobTitle && (
        <div className="mt-4 rounded-xl bg-brand-bg-warm/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Suggested job title for Indeed and Google for Jobs</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-brand-ink">{d.jobTitle}</p>
            <CopyButton text={d.jobTitle} label="Copy title" />
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
          Advert{typeof d.newScore === 'number' ? `, scores ${d.newScore}/100 once the gaps are filled in` : ''}
        </p>
        <CopyButton text={d.advert} label="Copy advert" />
      </div>
      <div className="mt-2 whitespace-pre-wrap rounded-xl border border-brand-line p-4 text-sm leading-relaxed text-brand-ink">{d.advert}</div>

      {d.placeholders.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">Fill these in before you post</p>
          <p className="mt-1 text-xs text-amber-800/80">We never make up facts. Anything your original advert did not say is marked like [add: hourly rate].</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {d.placeholders.map((p) => (
              <li key={p} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-amber-900">{p}</li>
            ))}
          </ul>
        </div>
      )}

      {d.notes.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-brand-ink-soft">
          {d.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      )}
      <p className="mt-4 text-xs text-brand-ink-muted">Written with AI from your original advert. Please check every detail is accurate before posting.</p>
    </div>
  )
}

export function JobAdvertChecker() {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<AdvertResult | null>(null)
  const [scored, setScored] = useState('')

  function check(e: React.FormEvent) {
    e.preventDefault()
    const t = text.trim()
    if (t.length < ADVERT_MIN_CHARS) {
      setError('Please paste the full advert so we can check it properly.')
      return
    }
    setError('')
    setScored(t.slice(0, ADVERT_MAX_CHARS))
    setResult(scoreAdvert(t))
  }

  function reset() {
    setResult(null)
    setScored('')
  }

  if (result) {
    const fixes = result.checks.filter((c) => c.status === 'fail' || c.status === 'warn').length
    return (
      <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
        <div className={`flex items-center gap-4 rounded-2xl p-5 ${BAND_STYLE[result.band]}`}>
          <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-full bg-white/20">
            <span className="font-display text-2xl font-bold leading-none">{result.score}</span>
            <span className="text-[10px] font-semibold opacity-90">/ 100</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest opacity-90">{result.roleLabel}</p>
            <p className="font-display text-xl font-bold leading-tight">{result.bandLabel}</p>
            <p className="mt-1 text-sm opacity-90">{BAND_LINE[result.band]}</p>
          </div>
        </div>

        <ul className="mt-5 space-y-3">
          {result.checks.map((c) => (
            <li key={c.id} className="flex gap-3 rounded-xl border border-brand-line p-4">
              <StatusIcon s={c.status} />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-brand-ink">{c.label}</p>
                <p className="mt-0.5 break-words text-sm text-brand-ink-soft">{c.detail}</p>
                {c.status !== 'na' && c.status !== 'pass' && (
                  <p className="mt-1.5 text-xs leading-relaxed text-brand-ink-muted"><span className="font-semibold">Why it matters:</span> {c.why}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="font-display text-base font-bold uppercase tracking-tight text-brand-ink">Get a rewritten advert</p>
          <p className="mt-1 text-sm text-brand-ink-soft">
            We will rewrite your advert to fix {fixes > 0 ? `the ${fixes} point${fixes === 1 ? '' : 's'} above` : 'the finer points'}, and suggest a job title that works on Indeed and Google for Jobs.
            We only use facts from your advert and mark anything missing for you to fill in.
          </p>
          <div className="mt-4">
            <ToolLeadGate
              toolName={TOOL_NAME}
              copy={{
                heading: 'Get your rewritten advert',
                body: 'Enter your details and we will rewrite your advert in a few seconds. Free, no obligation.',
                button: 'Rewrite my advert',
                unlocked: 'Here is your rewritten advert. Check any [add: ...] gaps before you post it.',
                pdf: false,
              }}
              summary={`Advert scored ${result.score}/100 (${result.bandLabel.toLowerCase()}, ${result.roleLabel.toLowerCase()}), ${result.wordCount} words. Asked for an AI rewrite.`}
            >
              <RewritePanel advert={scored} />
            </ToolLeadGate>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-brand-ink-soft">
          Struggling to fill shifts? See how we help with{' '}
          <Link href="/carer-recruitment" className="font-semibold text-brand-pop hover:underline">carer recruitment</Link>.
        </p>

        <button type="button" onClick={reset} className="btn-cta-outline mt-4 w-full">
          <RotateCcw className="h-4 w-4" /> Check another advert
        </button>
        <p className="mt-3 text-center text-xs text-brand-ink-muted">
          The score is an automated check against what makes carers apply. It is a guide, not a guarantee.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={check} className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <label htmlFor="jac-advert" className="flex items-center gap-2 text-sm font-semibold text-brand-ink">
        <ClipboardList className="h-4 w-4 text-brand-pop" /> Paste your job advert
      </label>
      <textarea
        id="jac-advert"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={ADVERT_MAX_CHARS}
        rows={12}
        placeholder="Paste the full advert here, as it appears on Indeed, your website or social media. Care assistant, senior carer, nurse or home care worker adverts all work."
        className="mt-2 w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm leading-relaxed focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
      />
      <p className="mt-1 text-right text-xs text-brand-ink-muted">{text.length.toLocaleString()} / {ADVERT_MAX_CHARS.toLocaleString()}</p>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" className="btn-pop mt-4 w-full">
        Check my advert
        <span className="btn-arrow" aria-hidden>→</span>
      </button>
      <p className="mt-3 text-center text-xs text-brand-ink-muted">Instant and free. Your advert is checked in your browser and is not stored.</p>
    </form>
  )
}
