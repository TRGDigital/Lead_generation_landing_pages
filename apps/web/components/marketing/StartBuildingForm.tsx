'use client'

import { useState, useTransition } from 'react'
import { CheckCircle } from 'lucide-react'
import { getAttribution } from '@/lib/attribution'

// The new website enquiry form on /start-building-your-new-website. Posts to
// /api/marketing-leads exactly as CountyLeadForm does (the route stores the lead in
// marketing_leads and always alerts lenny@trgdigital.co.uk). The route has no fields for
// service type, locations or timing, so those go into the message as readable lines,
// headed so the enquiry is recognisable in admin and in the alert email.

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

const LOCATIONS = ['1', '2 to 5', '6+'] as const

const TIMING = ['As soon as possible', 'In 1 to 3 months', 'Just researching'] as const

/** The route caps the whole message at 2000 characters; this keeps the notes well inside it. */
const NOTES_MAX = 1200

type Field = 'name' | 'email' | 'phone' | 'company' | 'serviceType' | 'locations' | 'timing' | 'currentSite'
type Errors = Partial<Record<Field, string>>

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function StartBuildingForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [locations, setLocations] = useState('')
  const [currentSite, setCurrentSite] = useState('')
  const [timing, setTiming] = useState('')
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [pending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function validate(): Errors {
    const e: Errors = {}
    if (name.trim().length < 2) e.name = 'Please enter your name.'
    if (!EMAIL_RE.test(email.trim())) e.email = 'Please enter a valid email address.'
    if (phone.trim() && !/^[0-9+()\s-]{7,30}$/.test(phone.trim())) e.phone = 'Please check the phone number.'
    if (company.trim().length < 2) e.company = 'Please tell us the name of your service or organisation.'
    if (!serviceType) e.serviceType = 'Please choose the type of service.'
    if (!locations) e.locations = 'Please choose how many locations.'
    if (!timing) e.timing = 'Please choose when you would like to start.'
    if (currentSite.trim() && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(currentSite.trim()))
      e.currentSite = 'Please check the web address, for example yourcareservice.co.uk.'
    return e
  }

  /** Clears a field's error as soon as the visitor starts correcting it. */
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
      document.getElementById(`sb-${first}`)?.focus()
      return
    }

    const message = [
      'New website enquiry (start-building page).',
      `Organisation: ${company.trim()}`,
      `Type of service: ${serviceType}`,
      `Number of locations: ${locations}`,
      `Current website: ${currentSite.trim() || '(none given)'}`,
      `When they want to start: ${timing}`,
      notes.trim() ? `Message: ${notes.trim().slice(0, NOTES_MAX)}` : 'Message: (none)',
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
            company: company.trim(),
            message,
            website: honeypot,
            ...getAttribution(),
          }),
        })
        const json = await res.json().catch(() => ({}))
        if (res.status === 429) {
          setError('We have already received a few messages from you in the last hour. Please try again later, or call us on 020 8064 1596.')
        } else if (!res.ok) {
          setError(typeof json.error === 'string' ? json.error : 'Something went wrong. Please check your details and try again.')
        } else {
          try {
            const w = window as unknown as { gtag?: (...args: unknown[]) => void }
            w.gtag?.('event', 'generate_lead', { event_category: 'start-building', event_label: serviceType })
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
          Thanks, we will be in touch within one working day. The reply comes from a person, not an automated
          sequence.
        </p>
      </div>
    )
  }

  const base =
    'w-full rounded-xl border bg-white px-3.5 py-2.5 text-base text-brand-ink placeholder:text-brand-ink-muted focus:outline-none sm:text-sm'
  const field = (f: Field) =>
    `${base} ${errors[f] ? 'border-red-500 focus:border-red-600' : 'border-brand-line focus:border-brand-pop'}`
  const label = 'block text-xs font-semibold uppercase tracking-wide text-brand-ink-soft'
  const optional = <span className="font-normal normal-case text-brand-ink-muted">optional</span>
  const err = (f: Field) =>
    errors[f] ? (
      <p id={`sb-${f}-error`} className="text-xs font-medium text-red-600">
        {errors[f]}
      </p>
    ) : null
  const aria = (f: Field) => ({
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': errors[f] ? `sb-${f}-error` : undefined,
  })

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Start building your new website"
      className="rounded-3xl border-2 border-brand-ink bg-white p-5 shadow-[6px_6px_0_0_#2a2620] sm:p-7"
    >
      <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-2xl">
        Tell us about your service
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">
        A few details and we will come back with ideas for your new website.
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
          <label className={label} htmlFor="sb-name">
            Your name
          </label>
          <input
            id="sb-name"
            autoComplete="name"
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
          <label className={label} htmlFor="sb-email">
            Email
          </label>
          <input
            id="sb-email"
            type="email"
            autoComplete="email"
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
          <label className={label} htmlFor="sb-phone">
            Phone {optional}
          </label>
          <input
            id="sb-phone"
            type="tel"
            autoComplete="tel"
            maxLength={30}
            className={field('phone')}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              clear('phone')
            }}
            {...aria('phone')}
          />
          {err('phone')}
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="sb-company">
            Organisation
          </label>
          <input
            id="sb-company"
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
          <label className={label} htmlFor="sb-serviceType">
            Type of service
          </label>
          <select
            id="sb-serviceType"
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
        <div className="space-y-1.5">
          <label className={label} htmlFor="sb-locations">
            Number of locations
          </label>
          <select
            id="sb-locations"
            className={field('locations')}
            value={locations}
            onChange={(e) => {
              setLocations(e.target.value)
              clear('locations')
            }}
            {...aria('locations')}
          >
            <option value="">Choose one</option>
            {LOCATIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {err('locations')}
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="sb-currentSite">
            Current website {optional}
          </label>
          <input
            id="sb-currentSite"
            inputMode="url"
            autoComplete="url"
            maxLength={200}
            placeholder="yourcareservice.co.uk"
            className={field('currentSite')}
            value={currentSite}
            onChange={(e) => {
              setCurrentSite(e.target.value)
              clear('currentSite')
            }}
            {...aria('currentSite')}
          />
          {err('currentSite')}
        </div>
        <div className="space-y-1.5">
          <label className={label} htmlFor="sb-timing">
            When do you want to start
          </label>
          <select
            id="sb-timing"
            className={field('timing')}
            value={timing}
            onChange={(e) => {
              setTiming(e.target.value)
              clear('timing')
            }}
            {...aria('timing')}
          >
            <option value="">Choose one</option>
            {TIMING.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {err('timing')}
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <label className={label} htmlFor="sb-notes">
          Anything else {optional}
        </label>
        <textarea
          id="sb-notes"
          rows={3}
          maxLength={NOTES_MAX}
          className={`${base} border-brand-line focus:border-brand-pop`}
          placeholder="What is not working now, what you would like the new site to do"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn-cta mt-5 w-full justify-center disabled:opacity-60">
        {pending ? 'Sending' : 'Start building my website'}
        {!pending && (
          <span className="btn-arrow" aria-hidden>
            →
          </span>
        )}
      </button>
      <p className="mt-3 text-xs leading-relaxed text-brand-ink-muted">
        It goes straight to Lenny, who runs the studio. A reply from a person within one working day, and we do not
        pass your details to anyone.
      </p>
    </form>
  )
}
