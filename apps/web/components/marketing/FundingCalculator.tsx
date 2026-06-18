'use client'

import { useState } from 'react'
import { Check, AlertCircle, Info, RotateCcw } from 'lucide-react'
import { calculateFunding, gbp, type Country, type CareType, type FundingResult } from '@/lib/funding'

type Form = {
  country: Country | ''
  careType: CareType | ''
  savings: number
  ownsHome: boolean | null
  spouseInHome: boolean | null
  homeValue: number
  mortgage: number
  weeklyIncome: number
  weeklyFee: number
}

const EMPTY: Form = {
  country: '', careType: '', savings: 0, ownsHome: null, spouseInHome: null,
  homeValue: 0, mortgage: 0, weeklyIncome: 0, weeklyFee: 0,
}

const COUNTRIES: { value: Country; label: string }[] = [
  { value: 'england', label: 'England' },
  { value: 'scotland', label: 'Scotland' },
  { value: 'wales', label: 'Wales' },
  { value: 'ni', label: 'Northern Ireland' },
]

const STATUS = {
  self: { label: 'Likely self-funding', color: 'text-brand-pop', ring: 'border-brand-pop/40 bg-brand-pop/5', Icon: AlertCircle },
  partial: { label: 'Partial council support', color: 'text-amber-600', ring: 'border-amber-300 bg-amber-50', Icon: Info },
  council: { label: 'Likely full council support', color: 'text-green-700', ring: 'border-green-300 bg-green-50', Icon: Check },
} as const

