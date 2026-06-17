'use client'

import { Button } from '@/components/ui/button'

type Row = {
  lead_name: string
  lead_area: string
  lead_care_type: string
  lead_status: string
  buyer_name: string
  channel: string
  status: string
  price_pennies: number | null
  sent_at: string
  captured_at: string | null
  delivered_at: string | null
  opened_at: string | null
  clicked_at: string | null
}

function csv(v: unknown): string {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export default function ExportCsvButton({ rows, filename }: { rows: Row[]; filename: string }) {
  function download() {
    const headers = ['Lead', 'Area', 'Care type', 'Buyer', 'Channel', 'Delivery status', 'Lead status', 'Price (£)', 'Captured at', 'Sent at', 'Delivered at', 'Opened at', 'Clicked at']
    const lines = [headers.join(',')]
    for (const r of rows) {
      lines.push(
        [
          r.lead_name,
          r.lead_area,
          r.lead_care_type,
          r.buyer_name,
          r.channel,
          r.status,
          r.lead_status,
          r.price_pennies != null ? (r.price_pennies / 100).toFixed(2) : '',
          r.captured_at ?? '',
          r.sent_at,
          r.delivered_at ?? '',
          r.opened_at ?? '',
          r.clicked_at ?? '',
        ]
          .map(csv)
          .join(',')
      )
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={download} disabled={rows.length === 0}>
      Export CSV
    </Button>
  )
}
