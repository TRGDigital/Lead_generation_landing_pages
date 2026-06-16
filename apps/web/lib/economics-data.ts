import { createClient } from '@/lib/supabase/server'
import {
  calculateCPC,
  calculateCPL,
  calculateCPQL,
  calculateCPM,
  calculatePaybackWeeks,
  calculateROAS,
  classifyPerformance,
  calculateResponseMinutes,
  buildResponseHistogram,
  median,
  percentile,
  DEFAULT_EXPECTED_STAY_WEEKS,
  type EconomicsRating,
  type ResponseTimeBucket,
} from '@lib/economics'

export type TimeWindow = '7d' | '30d' | '90d' | 'all'

function startDateForWindow(window: TimeWindow): string | null {
  if (window === 'all') return null
  const days = window === '7d' ? 7 : window === '30d' ? 30 : 90
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export type EconomicsKPIs = {
  totalSpendPennies: number
  totalClicks: number
  totalLeads: number
  qualifiedLeads: number
  moveIns: number
  cpcPennies: number | null
  cplPennies: number | null
  cpqlPennies: number | null
  cpmPennies: number | null
  paybackWeeks: number | null
  roas: number | null
}

export type HomeBreakdownRow = {
  careHomeId: string
  name: string
  spendPennies: number
  leads: number
  qualifiedLeads: number
  moveIns: number
  cplPennies: number | null
  cpmPennies: number | null
  rating: EconomicsRating
  weeklyBedValuePennies: number | null
}

export type SpendTimeSeries = {
  date: string
  spendPennies: number
  leads: number
}

export async function getEconomicsKPIs(window: TimeWindow): Promise<EconomicsKPIs> {
  const db = createClient() as unknown as any
  const startDate = startDateForWindow(window)

  // Spend
  let spendQuery = db.from('campaign_spend').select('spend_pennies, clicks')
  if (startDate) spendQuery = spendQuery.gte('date', startDate)
  const { data: spendRows } = await spendQuery

  const totalSpendPennies = (spendRows ?? []).reduce(
    (s: number, r: { spend_pennies: number }) => s + (r.spend_pennies ?? 0),
    0
  )
  const totalClicks = (spendRows ?? []).reduce(
    (s: number, r: { clicks: number | null }) => s + (r.clicks ?? 0),
    0
  )

  // Leads
  let leadsQuery = db
    .from('leads')
    .select('id, qualified, status, moved_in_at, weekly_fee_pennies')
  if (startDate) leadsQuery = leadsQuery.gte('created_at', startDate + 'T00:00:00Z')
  const { data: leads } = await leadsQuery

  const allLeads = (leads ?? []) as Array<{
    id: string
    qualified: boolean
    status: string
    moved_in_at: string | null
    weekly_fee_pennies: number | null
  }>

  const totalLeads = allLeads.length
  const qualifiedLeads = allLeads.filter((l) => l.qualified).length
  const moveInLeads = allLeads.filter((l) => l.status === 'moved_in')

  const cpcPennies = calculateCPC(totalSpendPennies, totalClicks)
  const cplPennies = calculateCPL(totalSpendPennies, totalLeads)
  const cpqlPennies = calculateCPQL(totalSpendPennies, qualifiedLeads)
  const cpmPennies = calculateCPM(totalSpendPennies, moveInLeads.length)

  // Payback: use median weekly bed value across move-in homes
  const { data: homeValues } = await db
    .from('care_homes')
    .select('weekly_bed_value_pennies')
    .not('weekly_bed_value_pennies', 'is', null)
  const vals = (homeValues ?? []).map(
    (h: { weekly_bed_value_pennies: number }) => h.weekly_bed_value_pennies
  )
  const medianBedValue = vals.length ? Math.round(vals.reduce((s: number, v: number) => s + v, 0) / vals.length) : 0

  const paybackWeeks = calculatePaybackWeeks(cpmPennies, medianBedValue)

  const roas = calculateROAS(
    moveInLeads
      .filter((l) => l.weekly_fee_pennies)
      .map((l) => ({ weeklyFeePennies: l.weekly_fee_pennies! })),
    totalSpendPennies
  )

  return {
    totalSpendPennies,
    totalClicks,
    totalLeads,
    qualifiedLeads,
    moveIns: moveInLeads.length,
    cpcPennies,
    cplPennies,
    cpqlPennies,
    cpmPennies,
    paybackWeeks,
    roas,
  }
}

export async function getHomeBreakdown(window: TimeWindow): Promise<HomeBreakdownRow[]> {
  const db = createClient() as unknown as any
  const startDate = startDateForWindow(window)

  const { data: homes } = await db
    .from('care_homes')
    .select('id, name, weekly_bed_value_pennies')
    .order('name')

  if (!homes?.length) return []

  const rows: HomeBreakdownRow[] = []

  for (const home of homes as Array<{
    id: string
    name: string
    weekly_bed_value_pennies: number | null
  }>) {
    let spendQ = db
      .from('campaign_spend')
      .select('spend_pennies')
      .eq('care_home_id', home.id)
    if (startDate) spendQ = spendQ.gte('date', startDate)
    const { data: spendData } = await spendQ
    const spendPennies = (spendData ?? []).reduce(
      (s: number, r: { spend_pennies: number }) => s + r.spend_pennies,
      0
    )

    let leadsQ = db
      .from('leads')
      .select('qualified, status, weekly_fee_pennies')
      .eq('care_home_id', home.id)
    if (startDate) leadsQ = leadsQ.gte('created_at', startDate + 'T00:00:00Z')
    const { data: leadsData } = await leadsQ
    const homeLeads = (leadsData ?? []) as Array<{
      qualified: boolean
      status: string
      weekly_fee_pennies: number | null
    }>

    const leads = homeLeads.length
    const qualifiedLeads = homeLeads.filter((l) => l.qualified).length
    const moveIns = homeLeads.filter((l) => l.status === 'moved_in').length

    const cplPennies = calculateCPL(spendPennies, leads)
    const cpmPennies = calculateCPM(spendPennies, moveIns)

    const annualBedRevenuePennies = home.weekly_bed_value_pennies
      ? home.weekly_bed_value_pennies * DEFAULT_EXPECTED_STAY_WEEKS
      : 0

    const rating = classifyPerformance({ cpmPennies, annualBedRevenuePennies, moveInCount: moveIns })

    rows.push({
      careHomeId: home.id,
      name: home.name,
      spendPennies,
      leads,
      qualifiedLeads,
      moveIns,
      cplPennies,
      cpmPennies,
      rating,
      weeklyBedValuePennies: home.weekly_bed_value_pennies,
    })
  }

  return rows
}

export async function getSpendTimeSeries(window: TimeWindow): Promise<SpendTimeSeries[]> {
  const db = createClient() as unknown as any
  const startDate = startDateForWindow(window) ?? '2020-01-01'

  const { data: spendData } = await db
    .from('campaign_spend')
    .select('date, spend_pennies')
    .gte('date', startDate)
    .order('date')

  const { data: leadsData } = await db
    .from('leads')
    .select('created_at')
    .gte('created_at', startDate + 'T00:00:00Z')

  // Aggregate by date
  const byDate = new Map<string, { spendPennies: number; leads: number }>()

  for (const row of spendData ?? []) {
    const existing = byDate.get(row.date) ?? { spendPennies: 0, leads: 0 }
    existing.spendPennies += row.spend_pennies ?? 0
    byDate.set(row.date, existing)
  }
  for (const lead of leadsData ?? []) {
    const date = (lead.created_at as string).slice(0, 10)
    const existing = byDate.get(date) ?? { spendPennies: 0, leads: 0 }
    existing.leads += 1
    byDate.set(date, existing)
  }

  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { spendPennies, leads }]) => ({ date, spendPennies, leads }))
}

export type ResponseTimeStats = {
  histogram: ResponseTimeBucket[]
  medianMinutes: number | null
  p90Minutes: number | null
  totalContacted: number
  totalUncontacted: number
}

export async function getResponseTimeStats(window: TimeWindow): Promise<ResponseTimeStats> {
  const db = createClient() as unknown as any
  const startDate = startDateForWindow(window)

  let q = db.from('leads').select('created_at, contacted_at')
  if (startDate) q = q.gte('created_at', startDate + 'T00:00:00Z')
  const { data: leads } = await q

  const minutes = (leads ?? []).map((l: { created_at: string; contacted_at: string | null }) =>
    calculateResponseMinutes(l.created_at, l.contacted_at)
  )

  const contactedMinutes = minutes.filter((m: number | null): m is number => m !== null)
  const histogram = buildResponseHistogram(minutes)

  return {
    histogram,
    medianMinutes: median(contactedMinutes),
    p90Minutes: percentile(contactedMinutes, 90),
    totalContacted: contactedMinutes.length,
    totalUncontacted: minutes.length - contactedMinutes.length,
  }
}
