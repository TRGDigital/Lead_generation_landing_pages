'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus } from 'lucide-react'
import { gbp } from '@/lib/funding'

function Money({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink">{label}</label>
      <div className="relative mt-1.5">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-brand-ink-muted">£</span>
        <input
          inputMode="numeric"
          value={value ? value.toLocaleString('en-GB') : ''}
          onChange={(e) => onChange(Number(e.target.value.replace(/[^0-9]/g, '')) || 0)}
          placeholder="0"
          className="w-full rounded-lg border border-brand-line py-2.5 pl-8 pr-3 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
        />
      </div>
    </div>
  )
}

function Stepper({ label, value, onChange, min = 0, max = 200 }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink">{label}</label>
      <div className="mt-1.5 flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(value - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Decrease">
          <Minus className="h-4 w-4" />
        </button>
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value.replace(/[^0-9]/g, '')) || 0))}
          className="h-10 w-full rounded-lg border border-brand-line text-center text-sm font-semibold focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
        />
        <button type="button" onClick={() => onChange(clamp(value + 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Increase">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function EmptyBedCalculator() {
  const [fee, setFee] = useState(1100)
  const [beds, setBeds] = useState(3)
  const [weeks, setWeeks] = useState(8)

  const perWeek = fee * beds
  const perMonth = perWeek * 4.33
  const perYear = perWeek * 52
  const alreadyLost = perWeek * weeks

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Money label="Weekly fee per bed" value={fee} onChange={setFee} />
        <Stepper label="Empty beds" value={beds} onChange={setBeds} />
      </div>
      <div className="mt-5">
        <Stepper label="Weeks they've been empty" value={weeks} onChange={setWeeks} max={104} />
      </div>

      {/* Headline result */}
      <div className="mt-7 rounded-2xl bg-brand-ink p-6 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Lost revenue per year</p>
        <p className="mt-1 font-display text-5xl font-bold leading-none text-white sm:text-6xl">{gbp(perYear)}</p>
        <p className="mt-2 text-sm text-white/60">at {gbp(fee)}/week across {beds} empty bed{beds === 1 ? '' : 's'}</p>
      </div>

      {/* Breakdown */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-brand-bg-warm p-4 text-center">
          <p className="text-xs text-brand-ink-muted">Every week</p>
          <p className="font-display text-2xl font-bold text-brand-pop">{gbp(perWeek)}</p>
        </div>
        <div className="rounded-xl bg-brand-bg-warm p-4 text-center">
          <p className="text-xs text-brand-ink-muted">Every month</p>
          <p className="font-display text-2xl font-bold text-brand-pop">{gbp(perMonth)}</p>
        </div>
      </div>

      {weeks > 0 && (
        <p className="mt-4 rounded-xl border border-brand-pop/30 bg-brand-pop/5 p-4 text-center text-sm text-brand-ink">
          Those vacancies have already cost you{' '}
          <span className="font-display text-base font-bold text-brand-pop">{gbp(alreadyLost)}</span>.
        </p>
      )}

      <Link href="/marketing" className="btn-pop mt-6 w-full">
        Fill these beds
        <span className="btn-arrow" aria-hidden>→</span>
      </Link>
      <p className="mt-3 text-center text-xs text-brand-ink-muted">A guide based on the figures you enter.</p>
    </div>
  )
}
