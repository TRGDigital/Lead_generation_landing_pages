import type { HomeBreakdownRow } from '@/lib/economics-data'

const RATING_CONFIG = {
  good: {
    label: 'Good',
    description: 'CPM < 4% of annual revenue',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    count: 'text-green-700',
    dot: 'bg-green-500',
  },
  monitor: {
    label: 'Monitor',
    description: 'CPM 4–8% of annual revenue',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    count: 'text-yellow-700',
    dot: 'bg-yellow-500',
  },
  review: {
    label: 'Review',
    description: 'CPM > 8% of annual revenue',
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    count: 'text-red-700',
    dot: 'bg-red-500',
  },
  insufficient: {
    label: 'Insufficient data',
    description: 'Fewer than 5 move-ins',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-600',
    count: 'text-gray-500',
    dot: 'bg-gray-400',
  },
}

export function PerformanceRatings({ rows }: { rows: HomeBreakdownRow[] }) {
  const counts = rows.reduce(
    (acc, row) => {
      acc[row.rating] = (acc[row.rating] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const ratingKeys = ['good', 'monitor', 'review', 'insufficient'] as const

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ratingKeys.map((rating) => {
        const config = RATING_CONFIG[rating]
        const count = counts[rating] ?? 0
        const homes = rows.filter((r) => r.rating === rating)
        return (
          <div
            key={rating}
            className={`rounded-lg border p-4 ${config.bg} ${config.border}`}
          >
            <div className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${config.dot}`} />
              <span className={`text-xs font-semibold uppercase tracking-wide ${config.text}`}>
                {config.label}
              </span>
            </div>
            <div className={`mt-2 text-3xl font-bold tabular-nums ${config.count}`}>{count}</div>
            <p className={`mt-1 text-xs ${config.text} opacity-75`}>{config.description}</p>
            {homes.length > 0 && (
              <ul className="mt-3 space-y-0.5">
                {homes.map((h) => (
                  <li key={h.careHomeId} className={`truncate text-xs ${config.text} opacity-80`}>
                    {h.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
