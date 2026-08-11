'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, Users, Sun, Moon } from 'lucide-react'
import { ToolLeadGate } from '@/components/marketing/ToolLeadGate'

// Turns weekly care hours (e.g. from the dependency tool) into the care staff a home
// needs: a whole-time-equivalent (WTE) figure that accounts for a cover uplift, plus an
// indicative number of staff on duty by day and night on 12-hour shifts. Headline WTE +
// on-duty stays free; the detailed table + assumptions sit behind the lead gate.

function Stepper({ label, helper, value, onChange, min = 0, max = 100000, step = 1, suffix }: {
  label: string
  helper?: string
  value: number
  onChange: (n: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink">{label}</label>
      {helper && <p className="mt-0.5 text-xs text-brand-ink-muted">{helper}</p>}
      <div className="mt-1.5 flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(value - step))} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Decrease">
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative w-full">
          <input
            inputMode="numeric"
            value={value ? value.toLocaleString('en-GB') : ''}
            onChange={(e) => onChange(clamp(Number(e.target.value.replace(/[^0-9.]/g, '')) || 0))}
            placeholder="0"
            className={`h-10 w-full rounded-lg border border-brand-line text-center text-sm font-semibold focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20 ${suffix ? 'pr-8' : ''}`}
          />
          {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-brand-ink-muted">{suffix}</span>}
        </div>
        <button type="button" onClick={() => onChange(clamp(value + step))} className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Increase">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function StaffingCalculator() {
  const [careHoursWeek, setCareHoursWeek] = useState(700)
  const [contractedHours, setContractedHours] = useState(37.5)
  const [uplift, setUplift] = useState(22)
  const [dayShare, setDayShare] = useState(65)

  // Calc
  const productiveHoursPerWTE = Math.max(1, contractedHours * (1 - uplift / 100))
  const requiredWTE = Math.round((careHoursWeek / productiveHoursPerWTE) * 10) / 10
  const dailyCareHours = careHoursWeek / 7
  const dayHours = (dailyCareHours * dayShare) / 100
  const nightHours = (dailyCareHours * (100 - dayShare)) / 100
  const staffOnDutyDay = Math.ceil(dayHours / 12)
  const staffOnDutyNight = Math.ceil(nightHours / 12)

  const dp = (n: number) => n.toLocaleString('en-GB', { maximumFractionDigits: 1 })

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* ── Your care hours ── */}
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your care hours</p>
      <p className="mt-1 text-sm text-brand-ink-soft">Tell us the care your home delivers and how your team is contracted.</p>

      <div className="mt-4 space-y-5">
        <Stepper
          label="Care hours needed per week"
          helper="From your dependency assessment, or enter your own"
          value={careHoursWeek}
          onChange={setCareHoursWeek}
          min={0}
          max={100000}
          step={10}
          suffix="hrs"
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Stepper label="Staff contracted hours / week" value={contractedHours} onChange={setContractedHours} min={1} max={60} suffix="hrs" />
          <Stepper label="Cover uplift for holiday, sickness & training" value={uplift} onChange={setUplift} min={0} max={60} suffix="%" />
        </div>
        <div>
          <Stepper label="Day share of care" helper="The rest is delivered at night" value={dayShare} onChange={setDayShare} min={0} max={100} step={5} suffix="%" />
          <p className="mt-1.5 text-xs text-brand-ink-muted">Day {dayShare}% · Night {100 - dayShare}%</p>
        </div>
      </div>

      {/* ── Free headline result ── */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-ink p-6 text-center text-white">
          <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-brand-accent"><Users className="h-3.5 w-3.5" /> Care staff needed (WTE)</p>
          <p className="mt-1 font-display text-5xl font-bold leading-none">{dp(requiredWTE)}</p>
          <p className="mt-1 text-xs text-white/60">whole-time equivalent</p>
        </div>
        <div className="rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">On duty</p>
          <div className="mt-1 flex items-center justify-center gap-4">
            <span className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-brand-ink-muted"><Sun className="h-3.5 w-3.5" /> Day</span>
              <span className="font-display text-5xl font-bold leading-none text-brand-ink">{staffOnDutyDay}</span>
            </span>
            <span className="text-2xl font-bold text-brand-line">/</span>
            <span className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest text-brand-ink-muted"><Moon className="h-3.5 w-3.5" /> Night</span>
              <span className="font-display text-5xl font-bold leading-none text-brand-ink">{staffOnDutyNight}</span>
            </span>
          </div>
          <p className="mt-2 text-xs text-brand-ink-muted">care staff on a 12-hour shift</p>
        </div>
      </div>

      {/* ── Gated detailed report ── */}
      <div className="mt-8">
        {careHoursWeek <= 0 ? (
          <p className="rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 p-6 text-center text-sm text-brand-ink-muted">
            Enter your weekly care hours above to see your full staffing report.
          </p>
        ) : (
          <ToolLeadGate
            toolName="Staffing Calculator"
            summary={`${dp(requiredWTE)} WTE for ${careHoursWeek.toLocaleString('en-GB')} care hours/week (${staffOnDutyDay} day / ${staffOnDutyNight} night on duty).`}
          >
            <div className="rounded-2xl border border-brand-line bg-white p-6">
              <h3 className="font-display text-xl font-bold text-brand-ink">Your staffing report</h3>
              <p className="mt-1 text-sm text-brand-ink-soft">Based on {careHoursWeek.toLocaleString('en-GB')} care hours per week.</p>

              <table className="mt-5 w-full text-left text-sm">
                <tbody>
                  <tr className="border-b border-brand-line/60">
                    <td className="py-2.5 font-semibold text-brand-ink">Care staff required (WTE)</td>
                    <td className="py-2.5 text-right font-display font-bold text-brand-ink">{dp(requiredWTE)}</td>
                  </tr>
                  <tr className="border-b border-brand-line/60">
                    <td className="py-2.5 font-semibold text-brand-ink">Staff on duty, day</td>
                    <td className="py-2.5 text-right font-semibold">{staffOnDutyDay}</td>
                  </tr>
                  <tr className="border-b border-brand-line/60">
                    <td className="py-2.5 font-semibold text-brand-ink">Staff on duty, night</td>
                    <td className="py-2.5 text-right font-semibold">{staffOnDutyNight}</td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Assumptions used</p>
              <table className="mt-2 w-full text-left text-sm">
                <tbody>
                  <tr className="border-b border-brand-line/60">
                    <td className="py-2 text-brand-ink-soft">Care hours needed per week</td>
                    <td className="py-2 text-right font-semibold text-brand-ink">{careHoursWeek.toLocaleString('en-GB')} hrs</td>
                  </tr>
                  <tr className="border-b border-brand-line/60">
                    <td className="py-2 text-brand-ink-soft">Contracted hours per WTE</td>
                    <td className="py-2 text-right font-semibold text-brand-ink">{dp(contractedHours)} hrs</td>
                  </tr>
                  <tr className="border-b border-brand-line/60">
                    <td className="py-2 text-brand-ink-soft">Cover uplift (holiday, sickness &amp; training)</td>
                    <td className="py-2 text-right font-semibold text-brand-ink">{uplift}%</td>
                  </tr>
                  <tr className="border-b border-brand-line/60">
                    <td className="py-2 text-brand-ink-soft">Productive hours per WTE</td>
                    <td className="py-2 text-right font-semibold text-brand-ink">{dp(productiveHoursPerWTE)} hrs</td>
                  </tr>
                  <tr className="border-b border-brand-line/60">
                    <td className="py-2 text-brand-ink-soft">Day / night split of care</td>
                    <td className="py-2 text-right font-semibold text-brand-ink">{dayShare}% / {100 - dayShare}%</td>
                  </tr>
                  <tr className="border-b border-brand-line/60">
                    <td className="py-2 text-brand-ink-soft">Shift length</td>
                    <td className="py-2 text-right font-semibold text-brand-ink">12 hrs</td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-5 text-xs leading-relaxed text-brand-ink-muted">
                How this is worked out: productive hours per WTE = contracted hours &times; (1 minus the cover uplift),
                which strips out the time each contracted person is unavailable for holiday, sickness and training. The
                required WTE = weekly care hours divided by productive hours per WTE. On-duty numbers split the daily
                care hours into day and night, then divide by a 12-hour shift and round up. This is an indicative guide
                to support planning and professional judgement, not a compliant staffing assessment. Adjust the inputs
                for your own home, care model, dependency mix and skill mix.
              </p>
              <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/book-a-demo" className="btn-pop">See how CareStream lightens rotas<span className="btn-arrow" aria-hidden>→</span></Link>
                <Link href="/contact" className="btn-cta-outline">Talk to TRG about your home</Link>
              </div>
            </div>
          </ToolLeadGate>
        )}
      </div>
    </div>
  )
}
