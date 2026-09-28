'use client'
import { ToolLeadPrompt } from '@/components/marketing/ToolLeadPrompt'

import { useState } from 'react'
import { Minus, Plus, TrendingUp } from 'lucide-react'
import { gbp } from '@/lib/funding'
import {
  computeEnquiryValue,
  enquiryWords,
  BASE_DEFAULTS,
  SERVICE_DEFAULTS,
  type EnquiryService,
  type EnquiryValueInputs,
} from '@/lib/enquiry-value'

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
          aria-label={label}
          className="w-full rounded-lg border border-brand-line py-2.5 pl-8 pr-3 text-sm focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
        />
      </div>
    </div>
  )
}

function Stepper({ label, value, onChange, min = 0, max = 500, step = 1, suffix, hint }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; step?: number; suffix?: string; hint?: string }) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  return (
    <div>
      <label className="block text-sm font-semibold text-brand-ink">{label}</label>
      {hint ? <p className="text-[11px] text-brand-ink-muted">{hint}</p> : null}
      <div className="mt-1.5 flex items-center gap-2">
        <button type="button" onClick={() => onChange(clamp(value - step))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label={`Decrease ${label}`}>
          <Minus className="h-4 w-4" />
        </button>
        <div className="relative w-full">
          <input
            inputMode="numeric"
            value={value}
            aria-label={label}
            onChange={(e) => onChange(clamp(Number(e.target.value.replace(/[^0-9]/g, '')) || 0))}
            className="h-10 w-full rounded-lg border border-brand-line text-center text-sm font-semibold focus:border-brand-pop focus:outline-none focus:ring-2 focus:ring-brand-pop/20"
          />
          {suffix ? <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-ink-muted">{suffix}</span> : null}
        </div>
        <button type="button" onClick={() => onChange(clamp(value + step))} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-line text-brand-ink transition-colors hover:border-brand-pop hover:text-brand-pop" aria-label={`Increase ${label}`}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// One-decimal count that drops the ".0" for whole numbers.
const num = (n: number) => (Math.round(n * 10) / 10).toLocaleString('en-GB', { maximumFractionDigits: 1 })

export function EnquiryValueCalculator() {
  const [i, setI] = useState<EnquiryValueInputs>(BASE_DEFAULTS)
  const set = (patch: Partial<EnquiryValueInputs>) => setI((prev) => ({ ...prev, ...patch }))

  // Switching service resets the fee, stay and funnel to that service's sensible defaults.
  const setService = (service: EnquiryService) => set({ service, ...SERVICE_DEFAULTS[service] })

  const r = computeEnquiryValue(i)
  const w = enquiryWords(i.service)
  const isHomeCare = i.service === 'homecare'
  const m = r.margin
  const showMargin = i.useMargin

  const serviceBtn = (service: EnquiryService, text: string) => (
    <button
      type="button"
      onClick={() => setService(service)}
      aria-pressed={i.service === service}
      className={`flex-1 rounded-lg px-2 py-2.5 text-sm font-semibold transition-colors sm:px-4 ${
        i.service === service ? 'bg-brand-ink text-white' : 'text-brand-ink-soft hover:text-brand-ink'
      }`}
    >
      {text}
    </button>
  )

  // Funnel bars scale against the enquiry count.
  const enquiries = Math.max(0, i.enquiriesPerMonth)
  const bar = (n: number) => (enquiries > 0 ? Math.max(4, (n / enquiries) * 100) : 4)
  const funnel: [string, number, string][] = [
    ['Enquiries', enquiries, 'bg-brand-ink'],
    [w.Viewing === 'Viewing' ? 'Viewings' : 'Assessments', r.viewingsPerMonth, 'bg-brand-ink/70'],
    [w.Admission === 'Admission' ? 'Admissions' : 'New clients', r.admissionsPerMonth, 'bg-brand-pop'],
  ]

  return (
    <div className="rounded-3xl border border-brand-line bg-white p-6 shadow-card sm:p-8">
      {/* Service toggle */}
      <div className="flex rounded-xl border border-brand-line bg-brand-bg-warm/60 p-1">
        {serviceBtn('residential', 'Residential')}
        {serviceBtn('nursing', 'Nursing')}
        {serviceBtn('homecare', 'Home care')}
      </div>

      {/* Fees */}
      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
        {isHomeCare ? 'Your average client' : 'Your average resident'}
      </p>
      <div className="mt-3 space-y-4">
        {isHomeCare ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Money label="Hourly rate" value={i.hourlyRate} onChange={(n) => set({ hourlyRate: n })} />
            <Stepper label="Hours per week" value={i.hoursPerWeek} onChange={(n) => set({ hoursPerWeek: n })} min={1} max={168} suffix="hrs" />
          </div>
        ) : (
          <Money label="Average weekly fee" value={i.weeklyFee} onChange={(n) => set({ weeklyFee: n })} hint={i.service === 'nursing' ? 'What the home receives each week, including any FNC.' : undefined} />
        )}
        <Stepper
          label={w.Stay}
          value={i.stayMonths}
          onChange={(n) => set({ stayMonths: n })}
          min={1}
          max={120}
          suffix="months"
          hint={isHomeCare ? 'How long a typical private package runs.' : 'How long a typical resident stays with you.'}
        />
        {isHomeCare ? (
          <p className="text-xs text-brand-ink-muted">That is {gbp(r.weeklyIncome)} a week per client.</p>
        ) : null}
      </div>

      {/* Funnel */}
      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your enquiries</p>
      <div className="mt-3 space-y-4">
        <Stepper label="Enquiries per month" value={i.enquiriesPerMonth} onChange={(n) => set({ enquiriesPerMonth: n })} min={0} max={1000} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Stepper label={`Enquiry to ${w.viewing}`} value={i.toViewingPct} onChange={(n) => set({ toViewingPct: n })} min={0} max={100} step={5} suffix="%" />
          <Stepper label={`${w.Viewing} to ${isHomeCare ? 'care start' : 'admission'}`} value={i.toAdmissionPct} onChange={(n) => set({ toAdmissionPct: n })} min={0} max={100} step={5} suffix="%" />
        </div>
      </div>

      {/* Margin */}
      <details className="mt-5 rounded-xl border border-brand-line bg-brand-bg-warm/50 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-brand-ink">Show profit as well as fees (optional)</summary>
        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-brand-line bg-white px-4 py-3 text-sm">
            <span className="font-semibold text-brand-ink">Include contribution margin</span>
            <input type="checkbox" checked={i.useMargin} onChange={(e) => set({ useMargin: e.target.checked })} className="h-5 w-5 accent-brand-pop" />
          </label>
          {i.useMargin ? (
            <Stepper
              label="Contribution margin"
              value={i.marginPct}
              onChange={(n) => set({ marginPct: n })}
              min={0}
              max={100}
              step={5}
              suffix="%"
              hint={`The share of each fee left after the direct cost of care for that ${w.person}.`}
            />
          ) : null}
        </div>
      </details>

      {/* ── HEADLINE: value of one enquiry ── */}
      <div className="mt-7 rounded-2xl bg-brand-ink p-6 text-center text-white">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">Every enquiry is worth</p>
        <p className="mt-1 font-display text-5xl font-bold leading-none sm:text-6xl">{gbp(r.enquiryValue)}</p>
        <p className="mt-2 text-sm text-white/60">
          in lifetime fees, at your {num(r.conversionPct)}% enquiry to {w.admission} rate
        </p>
        {showMargin ? (
          <p className="mt-1 text-sm text-white/80">
            About <span className="font-bold text-white">{gbp(r.enquiryValue * m)}</span> of that is contribution at a {i.marginPct}% margin
          </p>
        ) : null}
        <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/55">One {w.person}</p>
            <p className="mt-0.5 font-display text-base font-bold leading-tight sm:text-lg">{gbp(r.lifetimeValue)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/55">One {w.viewing}</p>
            <p className="mt-0.5 font-display text-base font-bold leading-tight sm:text-lg">{gbp(r.viewingValue)}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/55">{w.Admission === 'Admission' ? 'Admissions' : 'New clients'} / yr</p>
            <p className="mt-0.5 font-display text-base font-bold leading-tight sm:text-lg">{num(r.admissionsPerYear)}</p>
          </div>
        </div>
      </div>

      {/* Funnel visual */}
      <div className="mt-4 rounded-2xl border border-brand-line p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Your month, as a funnel</p>
        <div className="mt-4 space-y-2.5">
          {funnel.map(([label, n, cls]) => (
            <div key={label}>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-semibold text-brand-ink">{label}</span>
                <span className="font-display text-sm font-bold text-brand-ink">{num(n)}</span>
              </div>
              <div className="mt-1 h-3 w-full rounded-full bg-brand-bg-warm">
                <div className={`h-3 rounded-full ${cls} transition-all`} style={{ width: `${bar(n)}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-brand-line pt-3 text-xs leading-relaxed text-brand-ink-soft">
          A year of enquiries at this rate brings in about <span className="font-bold text-brand-ink">{num(r.admissionsPerYear)}</span> {w.admissions},
          worth <span className="font-bold text-brand-ink">{gbp(r.annualNewBusiness * m)}</span> in {showMargin ? 'contribution' : 'fees'} over their {w.stay}.
        </p>
      </div>

      {/* Lost at each stage */}
      <div className="mt-4 rounded-2xl border border-brand-line bg-brand-bg-warm/50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">What walks away each year</p>
        <div className="mt-3 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-ink">Enquiries that never reach {w.viewing === 'viewing' ? 'a viewing' : 'an assessment'}</p>
              <p className="text-[11px] text-brand-ink-muted">{num(r.lostBeforeViewing.count)} a year, each worth one {w.viewing}</p>
            </div>
            <p className="shrink-0 font-display text-lg font-bold text-brand-pop">{gbp(r.lostBeforeViewing.value * m)}</p>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-ink">{w.Viewing === 'Viewing' ? 'Viewings' : 'Assessments'} that do not become {w.admission === 'admission' ? 'an admission' : 'a client'}</p>
              <p className="text-[11px] text-brand-ink-muted">{num(r.lostAfterViewing.count)} a year, each worth one {w.person}</p>
            </div>
            <p className="shrink-0 font-display text-lg font-bold text-brand-pop">{gbp(r.lostAfterViewing.value * m)}</p>
          </div>
        </div>
        <p className="mt-3 border-t border-brand-line pt-3 text-[11px] leading-relaxed text-brand-ink-muted">
          Lifetime {showMargin ? 'contribution' : 'fees'} those people represented. You will never win them all, but every one you do win back is worth the full amount.
        </p>
      </div>

      {/* What if */}
      <div className="mt-4 rounded-2xl border-2 border-brand-pop/30 bg-brand-pop/5 p-5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-pop">
          <TrendingUp className="h-4 w-4" /> What if
        </p>

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="evc-uplift" className="text-sm font-semibold text-brand-ink">
              You converted {i.upliftPct}% more of your enquiries
            </label>
          </div>
          <input
            id="evc-uplift"
            type="range"
            min={5}
            max={100}
            step={5}
            value={i.upliftPct}
            onChange={(e) => set({ upliftPct: Number(e.target.value) })}
            className="mt-2 w-full accent-brand-pop"
          />
          <p className="mt-1 text-xs text-brand-ink-soft">
            {num(r.upliftAdmissions)} more {w.admissions} a year, worth{' '}
            <span className="font-display text-base font-bold text-brand-ink">{gbp(r.upliftValue * m)}</span>
          </p>
        </div>

        <div className="mt-5 border-t border-brand-pop/20 pt-5">
          <Stepper label="Or you had this many extra enquiries a month" value={i.extraEnquiries} onChange={(n) => set({ extraEnquiries: n })} min={0} max={200} />
          <p className="mt-2 text-xs text-brand-ink-soft">
            {num(r.extraEnquiryAdmissions)} more {w.admissions} a year, worth{' '}
            <span className="font-display text-base font-bold text-brand-ink">{gbp(r.extraEnquiryValue * m)}</span>
          </p>
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-brand-ink-muted">
          {isHomeCare
            ? 'Assumes you have the carer hours to take on the extra clients.'
            : 'Assumes you have rooms free for the extra residents. A full home gains most from a waiting list and a stronger private mix.'}
        </p>
      </div>

      <ToolLeadPrompt
        toolName="enquiry value calculator"
        summary={`${i.service}: each enquiry worth ${gbp(r.enquiryValue)}, ${num(r.admissionsPerYear)} ${w.admissions}/yr from ${i.enquiriesPerMonth} enquiries/mo, ${gbp(r.totalLost)} lost a year.`}
        heading="Get more enquiries from your own website"
        body={`Leave your details and we will send you how ${isHomeCare ? 'home care services' : 'care homes'} win more direct enquiries, without paying directories for every one.`}
        cta="Send me the detail"
      />
      <p className="mt-3 text-center text-xs text-brand-ink-muted">An estimate based on the figures you enter, not a guarantee.</p>
    </div>
  )
}
