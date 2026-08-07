'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { OverlayQuestionStat } from '@/lib/websites'

// Overlay quiz questions over time: a line chart of answers per day (all questions
// combined by default), a clickable question list, and the answer distribution for
// the selected question. Same drill-down pattern as the tools chart.
const ACCENT = '#F0532B'

function fmtDate(s: string) {
  return new Date(s + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}
function Tip({ active, payload, label, name }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-brand-line bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-0.5 font-semibold text-brand-ink">{label ? fmtDate(label) : ''}</p>
      <p style={{ color: ACCENT }}>{name}: <strong>{payload[0].value}</strong> answered</p>
    </div>
  )
}

export default function OverlayQuestionPerformance({
  data,
}: {
  data: { starts: number; questions: OverlayQuestionStat[]; series: Array<{ date: string; total: number; [k: string]: number | string }> }
}) {
  const [selStep, setSelStep] = useState<number | null>(null)

  if (data.questions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 p-8 text-center text-sm text-brand-ink-muted">
        No quiz answers in this period yet. As visitors move through the overlay quiz, per-question performance shows here.
      </div>
    )
  }

  const dataKey = selStep ? 'q' + selStep : 'total'
  const selected = selStep ? data.questions.find((q) => q.step === selStep) : null
  const selName = selected ? `Q${selected.step}: ${selected.question}` : 'All questions'
  const hasData = data.series.some((d) => ((d[dataKey] as number) || 0) > 0)

  return (
    <div>
      <p className="mb-2 text-sm text-brand-ink-muted">
        {data.starts} visitor{data.starts === 1 ? '' : 's'} started the quiz. Showing: <strong className="text-brand-ink">{selName}</strong>
        {selStep && <button type="button" onClick={() => setSelStep(null)} className="ml-2 text-xs font-semibold text-brand-accent hover:underline">show all</button>}
      </p>

      <div className="h-56 w-full">
        {hasData ? (
          <ResponsiveContainer>
            <LineChart data={data.series} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efeae2" vertical={false} />
              <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11, fill: '#7a746b' }} minTickGap={28} tickLine={false} axisLine={{ stroke: '#e7e2da' }} />
              <YAxis tick={{ fontSize: 11, fill: '#7a746b' }} allowDecimals={false} tickLine={false} axisLine={false} width={34} />
              <Tooltip content={<Tip name={selStep ? 'Q' + selStep : 'All'} />} />
              <Line type="monotone" dataKey={dataKey} name={selStep ? 'Q' + selStep : 'All'} stroke={ACCENT} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 text-center text-sm text-brand-ink-muted">
            No answers for this selection in the period.
          </div>
        )}
      </div>

      {/* Answer distribution for the selected question */}
      {selected && (
        <div className="mt-4 rounded-xl border border-brand-accent/40 bg-brand-accent/5 p-4">
          <p className="text-sm font-medium text-brand-ink">How they answered</p>
          <div className="mt-3 space-y-1.5">
            {selected.options.map((o) => (
              <div key={o.option} className="flex items-center gap-3 text-sm">
                <span className="w-40 shrink-0 truncate text-brand-ink-soft sm:w-56" title={o.option}>{o.option}</span>
                <span className="h-3 flex-1 overflow-hidden rounded-full bg-white">
                  <span className="block h-full rounded-full bg-brand-accent" style={{ width: `${o.pct}%` }} />
                </span>
                <span className="w-14 shrink-0 text-right text-xs font-semibold text-brand-ink">{o.count} · {o.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question list — click to drill in */}
      <div className="mt-4 space-y-2">
        {data.questions.map((q) => (
          <button
            key={q.step}
            type="button"
            onClick={() => setSelStep(selStep === q.step ? null : q.step)}
            className={`w-full rounded-xl border p-3 text-left transition ${selStep === q.step ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-line hover:border-brand-accent/40'}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-brand-ink">{q.step}. {q.question}</p>
              <span className="flex shrink-0 items-center gap-2 text-xs">
                <span className="rounded-full bg-brand-bg-warm px-2 py-0.5 font-semibold text-brand-ink-muted">{q.answered} answered</span>
                <span className={`rounded-full px-2 py-0.5 font-semibold ${q.dropOffPct > 30 ? 'bg-red-50 text-red-700' : q.dropOffPct > 15 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                  {q.dropOffPct}% drop-off
                </span>
              </span>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-brand-ink-muted">Click a question to see its answers over time and how visitors answered. Drop-off is the share of quiz starters who never reached it.</p>
    </div>
  )
}
