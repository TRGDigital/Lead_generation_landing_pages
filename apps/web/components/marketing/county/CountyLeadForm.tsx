'use client'

import { useState, useTransition } from 'react'
import { CheckCircle } from 'lucide-react'
import { getAttribution } from '@/lib/attribution'

// The enquiry form on the county pages. Posts to /api/marketing-leads, which stores the
// lead in marketing_leads and always alerts lenny@trgdigital.co.uk, so nothing here needs
// its own mail route. The county and the page it came from go into the message, because
// the useful thing in the alert email is knowing which page produced the enquiry.

const NEEDS = [
  'A new website',
  'Better rankings',
  'Both, and I do not know where to start',
  'An audit of what I already have',
  'Something else',
] as const

export type Need = (typeof NEEDS)[number]

/** The page's own subject leads the list, because it is what most people will pick. */
function orderedNeeds(first?: Need): string[] {
  if (!first) return [...NEEDS]
  return [first, ...NEEDS.filter((n) => n !== first)]
}

export function CountyLeadForm({
  countyName = '',
  context,
  defaultNeed,
  mode = 'county',
}: {
  countyName?: string
  /** Which page this form is on, for the alert email. */
  context: string
  defaultNeed?: Need
  /**
   * 'group' is the same form for multi site operators: it asks for the group and how many
   * services it runs instead of a town, and labels the alert email as a group enquiry.
   */
  mode?: 'county' | 'group'
}) {
  const group = mode === 'group'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [town, setTown] = useState('')
  const needs = orderedNeeds(defaultNeed)
  const [need, setNeed] = useState<string>(needs[0] ?? NEEDS[0])
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [pending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (name.trim().length < 2) return setError('Please enter your name.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setError('Please enter a valid email address.')

    const message = [
      `${group ? 'GROUP' : 'COUNTY'} ENQUIRY: ${context}`,
      ...(group
        ? [`Services run: ${town.trim() || '(not given)'}`]
        : [`County: ${countyName}`, `Town: ${town.trim() || '(not given)'}`]),
      `Looking for: ${need}`,
      notes.trim() ? `Notes: ${notes.trim()}` : 'Notes: (none)',
    ].join('\n')

    startTransition(async () => {
      try {
        const res = await fetch('/api/marketing-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || undefined,
            company: company.trim() || undefined,
            message,
            website: honeypot,
            ...getAttribution(),
          }),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(typeof json.error === 'string' ? json.error : 'Something went wrong. Please try again.')
        } else {
          setSubmitted(true)
        }
      } catch {
        setError('Network error. Please check your connection and try again.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-brand-ink bg-white p-8 text-center shadow-[6px_6px_0_0_#2a2620]">
        <CheckCircle className="h-11 w-11 text-brand-pop" />
        <h3 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink">Thank you</h3>
        <p className="max-w-sm text-sm leading-relaxed text-brand-ink-soft">
          That has come straight through to us. You will get a reply from a person, not an automated sequence, within
          one working day.
        </p>
      </div>
    )
  }

  const field =
    'w-full rounded-xl border border-brand-line bg-white px-3.5 py-2.5 text-sm text-brand-ink placeholder:text-brand-ink-muted focus:border-brand-pop focus:outline-none'
  const label = 'block text-xs font-semibold uppercase tracking-wide text-brand-ink-soft'

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border-2 border-brand-ink bg-white p-6 shadow-[6px_6px_0_0_#2a2620]"
    >
      {/* Honeypot, hidden from real users and screen readers */}
      <input
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label} htmlFor="cl-name">
            Your name
          </label>
          <input id="cl-name" className={field} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="cl-email">
            Email
          </label>
          <input
            id="cl-email"
            type="email"
            className={field}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="cl-phone">
            Phone <span className="font-normal normal-case text-brand-ink-muted">optional</span>
          </label>
          <input id="cl-phone" className={field} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="cl-company">
            {group ? 'Your group' : 'Your service'}
          </label>
          <input
            id="cl-company"
            className={field}
            placeholder={group ? 'Group or company name' : 'Home or agency name'}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="cl-town">
            {group ? 'How many services' : 'Town'}
          </label>
          <input
            id="cl-town"
            className={field}
            placeholder={group ? 'For example, 6 homes' : `Where in ${countyName}`}
            value={town}
            onChange={(e) => setTown(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="cl-need">
            What you are after
          </label>
          <select id="cl-need" className={field} value={need} onChange={(e) => setNeed(e.target.value)}>
            {needs.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <label className={label} htmlFor="cl-notes">
          Anything else <span className="font-normal normal-case text-brand-ink-muted">optional</span>
        </label>
        <textarea
          id="cl-notes"
          rows={3}
          className={field}
          placeholder="Your current site, what is frustrating you, when you want it live"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="btn-cta mt-5 w-full justify-center disabled:opacity-60"
      >
        {pending ? 'Sending' : 'Send it to us'}
        {!pending && (
          <span className="btn-arrow" aria-hidden>
            →
          </span>
        )}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-brand-ink-muted">
        It goes straight to Lenny, who runs the studio. No call centre, no sequence of chasing emails, and we do not
        pass your details to anyone.
      </p>
    </form>
  )
}
