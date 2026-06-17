import { getDistributionReport } from '@/lib/reports'
import DateRangeFilter from '@/components/admin/DateRangeFilter'
import CaptureDeliveryChart from '@/components/admin/CaptureDeliveryChart'
import ExportCsvButton from '@/components/admin/ExportCsvButton'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Lead Distribution Report' }

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10)
}
function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
function money(pennies: number) {
  return `£${(pennies / 100).toFixed(2)}`
}

function Card({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${accent ?? ''}`}>{value}</p>
    </div>
  )
}

export default async function ReportsPage({ searchParams }: { searchParams: { from?: string; to?: string } }) {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 29)
  const from = searchParams.from || isoDay(start)
  const to = searchParams.to || isoDay(end)

  const r = await getDistributionReport({ from, to })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Lead Distribution Report</h1>
        <p className="text-sm text-muted-foreground">Leads captured vs delivered to buyers, and where each lead was sent.</p>
      </div>

      <DateRangeFilter from={from} to={to} />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card label="Leads captured" value={r.kpis.captured} />
        <Card label="Leads delivered" value={r.kpis.leadsDelivered} accent="text-blue-600" />
        <Card label="Total sends" value={r.kpis.deliveries} />
        <Card label="Not yet sent" value={r.kpis.undistributed} accent={r.kpis.undistributed ? 'text-amber-600' : ''} />
        <Card label="Failed sends" value={r.kpis.failed} accent={r.kpis.failed ? 'text-destructive' : ''} />
        <Card label="Revenue" value={money(r.kpis.revenue)} />
        <Card label="Delivered" value={r.kpis.delivered} accent="text-green-600" />
        <Card label="Opened" value={r.kpis.opened} />
        <Card label="Clicked" value={r.kpis.clicked} />
      </div>

      {/* Daily chart */}
      <section className="space-y-3 rounded-lg border bg-white p-4">
        <h2 className="font-medium">Captured vs delivered, by day</h2>
        <CaptureDeliveryChart data={r.daily} />
      </section>

      {/* Delivery log — the match-back: which lead went to which buyer, and when */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Delivery log <span className="text-sm font-normal text-muted-foreground">({r.deliveries.length})</span></h2>
          <ExportCsvButton rows={r.deliveries} filename={`distributions_${from}_to_${to}.csv`} />
        </div>
        {r.deliveries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leads have been delivered in this range yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-3">Lead</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Care type</th>
                  <th className="p-3">Buyer</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 whitespace-nowrap">Sent at</th>
                  <th className="p-3 text-center">Delivered</th>
                  <th className="p-3 text-center">Opened</th>
                  <th className="p-3 text-center">Clicked</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {r.deliveries.map((d, i) => (
                  <tr key={`${d.lead_id}-${d.buyer_id}-${i}`}>
                    <td className="p-3 font-medium">{d.lead_name}</td>
                    <td className="p-3">{d.lead_area}</td>
                    <td className="p-3 text-muted-foreground">{d.lead_care_type}</td>
                    <td className="p-3">{d.buyer_name}</td>
                    <td className="p-3 text-muted-foreground">{d.channel}</td>
                    <td className="p-3"><Badge variant={d.status === 'failed' ? 'destructive' : 'secondary'}>{d.status}</Badge></td>
                    <td className="p-3 whitespace-nowrap text-muted-foreground">{fmtDateTime(d.sent_at)}</td>
                    <td className="p-3 text-center" title={d.delivered_at ? fmtDateTime(d.delivered_at) : ''}>{d.delivered_at ? <span className="text-green-600">✓</span> : <span className="text-muted-foreground">—</span>}</td>
                    <td className="p-3 text-center" title={d.opened_at ? fmtDateTime(d.opened_at) : ''}>{d.opened_at ? <span className="text-green-600">✓</span> : <span className="text-muted-foreground">—</span>}</td>
                    <td className="p-3 text-center" title={d.clicked_at ? fmtDateTime(d.clicked_at) : ''}>{d.clicked_at ? <span className="text-green-600">✓</span> : <span className="text-muted-foreground">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Per buyer */}
        <section className="space-y-3">
          <h2 className="font-medium">By buyer</h2>
          {r.buyers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No deliveries yet.</p>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="p-3">Buyer</th><th className="p-3">Sent</th><th className="p-3">Contacted</th><th className="p-3">Won</th><th className="p-3">Last delivery</th><th className="p-3">Revenue</th></tr>
                </thead>
                <tbody className="divide-y">
                  {r.buyers.map((b) => (
                    <tr key={b.buyer_id}>
                      <td className="p-3 font-medium">{b.name}</td>
                      <td className="p-3 tabular-nums">{b.count}</td>
                      <td className="p-3 tabular-nums text-muted-foreground">{b.contacted}</td>
                      <td className="p-3 tabular-nums font-medium text-green-600">{b.won}</td>
                      <td className="p-3 whitespace-nowrap text-muted-foreground">{fmtDateTime(b.last)}</td>
                      <td className="p-3 tabular-nums">{b.revenue ? money(b.revenue) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Source / campaign (UTM) */}
        <section className="space-y-3">
          <h2 className="font-medium">By source / campaign</h2>
          {r.utm.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads in this range.</p>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="p-3">Source</th><th className="p-3">Campaign</th><th className="p-3">Leads</th></tr>
                </thead>
                <tbody className="divide-y">
                  {r.utm.map((u) => (
                    <tr key={`${u.source}-${u.campaign}`}>
                      <td className="p-3 font-medium">{u.source}</td>
                      <td className="p-3 text-muted-foreground">{u.campaign}</td>
                      <td className="p-3 tabular-nums">{u.captured}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Buyer cap usage (this calendar month) */}
        <section className="space-y-3">
          <h2 className="font-medium">Cap usage <span className="text-sm font-normal text-muted-foreground">(this month)</span></h2>
          {r.caps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No buyers yet.</p>
          ) : (
            <div className="space-y-3 rounded-md border p-4">
              {r.caps.map((c) => {
                const pct = c.cap ? Math.min(100, Math.round((c.used / c.cap) * 100)) : 0
                const near = c.cap != null && c.used >= c.cap * 0.8
                return (
                  <div key={c.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{c.name}</span>
                      <span className={near ? 'font-medium text-amber-600' : 'text-muted-foreground'}>
                        {c.used}{c.cap != null ? ` / ${c.cap}` : ' (no cap)'}
                      </span>
                    </div>
                    {c.cap != null && (
                      <div className="h-1.5 w-full overflow-hidden rounded bg-muted">
                        <div className={`h-full ${near ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Per area / landing page */}
        <section className="space-y-3">
          <h2 className="font-medium">By area / landing page</h2>
          {r.areas.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads in this range.</p>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="p-3">Area</th><th className="p-3">Captured</th><th className="p-3">Delivered</th></tr>
                </thead>
                <tbody className="divide-y">
                  {r.areas.map((a) => (
                    <tr key={a.area}>
                      <td className="p-3 font-medium">{a.area}</td>
                      <td className="p-3 tabular-nums">{a.captured}</td>
                      <td className="p-3 tabular-nums">{a.delivered}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
