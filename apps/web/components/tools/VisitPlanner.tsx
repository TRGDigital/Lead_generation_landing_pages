'use client'

import { useState } from 'react'
import { ToolButton, Field, MoneyInput, ResultBadge, Disclaimer, ToolLeadCapture, ACCENT, ACCENT_SOFT, gbp } from './ui'

// "How much care do we need?" Families build a week of home care visits from the common
// visit pattern (a morning visit of about an hour, a lunch call of 30 or 60 minutes, a tea
// call and a 30 minute bedtime call), day by day, and see the weekly hours. An optional
// hourly rate from a provider's quote gives an indicative weekly cost.

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

type VisitKey = 'morning' | 'lunch' | 'tea' | 'bed'
const VISITS: { key: VisitKey; label: string; minutes: number[] }[] = [
  { key: 'morning', label: 'Morning', minutes: [60, 45, 30] },
  { key: 'lunch', label: 'Lunch', minutes: [30, 60] },
  { key: 'tea', label: 'Tea', minutes: [30, 45] },
  { key: 'bed', label: 'Bedtime', minutes: [30, 45] },
]

type DayPlan = Record<VisitKey, number> // 0 = no visit, otherwise minutes

const EMPTY: DayPlan = { morning: 0, lunch: 0, tea: 0, bed: 0 }

export function VisitPlanner({ site }: { site?: string }) {
  const [plan, setPlan] = useState<DayPlan[]>(DAYS.map(() => ({ ...EMPTY })))
  const [rate, setRate] = useState(0)
  const [done, setDone] = useState(false)

  const setVisit = (day: number, key: VisitKey, minutes: number) =>
    setPlan((p) => p.map((d, i) => (i === day ? { ...d, [key]: minutes } : d)))

  const copyToAll = (day: number) => setPlan((p) => p.map(() => ({ ...p[day]! })))

  const totalMinutes = plan.reduce((sum, d) => sum + d.morning + d.lunch + d.tea + d.bed, 0)
  const visits = plan.reduce((sum, d) => sum + (Object.values(d).filter((m) => m > 0).length), 0)
  const hours = totalMinutes / 60
  const hoursLabel = Number.isInteger(hours) ? `${hours}` : hours.toFixed(1)

  if (done) {
    return (
      <div>
        <ResultBadge tone="info">
          <p className="text-sm font-semibold">Your weekly plan</p>
          <p className="mt-1 text-2xl font-bold text-brand-ink">{hoursLabel} hours a week</p>
          <p className="mt-1 text-sm text-brand-ink-soft">
            {visits} visits across the week{rate > 0 ? `, about ${gbp(hours * rate)} a week at ${gbp(rate)} an hour` : ''}.
          </p>
        </ResultBadge>

        <div className="mt-4 overflow-hidden rounded-2xl border border-brand-line">
          {plan.map((d, i) => {
            const items = VISITS.filter((v) => d[v.key] > 0).map((v) => `${v.label} ${d[v.key]} min`)
            return (
              <div key={DAYS[i]} className="flex justify-between gap-3 border-b border-brand-line px-4 py-2.5 text-sm last:border-b-0">
                <span className="font-semibold text-brand-ink">{DAYS[i]}</span>
                <span className="text-right text-brand-ink-soft">{items.length ? items.join(', ') : 'No visits'}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-4 rounded-2xl p-5" style={{ background: ACCENT_SOFT }}>
          <p className="text-sm font-semibold text-brand-ink">What happens next</p>
          <ul className="mt-2 space-y-1.5 text-sm text-brand-ink-soft">
            <li>• A care assessment confirms the visits and the help needed at each one.</li>
            <li>• Visits can usually be increased or reduced as needs change.</li>
            <li>• If needs are high through the day and night, live-in care may be worth comparing.</li>
          </ul>
        </div>

        {site && (
          <ToolLeadCapture
            site={site}
            toolName="visit-planner"
            intent="results"
            answers={Object.fromEntries([
              ['Weekly hours', hoursLabel],
              ['Visits a week', String(visits)],
              ...plan.map((d, i) => [DAYS[i]!, VISITS.filter((v) => d[v.key] > 0).map((v) => `${v.label} ${d[v.key]}m`).join(', ') || 'None']),
            ])}
          />
        )}

        <button type="button" onClick={() => setDone(false)} className="mt-4 text-sm text-brand-ink-muted underline hover:text-brand-ink">
          Change the plan
        </button>

        <Disclaimer>
          A planning guide, not a care assessment. The right visits are agreed with the provider at a care assessment.
          Nothing you enter is stored.
        </Disclaimer>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-brand-ink-soft">
        Choose the visits needed each day. Set up Monday, then copy it to every day and adjust from there.
      </p>
      <div className="mt-4 space-y-4">
        {DAYS.map((day, i) => (
          <div key={day} className="rounded-2xl border border-brand-line p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-ink">{day}</p>
              {i === 0 && (
                <button type="button" onClick={() => copyToAll(0)} className="text-xs font-semibold underline" style={{ color: ACCENT }}>
                  Copy to every day
                </button>
              )}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {VISITS.map((v) => {
                const current = plan[i]![v.key]
                return (
                  <div key={v.key} className="flex flex-wrap items-center gap-1.5">
                    <span className="w-16 text-xs font-medium text-brand-ink-soft">{v.label}</span>
                    {[0, ...v.minutes].map((m) => {
                      const selected = current === m
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setVisit(i, v.key, m)}
                          style={selected ? { borderColor: ACCENT, background: ACCENT_SOFT } : undefined}
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${selected ? 'text-brand-ink' : 'border-brand-line text-brand-ink-soft hover:border-brand-ink/30'}`}
                        >
                          {m === 0 ? 'None' : `${m} min`}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <Field label="Hourly rate (optional)" hint="If you have a quote from a home care provider, add the hourly rate for an estimated weekly cost.">
          <MoneyInput value={rate} onChange={setRate} placeholder="Hourly rate" />
        </Field>
      </div>

      <div className="mt-5">
        <ToolButton onClick={() => setDone(true)} disabled={totalMinutes === 0}>See the weekly hours</ToolButton>
        {totalMinutes === 0 && <p className="mt-2 text-xs text-brand-ink-muted">Add at least one visit to see your plan.</p>}
      </div>

      <Disclaimer>Private and anonymous. Nothing you select is stored.</Disclaimer>
    </div>
  )
}
