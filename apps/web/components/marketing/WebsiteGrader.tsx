'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Minus, Search, RotateCcw } from 'lucide-react'
import { EnquiryButton } from '@/components/marketing/EnquiryOverlay'

type Status = 'pass' | 'warn' | 'fail'
type CheckResult = { id: string; label: string; group: string; status: Status; tip: string }
type Result = { url: string; title: string; score: number; grade: string; passed: number; warnings: number; total: number; checks: CheckResult[] }

const scoreTone = (score: number) =>
  score >= 75 ? { ring: '#16A34A', text: 'text-green-700', label: 'Strong' } : score >= 50 ? { ring: '#D97706', text: 'text-amber-600', label: 'Needs work' } : { ring: '#F0532B', text: 'text-brand-pop', label: 'Losing enquiries' }

const checkStyle: Record<Status, { box: string; dot: string; icon: typeof Check }> = {
  pass: { box: 'border-brand-line bg-white', dot: 'bg-green-500', icon: Check },
  warn: { box: 'border-amber-400/50 bg-amber-50', dot: 'bg-amber-500', icon: Minus },
  fail: { box: 'border-brand-pop/30 bg-brand-pop/5', dot: 'bg-brand-pop', icon: X },
}

export function WebsiteGrader() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  // Audit-to-booking funnel: capture the prospect + email them their report.
  const [lName, setLName] = useState('')
  const [lEmail, setLEmail] = useState('')
  const [lHp, setLHp] = useState('')
  const [lBusy, setLBusy] = useState(false)
  const [lSent, setLSent] = useState(false)
  const [lErr, setLErr] = useState('')

  async function submitLead(e: React.FormEvent) {
    e.preventDefault()
    if (!result) return
    if (!lEmail) { setLErr('Please enter your email.'); return }
    setLBusy(true); setLErr('')
    try {
      const issues = result.checks.filter((ch) => ch.status !== 'pass').map((ch) => ch.label)
      const res = await fetch('/api/grader-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: lName, email: lEmail, url: result.url, score: result.score, grade: result.grade, issues, website: lHp }),
      })
      if (!res.ok) throw new Error()
      setLSent(true)
    } catch {
      setLErr('Something went wrong. Please try again.')
    } finally {
      setLBusy(false)
    }
  }

  async function grade(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/website-grader', {
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
    const tone = scoreTone(result.score)
    const groups = Array.from(new Set(result.checks.map((c) => c.group)))
    const c = 2 * Math.PI * 52
    return (
      <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <div className="relative h-32 w-32 flex-shrink-0">
            <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#ebe9e4" strokeWidth="10" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={tone.ring} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - result.score / 100)} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-bold text-brand-ink">{result.score}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-ink-muted">/ 100</span>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className={`font-display text-2xl font-bold uppercase tracking-tight ${tone.text}`}>Grade {result.grade}: {tone.label}</p>
            <p className="mt-1 text-sm text-brand-ink-soft">{result.passed} of {result.total} checks passed{result.warnings > 0 ? `, ${result.warnings} need work` : ''} for</p>
            <p className="truncate text-sm font-semibold text-brand-ink">{result.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p>
          </div>
        </div>

        {(() => {
          const leaks = result.checks.filter((ch) => ch.status !== 'pass' && (ch.group === 'Turns visits into enquiries' || ch.group === 'Easy for older families' || ch.id.startsWith('pagespeed')))
          if (!leaks.length) return null
          return (
            <div className="mt-6 rounded-2xl border border-brand-pop/30 bg-brand-pop/5 p-5">
              <p className="font-display text-lg font-bold text-brand-pop">{leaks.length} {leaks.length === 1 ? 'thing is' : 'things are'} losing you enquiries</p>
              <p className="mt-1 text-sm text-brand-ink-soft">Each of these is a family who reaches your site and leaves without getting in touch.</p>
              <ul className="mt-3 space-y-1.5">
                {leaks.map((ch) => (
                  <li key={ch.id} className="flex items-start gap-2 text-sm font-medium text-brand-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-pop" />{ch.label}
                  </li>
                ))}
              </ul>
            </div>
          )
        })()}

        <div className="mt-6 space-y-5">
          {groups.map((g) => (
            <div key={g}>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-pop">{g}</p>
              <div className="mt-2 space-y-2">
                {result.checks.filter((ch) => ch.group === g).map((ch) => {
                  const s = checkStyle[ch.status]
                  const Icon = s.icon
                  return (
                    <div key={ch.id} className={`rounded-xl border p-3 ${s.box}`}>
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${s.dot}`}>
                          <Icon className="h-3 w-3 text-white" />
                        </span>
                        <span className="text-sm font-semibold text-brand-ink">{ch.label}</span>
                      </div>
                      {ch.status !== 'pass' && <p className="mt-1.5 pl-8 text-xs leading-relaxed text-brand-ink-soft">{ch.tip}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-2xl border border-brand-line bg-brand-bg-warm/60 p-4 text-sm leading-relaxed text-brand-ink-soft">
          This is a quick look at your homepage. A full TRG site audit goes far deeper, across every page, your Core Web
          Vitals, keyword rankings, content gaps, accessibility, local listings and dozens of signals this snapshot
          cannot see. Whatever your score today, there is almost always more to win, and we will show you exactly where.
        </p>

        <div className="mt-4 rounded-2xl bg-brand-ink p-6 text-white">
          {lSent ? (
            <div className="text-center">
              <p className="font-display text-lg font-bold uppercase tracking-tight">Your report is on its way</p>
              <p className="mt-1 text-sm text-white/70">Check your inbox. Want to talk it through now?</p>
              <EnquiryButton className="btn-cta btn-on-dark mt-4">
                Book a free review
                <span className="btn-arrow" aria-hidden>→</span>
              </EnquiryButton>
            </div>
          ) : (
            <form onSubmit={submitLead}>
              <p className="font-display text-lg font-bold uppercase tracking-tight">Get your full report + a free 15-minute review</p>
              <p className="mt-1 text-sm text-white/70">We will email your report and show you exactly how to turn this score into more enquiries. No obligation.</p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                <input value={lName} onChange={(e) => setLName(e.target.value)} placeholder="Your name" className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/50 focus:border-white/50 focus:outline-none" />
                <input value={lEmail} onChange={(e) => setLEmail(e.target.value)} type="email" placeholder="Email address" className="rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-white/50 focus:border-white/50 focus:outline-none" />
              </div>
              <input value={lHp} onChange={(e) => setLHp(e.target.value)} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0" />
              {lErr && <p className="mt-2 text-sm text-brand-accent">{lErr}</p>}
              <button type="submit" disabled={lBusy} className="btn-cta btn-on-dark mt-3 w-full disabled:opacity-60">
                {lBusy ? 'Sending…' : 'Email me my report'}
                {!lBusy && <span className="btn-arrow" aria-hidden>→</span>}
              </button>
              <p className="mt-2 text-center text-xs text-white/50">We will send your report and never share your details.</p>
            </form>
          )}
        </div>

        <button type="button" onClick={() => { setResult(null); setUrl('') }} className="btn-cta-outline mt-4 w-full">
          <RotateCcw className="h-4 w-4" /> Check another site
        </button>
        <p className="mt-3 text-center text-xs text-brand-ink-muted">A quick homepage check. A full audit goes deeper across every page.</p>
      </div>
    )
  }

  return (
    <form onSubmit={grade} className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <label className="block text-sm font-semibold text-brand-ink">Your website address</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="yourhome.co.uk"
            className="w-full rounded-lg border border-brand-line py-3 pl-9 pr-3 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
          />
        </div>
        <button type="submit" disabled={loading || !url.trim()} className="btn-pop disabled:opacity-50">
          {loading ? 'Grading…' : 'Grade my site'}
          {!loading && <span className="btn-arrow" aria-hidden>→</span>}
        </button>
      </div>
      {error && <p className="mt-3 rounded-lg bg-brand-pop/10 px-3 py-2 text-sm text-brand-pop">{error}</p>}
      {loading && <p className="mt-4 text-center text-sm text-brand-ink-soft">Running 30 checks and a live Google PageSpeed test. This can take up to a minute…</p>}
      {!loading && !error && <p className="mt-4 text-xs text-brand-ink-muted">We check your homepage against the signals families and search engines look for. No sign-up, free.</p>}
    </form>
  )
}
