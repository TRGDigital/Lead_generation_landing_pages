'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus } from 'lucide-react'
import { gbp } from '@/lib/funding'
import { ToolLeadGate } from '@/components/marketing/ToolLeadGate'

// Shows what agency staffing really costs a care home, and what cutting a share of
// it back to permanent staff would save. Free headline (annual spend + potential
// saving); the detailed breakdown sits behind the email gate.

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

export function AgencyCostCalculator() {
  const [hours, setHours] = useState(120)
  const [agencyRate, setAgencyRate] = useState(28)
  const [permRate, setPermRate] = useState(15)
  const [targetPct, setTargetPct] = useState(50)

  const weeklyAgency = hours * agencyRate
  const annualAgency = weeklyAgency * 52
  const gap = Math.max(0, agencyRate - permRate)
  const annualPremium = hours * gap * 52
  const annualSaving = hours * (targetPct / 100) * gap * 52

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* ── Your agency use ── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your agency use</p>
      <div className="mt-3 grid gap-5 sm:grid-cols-2">
        <Stepper label="Agency hours per week" value={hours} onChange={setHours} max={2000} suffix="hrs" />
        <Money label="Agency cost per hour" value={agencyRate} onChange={setAgencyRate} />
        <Money label="Permanent cost per hour (incl. on-costs)" value={permRate} onChange={setPermRate} />
        <Stepper label="Target reduction in agency" value={targetPct} onChange={setTargetPct} max={100} suffix="%" />
      </div>

      {/* ── Free headline result ── */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-ink p-6 text-center text-white">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Annual agency spend</p>
          <p className="mt-1 font-display text-4xl font-bold leading-none sm:text-5xl">{gbp(annualAgency)}</p>
          <p className="mt-2 text-sm text-white/60">{gbp(weeklyAgency)}/wk at {gbp(agencyRate)}/hr</p>
        </div>
        <div className="rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">You could save / year</p>
          <p className="mt-1 font-display text-4xl font-bold leading-none text-brand-ink sm:text-5xl">{gbp(annualSaving)}</p>
          <p className="mt-2 text-sm text-brand-ink-muted">by moving {targetPct}% back to permanent</p>
        </div>
      </div>

      {/* ── Gated detailed report ── */}
      <div className="mt-8">
        <ToolLeadGate
          toolName="Agency Staff Cost Calculator"
          summary={`${gbp(annualAgency)}/yr on agency, potential saving ${gbp(annualSaving)}/yr by cutting ${targetPct}%.`}
        >
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <h3 className="font-display text-xl font-bold text-brand-ink">Your agency cost breakdown</h3>
            <p className="mt-1 text-sm text-brand-ink-soft">
              Based on {hours.toLocaleString('en-GB')} agency hours a week at {gbp(agencyRate)}/hr versus {gbp(permRate)}/hr for permanent staff.
            </p>

            <table className="mt-5 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-line text-xs uppercase tracking-wide text-brand-ink-muted">
                  <th className="py-2">Measure</th><th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Weekly agency cost</td>
                  <td className="py-2.5 text-right">{gbp(weeklyAgency)}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Annual agency cost</td>
                  <td className="py-2.5 text-right">{gbp(annualAgency)}</td>
                </tr>
                <tr className="border-b border-brand-line/60">
                  <td className="py-2.5 font-semibold text-brand-ink">Premium over permanent / year</td>
                  <td className="py-2.5 text-right">{gbp(annualPremium)}</td>
                </tr>
                <tr className="font-bold text-brand-ink">
                  <td className="py-2.5">Saving from cutting {targetPct}% / year</td>
                  <td className="py-2.5 text-right text-brand-pop">{gbp(annualSaving)}</td>
                </tr>
              </tbody>
            </table>

            <p className="mt-5 text-xs leading-relaxed text-brand-ink-muted">
              The premium is the extra you pay for agency hours compared with covering them permanently. The saving
              assumes you move your target share of agency hours onto permanent staff at your stated permanent rate.
              This is an estimate to support planning, based on the figures you enter, not a guarantee of savings.
            </p>

            <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">Get help reducing agency<span className="btn-arrow" aria-hidden>→</span></Link>
              <Link href="/tools" className="btn-cta-outline">More free tools</Link>
            </div>
          </div>
        </ToolLeadGate>
      </div>
    </div>
  )
}
