'use client'

import { useState } from 'react'
import { ToolButton, Field, MoneyInput, ResultBadge, Disclaimer, ToolLeadCapture, ACCENT, ACCENT_SOFT, gbp } from './ui'

// "What will care cost?" estimator. Weekly fee is an adjustable guide (families put in their
// own quote); the means-test bands use the England thresholds. Client-side only. Ported from
// the Crossways/Ferndale native tool into the brandable embed suite.

const UPPER = 23250
const LOWER = 14250
const AA = { none: 0, lower: 72.65, higher: 108.55 }
const DEFAULT_FEE = { residential: 1400, nursing: 1600, respite: 1500 }

type CareType = keyof typeof DEFAULT_FEE

const BANDS = {
  self: {
    tone: 'info' as const,
    title: 'You would likely fund your own care',
    body: 'With savings and assets above £23,250, you would usually pay your own fees in full. Attendance Allowance can still help, and a deferred payment agreement could let you use your home’s value without selling now.',
  },
  partial: {
    tone: 'info' as const,
    title: 'The council would likely help with the fees',
    body: 'Between £14,250 and £23,250, the council helps towards fees on a sliding scale, and you contribute from your income and savings. It’s well worth asking for a financial assessment.',
  },
  council: {
    tone: 'good' as const,
    title: 'The council would likely fund most of the care',
    body: 'Below £14,250, your savings aren’t counted towards fees. You’d contribute from your income (such as pensions), keeping a weekly Personal Expenses Allowance, and the council funds the rest.',
  },
}

export function CostEstimator({ site }: { site?: string }) {
  const [careType, setCareType] = useState<CareType>('residential')
  const [fee, setFee] = useState(DEFAULT_FEE.residential)
  const [feeTouched, setFeeTouched] = useState(false)
  const [savings, setSavings] = useState(0)
  const [ownsHome, setOwnsHome] = useState(false)
  const [propertyValue, setPropertyValue] = useState(0)
  const [aa, setAa] = useState<keyof typeof AA>('none')
  const [shown, setShown] = useState(false)

  const setType = (t: CareType) => {
    setCareType(t)
    if (!feeTouched) setFee(DEFAULT_FEE[t])
  }

  const capital = savings + (ownsHome ? propertyValue : 0)
  const band = BANDS[capital > UPPER ? 'self' : capital < LOWER ? 'council' : 'partial']
  const weekly = Math.max(0, fee - AA[aa])
  const monthly = (weekly * 52) / 12
  const label = careType === 'respite' ? 'Respite care' : careType === 'nursing' ? 'Nursing care' : 'Residential care'

  return (
    <div className="space-y-5">
      <Field label="Type of care">
        <div className="flex rounded-xl border border-brand-line p-1">
          {(['residential', 'nursing', 'respite'] as CareType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              style={careType === t ? { background: ACCENT } : undefined}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition ${careType === t ? 'text-white' : 'text-brand-ink-soft hover:text-brand-ink'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Weekly fee" hint="A typical guide figure — replace it with the home's actual quote if you have one.">
        <MoneyInput value={fee} onChange={(n) => { setFee(n); setFeeTouched(true) }} />
      </Field>

      <Field label="Savings & investments">
        <MoneyInput value={savings} onChange={setSavings} placeholder="0" />
      </Field>

      <Field label="Do they own their home?">
        <div className="flex gap-2">
          {[{ v: false, l: 'No' }, { v: true, l: 'Yes' }].map((o) => (
            <button
              key={o.l}
              type="button"
              onClick={() => setOwnsHome(o.v)}
              style={ownsHome === o.v ? { borderColor: ACCENT, background: ACCENT_SOFT } : undefined}
              className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${ownsHome === o.v ? 'text-brand-ink' : 'border-brand-line text-brand-ink-soft hover:border-brand-ink/30'}`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </Field>

      {ownsHome && (
        <Field label="Approximate property value" hint="The property is usually excluded for respite, and can be excluded if a partner still lives there.">
          <MoneyInput value={propertyValue} onChange={setPropertyValue} />
        </Field>
      )}

      <Field label="Attendance Allowance">
        <select
          value={aa}
          onChange={(e) => setAa(e.target.value as keyof typeof AA)}
          className="w-full rounded-xl border border-brand-line px-3 py-3 text-sm focus:outline-none focus:ring-2"
          style={{ ['--tw-ring-color' as string]: ACCENT }}
        >
          <option value="none">Not claiming</option>
          <option value="lower">Lower rate (£72.65/wk)</option>
          <option value="higher">Higher rate (£108.55/wk)</option>
        </select>
      </Field>

      {!shown ? (
        <ToolButton onClick={() => setShown(true)}>Estimate the cost</ToolButton>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: ACCENT_SOFT }}>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">
              {label} · estimated cost after Attendance Allowance
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-6 gap-y-1">
              <p className="font-display text-3xl font-bold text-brand-ink">{gbp(weekly)}<span className="text-sm font-medium text-brand-ink-muted"> /week</span></p>
              <p className="text-brand-ink-soft">{gbp(monthly)} /month · {gbp(weekly * 52)} /year</p>
            </div>
          </div>

          <ResultBadge tone={band.tone}>
            <p className="text-sm font-bold text-brand-ink">{band.title}</p>
            <p className="mt-1 text-sm text-brand-ink-soft">{band.body}</p>
          </ResultBadge>

          {site && <ToolLeadCapture site={site} toolName="cost-estimator" intent="results" />}
        </div>
      )}

      <Disclaimer>
        A guide only, based on the England means-test thresholds (£23,250 / £14,250), not financial advice or a
        quote. Please confirm fees with the home and your council. Nothing you enter is stored.
      </Disclaimer>
    </div>
  )
}
