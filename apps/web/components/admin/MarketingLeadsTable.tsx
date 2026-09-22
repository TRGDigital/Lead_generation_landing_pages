'use client'

import { useMemo, useState } from 'react'
import { Search, Download } from 'lucide-react'
import type { MarketingLead } from '@/lib/marketing-leads'

function refHost(ref: string | null): string {
  if (!ref) return 'Direct'
  try { return new URL(ref).hostname.replace(/^www\./, '') } catch { return ref }
}

function pagePath(source: string | null): string {
  if (!source) return '—'
  try { return new URL(source).pathname || '/' } catch { return source }
}

function when(s: string) {
  try {
    return new Date(s).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

function toCsv(rows: MarketingLead[]): string {
  const head = ['Date', 'Name', 'Email', 'Phone', 'Company', 'Message', 'Page', 'Heard about us', 'First page', 'First referrer', 'utm_source', 'utm_medium', 'utm_campaign']
  const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines = rows.map((r) => [when(r.created_at), r.name, r.email, r.phone, r.company, r.message, pagePath(r.source), r.heard_about, r.landing_page, r.first_referrer, r.utm_source, r.utm_medium, r.utm_campaign].map(esc).join(','))
  return [head.join(','), ...lines].join('\n')
}

export default function MarketingLeadsTable({ leads }: { leads: MarketingLead[] }) {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim()
    if (!s) return leads
    return leads.filter((l) =>
      [l.name, l.email, l.company, l.phone, l.message, l.source, l.utm_campaign, l.heard_about, l.first_referrer].some((v) => (v ?? '').toLowerCase().includes(s)),
    )
  }, [q, leads])

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `marketing-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, message, page…"
            className="w-full rounded-xl border border-brand-line py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30" />
        </div>
        <button type="button" onClick={exportCsv} disabled={filtered.length === 0} className="inline-flex items-center gap-1.5 rounded-xl border border-brand-line px-4 py-2.5 text-sm font-semibold text-brand-ink hover:border-brand-accent disabled:opacity-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-brand-line bg-white p-10 text-center text-sm text-brand-ink-muted">
          {leads.length === 0 ? 'No enquiries yet. Contact and audit form submissions will appear here.' : 'No enquiries match your search.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-line bg-brand-bg-warm text-left">
                <th className="px-4 py-3 font-semibold text-brand-ink">Name</th>
                <th className="px-4 py-3 font-semibold text-brand-ink">Contact</th>
                <th className="px-4 py-3 font-semibold text-brand-ink hidden md:table-cell">Message</th>
                <th className="px-4 py-3 font-semibold text-brand-ink hidden sm:table-cell">Page</th>
                <th className="px-4 py-3 font-semibold text-brand-ink hidden lg:table-cell">Source</th>
                <th className="px-4 py-3 font-semibold text-brand-ink whitespace-nowrap">When</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-brand-line/50 align-top last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-brand-ink">{l.name || '—'}</div>
                    {l.company && <div className="text-xs text-brand-ink-muted">{l.company}</div>}
                  </td>
                  <td className="px-4 py-3 text-brand-ink-soft">
                    {l.email && <div><a href={`mailto:${l.email}`} className="text-brand-accent hover:underline">{l.email}</a></div>}
                    {l.phone && <div>{l.phone}</div>}
                    {!l.email && !l.phone && '—'}
                  </td>
                  <td className="px-4 py-3 hidden max-w-sm text-brand-ink-soft md:table-cell">{l.message ? <span className="line-clamp-3">{l.message}</span> : '—'}</td>
                  <td className="px-4 py-3 hidden text-brand-ink-muted sm:table-cell">{pagePath(l.source)}</td>
                  <td className="px-4 py-3 hidden text-brand-ink-muted lg:table-cell">
                    <span className="block">{l.heard_about ?? 'Not answered'}</span>
                    <span className="block text-xs">{refHost(l.first_referrer)}{l.landing_page ? ` → ${l.landing_page}` : ''}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-brand-ink-muted">{when(l.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
