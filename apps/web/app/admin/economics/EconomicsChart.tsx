'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useState } from 'react'
import type { SpendTimeSeries } from '@/lib/economics-data'

type Props = {
  data: SpendTimeSeries[]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function EconomicsChart({ data }: Props) {
  const [showSpend, setShowSpend] = useState(true)
  const [showLeads, setShowLeads] = useState(true)

  const chartData = data.map((d) => ({
    date: formatDate(d.date),
    'Spend (£)': showSpend ? Math.round(d.spendPennies / 100) : undefined,
    Leads: showLeads ? d.leads : undefined,
  }))

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Spend & Leads Over Time</h3>
        <div className="flex gap-3 text-xs">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={showSpend}
              onChange={(e) => setShowSpend(e.target.checked)}
              className="rounded"
            />
            <span className="text-blue-600">Spend</span>
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={showLeads}
              onChange={(e) => setShowLeads(e.target.checked)}
              className="rounded"
            />
            <span className="text-green-600">Leads</span>
          </label>
        </div>
      </div>
      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">No data for this period</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === 'Spend (£)' ? [`£${value.toLocaleString()}`, name] : [value, name]
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {showSpend && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Spend (£)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            )}
            {showLeads && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Leads"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
