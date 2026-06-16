import { createServiceClient } from '@/lib/supabase/server'

// Lead distribution reporting: leads captured vs delivered over a date range,
// with per-day, per-buyer and per-area breakdowns + a full delivery log.

export type ReportRange = { from: string; to: string } // YYYY-MM-DD (inclusive)

export type DeliveryRow = {
  lead_id: string
  buyer_id: string
  buyer_name: string
  lead_name: string
  lead_area: string
  lead_care_type: string
  status: string
  channel: string
  price_pennies: number | null
  sent_at: string
  captured_at: string | null
}

export type DistributionReport = {
  daily: { date: string; captured: number; delivered: number }[]
  buyers: { buyer_id: string; name: string; count: number; last: string; revenue: number }[]
  areas: { area: string; captured: number; delivered: number }[]
  deliveries: DeliveryRow[]
  kpis: {
    captured: number
    deliveries: number
    leadsDelivered: number
    undistributed: number
    failed: number
    revenue: number
  }
}

export async function getDistributionReport({ from, to }: ReportRange): Promise<DistributionReport> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const fromIso = `${from}T00:00:00.000Z`
  const toIso = `${to}T23:59:59.999Z`

  const [leadsRes, distRes] = await Promise.all([
    db
      .from('leads')
      .select('id, area, created_at, distributed_at')
      .gte('created_at', fromIso)
      .lte('created_at', toIso),
    db
      .from('lead_distributions')
      .select('lead_id, buyer_id, status, channel, sent_at, price_pennies, buyers(name), leads(full_name, area, care_type, created_at)')
      .gte('sent_at', fromIso)
      .lte('sent_at', toIso)
      .order('sent_at', { ascending: false }),
  ])

  type LeadLite = { id: string; area: string | null; created_at: string; distributed_at: string | null }
  const leads = (leadsRes.data ?? []) as LeadLite[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deliveries: DeliveryRow[] = ((distRes.data ?? []) as any[]).map((d) => ({
    lead_id: d.lead_id,
    buyer_id: d.buyer_id,
    buyer_name: d.buyers?.name ?? 'Unknown buyer',
    lead_name: d.leads?.full_name ?? '—',
    lead_area: d.leads?.area ?? '—',
    lead_care_type: d.leads?.care_type ?? '—',
    status: d.status,
    channel: d.channel,
    price_pennies: d.price_pennies ?? null,
    sent_at: d.sent_at,
    captured_at: d.leads?.created_at ?? null,
  }))

  const day = (iso: string) => iso.slice(0, 10)

  const perDay: Record<string, { date: string; captured: number; delivered: number }> = {}
  for (const l of leads) (perDay[day(l.created_at)] ??= { date: day(l.created_at), captured: 0, delivered: 0 }).captured++
  for (const d of deliveries) (perDay[day(d.sent_at)] ??= { date: day(d.sent_at), captured: 0, delivered: 0 }).delivered++
  const daily = Object.values(perDay).sort((a, b) => a.date.localeCompare(b.date))

  const perBuyer: Record<string, { buyer_id: string; name: string; count: number; last: string; revenue: number }> = {}
  for (const d of deliveries) {
    const b = (perBuyer[d.buyer_id] ??= { buyer_id: d.buyer_id, name: d.buyer_name, count: 0, last: d.sent_at, revenue: 0 })
    b.count++
    if (d.sent_at > b.last) b.last = d.sent_at
    b.revenue += d.price_pennies ?? 0
  }
  const buyers = Object.values(perBuyer).sort((a, b) => b.count - a.count)

  const perArea: Record<string, { area: string; captured: number; delivered: number }> = {}
  for (const l of leads) {
    const a = l.area ?? '—'
    ;(perArea[a] ??= { area: a, captured: 0, delivered: 0 }).captured++
  }
  for (const d of deliveries) {
    const a = d.lead_area ?? '—'
    ;(perArea[a] ??= { area: a, captured: 0, delivered: 0 }).delivered++
  }
  const areas = Object.values(perArea).sort((a, b) => b.captured - a.captured)

  return {
    daily,
    buyers,
    areas,
    deliveries,
    kpis: {
      captured: leads.length,
      deliveries: deliveries.length,
      leadsDelivered: new Set(deliveries.filter((d) => d.status === 'sent').map((d) => d.lead_id)).size,
      undistributed: leads.filter((l) => !l.distributed_at).length,
      failed: deliveries.filter((d) => d.status === 'failed').length,
      revenue: deliveries.reduce((s, d) => s + (d.price_pennies ?? 0), 0),
    },
  }
}
