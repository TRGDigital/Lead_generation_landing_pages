'use client'

import { useState } from 'react'
import { Loader2, Check } from 'lucide-react'
import { getAttribution } from '@/lib/attribution'

// A soft email ask for the tools whose result should stay in the open.
//
// ToolLeadGate hides a detailed report until someone identifies themselves, which
// suits the calculators that produce a long breakdown. It does not suit a CQC
// lookup or a schema generator: the answer is the whole point of the page, and
// holding it back would read as a bait and switch on pages that promise a free
// tool with no sign-up. So this asks afterwards instead, with the result already
// on screen.
//
// The message deliberately begins "Used the <tool>." because that is how
// /api/marketing-leads recognises a tool signup and enrols the person in the
// nurture sequence, which is what actually sends them the follow-up.
export function ToolLeadPrompt({
  toolName,
  summary,
  heading,
  body,
  cta = 'Email it to me',
  tone = 'light',
}: {
  toolName: string
  /** One line of context about their result, stored with the lead. */
  summary: string
  heading: string
  body: string
  cta?: string
  tone?: 'light' | 'dark'
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const dark = tone === 'dark'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !/.+@.+\..+/.test(email)) {
      setError('Please add your name and a valid email address.')
      return
    }
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/marketing-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...getAttribution(),
          name: name.trim(),
          email: email.trim(),
          message: `Used the ${toolName}. ${summary}`.slice(0, 2000),
          website: website || undefined,
        }),
      })
      if (!res.ok) throw new Error('Something went wrong. Please try again.')
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div
        className={`mt-6 rounded-2xl p-5 text-center ${
          dark ? 'bg-brand-ink text-white' : 'border-2 border-brand-ink bg-brand-bg-warm text-brand-ink'
        }`}
      >
        <Check className={`mx-auto h-6 w-6 ${dark ? 'text-white' : 'text-brand-pop'}`} />
        <p className="mt-2 font-display text-base font-bold uppercase tracking-tight">On its way</p>
        <p className={`mt-1 text-sm ${dark ? 'text-white/70' : 'text-brand-ink-soft'}`}>
          Check your inbox. You can unsubscribe from any email, any time.
        </p>
      </div>
    )
  }

  return (
    <div
      className={`mt-6 rounded-2xl p-5 ${
        dark ? 'bg-brand-ink text-white' : 'border-2 border-brand-ink bg-brand-bg-warm text-brand-ink'
      }`}
    >
      <p className="font-display text-base font-bold uppercase tracking-tight">{heading}</p>
      <p className={`mt-1 text-sm ${dark ? 'text-white/70' : 'text-brand-ink-soft'}`}>{body}</p>

      <form onSubmit={submit} className="mt-4 space-y-2">
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="sr-only" htmlFor={`tlp-name-${toolName}`}>
            Your name
          </label>
          <input
            id={`tlp-name-${toolName}`}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            autoComplete="name"
            className="w-full rounded-xl border-2 border-brand-ink px-3 py-2 text-sm text-brand-ink placeholder:text-brand-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
          />
          <label className="sr-only" htmlFor={`tlp-email-${toolName}`}>
            Your email address
          </label>
          <input
            id={`tlp-email-${toolName}`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@yourhome.co.uk"
            autoComplete="email"
            className="w-full rounded-xl border-2 border-brand-ink px-3 py-2 text-sm text-brand-ink placeholder:text-brand-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-accent/40"
          />
        </div>
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        <button type="submit" disabled={busy} className={`btn-cta w-full ${dark ? 'btn-on-dark' : ''}`}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? 'Sending' : cta}
          {!busy && (
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          )}
        </button>
        <p className={`text-center text-xs ${dark ? 'text-white/50' : 'text-brand-ink-muted'}`}>
          Your result stays on screen either way. We never share your details.
        </p>
      </form>
    </div>
  )
}
