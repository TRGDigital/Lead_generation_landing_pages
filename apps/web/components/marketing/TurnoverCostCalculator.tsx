'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, TrendingDown, Users } from 'lucide-react'
import { gbp } from '@/lib/funding'
import { ToolLeadGate } from '@/components/marketing/ToolLeadGate'

// Reveals the hidden cost of losing care staff. The two headline cards (annual
// turnover cost + potential saving) stay free; the detailed breakdown table
// sits behind the email gate.

function Money({ label, value, onChange, helper }: { label: string; value: number; onChange: (n: number) => void; helper?: string }) {
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
      {helper && <p className="mt-1.5 text-xs text-brand-ink-muted">{helper}</p>}
    </div>
  )
}

function Stepper({ label, value, onChange, min = 0, max = 500, suffix }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; suffix?: string }) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink">{label}</label>
      <div className="mt-1.5 flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(value - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Decrease">
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative w-full">
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value.replace(/[^0-9]/g, '')) || 0))}
            className="h-10 w-full rounded-lg border border-brand-line text-center text-sm font-semibold focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
          />
          {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-ink-muted">{suffix}</span>}
        </div>
        <button type="button" onClick={() => onChange(clamp(value + 1))} className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Increase">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function TurnoverCostCalculator() {
  const [staff, setStaff] = useState(40)
  const [turnoverPct, setTurnoverPct] = useState(30)
  const [replaceCost, setReplaceCost] = useState(3500)
  const [targetPct, setTargetPct] = useState(20)

  const leaversPerYear = Math.round(staff * (turnoverPct / 100))
  const annualCost = leaversPerYear * replaceCost
  const targetLeavers = Math.round(staff * (targetPct / 100))
  const costAtTarget = targetLeavers * replaceCost
  const annualSaving = Math.max(0, (leaversPerYear - targetLeavers) * replaceCost)

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* ── Your team ── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your team</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <Stepper label="Number of care staff" value={staff} onChange={setStaff} min={1} max={1000} />
        <Stepper label="Annual staff turnover" value={turnoverPct} onChange={setTurnoverPct} min={0} max={100} suffix="%" />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Money label="Cost to replace one staff member" value={replaceCost} onChange={setReplaceCost} helper="recruitment, induction, agency backfill and lost productivity" />
        <Stepper label="Target turnover to reduce to" value={targetPct} onChange={setTargetPct} min={0} max={100} suffix="%" />
      </div>

      {/* ── Free headline result ── */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-ink p-6 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Turnover costs you / year</p>
          <p className="mt-1 font-display text-5xl font-bold leading-none">{gbp(annualCost)}</p>
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-white/60"><Users className="h-3.5 w-3.5" /> {leaversPerYear} leaver{leaversPerYear === 1 ? '' : 's'} a year to replace</p>
        </div>
        <div className="rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-pop"><TrendingDown className="h-3.5 w-3.5" /> You could save / year</p>
          <p className="mt-1 font-display text-5xl font-bold leading-none text-brand-ink">{gbp(annualSaving)}</p>
          <p className="mt-1 text-xs text-brand-ink-muted">by cutting turnover to {targetPct}%</p>
        </div>
      </div>

      {/* ── Gated detailed report ── */}
      <div className="mt-8">
        <ToolLeadGate
          toolName="Staff Turnover Cost Calculator"
          summary={`${staff} staff at ${turnoverPct}% turnover, costing ${gbp(annualCost)}/year, potential saving ${gbp(annualSaving)}/year.`}
        >
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <h3 className="font-display text-xl font-bold text-brand-ink">Your staff turnover cost report</h3>
            <p className="mt-1 text-sm text-brand-ink-soft">Based on {staff} care staff at a {turnoverPct}% annual turnover rate.</p>

            <table className="mt-5 w-full text-left text-sm">
              <tbody>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Leavers per year</td>
                  <td className="py-2.5 text-right font-semibold">{leaversPerYear}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Cost per leaver</td>
                  <td className="py-2.5 text-right font-semibold">{gbp(replaceCost)}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Annual turnover cost</td>
                  <td className="py-2.5 text-right font-semibold">{gbp(annualCost)}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Cost at {targetPct}% target turnover</td>
                  <td className="py-2.5 text-right font-semibold">{gbp(costAtTarget)}</td>
                </tr>
                <tr className="font-bold text-brand-ink">
                  <td className="py-2.5">Potential annual saving</td>
                  <td className="py-2.5 text-right text-brand-pop">{gbp(annualSaving)}</td>
                </tr>
              </tbody>
            </table>

            <p className="mt-5 text-xs leading-relaxed text-brand-ink-muted">
              Every care worker who leaves takes recruitment, induction, agency backfill and lost productivity costs
              with them. Reducing turnover from {turnoverPct}% to {targetPct}% would keep {Math.max(0, leaversPerYear - targetLeavers)} more people in
              post each year. This is an estimate based on the figures you enter, not a guarantee, treat it as a
              planning guide alongside your own workforce data.
            </p>
            <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/book-a-demo" className="btn-pop">See how CareStream aids retention &amp; onboarding<span className="btn-arrow" aria-hidden>→</span></Link>
              <Link href="/contact" className="btn-cta-outline">Talk to TRG about your home</Link>
            </div>
          </div>
        </ToolLeadGate>
      </div>

      <p className="mt-4 text-center text-xs text-brand-ink-muted">An estimate based on the figures you enter, not a guarantee.</p>
    </div>
  )
}
