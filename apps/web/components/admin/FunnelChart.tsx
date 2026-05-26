'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

type FunnelStage = { stage: string; count: number }

const COLORS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#d946ef',
  '#ec4899',
  '#f43f5e',
  '#ef4444',
  '#dc2626',
]

export default function FunnelChart({ data }: { data: FunnelStage[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 120, bottom: 8 }}
      >
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="stage"
          tick={{ fontSize: 12 }}
          width={110}
          tickFormatter={(v: string) => v.replace(/_/g, ' ')}
        />
        <Tooltip
          formatter={(value: number) => [value, 'Leads']}
          labelFormatter={(label: string) => label.replace(/_/g, ' ')}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
