'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { ResponseTimeBucket } from '@lib/economics'

const BAR_COLORS = [
  '#22c55e', // <30 min — green
  '#86efac', // 30–60 min — light green
  '#fbbf24', // 1–2 h — yellow
  '#f97316', // 2–4 h — orange
  '#ef4444', // 4–8 h — red
  '#b91c1c', // 8–24 h — dark red
  '#7f1d1d', // >24 h — very dark red
]

export function ResponseTimeHistogram({ buckets }: { buckets: ResponseTimeBucket[] }) {
  const data = buckets.map((b) => ({ label: b.label, count: b.count, pct: b.pct }))

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-medium text-gray-700">Response Time Distribution</h3>
      {data.every((d) => d.count === 0) ? (
        <p className="py-8 text-center text-sm text-gray-400">No contacted leads in this period</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              formatter={(value: number, _: string, entry) => [
                `${value} leads (${(entry.payload as { pct: number })?.pct ?? 0}%)`,
                'Count',
              ]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
