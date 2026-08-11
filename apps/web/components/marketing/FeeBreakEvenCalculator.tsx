'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, TrendingUp } from 'lucide-react'
import { gbp } from '@/lib/funding'
import { ToolLeadGate } from '@/components/marketing/ToolLeadGate'

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
      {helper && <p className="mt-1 text-xs text-brand-ink-muted">{helper}</p>}
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

export function FeeBreakEvenCalculator() {
  const [beds, setBeds] = useState(40)
  const [occupancyPct, setOccupancyPct] = useState(88)
  const [costs, setCosts] = useState(38000)
  const [fee, setFee] = useState(1150)

  const occupiedBeds = Math.round(beds * occupancyPct / 100)
  const weeklyRevenue = occupiedBeds * fee
  const weeklySurplus = weeklyRevenue - costs // can be negative
  const annualSurplus = weeklySurplus * 52
  const breakEvenFee = occupiedBeds > 0 ? costs / occupiedBeds : 0
  const breakEvenOccupancyPct = (beds * fee) > 0 ? (costs / (beds * fee)) * 100 : 0

  const inSurplus = weeklySurplus >= 0

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* ── Your home ── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your home</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <Stepper label="Number of beds" value={beds} onChange={setBeds} min={1} max={400} />
        <Stepper label="Current occupancy (%)" value={occupancyPct} onChange={setOccupancyPct} min={0} max={100} />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Money label="Total weekly running costs" value={costs} onChange={setCosts} helper="all staff and non-staff costs" />
        <Money label="Current weekly fee per bed" value={fee} onChange={setFee} />
      </div>

      {/* ── Free headline result ── */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className={`rounded-2xl p-6 text-center text-white ${inSurplus ? 'bg-green-700' : 'bg-red-600'}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/80">Weekly {inSurplus ? 'surplus' : 'deficit'}</p>
          <p className="mt-1 font-display text-5xl font-bold leading-none">{gbp(Math.abs(weeklySurplus))}</p>
          <p className="mt-2 text-sm text-white/80">{gbp(Math.abs(annualSurplus))}/yr {inSurplus ? 'surplus' : 'shortfall'}</p>
        </div>
        <div className="rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-6 text-center">
          <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-pop"><TrendingUp className="h-3.5 w-3.5" /> Break-even occupancy</p>
          <p className="mt-1 font-display text-5xl font-bold leading-none text-brand-ink">{breakEvenOccupancyPct.toFixed(0)}%</p>
          <p className="mt-2 text-xs text-brand-ink-muted">
            You&apos;re at {occupancyPct}% now, {occupancyPct >= breakEvenOccupancyPct ? `${(occupancyPct - breakEvenOccupancyPct).toFixed(0)} pts above` : `${(breakEvenOccupancyPct - occupancyPct).toFixed(0)} pts below`} break-even at this fee.
          </p>
        </div>
      </div>

      {/* ── Gated detailed report ── */}
      <div className="mt-8">
        <ToolLeadGate
          toolName="Care Fee Break-Even Calculator"
          summary={`${beds} beds at ${occupancyPct}% occupancy, ${gbp(fee)}/wk fee, ${gbp(costs)}/wk costs, ${inSurplus ? 'surplus' : 'deficit'} of ${gbp(Math.abs(weeklySurplus))}/wk.`}
        >
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <h3 className="font-display text-xl font-bold text-brand-ink">Your break-even report</h3>
            <p className="mt-1 text-sm text-brand-ink-soft">Based on {beds} beds at {occupancyPct}% occupancy and a {gbp(fee)} weekly fee.</p>

            <table className="mt-5 w-full text-left text-sm">
              <tbody>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Occupied beds</td>
                  <td className="py-2.5 text-right">{occupiedBeds}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Weekly revenue</td>
                  <td className="py-2.5 text-right">{gbp(weeklyRevenue)}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Weekly costs</td>
                  <td className="py-2.5 text-right">{gbp(costs)}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Weekly {inSurplus ? 'surplus' : 'deficit'}</td>
                  <td className={`py-2.5 text-right font-semibold ${inSurplus ? 'text-green-700' : 'text-red-600'}`}>{inSurplus ? '' : '-'}{gbp(Math.abs(weeklySurplus))}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Annual {inSurplus ? 'surplus' : 'deficit'}</td>
                  <td className={`py-2.5 text-right font-semibold ${inSurplus ? 'text-green-700' : 'text-red-600'}`}>{inSurplus ? '' : '-'}{gbp(Math.abs(annualSurplus))}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Break-even fee per bed</td>
                  <td className="py-2.5 text-right">{gbp(breakEvenFee)}/wk</td>
                </tr>
                <tr className="font-bold text-brand-ink">
                  <td className="py-2.5">Break-even occupancy</td>
                  <td className="py-2.5 text-right">{breakEvenOccupancyPct.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>

            <p className="mt-5 text-xs leading-relaxed text-brand-ink-muted">
              Break-even fee is the weekly fee per occupied bed that would cover your running costs at today&apos;s
              occupancy. Break-even occupancy is the occupancy you&apos;d need to cover costs at today&apos;s fee. This is a
              planning estimate based on the figures you entered, not financial advice.
            </p>
            <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/tools/empty-bed-calculator" className="btn-pop">See what empty beds cost you<span className="btn-arrow" aria-hidden>→</span></Link>
              <Link href="/contact" className="btn-cta-outline">Talk to TRG about your home</Link>
            </div>
          </div>
        </ToolLeadGate>
      </div>

      <p className="mt-4 text-center text-xs text-brand-ink-muted">An estimate based on the figures you enter, not financial advice.</p>
    </div>
  )
}