function OptionCard({ label, sub, selected, onClick }: { label: string; sub?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
        selected ? 'border-brand-pop bg-brand-pop/5' : 'border-brand-line bg-white hover:border-brand-pop/40'
      }`}
    >
      <span className={`text-sm font-semibold ${selected ? 'text-brand-pop' : 'text-brand-ink'}`}>{label}</span>
      {sub && <span className="mt-0.5 text-xs text-brand-ink-soft">{sub}</span>}
    </button>
  )
}

function Money({ label, hint, value, onChange }: { label: string; hint?: string; value: number; onChange: (n: number) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink">{label}</label>
      {hint && <p className="mb-1 text-xs text-brand-ink-soft">{hint}</p>}
      <div className="relative mt-1">
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

function ResultBar({ label, amount, total, color }: { label: string; amount: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="w-32 shrink-0 text-right text-xs font-medium text-brand-ink-soft">{label}</div>
      <div className="h-7 flex-1 overflow-hidden rounded-md bg-brand-bg-warm">
        <div className="flex h-full items-center rounded-md px-2 text-xs font-bold text-white" style={{ width: `${Math.max(pct, amount > 0 ? 14 : 0)}%`, background: color }}>
          {amount > 0 && gbp(amount)}
        </div>
      </div>
    </div>
  )
}

const STEPS = ['Location', 'Care type', 'Savings & property', 'Income & fee']

export function FundingCalculator() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Form>(EMPTY)
  const [result, setResult] = useState<FundingResult | null>(null)

  const set = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }))

  const canNext = (() => {
    if (step === 0) return !!form.country
    if (step === 1) return !!form.careType
    if (step === 2) return form.ownsHome !== null
    if (step === 3) return (form.weeklyFee || 0) > 0
    return true
  })()

  function next() {
    if (step < STEPS.length - 1) return setStep((s) => s + 1)
    setResult(calculateFunding({ ...(form as Required<Form>), country: form.country as Country, careType: form.careType as CareType, ownsHome: !!form.ownsHome, spouseInHome: !!form.spouseInHome }))
  }
  function reset() {
    setForm(EMPTY); setStep(0); setResult(null)
  }

  // ── Results ──────────────────────────────────────────────────────────────
  if (result) {
    const s = STATUS[result.status]
    const fee = form.weeklyFee || 0
    return (
      <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
        <div className={`flex items-center gap-3 rounded-2xl border-2 p-5 ${s.ring}`}>
          <s.Icon className={`h-7 w-7 flex-shrink-0 ${s.color}`} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">{result.nation} · your likely position</p>
            <p className={`font-display text-xl font-bold uppercase tracking-tight ${s.color}`}>{s.label}</p>
          </div>
        </div>

        <p className="mt-6 text-sm font-semibold text-brand-ink">Estimated weekly breakdown of a {gbp(fee)} fee</p>
        <div className="mt-3 space-y-2.5">
          <ResultBar label="You pay" amount={result.yourWeekly} total={fee} color="#F0532B" />
          {result.councilWeekly > 0 && <ResultBar label="Council pays" amount={result.councilWeekly} total={fee} color="#16A34A" />}
          {result.nhsWeekly > 0 && <ResultBar label="NHS / FNC pays" amount={result.nhsWeekly} total={fee} color="#2563EB" />}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-brand-bg-warm p-4">
            <p className="text-xs text-brand-ink-muted">Your contribution</p>
            <p className="font-display text-2xl font-bold text-brand-ink">{gbp(result.yourWeekly)}<span className="text-sm font-medium text-brand-ink-soft">/wk</span></p>
          </div>
          {result.weeksUntilSupport != null ? (
            <div className="rounded-xl bg-brand-bg-warm p-4">
              <p className="text-xs text-brand-ink-muted">Savings last roughly</p>
              <p className="font-display text-2xl font-bold text-brand-ink">{Math.round(result.weeksUntilSupport / 52 * 10) / 10} yrs<span className="text-sm font-medium text-brand-ink-soft"> until support</span></p>
            </div>
          ) : (
            <div className="rounded-xl bg-brand-bg-warm p-4">
              <p className="text-xs text-brand-ink-muted">Total assessable capital</p>
              <p className="font-display text-2xl font-bold text-brand-ink">{gbp(result.totalCapital)}</p>
            </div>
          )}
        </div>

        {result.dpaPossible && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-brand-line bg-white p-4 text-sm text-brand-ink-soft">
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
            You may be eligible for a <span className="font-semibold text-brand-ink">Deferred Payment Agreement</span> — using your home&apos;s value to pay for care without selling it now.
          </p>
        )}

        <p className="mt-5 text-xs leading-relaxed text-brand-ink-muted">
          This is a guide only, based on {result.nation} thresholds and not financial advice. A full local authority financial assessment may give a different result.
        </p>

        <button type="button" onClick={reset} className="btn-cta-outline mt-6 w-full">
          <RotateCcw className="h-4 w-4" /> Start again
        </button>
      </div>
    )
  }

  // ── Wizard ───────────────────────────────────────────────────────────────
  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-brand-ink-muted">
        <span>Step {step + 1} of {STEPS.length}</span>
        {step > 0 && <button type="button" onClick={() => setStep((s) => s - 1)} className="font-semibold text-brand-pop hover:underline">Back</button>}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-bg-warm">
        <div className="h-full rounded-full bg-brand-pop transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
      </div>

      <h3 className="mt-5 font-display text-xl font-bold uppercase tracking-tight text-brand-ink">{STEPS[step]}</h3>

      <div className="mt-5">
        {step === 0 && (
          <div className="grid grid-cols-2 gap-3">
            {COUNTRIES.map((c) => (
              <OptionCard key={c.value} label={c.label} selected={form.country === c.value} onClick={() => set({ country: c.value })} />
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <OptionCard label="Residential care" sub="Personal care & support" selected={form.careType === 'residential'} onClick={() => set({ careType: 'residential' })} />
            <OptionCard label="Nursing care" sub="Includes registered nursing" selected={form.careType === 'nursing'} onClick={() => set({ careType: 'nursing' })} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <Money label="Savings & investments" hint="Cash, ISAs, shares, etc." value={form.savings} onChange={(n) => set({ savings: n })} />
            <div>
              <p className="mb-2 text-sm font-semibold text-brand-ink">Do you own your home?</p>
              <div className="grid grid-cols-2 gap-3">
                <OptionCard label="Yes" selected={form.ownsHome === true} onClick={() => set({ ownsHome: true })} />
                <OptionCard label="No" selected={form.ownsHome === false} onClick={() => set({ ownsHome: false, spouseInHome: null, homeValue: 0, mortgage: 0 })} />
              </div>
            </div>
            {form.ownsHome && (
              <div className="space-y-5 rounded-xl bg-brand-bg-warm p-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-brand-ink">Will a partner still live there?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <OptionCard label="Yes" sub="Home is disregarded" selected={form.spouseInHome === true} onClick={() => set({ spouseInHome: true })} />
                    <OptionCard label="No" selected={form.spouseInHome === false} onClick={() => set({ spouseInHome: false })} />
                  </div>
                </div>
                {form.spouseInHome === false && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Money label="Home value" value={form.homeValue} onChange={(n) => set({ homeValue: n })} />
                    <Money label="Mortgage left" value={form.mortgage} onChange={(n) => set({ mortgage: n })} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <Money label="Total weekly income" hint="State pension, private pensions, benefits, etc." value={form.weeklyIncome} onChange={(n) => set({ weeklyIncome: n })} />
            <Money label="Weekly care fee" hint="The fee quoted by the care provider" value={form.weeklyFee} onChange={(n) => set({ weeklyFee: n })} />
          </div>
        )}
      </div>

      <button type="button" onClick={next} disabled={!canNext} className="btn-pop mt-7 w-full disabled:opacity-50">
        {step < STEPS.length - 1 ? 'Continue' : 'See my result'}
        <span className="btn-arrow" aria-hidden>→</span>
      </button>
    </div>
  )
}
