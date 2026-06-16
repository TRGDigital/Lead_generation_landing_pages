import Link from 'next/link'
import { formatMinutes } from '@lib/economics'
import { getResponseTimeStats, type TimeWindow } from '@/lib/economics-data'
import { ResponseTimeHistogram } from './ResponseTimeHistogram'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Response Time Analysis' }

const WINDOWS: { label: string; value: TimeWindow }[] = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
  { label: 'All time', value: 'all' },
]

type Props = { searchParams: { window?: string } }

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tabular-nums text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

export default async function ResponseTimePage({ searchParams }: Props) {
  const window = (['7d', '30d', '90d', 'all'].includes(searchParams.window ?? '')
    ? searchParams.window
    : '30d') as TimeWindow

  const stats = await getResponseTimeStats(window)
  const contactRate =
    stats.totalContacted + stats.totalUncontacted > 0
      ? Math.round(
          (stats.totalContacted / (stats.totalContacted + stats.totalUncontacted)) * 100
        )
      : 0

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/economics" className="text-sm text-gray-400 hover:text-gray-600">
              ← Economics
            </Link>
          </div>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">Response Time Analysis</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            How quickly leads are being contacted
          </p>
        </div>
        <div className="flex items-center gap-2">
          {WINDOWS.map((w) => (
            <Link
              key={w.value}
              href={`/admin/economics/response-time?window=${w.value}`}
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Median Response"
          value={formatMinutes(stats.medianMinutes)}
          sub="50th percentile"
        />
        <StatCard
          label="P90 Response"
          value={formatMinutes(stats.p90Minutes)}
          sub="90th percentile"
        />
        <StatCard
          label="Contact Rate"
          value={`${contactRate}%`}
          sub={`${stats.totalContacted} of ${stats.totalContacted + stats.totalUncontacted} leads`}
        />
        <StatCard
          label="Not Contacted"
          value={stats.totalUncontacted.toLocaleString()}
          sub="no contacted_at recorded"
        />
      </div>

      {/* Histogram */}
      <ResponseTimeHistogram buckets={stats.histogram} />

      {/* Benchmark callout */}
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <strong>Industry benchmark:</strong> Care homes that contact leads within 30 minutes see
        significantly higher tour conversion rates. Aim for &gt;60% of leads contacted in the first
        hour.
      </div>
    </div>
  )
}
