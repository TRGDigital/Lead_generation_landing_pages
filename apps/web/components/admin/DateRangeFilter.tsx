'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function DateRangeFilter({ from, to }: { from: string; to: string }) {
  const router = useRouter()
  const apply = (f: string, t: string) => router.push(`/admin/reports?from=${f}&to=${t}`)
  const preset = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - (days - 1))
    apply(isoDay(start), isoDay(end))
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <label className="block text-xs text-muted-foreground">From</label>
        <Input type="date" value={from} max={to} onChange={(e) => apply(e.target.value, to)} className="w-40" />
      </div>
      <div className="space-y-1">
        <label className="block text-xs text-muted-foreground">To</label>
        <Input type="date" value={to} min={from} onChange={(e) => apply(from, e.target.value)} className="w-40" />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => preset(1)}>Today</Button>
        <Button variant="outline" size="sm" onClick={() => preset(7)}>7 days</Button>
        <Button variant="outline" size="sm" onClick={() => preset(30)}>30 days</Button>
      </div>
    </div>
  )
}
