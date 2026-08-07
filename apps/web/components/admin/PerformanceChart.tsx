'use client'

import { useState } from 'react'
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { PerfDay } from '@/lib/websites'

// GSC-style performance chart: click a metric card to toggle its line. Overlay
// funnel (pop shown / quiz started) on the left axis; captured leads on the right
// axis with dot markers so each lead is visible on the day it happened.
const METRICS = [
  { key: 'impressions', label: 'Pop shown', color: '#6366f1', axis: 'left' as const },
  { key: 'starts', label: 'Quiz started', color: '#F0532B', axis: 'left' as const },
  { key: 'leads', label: 'Leads captured', color: '#16a34a', axis: 'right' as const },
]

function fmtDate(s: string) {
  return new Date(s + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

function Tip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-brand-line bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold text-brand-ink">{label ? fmtDate(label) : ''}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-1.5" style={{ color: p.color }}>
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

export default function PerformanceChart({ series }: { series: PerfDay[] }) {
  const [on, setOn] = useState<Record<string, boolean>>({ impressions: true, starts: true, leads: true })
  const totals: Record<string, number> = {}
  for (const m of METRICS) totals[m.key] = series.reduce((n, d) => n + (d[m.key as keyof PerfDay] as number), 0)
  const hasData = series.some((d) => d.impressions + d.starts + d.leads > 0)

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {METRICS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setOn((o) => ({ ...o, [m.key]: !o[m.key] }))}
            className={`rounded-xl border-2 p-3 text-left transition ${on[m.key] ? "bg-white" : "bg-brand-bg-warm/40 opacity-55"}`}
            style={{ borderColor: on[m.key] ? m.color : '#e7e2da' }}
          >
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-ink-muted">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.color }} /> {m.label}
            </span>
            <span className="mt-1 block font-display text-2xl font-bold text-brand-ink">{(totals[m.key] ?? 0).toLocaleString()}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 h-72 w-full">
        {hasData ? (
          <ResponsiveContainer>
            <ComposedChart data={series} margin={{ top: 8, right: 4, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efeae2" vertical={false} />
              <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11, fill: '#7a746b' }} minTickGap={28} tickLine={false} axisLine={{ stroke: '#e7e2da' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#7a746b' }} allowDecimals={false} tickLine={false} axisLine={false} width={34} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#16a34a' }} allowDecimals={false} tickLine={false} axisLine={false} width={28} />
              <Tooltip content={<Tip />} />
              {METRICS.filter((m) => on[m.key]).map((m) => (
                <Line
                  key={m.key}
                  yAxisId={m.axis}
                  type="monotone"
                  dataKey={m.key}
                  name={m.label}
                  stroke={m.color}
                  strokeWidth={2}
                  dot={m.key === 'leads' ? { r: 3, fill: m.color, strokeWidth: 0 } : false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 text-center text-sm text-brand-ink-muted">
            No activity in this period yet. Data appears here as the overlay runs on the site.
          </div>
        )}
      </div>
    </div>
  )
}
