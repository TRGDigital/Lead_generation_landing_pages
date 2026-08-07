'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { SiteToolStat, ToolPerfPoint } from '@/lib/websites'

// Family-tools performance: a line chart of opens over time (all tools combined
// by default) plus a tool list you can click to drill the chart into one tool.
const ACCENT = '#F0532B'

function fmtDate(s: string) {
  return new Date(s + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
}

function Tip({ active, payload, label, name }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-brand-line bg-white px-3 py-2 text-xs shadow-lg">
      <p className="mb-0.5 font-semibold text-brand-ink">{label ? fmtDate(label) : ''}</p>
      <p style={{ color: ACCENT }}>{name}: <strong>{payload[0].value}</strong> opens</p>
    </div>
  )
}

export default function ToolPerformance({ series, tools }: { series: ToolPerfPoint[]; tools: SiteToolStat[] }) {
  const [sel, setSel] = useState<string | null>(null) // null = all tools combined
  const totalOpens = tools.reduce((n, t) => n + t.views, 0)

  if (tools.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 p-8 text-center text-sm text-brand-ink-muted">
        No tool usage in this period yet. Once the family tools are embedded and visitors use them, activity shows here.
      </div>
    )
  }

  const dataKey = sel ?? 'total'
  const selName = sel ? tools.find((t) => t.tool === sel)?.toolName ?? sel : 'All tools'
  const hasData = series.some((d) => ((d[dataKey] as number) || 0) > 0)
  const max = Math.max(...tools.map((t) => t.views), 1)

  const Row = ({ active, name, views, engagementRate, ctas, onClick }: { active: boolean; name: string; views: number; engagementRate?: number; ctas?: number; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-3 text-left transition ${active ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-line hover:border-brand-accent/40'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-medium text-brand-ink">{name}</p>
        <span className="flex items-center gap-3 text-xs text-brand-ink-muted">
          <span><strong className="text-brand-ink">{views}</strong> opens</span>
          {engagementRate !== undefined && <span className={engagementRate >= 40 ? 'font-semibold text-green-600' : ''}>{engagementRate}% engaged</span>}
          {ctas ? <span><strong className="text-brand-ink">{ctas}</strong> CTA</span> : null}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-bg-warm">
        <div className="h-full rounded-full bg-brand-accent" style={{ width: `${Math.round((views / max) * 100)}%` }} />
      </div>
    </button>
  )

  return (
    <div>
      <p className="mb-2 text-sm text-brand-ink-muted">
        Showing: <strong className="text-brand-ink">{selName}</strong>
        {sel && <button type="button" onClick={() => setSel(null)} className="ml-2 text-xs font-semibold text-brand-accent hover:underline">show all tools</button>}
      </p>
      <div className="h-64 w-full">
        {hasData ? (
          <ResponsiveContainer>
            <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efeae2" vertical={false} />
              <XAxis dataKey="date" tickFormatter={fmtDate} tick={{ fontSize: 11, fill: '#7a746b' }} minTickGap={28} tickLine={false} axisLine={{ stroke: '#e7e2da' }} />
              <YAxis tick={{ fontSize: 11, fill: '#7a746b' }} allowDecimals={false} tickLine={false} axisLine={false} width={34} />
              <Tooltip content={<Tip name={selName} />} />
              <Line type="monotone" dataKey={dataKey} name={selName} stroke={ACCENT} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 text-center text-sm text-brand-ink-muted">
            No opens for {selName} in this period.
          </div>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <Row active={sel === null} name="All tools" views={totalOpens} onClick={() => setSel(null)} />
        {tools.map((t) => (
          <Row key={t.tool} active={sel === t.tool} name={t.toolName} views={t.views} engagementRate={t.engagementRate} ctas={t.ctas} onClick={() => setSel(t.tool)} />
        ))}
      </div>
      <p className="mt-3 text-[11px] text-brand-ink-muted">Click a tool to drill the chart into it. &ldquo;Opens&rdquo; = the tool loaded · &ldquo;engaged&rdquo; = the visitor interacted · &ldquo;CTA&rdquo; = clicked through to enquire.</p>
    </div>
  )
}
