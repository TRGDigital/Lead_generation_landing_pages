'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts'

export default function CaptureDeliveryChart({
  data,
}: {
  data: { date: string; captured: number; delivered: number }[]
}) {
  if (!data.length) {
    return <p className="text-sm text-muted-foreground">No leads captured in this range.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis dataKey="date" tickFormatter={(d: string) => d.slice(5)} fontSize={11} />
        <YAxis allowDecimals={false} fontSize={11} />
        <Tooltip />
        <Legend />
        <Bar dataKey="captured" name="Captured" fill="#94a3b8" radius={[3, 3, 0, 0]} />
        <Bar dataKey="delivered" name="Delivered" fill="#2563eb" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
