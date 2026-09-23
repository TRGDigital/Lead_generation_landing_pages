'use client'
import { ToolLeadPrompt } from '@/components/marketing/ToolLeadPrompt'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { gbp } from '@/lib/funding'
import {
  computeFundingMix,
  DEFAULTS,
  BASE_DEFAULTS,
  type FundingMode,
  type FundingMixInputs,
  type Timescaled,
} from '@/lib/funding-mix'

function Money({ label, value, onChange, hint }: { label: string; value: number; onChange: (n: number) => void; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink">{label}</label>
      {hint ? <p className="text-[11px] text-brand-ink-muted">{hint}</p> : null}
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

function Stepper({ label, value, onChange, min = 0, max = 500, step = 1, suffix }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number; suffix?: string }) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink">{label}</label>
      <div className="mt-1.5 flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(value - step))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Decrease">
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative w-full">
          <input
            inputMode="numeric"
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value.replace(/[^0-9]/g, '')) || 0))}
            className="h-10 w-full rounded-lg border border-brand-line text-center text-sm font-semibold focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
          />
          {suffix ? <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-ink-muted">{suffix}</span> : null}
        </div>
        <button type="button" onClick={() => onChange(clamp(value + step))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label="Increase">
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Compact four-timescale row for a single figure.
function Timescales({ v, tone = 'light' }: { v: Timescaled; tone?: 'light' | 'dark' }) {
  const cells: [string, number][] = [
    ['Month', v.month],
    ['Quarter', v.quarter],
    ['6 months', v.sixMonth],
    ['12 months', v.year],
  ]
  const labelCls = tone === 'dark' ? 'text-white/55' : 'text-brand-ink-muted'
  const valCls = tone === 'dark' ? 'text-white' : 'text-brand-ink'
  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map(([label, n]) => (
        <div key={label} className="text-center">
          <p className={`text-[10px] font-semibold uppercase tracking-wide ${labelCls}`}>{label}</p>
          <p className={`mt-0.5 font-display text-base font-bold leading-tight sm:text-lg ${valCls}`}>{gbp(n)}</p>
        </div>
      ))}
    </div>
  )
}

