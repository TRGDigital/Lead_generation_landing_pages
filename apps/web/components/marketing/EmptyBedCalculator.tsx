'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, TrendingUp } from 'lucide-react'
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
  // Current situation
  const [fee, setFee] = useState(1100)
  const [beds, setBeds] = useState(3)
  const [weeks, setWeeks] = useState(8)
  // With TRG — fixed fees, plus an editable conversion assumption
  const COST_PER_LEAD = 100
  const WEBSITE_COST = 5000
  const [leadsPerMoveIn, setLeadsPerMoveIn] = useState(4)
  const [includeWebsite, setIncludeWebsite] = useState(false)

  // Cost of doing nothing
  const perWeek = fee * beds
  const perMonth = perWeek * 4.33
  const perYear = perWeek * 52
  const alreadyLost = perWeek * weeks

  // With TRG
  const leadsNeeded = beds * leadsPerMoveIn
  const trgCost = leadsNeeded * COST_PER_LEAD + (includeWebsite ? WEBSITE_COST : 0)
  const annualRevenue = perYear // revenue recovered in a full year once filled
  const netBenefit = annualRevenue - trgCost
  const roi = trgCost > 0 ? annualRevenue / trgCost : 0

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* ── Your situation ── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your situation</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <Money label="Weekly fee per bed" value={fee} onChange={setFee} />
        <Stepper label="Empty beds" value={beds} onChange={setBeds} />
      </div>
      <div className="mt-5">
        <Stepper label="Weeks they've been empty" value={weeks} onChange={setWeeks} max={104} />
      </div>

      {/* Cost of doing nothing */}
      <div className="mt-7 rounded-2xl bg-brand-ink p-6 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Empty beds cost you per year</p>
        <p className="mt-1 font-display text-5xl font-bold leading-none sm:text-6xl">{gbp(perYear)}</p>
        <p className="mt-2 text-sm text-white/60">{gbp(perWeek)}/wk · {gbp(perMonth)}/mo · already lost {gbp(alreadyLost)}</p>
      </div>

      {/* ── With TRG ── */}
      <div className="mt-7">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-pop">
          <TrendingUp className="h-4 w-4" /> What if you filled them with TRG?
        </p>
        <details className="mt-3 rounded-xl border border-brand-line bg-brand-bg-warm/60 p-4" open>
          <summary className="cursor-pointer text-sm font-semibold text-brand-ink">Your assumptions</summary>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-brand-line bg-white px-4 py-2.5 text-sm">
              <span className="font-semibold text-brand-ink">Cost per qualified lead</span>
              <span className="font-display font-bold text-brand-pop">{gbp(COST_PER_LEAD)}</span>
            </div>
            <Stepper label="Leads per move-in" value={leadsPerMoveIn} onChange={setLeadsPerMoveIn} min={1} max={20} />
            <label className="flex cursor-pointer items-center justify-between rounded-lg border border-brand-line bg-white px-4 py-3 text-sm">
              <span className="font-semibold text-brand-ink">Include a new website ({gbp(WEBSITE_COST)})</span>
              <input type="checkbox" checked={includeWebsite} onChange={(e) => setIncludeWebsite(e.target.checked)} className="h-5 w-5 accent-brand-pop" />
            </label>
          </div>
        </details>

        <div className="mt-4 rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-brand-ink-muted">Your investment with TRG</p>
              <p className="font-display text-2xl font-bold text-brand-ink">{gbp(trgCost)}</p>
              <p className="mt-0.5 text-[11px] text-brand-ink-muted">{leadsNeeded} leads{includeWebsite ? ' + website' : ''}</p>
            </div>
            <div>
              <p className="text-xs text-brand-ink-muted">Revenue recovered / year</p>
              <p className="font-display text-2xl font-bold text-brand-ink">{gbp(annualRevenue)}</p>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-brand-pop p-5 text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Net benefit in year one</p>
            <p className="mt-1 font-display text-4xl font-bold leading-none">{gbp(netBenefit)}</p>
            {roi > 0 && netBenefit > 0 && (
              <p className="mt-2 text-sm text-white/90">That&apos;s about <span className="font-bold">£{Math.round(roi)} back for every £1</span> you invest.</p>
            )}
          </div>
        </div>
      </div>

      <Link href="/contact" className="btn-pop mt-6 w-full">
        Get a tailored quote
        <span className="btn-arrow" aria-hidden>→</span>
      </Link>
      <p className="mt-3 text-center text-xs text-brand-ink-muted">An estimate based on the figures and assumptions you enter, not a guarantee.</p>
    </div>
  )
}
