'use client'

import { useMemo, useState } from 'react'
import type { QuizQuestion } from '@/lib/care-finder'

// Gamified multi-step care finder. One question at a time with a progress bar.
// The lead is created at the "contact" step (so it's captured even if they stop
// after), then enriched as they answer the remaining questions.
export function CareFinderQuiz({
  locationSlug,
  questions,
  anchorId,
  flat = false,
}: {
  locationSlug: string
  questions: QuizQuestion[]
  anchorId?: string
  flat?: boolean
}) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [contact, setContact] = useState({ fullName: '', email: '', phone: '' })
  const [companyWebsite, setCompanyWebsite] = useState('') // honeypot
  const [leadId, setLeadId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const total = questions.length
  const q = questions[step] as QuizQuestion   // bounded by step; runtime-guarded below
  const isLast = step === total - 1

  const utm = useMemo(() => {
    if (typeof window === 'undefined') return {} as Record<string, string | undefined>
    const p = new URLSearchParams(window.location.search)
    return {
      utmSource: p.get('utm_source') || undefined, utmMedium: p.get('utm_medium') || undefined,
      utmCampaign: p.get('utm_campaign') || undefined, utmContent: p.get('utm_content') || undefined,
      utmTerm: p.get('utm_term') || undefined, gclid: p.get('gclid') || undefined,
    }
  }, [])

  if (!questions.length) return null // no questions configured

  function title(question: QuizQuestion): string {
    if (question.titleIf && answers[question.titleIf.questionId] === question.titleIf.equals) return question.titleIf.title
    return question.title
  }

  function next() { if (!isLast) setStep((s) => s + 1); else finish() }
  function back() { if (step > 0) setStep((s) => s - 1) }

  // Single-select: record + auto-advance.
  function pickSingle(value: string) {
    setAnswers((a) => ({ ...a, [q.id]: value }))
    setTimeout(next, 180)
  }
  function toggleMulti(value: string) {
    setAnswers((a) => {
      const cur: string[] = Array.isArray(a[q.id]) ? a[q.id] : []
      return { ...a, [q.id]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] }
    })
  }
  function setBudget(field: 'min' | 'max', v: string) {
    setAnswers((a) => ({ ...a, [q.id]: { ...(a[q.id] ?? {}), [field]: v.replace(/[^0-9]/g, '') } }))
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!contact.fullName.trim()) return setError('Please enter your name.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email.trim())) return setError('Please enter a valid email.')
    if (contact.phone.trim().length < 7) return setError('Please enter a phone number.')
    setSubmitting(true)
    try {
      const res = await fetch('/api/location-leads', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationSlug, fullName: contact.fullName.trim(), email: contact.email.trim(), phone: contact.phone.trim(),
          answers, companyWebsite,
          idempotencyKey: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined,
          ...utm,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error('failed')
      if (body?.leadId) setLeadId(body.leadId)
      next()
    } catch {
      setError('Something went wrong. Please try again, or call us.')
    } finally {
      setSubmitting(false)
    }
  }

  // Enrich the captured lead with the answers gathered after contact (best-effort).
  async function enrich(allAnswers: Record<string, any>) {
    if (!leadId) return
    try {
      await fetch('/api/location-leads/enrich', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, answers: allAnswers }),
      })
    } catch { /* best-effort */ }
  }

  function advanceAfter() {
    // For post-contact questions, push the latest answers to the lead, then move on.
    if (leadId) void enrich(answers)
    next()
  }

  function finish() {
    if (leadId) void enrich(answers)
    setDone(true)
  }

  const cardCls = flat ? 'bg-white' : 'rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-7'
  const opt = 'flex w-full items-start gap-3 rounded-xl border-2 border-slate-200 px-4 py-3.5 text-left transition hover:border-violet-400 hover:bg-violet-50/40'
  const optOn = 'border-violet-500 bg-violet-50 ring-1 ring-violet-500'

  if (done) {
    return (
      <div className={flat ? 'bg-white p-2 text-center' : 'rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-slate-100'} id={anchorId}>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-100">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-violet-600" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Thank you{contact.fullName ? `, ${contact.fullName.split(' ')[0]}` : ''}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          We have everything we need. We&apos;ll match you with local care homes that have availability and fit what you&apos;re looking for, and the right homes will be in touch shortly.
        </p>
      </div>
    )
  }

  return (
    <div className={cardCls} id={anchorId}>
      {/* Progress */}
      <div className="mb-5">
        <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Step {step + 1} of {total}</span>
          {step > 0 && <button type="button" onClick={back} className="text-violet-600 hover:underline">Back</button>}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-300" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{title(q)}</h3>
      {q.subtitle && <p className="mt-1 text-sm text-slate-500">{q.subtitle}</p>}

      <div className="mt-4">
        {/* Single-select */}
        {q.type === 'single' && (
          <div className="grid gap-2.5">
            {q.options?.map((o) => (
              <button key={o.value} type="button" onClick={() => pickSingle(o.value)} className={`${opt} ${answers[q.id] === o.value ? optOn : ''}`}>
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-slate-300">
                  {answers[q.id] === o.value && <span className="h-2.5 w-2.5 rounded-full bg-violet-600" />}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{o.label}</span>
                  {o.description && <span className="mt-0.5 block text-xs text-slate-500">{o.description}</span>}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Multi-select */}
        {q.type === 'multi' && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {q.options?.map((o) => {
              const on = Array.isArray(answers[q.id]) && answers[q.id].includes(o.value)
              return (
                <button key={o.value} type="button" onClick={() => toggleMulti(o.value)} className={`${opt} ${on ? optOn : ''}`}>
                  <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 ${on ? 'border-violet-600 bg-violet-600' : 'border-slate-300'}`}>
                    {on && <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{o.label}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Budget range */}
        {q.type === 'budget' && (
          <div className="flex items-end gap-3">
            <label className="flex-1 text-xs font-medium text-slate-600">Min £/week
              <div className="mt-1 flex items-center rounded-lg border border-slate-300 px-3"><span className="text-slate-400">£</span>
                <input inputMode="numeric" value={answers[q.id]?.min ?? ''} onChange={(e) => setBudget('min', e.target.value)} className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none" placeholder="1000" /></div>
            </label>
            <span className="pb-3 text-slate-400">to</span>
            <label className="flex-1 text-xs font-medium text-slate-600">Max £/week
              <div className="mt-1 flex items-center rounded-lg border border-slate-300 px-3"><span className="text-slate-400">£</span>
                <input inputMode="numeric" value={answers[q.id]?.max ?? ''} onChange={(e) => setBudget('max', e.target.value)} className="w-full bg-transparent px-2 py-2.5 text-sm focus:outline-none" placeholder="1800" /></div>
            </label>
          </div>
        )}

        {/* Contact capture — creates the lead */}
        {q.type === 'contact' && (
          <form onSubmit={submitContact} className="grid gap-3">
            <input value={contact.fullName} onChange={(e) => setContact((c) => ({ ...c, fullName: e.target.value }))} placeholder="Your name" autoComplete="name"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
            <input value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} type="email" placeholder="Email" autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
            <input value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} type="tel" placeholder="Phone" autoComplete="tel"
              className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" />
            <input value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={submitting} className="w-full rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">
              {submitting ? 'Finding your matches…' : 'See my matches'}
            </button>
            <p className="text-center text-xs text-slate-400">Free, impartial, and no obligation.</p>
          </form>
        )}
      </div>

      {/* Continue / Skip for non-single, non-contact steps */}
      {q.type !== 'single' && q.type !== 'contact' && (
        <div className="mt-5 flex items-center gap-3">
          <button type="button" onClick={() => advanceAfter()} className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white">
            {isLast ? 'Finish' : 'Continue'}
          </button>
          {q.optional && <button type="button" onClick={() => advanceAfter()} className="px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-600">Skip</button>}
        </div>
      )}
    </div>
  )
}
