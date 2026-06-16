'use client'

import { useState } from 'react'

const CARE_FOR = ['My mum or dad', 'My husband or wife', 'A relative', 'Myself', 'A friend', 'Someone else']
const DEFAULT_TIMEFRAMES = ['Urgently (within 2 weeks)', 'Within the next month', '1 to 3 months', 'Just researching']

export function LocationLeadForm({
  locationSlug,
  areaName,
  timeframes = DEFAULT_TIMEFRAMES,
  anchorId,
  flat = false,
}: {
  locationSlug: string
  areaName?: string
  careTypes?: string[]
  timeframes?: string[]
  anchorId?: string
  flat?: boolean
}) {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [values, setValues] = useState<Record<string, string>>({})

  function set(name: string, v: string) {
    setValues((p) => ({ ...p, [name]: v }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()
    try {
      const res = await fetch('/api/location-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationSlug,
          fullName: values.fullName ?? '',
          email: values.email ?? '',
          phone: values.phone ?? '',
          careFor: values.careFor || undefined,
          moveInTimeframe: values.moveInTimeframe || undefined,
          message: values.message || undefined,
          companyWebsite: values.companyWebsite ?? '',
          idempotencyKey: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined,
          utmSource: params.get('utm_source') || undefined,
          utmMedium: params.get('utm_medium') || undefined,
          utmCampaign: params.get('utm_campaign') || undefined,
          utmContent: params.get('utm_content') || undefined,
          utmTerm: params.get('utm_term') || undefined,
          gclid: params.get('gclid') || undefined,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setDone(true)
    } catch {
      setError('Something went wrong. Please try again, or call us.')
    } finally {
      setSubmitting(false)
    }
  }

  const input = 'w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20'
  const label = 'mb-1.5 block text-sm font-medium text-slate-700'

  const cardCls = flat
    ? 'bg-white'
    : 'rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-7'
  const doneCls = flat
    ? 'bg-white p-2 text-center'
    : 'rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100'

  if (done) {
    return (
      <div className={doneCls}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Thank you</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          We have your details and a care adviser will be in touch shortly to talk through the right homes for you. If it
          is urgent, please call us.
        </p>
      </div>
    )
  }

  return (
    <div id={anchorId} className={cardCls}>
      <p className="text-xs font-semibold uppercase tracking-wider text-violet-600">Free &amp; impartial</p>
      <h3 className="mt-1 text-xl font-semibold text-slate-900">Find your care home</h3>
      <p className="mt-1 text-sm text-slate-600">Tell us a little about your situation and we&apos;ll match you to the right local homes.</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3.5" noValidate>
        {/* Honeypot */}
        <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label>Company website<input type="text" tabIndex={-1} autoComplete="off" value={values.companyWebsite ?? ''} onChange={(e) => set('companyWebsite', e.target.value)} /></label>
        </div>

        <div>
          <label className={label} htmlFor="ll_name">Your name</label>
          <input id="ll_name" required autoComplete="name" className={input} value={values.fullName ?? ''} onChange={(e) => set('fullName', e.target.value)} />
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="ll_phone">Phone</label>
            <input id="ll_phone" type="tel" inputMode="tel" required autoComplete="tel" placeholder="So we can call you back" className={input} value={values.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="ll_email">Email</label>
            <input id="ll_email" type="email" inputMode="email" required autoComplete="email" className={input} value={values.email ?? ''} onChange={(e) => set('email', e.target.value)} />
          </div>
        </div>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="ll_for">Who is the care for?</label>
            <select id="ll_for" className={input} value={values.careFor ?? ''} onChange={(e) => set('careFor', e.target.value)}>
              <option value="">Please choose…</option>
              {CARE_FOR.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="ll_when">When is care needed?</label>
            <select id="ll_when" className={input} value={values.moveInTimeframe ?? ''} onChange={(e) => set('moveInTimeframe', e.target.value)}>
              <option value="">Please choose…</option>
              {timeframes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className={label} htmlFor="ll_msg">Anything else? <span className="font-normal text-slate-400">(optional)</span></label>
          <textarea id="ll_msg" rows={3} placeholder="Tell us anything that would help us find the right home." className={input} value={values.message ?? ''} onChange={(e) => set('message', e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-60">
          {submitting ? 'Sending…' : 'Get matched to local homes'}
        </button>
        <p className="text-center text-xs leading-relaxed text-slate-400">
          By submitting you agree to be contacted by a care adviser from a care home in the
          {areaName ? ` ${areaName} ` : ' '}area, who will liaise with you to arrange a visit.
        </p>
      </form>
    </div>
  )
}
