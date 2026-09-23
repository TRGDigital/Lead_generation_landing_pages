'use client'

import { Button } from '@/components/ui/button'

export type SubscriberRow = {
  name: string
  email: string
  tool: string
  status: string
  enrolled_at: string
  sent: number
  opened: number
  clicked: number
}

function csv(v: unknown): string {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Downloads the sign-up list so it can be worked through outside the admin. */
export default function NurtureSubscribersCsv({ rows }: { rows: SubscriberRow[] }) {
  function download() {
    const headers = ['Name', 'Email', 'Tool used', 'Status', 'Signed up', 'Emails sent', 'Opened', 'Clicked']
    const lines = [headers.join(',')]
    for (const r of rows) {
      lines.push(
        [r.name, r.email, r.tool, r.status, r.enrolled_at, r.sent, r.opened, r.clicked].map(csv).join(',')
      )
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tool-signups-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant="outline" size="sm" onClick={download} disabled={rows.length === 0}>
      Export CSV
    </Button>
  )
}
