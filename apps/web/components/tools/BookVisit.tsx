'use client'

import { useState } from 'react'
import { ToolButton, ResultBadge, ACCENT } from './ui'

// "Book a visit" — request a look-round with a preferred date and time. Submits an organic
// lead (trigger 'book-visit') so the request lands in the TRG admin + client email like every
// other enquiry. Ported from the Crossways/Ferndale native tool into the brandable embed suite.

type Status = 'idle' | 'submitting' | 'ok' | 'error'

const input =
  'w-full rounded-xl border border-brand-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2'
const ring = { ['--tw-ring-color' as string]: ACCENT }

export function BookVisit({ site }: { site?: string }) {
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!site) return
    setStatus('submitting')
    const fd = new FormData(e.currentTarget)
    const details = [
      fd.get('date') ? `Preferred date: ${fd.get('date')}` : '',
      fd.get('time') ? `Preferred time: ${fd.get('time')}` : '',
      fd.get('visitors') ? `Visiting: ${fd.get('visitors')}` : '',
      fd.get('notes') ? `\n${fd.get('notes')}` : '',
    ]
      .filter(Boolean)
      .join('\n')
    try {
      const res = await fetch('/api/organic-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site,
          name: String(fd.get('name') ?? ''),
          email: String(fd.get('email') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          message: details || 'Visit request',
          trigger: 'book-visit',
          pageUrl: typeof document !== 'undefined' ? document.referrer || location.href : '',
          consent: true,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }

  if (!site) {
    return (
      <ResultBadge tone="info">
        <p className="text-sm text-brand-ink-soft">
          This tool takes visit requests when it is embedded on a care home&rsquo;s website.
        </p>
      </ResultBadge>
    )
  }

  if (status === 'ok') {
    return (
      <ResultBadge tone="good">
        <p className="text-lg font-bold text-brand-ink">Thank you</p>
        <p className="mt-1 text-sm text-brand-ink-soft">
          Your visit request has been received. The home will be in touch shortly to confirm a time that suits
          you.
        </p>
      </ResultBadge>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-brand-ink">Your name</span>
          <input name="name" required className={input} style={ring} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-brand-ink">Email</span>
          <input type="email" name="email" required className={input} style={ring} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-brand-ink">Phone (optional)</span>
          <input name="phone" className={input} style={ring} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-brand-ink">Preferred date</span>
          <input type="date" name="date" className={input} style={ring} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-brand-ink">Preferred time</span>
          <select name="time" defaultValue="" className={input} style={ring}>
            <option value="">No preference</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Either">Either</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-brand-ink">Who&rsquo;s visiting? (optional)</span>
          <input name="visitors" placeholder="e.g. me and my mum" className={input} style={ring} />
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-brand-ink">Anything the home should know? (optional)</span>
        <textarea name="notes" rows={3} className={input} style={ring} />
      </label>

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600">
          Sorry, something went wrong sending your request. Please try again, or contact the home directly.
        </p>
      )}

      <ToolButton type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : 'Request my visit'}
      </ToolButton>
      <p className="text-center text-xs text-brand-ink-muted">
        The home will confirm your visit by phone or email. No obligation.
      </p>
    </form>
  )
}
