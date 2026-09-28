'use client'

import { useState, useTransition } from 'react'
import { CheckCircle, Download } from 'lucide-react'
import { getAttribution } from '@/lib/attribution'

// The gate for the buyer's guide on /guides/choosing-a-care-website-agency. Posts to
// /api/marketing-leads exactly as StartBuildingForm and CountyLeadForm do. The message
// starts with GUIDE_MESSAGE_PREFIX, which is how the route recognises a guide download
// (for the email nurture) and how the lead reads in admin and in the alert email.

const GUIDE_PDF = '/guides/choosing-a-care-website-agency.pdf'
const GUIDE_MESSAGE_PREFIX = "Downloaded the buyer's guide: How to choose a website agency for your care service."

const SERVICE_TYPES = [
  'Care home',
  'Nursing home',
  'Home care agency',
  'Supported living',
  'Live-in care',
  'Retirement or extra care',
  'Care group',
  'Other',
] as const

type Field = 'name' | 'email' | 'company' | 'serviceType'
type Errors = Partial<Record<Field, string>>

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function BuyersGuideForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [pending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validate(): Errors {
    const e: Errors = {}
    if (name.trim().length < 2) e.name = 'Please enter your name.'
    if (!EMAIL_RE.test(email.trim())) e.email = 'Please enter a valid email address.'
    if (company.trim().length < 2) e.company = 'Please tell us the name of your service or organisation.'
    if (!serviceType) e.serviceType = 'Please choose the type of service.'
    return e
  }

  function clear(f: Field) {
    if (errors[f]) setErrors((prev) => ({ ...prev, [f]: undefined }))
  }

  function submit(ev: React.FormEvent) {
    ev.preventDefault()
    setError(null)
    const found = validate()
    setErrors(found)
    const first = (Object.keys(found) as Field[])[0]
    if (first) {
      document.getElementById(`bg-${first}`)?.focus()
      return
    }

    const message = [GUIDE_MESSAGE_PREFIX, `Organisation: ${company.trim()}`, `Type of service: ${serviceType}`].join('\n')

    startTransition(async () => {
      try {
        const res = await fetch('/api/marketing-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            company: company.trim(),
            message,
            website: honeypot,
            ...getAttribution(),
          }),
        })
        const json = await res.json().catch(() => ({}))
        if (res.status === 429) {
          setError('We have already received a few requests from you in the last hour. Please try again later, or call us on 020 8064 1596.')
        } else if (!res.ok) {
          setError(typeof json.error === 'string' ? json.error : 'Something went wrong. Please check your details and try again.')
        } else {
          try {
            const w = window as unknown as { gtag?: (...args: unknown[]) => void }
            w.gtag?.('event', 'generate_lead', { event_category: 'buyers-guide', event_label: serviceType })
          } catch {
            /* tracking must never break the form */
          }
          setSubmitted(true)
        }
      } catch {
        setError('Network error. Please check your connection and try again.')
      }
    })
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-3xl border-2 border-brand-ink bg-white p-8 text-center shadow-[6px_6px_0_0_#2a2620] sm:p-10"
      >
        <CheckCircle className="h-12 w-12 text-brand-pop" aria-hidden />
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">Thank you</h2>
        <p className="max-w-sm text-base leading-relaxed text-brand-ink-soft">
          Your guide is ready. It is a 10 page PDF, so it is easy to print and share with whoever helps you choose.
        </p>
        <a href={GUIDE_PDF} download className="btn-cta mt-2 justify-center">
          <Download className="h-4 w-4" aria-hidden />
          Download the guide (PDF)
        </a>
        <p className="mt-1 max-w-sm text-xs leading-relaxed text-brand-ink-muted">
          If a question comes up while you compare agencies, call us on 020 8064 1596. We are happy to help, whoever you choose.
        </p>
      </div>
    )
  }

  const base =
    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-base text-brand-ink placeholder:text-brand-ink-muted focus:outline-none sm:text-sm'
  const field = (f: Field) =>
    `${base} ${errors[f] ? 'border-red-500 focus:border-red-600' : 'border-brand-line focus:border-brand-pop'}`
  const label = 'block text-xs font-semibold uppercase tracking-wide text-brand-ink-soft'
  const err = (f: Field) =>
    errors[f] ? (
      <p id={`bg-${f}-error`} className="text-xs font-medium text-red-600">
        {errors[f]}
      </p>
    ) : null
  const aria = (f: Field) => ({
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? `bg-${f}-error` : undefined,
  })

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Get the buyer's guide"
      className="rounded-3xl border-2 border-brand-ink bg-white p-5 shadow-[6px_6px_0_0_#2a2620] sm:p-7"
    >
      <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-2xl">
        Get the free guide
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">
        Tell us where to send it and the download appears straight away.
      </p>

      {/* Honeypot, hidden from real users and screen readers */}
      <input
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        name="website"
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={label} htmlFor="bg-name">
            Your name
          </label>
          <input
            id="bg-name"
            autoComplete="name"
            maxLength={100}
            className={field('name')}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              clear('name')
            }}
            {...aria('name')}
          />
          {err('name')}
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="bg-email">
            Email
          </label>
          <input
            id="bg-email"
            type="email"
            autoComplete="email"
            maxLength={255}
            className={field('email')}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              clear('email')
            }}
            {...aria('email')}
          />
          {err('email')}
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="bg-company">
            Organisation
          </label>
          <input
            id="bg-company"
            autoComplete="organization"
            maxLength={255}
            placeholder="Home, agency or group name"
            className={field('company')}
            value={company}
            onChange={(e) => {
              setCompany(e.target.value)
              clear('company')
            }}
            {...aria('company')}
          />
          {err('company')}
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="bg-serviceType">
            Type of service
          </label>
          <select
            id="bg-serviceType"
            className={field('serviceType')}
            value={serviceType}
            onChange={(e) => {
              setServiceType(e.target.value)
              clear('serviceType')
            }}
            {...aria('serviceType')}
          >
            <option value="">Choose one</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {err('serviceType')}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-cta mt-5 w-full justify-center disabled:opacity-60">
        {pending ? 'Sending' : 'Get the guide'}
        {!pending && (
          <span className="btn-arrow" aria-hidden>
            →
          </span>
        )}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-brand-ink-muted">
        We may also send a few short, practical emails for care providers. You can unsubscribe at any time, and we
        never pass your details to anyone.
      </p>
    </form>
  )
}
