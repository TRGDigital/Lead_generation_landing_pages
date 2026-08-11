'use client'

import { useState, type ReactNode } from 'react'
import { Lock, Loader2, Printer, Check } from 'lucide-react'

// Reusable email gate for the care-manager tools. The headline result stays free
// (good for SEO + UX); the full detailed breakdown + printable PDF sits behind a
// name/email capture that posts to /api/marketing-leads. Once unlocked, the
// wrapped content is revealed and a "Save as PDF" (print) button appears.
//
// The gated report should carry the `tool-print` class so the print stylesheet
// (globals.css) isolates just the report when saving to PDF.
export function ToolLeadGate({
  toolName,
  summary,
  children,
}: {
  toolName: string
  summary: string // one-line context stored with the lead
  children: ReactNode
}) {
  const [unlocked, setUnlocked] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !/.+@.+\..+/.test(email)) {
      setError('Please add your name and a valid email so we can send your report.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/marketing-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          message: `Used the ${toolName}. ${summary}`.slice(0, 2000),
          website: website || undefined,
        }),
      })
      if (!res.ok) throw new Error('Something went wrong. Please try again.')
      setUnlocked(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (unlocked) {
    return (
      <div>
        <div className="tool-print">{children}</div>
        <div className="no-print mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">
            <Check className="h-4 w-4" /> Report unlocked, we&apos;ve saved a copy to your inbox request.
          </p>
          <button type="button" onClick={() => window.print()} className="btn-cta-outline inline-flex items-center gap-2">
            <Printer className="h-4 w-4" /> Save as PDF
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-brand-pop/30 bg-brand-bg-warm/60 p-6 text-center sm:p-8">
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-pop/10">
        <Lock className="h-5 w-5 text-brand-pop" />
      </span>
      <p className="mt-4 font-display text-lg font-bold text-brand-ink">See your full report</p>
      <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-brand-ink-soft">
        Enter your details to unlock the detailed breakdown and download it as a PDF. Free, no obligation.
      </p>
      <form onSubmit={submit} className="mx-auto mt-5 max-w-md space-y-3 text-left">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
          className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@yourcarehome.co.uk"
          className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20" />
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Care home / company (optional)"
          className="w-full rounded-lg border border-brand-line px-3 py-2.5 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20" />
        {/* honeypot */}
        <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off"
          className="hidden" aria-hidden />
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className="btn-pop w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlock my full report'}
          {!busy && <span className="btn-arrow" aria-hidden>→</span>}
        </button>
      </form>
      {summary && <p className="mt-4 text-xs text-brand-ink-muted">{summary}</p>}
    </div>
  )
}
