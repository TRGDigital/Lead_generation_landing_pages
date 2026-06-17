import { createServiceClient } from '@/lib/supabase/server'

// Lead distribution reporting: leads captured vs delivered over a date range,
// with per-day, per-buyer (incl. conversion), per-area and UTM breakdowns, a
// full delivery log, and current-month cap usage per buyer.

export type ReportRange = { from: string; to: string } // YYYY-MM-DD (inclusive)

export type DeliveryRow = {
  lead_id: string
  buyer_id: string
  buyer_name: string
  lead_name: string
  lead_area: string
  lead_care_type: string
  lead_status: string
  status: string
  channel: string
  price_pennies: number | null
  sent_at: string
  captured_at: string | null
  delivered_at: string | null
  opened_at: string | null
  clicked_at: string | null
}

export type BuyerStat = {
  buyer_id: string
  name: string
  count: number
  last: string
  revenue: number
  won: number // converted / moved_in
  contacted: number // any progression past 'new'
}

export type DistributionReport = {
  daily: { date: string; captured: number; delivered: number }[]
  buyers: BuyerStat[]
  areas: { area: string; captured: number; delivered: number }[]
  utm: { source: string; campaign: string; captured: number }[]
  caps: { name: string; used: number; cap: number | null }[]
  deliveries: DeliveryRow[]
  kpis: { captured: number; deliveries: number; leadsDelivered: number; undistributed: number; failed: number; revenue: number; delivered: number; opened: number; clicked: number }
}

const WON = new Set(['converted', 'moved_in'])
const PROGRESSED = new Set(['contacted', 'qualified', 'tour_booked', 'tour_completed', 'assessed', 'converted', 'moved_in'])

export async function getDistributionReport({ from, to }: ReportRange): Promise<DistributionReport> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const fromIso = `${from}T00:00:00.000Z`
  const toIso = `${to}T23:59:59.999Z`

  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)

  const [leadsRes, distRes, buyersRes, monthDistRes] = await Promise.all([
    db.from('leads').select('id, area, created_at, distributed_at, utm_source, utm_campaign').gte('created_at', fromIso).lte('created_at', toIso),
    db.from('lead_distributions')
      .select('lead_id, buyer_id, status, channel, sent_at, price_pennies, delivered_at, opened_at, clicked_at, buyers(name), leads(full_name, area, care_type, created_at, status)')
      .gte('sent_at', fromIso).lte('sent_at', toIso).order('sent_at', { ascending: false }),
    db.from('buyers').select('id, name, monthly_cap'),
    db.from('lead_distributions').select('buyer_id').gte('created_at', monthStart.toISOString()),
  ])

  type LeadLite = { id: string; area: string | null; created_at: string; distributed_at: string | null; utm_source: string | null; utm_campaign: string | null }
  const leads = (leadsRes.data ?? []) as LeadLite[]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deliveries: DeliveryRow[] = ((distRes.data ?? []) as any[]).map((d) => ({
    lead_id: d.lead_id,
    buyer_id: d.buyer_id,
    buyer_name: d.buyers?.name ?? 'Unknown buyer',
    lead_name: d.leads?.full_name ?? '—',
    lead_area: d.leads?.area ?? '—',
    lead_care_type: d.leads?.care_type ?? '—',
    lead_status: d.leads?.status ?? 'new',
    status: d.status,
    channel: d.channel,
    price_pennies: d.price_pennies ?? null,
    sent_at: d.sent_at,
    captured_at: d.leads?.created_at ?? null,
    delivered_at: d.delivered_at ?? null,
    opened_at: d.opened_at ?? null,
    clicked_at: d.clicked_at ?? null,
  }))

  const day = (iso: string) => iso.slice(0, 10)

  const perDay: Record<string, { date: string; captured: number; delivered: number }> = {}
  for (const l of leads) (perDay[day(l.created_at)] ??= { date: day(l.created_at), captured: 0, delivered: 0 }).captured++
  for (const d of deliveries) (perDay[day(d.sent_at)] ??= { date: day(d.sent_at), captured: 0, delivered: 0 }).delivered++
  const daily = Object.values(perDay).sort((a, b) => a.date.localeCompare(b.date))

  const perBuyer: Record<string, BuyerStat> = {}
  for (const d of deliveries) {
    const b = (perBuyer[d.buyer_id] ??= { buyer_id: d.buyer_id, name: d.buyer_name, count: 0, last: d.sent_at, revenue: 0, won: 0, contacted: 0 })
    b.count++
    if (d.sent_at > b.last) b.last = d.sent_at
    b.revenue += d.price_pennies ?? 0
    if (WON.has(d.lead_status)) b.won++
    if (PROGRESSED.has(d.lead_status)) b.contacted++
  }
  const buyers = Object.values(perBuyer).sort((a, b) => b.count - a.count)

  const perArea: Record<string, { area: string; captured: number; delivered: number }> = {}
  for (const l of leads) (perArea[l.area ?? '—'] ??= { area: l.area ?? '—', captured: 0, delivered: 0 }).captured++
  for (const d of deliveries) (perArea[d.lead_area ?? '—'] ??= { area: d.lead_area ?? '—', captured: 0, delivered: 0 }).delivered++
  const areas = Object.values(perArea).sort((a, b) => b.captured - a.captured)

  const perUtm: Record<string, { source: string; campaign: string; captured: number }> = {}
  for (const l of leads) {
    const source = l.utm_source ?? '(direct/none)'
    const campaign = l.utm_campaign ?? '—'
    const key = `${source}|${campaign}`
    ;(perUtm[key] ??= { source, campaign, captured: 0 }).captured++
  }
  const utm = Object.values(perUtm).sort((a, b) => b.captured - a.captured)

  // Current-month cap usage per buyer.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const monthCounts: Record<string, number> = {}
  for (const r of (monthDistRes.data ?? []) as { buyer_id: string }[]) monthCounts[r.buyer_id] = (monthCounts[r.buyer_id] ?? 0) + 1
  const caps = ((buyersRes.data ?? []) as { id: string; name: string; monthly_cap: number | null }[])
    .map((b) => ({ name: b.name, used: monthCounts[b.id] ?? 0, cap: b.monthly_cap }))
    .sort((a, b) => b.used - a.used)

  return {
    daily,
    buyers,
    areas,
    utm,
    caps,
    deliveries,
    kpis: {
      captured: leads.length,
      deliveries: deliveries.length,
      leadsDelivered: new Set(deliveries.filter((d) => d.status === 'sent').map((d) => d.lead_id)).size,
      undistributed: leads.filter((l) => !l.distributed_at).length,
      failed: deliveries.filter((d) => d.status === 'failed').length,
      revenue: deliveries.reduce((s, d) => s + (d.price_pennies ?? 0), 0),
      delivered: deliveries.filter((d) => d.delivered_at).length,
      opened: deliveries.filter((d) => d.opened_at).length,
      clicked: deliveries.filter((d) => d.clicked_at).length,
    },
  }
}
