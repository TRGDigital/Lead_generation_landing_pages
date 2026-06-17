'use client'

import { useState, useTransition } from 'react'
import { CheckCircle } from 'lucide-react'

// Free care website & enquiry audit — a soft, high-intent lead magnet. Posts to the
// existing /api/marketing-leads endpoint (the site URL + goal are folded into the
// message; `website` stays the empty honeypot the API expects).
export function AuditForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [goal, setGoal] = useState('')
  const [company, setCompany] = useState('') // honeypot (maps to API `website`)
  const [pending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (name.trim().length < 2) return setError('Please enter your name.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError('Please enter a valid email.')

    const message = [
      'FREE AUDIT REQUEST',
      `Website: ${siteUrl.trim() || '(not provided)'}`,
      `Goal: ${goal.trim() || '(not specified)'}`,
    ].join('\n')

    startTransition(async () => {
      try {
        const res = await fetch('/api/marketing-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), message, website: company }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(typeof json.error === 'string' ? json.error : 'Something went wrong. Please try again.')
        } else {
          setSubmitted(true)
        }
      } catch {
        setError('Network error. Please try again.')
      }
    })
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-12 rounded-3xl border border-brand-line bg-brand-bg-warm p-8 shadow-soft lg:grid-cols-2 lg:p-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Free audit</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Get a free care website &amp; enquiry audit
          </h2>
          <p className="mt-4 leading-relaxed text-brand-ink-soft">
            We&apos;ll review your website, search visibility and enquiry journey, then send you a short,
            no-obligation report with the quickest wins to bring in more enquiries.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-brand-ink-soft">
            {['Where families drop off before enquiring', 'How you rank against local competitors', 'The fastest wins to lift enquiries'].map((p) => (
              <li key={p} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-line bg-white p-10 text-center shadow-soft">
            <CheckCircle className="h-12 w-12 text-brand-accent" />
            <h3 className="font-display text-2xl font-semibold text-brand-ink">Thanks!</h3>
            <p className="max-w-sm text-sm text-brand-ink-soft">
              Your audit request is in. We&apos;ll review your site and be in touch within one business day.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-brand-line bg-white p-6 shadow-soft sm:p-8">
            {/* honeypot */}
            <input value={company} onChange={(e) => setCompany(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name"
                className="w-full rounded-lg border border-brand-line px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" autoComplete="email"
                className="w-full rounded-lg border border-brand-line px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
            </div>
            <input value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} placeholder="Your website (e.g. yourhome.co.uk)"
              className="w-full rounded-lg border border-brand-line px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
            <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={3} placeholder="What would you most like to improve? (optional)"
              className="w-full rounded-lg border border-brand-line px-3.5 py-2.5 text-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20" />
            {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={pending}
              className="h-12 w-full rounded-xl bg-brand-accent text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-ink hover:text-white disabled:opacity-60">
              {pending ? 'Sending…' : 'Get my free audit'}
            </button>
            <p className="text-center text-xs text-brand-ink-muted">
              No obligation. We respond within one business day.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
