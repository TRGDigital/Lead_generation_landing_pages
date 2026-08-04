'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import type { GoQuizQuestion } from '@/lib/go-pages'

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? ''

// The gamified qualification quiz on TRG /go/ ad landing pages: one question per
// step with a progress bar, then a contact step. Answers ride along with the lead.
export function TrgGoQuiz({
  slug,
  intro,
  questions,
  ctaLabel,
}: {
  slug: string
  intro: string
  questions: GoQuizQuestion[]
  ctaLabel: string
}) {
  const [step, setStep] = useState(-1) // -1 intro, 0..n-1 questions, n contact
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const utm = useMemo(() => {
    if (typeof window === 'undefined') return {}
    const p = new URLSearchParams(window.location.search)
    const out: Record<string, string> = {}
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid']) {
      const v = p.get(k)
      if (v) out[k] = v
    }
    return out
  }, [])

  const total = questions.length
  const contactStep = step >= total

  // GA4 funnel events — shows exactly where people drop off, per page.
  function track(event: string, extra?: Record<string, unknown>) {
    try {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void }
      w.gtag?.('event', event, { event_category: 'go-quiz', event_label: slug, ...extra })
    } catch { /* never break the quiz */ }
  }

  // First-party quiz analytics — powers the Performance tab in /admin/go-pages.
  // Anonymous session id, no PII; sendBeacon so it survives navigation.
  function beacon(event: string, extra?: { step?: number; question?: string; option?: string }) {
    try {
      let session = sessionStorage.getItem('go-session')
      if (!session) {
        session = crypto.randomUUID()
        sessionStorage.setItem('go-session', session)
      }
      const payload = JSON.stringify({ slug, session, event, ...extra })
      if (!navigator.sendBeacon?.('/api/go-events', new Blob([payload], { type: 'application/json' }))) {
        fetch('/api/go-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {})
      }
    } catch { /* never break the quiz */ }
  }

  useEffect(() => {
    beacon('view')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function pick(q: string, option: string) {
    setAnswers((a) => ({ ...a, [q]: option }))
    track('quiz_question_answered', { step: step + 1, question: q.slice(0, 80) })
    beacon('answer', { step: step + 1, question: q, option })
    if (step + 1 >= total) { track('quiz_contact_step', { step: total }); beacon('contact', { step: total }) }
    setStep((s) => s + 1)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      const res = await fetch('/api/go-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, name, email, phone, company, answers, utm }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error || 'Something went wrong. Please try again.')
      // Tell Google the lead happened: a GA4 lead event always, and a Google Ads
      // conversion when the Ads conversion label env is configured.
      try {
        const w = window as unknown as { gtag?: (...args: unknown[]) => void }
        w.gtag?.('event', 'generate_lead', { event_category: 'go-page', event_label: slug })
        const label = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL
        const adsId = process.env.NEXT_PUBLIC_GADS_ID ?? 'AW-18370354696'
        if (label) w.gtag?.('event', 'conversion', { send_to: `${adsId}/${label}` })
      } catch { /* tracking must never break the form */ }
      beacon('submit')
      setDone(true)
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.')
    } finally {
      setPending(false)
    }
  }

  const input =
    'w-full rounded-xl border-2 border-brand-line px-4 py-3 text-sm focus:border-brand-pop focus:outline-none'

  if (done) {
    return (
      <div className="p-8">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <h3 className="mt-4 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">
            Thank you, {name.split(' ')[0] || 'done'}!
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-brand-ink-soft">
            A care-sector specialist is reviewing your answers now. Your personalised action plan
            will be with you within one working day.
          </p>
        </div>
        <div className="mt-6 rounded-2xl border-2 border-brand-line bg-brand-bg p-5">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-brand-pop">
            Want to skip the wait?
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">
            Talk it through with us right now, or see the care homes we&apos;ve already built for.
          </p>
          <div className="mt-4 flex flex-col gap-2.5">
            <a
              href="tel:+442080641596"
              onClick={() => track('thankyou_call_click')}
              className="rounded-xl bg-brand-ink px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-tight text-white"
            >
              Call us now · 020 8064 1596
            </a>
            <a
              href="/work"
              target="_blank"
              rel="noopener"
              onClick={() => track('thankyou_work_click')}
              className="rounded-xl border-2 border-brand-ink px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-tight text-brand-ink hover:bg-brand-ink hover:text-white"
            >
              See our recent care home builds
            </a>
          </div>
        </div>
        {BOOKING_URL && (
          <div className="mt-5">
            <p className="font-display text-xs font-bold uppercase tracking-widest text-brand-pop">
              Or book your slot right now
            </p>
            <p className="mt-1 text-sm leading-relaxed text-brand-ink-soft">
              Pick a time that suits you and we&apos;ll walk through your action plan together.
            </p>
            <div className="mt-3 overflow-hidden rounded-2xl border-2 border-brand-line">
              <iframe
                src={BOOKING_URL}
                title="Book a meeting with TRG Digital"
                className="h-[560px] w-full bg-white"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Progress */}
      {step >= 0 && (
        <div className="mb-6">
          <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-brand-ink-soft">
            <span>{contactStep ? 'Last step' : `Question ${step + 1} of ${total}`}</span>
            <span>{Math.round(((contactStep ? total : step) / (total + 1)) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-brand-line/60">
            <div
              className="h-full rounded-full bg-brand-pop transition-all duration-300"
              style={{ width: `${((contactStep ? total : step) / (total + 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {step === -1 && (
        <div className="text-center">
          <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-brand-ink">
            {intro || 'How many enquiries is your home missing?'}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-brand-ink-soft">
            Answer {total} quick questions and get your free, personalised action plan. It takes
            under a minute.
          </p>
          <button
            type="button"
            onClick={() => { track('quiz_start'); beacon('start'); setStep(0) }}
            className="mt-6 w-full rounded-2xl bg-brand-pop px-6 py-4 font-display text-lg font-bold uppercase tracking-tight text-white shadow-[4px_4px_0_0_#2a2620] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-brand-pop-dark hover:shadow-[2px_2px_0_0_#2a2620]"
          >
            Start the check →
          </button>
          <p className="mt-3 text-[11px] text-brand-ink-muted">Free · No obligation · Under 60 seconds</p>
        </div>
      )}

      {step >= 0 && !contactStep && questions[step] && (
        <div>
          <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-brand-ink">
            {questions[step]!.q}
          </h3>
          <div className="mt-4 flex flex-col gap-2.5">
            {questions[step]!.options.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => pick(questions[step]!.q, o)}
                className="group rounded-xl border-2 border-brand-line bg-white px-4 py-3.5 text-left text-sm font-medium text-brand-ink transition-all hover:-translate-y-0.5 hover:border-brand-pop hover:bg-brand-pop hover:text-white"
              >
                {o}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-ink-muted hover:text-brand-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          )}
        </div>
      )}

      {contactStep && (
        <form onSubmit={submit} className="space-y-3">
          <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-brand-ink">
            Where should we send your action plan?
          </h3>
          <p className="text-sm leading-relaxed text-brand-ink-soft">
            We&apos;ll review your answers and reply personally with what we&apos;d fix first.
          </p>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name *" required />
          <input className={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email *" required />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className={input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
            <input className={input} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Care home / group" />
          </div>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-pop px-6 py-4 font-display text-lg font-bold uppercase tracking-tight text-white shadow-[4px_4px_0_0_#2a2620] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-brand-pop-dark hover:shadow-[2px_2px_0_0_#2a2620] disabled:opacity-60"
          >
            {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
            {ctaLabel || 'See my results'}
          </button>
          <p className="text-center text-[11px] leading-relaxed text-brand-ink-muted">
            No spam, ever. We only use your details to reply about your results.
          </p>
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-ink-muted hover:text-brand-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        </form>
      )}
    </div>
  )
}
