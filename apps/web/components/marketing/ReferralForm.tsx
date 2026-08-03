'use client'

import { useState } from 'react'

export function ReferralForm() {
  const [f, setF] = useState({ referrerName: '', referrerEmail: '', referrerPhone: '', homeName: '', homeContact: '', notes: '' })
  const [hp, setHp] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((s) => ({ ...s, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!f.referrerEmail || !f.homeName) { setErr('Please add your email and the care home you’re referring.'); return }
    setBusy(true); setErr('')
    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, website: hp }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setErr('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div className="rounded-3xl border border-brand-line bg-white p-8 text-center shadow-card">
        <p className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">Thank you!</p>
        <p className="mt-2 text-brand-ink-soft">We’ve got your referral and will be in touch about your reward. We really appreciate it.</p>
      </div>
    )
  }

  const input = 'w-full rounded-xl border border-brand-line px-4 py-3 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20'

  return (
    <form onSubmit={submit} className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <p className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink">Refer a care home</p>
      <p className="mt-1 text-sm text-brand-ink-soft">Tell us who to talk to and we’ll take it from there.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input className={input} placeholder="Your name" value={f.referrerName} onChange={set('referrerName')} />
        <input className={input} type="email" placeholder="Your email" value={f.referrerEmail} onChange={set('referrerEmail')} />
      </div>
      <input className={`${input} mt-3`} placeholder="Your phone (optional)" value={f.referrerPhone} onChange={set('referrerPhone')} />

      <div className="mt-5 border-t border-brand-line pt-5">
        <input className={input} placeholder="Care home you’re referring" value={f.homeName} onChange={set('homeName')} />
        <input className={`${input} mt-3`} placeholder="Their website, phone or contact (optional)" value={f.homeContact} onChange={set('homeContact')} />
        <textarea className={`${input} mt-3`} rows={3} placeholder="Anything else we should know? (optional)" value={f.notes} onChange={set('notes')} />
      </div>

      {/* honeypot */}
      <input value={hp} onChange={(e) => setHp(e.target.value)} name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0" />

      {err && <p className="mt-3 rounded-lg bg-brand-pop/10 px-3 py-2 text-sm text-brand-pop">{err}</p>}
      <button type="submit" disabled={busy} className="btn-pop mt-5 w-full disabled:opacity-50">
        {busy ? 'Sending…' : 'Send referral'}
        {!busy && <span className="btn-arrow" aria-hidden>→</span>}
      </button>
      <p className="mt-3 text-center text-xs text-brand-ink-muted">No obligation for you or them. We’ll only get in touch about this referral.</p>
    </form>
  )
}
