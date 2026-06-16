import { Suspense } from 'react'
import Link from 'next/link'
import { formatPennies } from '@lib/economics'
import {
  getEconomicsKPIs,
  getHomeBreakdown,
  getSpendTimeSeries,
  type TimeWindow,
} from '@/lib/economics-data'
import { EconomicsChart } from './EconomicsChart'
import { BreakdownTable } from './BreakdownTable'
import { PerformanceRatings } from './PerformanceRatings'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Economics' }

const WINDOWS: { label: string; value: TimeWindow }[] = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: 'All time', value: 'all' },
]

type Props = { searchParams: { window?: string } }

function KPICard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

export default async function EconomicsPage({ searchParams }: Props) {
  const window = (['7d', '30d', '90d', 'all'].includes(searchParams.window ?? '')
    ? searchParams.window
    : '30d') as TimeWindow

  const [kpis, breakdown, timeSeries] = await Promise.all([
    getEconomicsKPIs(window),
    getHomeBreakdown(window),
    getSpendTimeSeries(window),
  ])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Unit Economics</h1>
          <p className="mt-0.5 text-sm text-gray-500">Ad spend performance across all care homes</p>
        </div>
        <div className="flex items-center gap-2">
          {WINDOWS.map((w) => (
            <Link
              key={w.value}
              href={`/admin/economics?window=${w.value}`}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                window === w.value
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {w.label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <KPICard label="Total Spend" value={formatPennies(kpis.totalSpendPennies)} />
        <KPICard label="Leads" value={kpis.totalLeads.toLocaleString()} />
        <KPICard label="CPL" value={formatPennies(kpis.cplPennies)} sub="cost per lead" />
        <KPICard label="CPQL" value={formatPennies(kpis.cpqlPennies)} sub="cost per qualified lead" />
        <KPICard
          label="CPM"
          value={formatPennies(kpis.cpmPennies)}
          sub={kpis.moveIns ? `${kpis.moveIns} move-ins` : 'no move-ins'}
        />
        <KPICard
          label="Payback"
          value={kpis.paybackWeeks !== null ? `${kpis.paybackWeeks}w` : '—'}
          sub="weeks to payback"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPICard label="Clicks" value={kpis.totalClicks.toLocaleString()} />
        <KPICard label="CPC" value={formatPennies(kpis.cpcPennies)} sub="cost per click" />
        <KPICard label="Qualified Leads" value={kpis.qualifiedLeads.toLocaleString()} />
        <KPICard
          label="ROAS"
          value={kpis.roas !== null ? `${kpis.roas.toFixed(1)}×` : '—'}
          sub="return on ad spend"
        />
      </div>

      {/* Time Series Chart */}
      <Suspense fallback={<div className="h-72 animate-pulse rounded-lg bg-gray-100" />}>
        <EconomicsChart data={timeSeries} />
      </Suspense>

      {/* Performance Ratings */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Performance Ratings</h2>
          <Link
            href="/admin/economics/response-time"
            className="text-xs text-blue-600 hover:underline"
          >
            Response time analysis →
          </Link>
        </div>
        <PerformanceRatings rows={breakdown} />
      </section>

      {/* Home Breakdown */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Breakdown by Care Home</h2>
        <BreakdownTable rows={breakdown} />
      </section>
    </div>
  )
}
