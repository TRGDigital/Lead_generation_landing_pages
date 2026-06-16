import { getDistributionReport } from '@/lib/reports'
import DateRangeFilter from '@/components/admin/DateRangeFilter'
import CaptureDeliveryChart from '@/components/admin/CaptureDeliveryChart'
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
      </div>

      {/* Daily chart */}
      <section className="space-y-3 rounded-lg border bg-white p-4">
        <h2 className="font-medium">Captured vs delivered, by day</h2>
        <CaptureDeliveryChart data={r.daily} />
      </section>

      {/* Delivery log — the match-back: which lead went to which buyer, and when */}
      <section className="space-y-3">
        <h2 className="font-medium">Delivery log <span className="text-sm font-normal text-muted-foreground">({r.deliveries.length})</span></h2>
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
                  <th className="p-3 whitespace-nowrap">Delivered at</th>
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
                  <tr><th className="p-3">Buyer</th><th className="p-3">Leads sent</th><th className="p-3">Last delivery</th><th className="p-3">Revenue</th></tr>
                </thead>
                <tbody className="divide-y">
                  {r.buyers.map((b) => (
                    <tr key={b.buyer_id}>
                      <td className="p-3 font-medium">{b.name}</td>
                      <td className="p-3 tabular-nums">{b.count}</td>
                      <td className="p-3 whitespace-nowrap text-muted-foreground">{fmtDateTime(b.last)}</td>
                      <td className="p-3 tabular-nums">{b.revenue ? money(b.revenue) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