export function FundingMixCalculator() {
  const [i, setI] = useState<FundingMixInputs>(BASE_DEFAULTS)
  const set = (patch: Partial<FundingMixInputs>) => setI((prev) => ({ ...prev, ...patch }))

  // Switching setting resets the fee + cost lines to that mode's sensible defaults.
  const setMode = (mode: FundingMode) => set({ mode, ...DEFAULTS[mode] })

  // Keep LA + private within total capacity.
  const setTotal = (n: number) => {
    const totalBeds = Math.max(1, n)
    const laBeds = Math.min(i.laBeds, totalBeds)
    const privateBeds = Math.min(i.privateBeds, totalBeds - laBeds)
    set({ totalBeds, laBeds, privateBeds })
  }
  const setLa = (n: number) => set({ laBeds: Math.max(0, Math.min(n, i.totalBeds - i.privateBeds)) })
  const setPrivate = (n: number) => set({ privateBeds: Math.max(0, Math.min(n, i.totalBeds - i.laBeds)) })

  const r = computeFundingMix(i)
  const isNursing = i.mode === 'nursing'

  const modeBtn = (mode: FundingMode, text: string) => (
    <button
      type="button"
      onClick={() => setMode(mode)}
      className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
        i.mode === mode ? 'bg-brand-ink text-white' : 'text-brand-ink-soft hover:text-brand-ink'
      }`}
    >
      {text}
    </button>
  )

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* Setting toggle */}
      <div className="flex rounded-xl border border-brand-line bg-brand-bg-warm/60 p-1">
        {modeBtn('residential', 'Residential')}
        {modeBtn('nursing', 'Nursing')}
      </div>

      {/* Your home */}
      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your home</p>
      <div className="mt-3 space-y-4">
        <Stepper label="Total beds" value={i.totalBeds} onChange={setTotal} min={1} max={300} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Stepper label="Social services beds" value={i.laBeds} onChange={setLa} max={i.totalBeds} />
          <Stepper label="Private beds" value={i.privateBeds} onChange={setPrivate} max={i.totalBeds} />
        </div>
        <p className="text-xs text-brand-ink-muted">
          {r.empty} empty · {r.occupancyPct.toFixed(0)}% occupancy
        </p>
      </div>

      {/* Fees */}
      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Weekly fees</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <Money label={`Private fee${isNursing ? ' (excl. FNC)' : ''}`} value={i.privateFee} onChange={(n) => set({ privateFee: n })} />
        {i.laMode === 'percent' ? (
          <Stepper label="Social services rate" value={i.laPercent} onChange={(n) => set({ laPercent: Math.min(100, n) })} min={0} max={100} step={5} suffix="%" />
        ) : (
          <Money label="Social services rate" value={i.laAmount} onChange={(n) => set({ laAmount: n })} />
        )}
      </div>
      <button
        type="button"
        onClick={() => set({ laMode: i.laMode === 'percent' ? 'amount' : 'percent' })}
        className="mt-2 text-xs font-semibold text-brand-pop hover:underline"
      >
        {i.laMode === 'percent' ? 'Enter a set £ rate instead' : 'Use % of private fee instead'}
      </button>

      {/* Advanced */}
      <details className="mt-5 rounded-xl border border-brand-line bg-brand-bg-warm/50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-brand-ink">Costs &amp; assumptions</summary>
        <div className="mt-4 space-y-4">
          <Money label="Variable cost per occupied bed / week" value={i.varPerBed} onChange={(n) => set({ varPerBed: n })} hint="Care staff, food, consumables, laundry, marginal utilities." />
          <Money label="Fixed overhead per bed / week" value={i.fixedPerBed} onChange={(n) => set({ fixedPerBed: n })} hint="Building, management, insurance, admin, spread over every bed." />
          <Money label="Third-party top-up per social services bed / week" value={i.topUp} onChange={(n) => set({ topUp: n })} hint="Any family top-up the home receives on top of the LA rate." />
          {isNursing ? (
            <Money label="NHS Funded Nursing Care (FNC) / week" value={i.fnc} onChange={(n) => set({ fnc: n })} hint="Paid on top for every nursing resident, both funders." />
          ) : null}
        </div>
      </details>

      {/* ── HEADLINE: revenue lost on social-services beds ── */}
      <div className="mt-7 rounded-2xl bg-brand-ink p-6 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">
          Your {i.laBeds} social services {i.laBeds === 1 ? 'bed costs' : 'beds cost'} you
        </p>
        <p className="mt-1 font-display text-5xl font-bold leading-none sm:text-6xl">{gbp(r.laShortfall.year)}</p>
        <p className="mt-2 text-sm text-white/60">a year in lost revenue, vs the same beds being private</p>
        <div className="mt-5 border-t border-white/10 pt-5">
          <Timescales v={r.laShortfall} tone="dark" />
        </div>
      </div>

      {/* Per-bed comparison */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-brand-line bg-brand-bg-warm/50 p-4 text-center">
        <div>
          <p className="text-[11px] text-brand-ink-muted">Private / wk</p>
          <p className="font-display text-lg font-bold text-brand-ink">{gbp(r.privWeekly)}</p>
        </div>
        <div>
          <p className="text-[11px] text-brand-ink-muted">Social services / wk</p>
          <p className="font-display text-lg font-bold text-brand-ink">{gbp(r.laWeekly)}</p>
        </div>
        <div>
          <p className="text-[11px] text-brand-ink-muted">Gap / bed / wk</p>
          <p className="font-display text-lg font-bold text-brand-pop">{gbp(r.gapPerBed)}</p>
        </div>
      </div>

      {/* Supporting: whole-home net profit */}
      <div className="mt-4 rounded-2xl border border-brand-line p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your home&apos;s net profit at this mix</p>
        <div className="mt-3">
          <Timescales v={r.net} />
        </div>
        <p className="mt-4 border-t border-brand-line pt-3 text-xs leading-relaxed text-brand-ink-soft">
          {r.maxLaBeds >= r.occupied ? (
            <>At these figures your home stays profitable across your whole occupied capacity.</>
          ) : (
            <>
              At these figures your home slips into a loss once more than{' '}
              <span className="font-bold text-brand-ink">{r.maxLaBeds}</span> of your {r.occupied} occupied beds are social-services funded.
            </>
          )}
        </p>
      </div>

      <ToolLeadPrompt
        toolName="funding mix calculator"
        summary={`Breaks even at ${r.maxLaBeds} of ${r.occupied} occupied beds on social services funding.`}
        heading="Talk to us about filling beds privately"
        body="Leave your details and we will send you how homes shift their mix towards private payers, with the numbers behind it."
        cta="Send me the detail"
      />
      <p className="mt-3 text-center text-xs text-brand-ink-muted">An estimate based on the figures you enter, not a guarantee. Costs vary by home.</p>
    </div>
  )
}
