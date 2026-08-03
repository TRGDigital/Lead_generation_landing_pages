import type { OverlayStats } from '@/lib/websites'

const pct = (n: number) => `${Math.round(n * 100)}%`

function Bar({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  const w = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs text-brand-ink-muted">{label}</span>
      <div className="h-5 flex-1 overflow-hidden rounded-full bg-brand-bg-warm">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${w}%` }} />
      </div>
      <span className="w-10 shrink-0 text-right text-xs font-semibold text-brand-ink tabular-nums">{value.toLocaleString()}</span>
    </div>
  )
}

export default function OverlayAnalytics({ stats }: { stats: OverlayStats }) {
  if (stats.impressions === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-line bg-brand-bg-warm/40 p-6 text-center text-sm text-brand-ink-muted">
        <p>
          No overlay views recorded yet in the last {stats.days} days. Once visitors see the pop on the live site, impressions,
          engagement and submissions will build up here.
        </p>
        {stats.previews > 0 && (
          <p className="mt-2 font-medium text-brand-ink">
            {stats.previews.toLocaleString()} admin preview {stats.previews === 1 ? 'view' : 'views'} recorded — previews are
            deliberately not counted as impressions.
          </p>
        )}
        <p className="mt-2 text-xs">
          Note: your own visits rarely register — the pop shows once per browser session, respects the cooldown and max-show
          limits, and stops entirely after you submit the form. Use a private/incognito window to see it as a new visitor.
        </p>
      </div>
    )
  }

  const cards = [
    {
      label: 'Impressions',
      value: stats.impressions.toLocaleString(),
      sub: stats.previews > 0 ? `real visitors (+${stats.previews.toLocaleString()} previews)` : 'times shown',
    },
    { label: 'Started', value: stats.starts.toLocaleString(), sub: `${pct(stats.engagementRate)} engaged` },
    { label: 'Closed', value: stats.closes.toLocaleString(), sub: 'dismissed' },
    { label: 'Submitted', value: stats.submits.toLocaleString(), sub: `${pct(stats.submitRate)} conversion` },
    { label: 'Unique visitors', value: stats.uniqueVisitors.toLocaleString(), sub: 'saw the pop' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-brand-line bg-white p-4">
            <p className="font-display text-2xl font-bold text-brand-ink">{c.value}</p>
            <p className="text-xs font-semibold text-brand-ink">{c.label}</p>
            <p className="text-[11px] text-brand-ink-muted">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Funnel */}
      <div className="rounded-2xl border border-brand-line bg-white p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">Engagement funnel</p>
        <div className="space-y-2">
          <Bar label="Shown" value={stats.impressions} max={stats.impressions} tone="bg-brand-ink/70" />
          <Bar label="Started" value={stats.starts} max={stats.impressions} tone="bg-amber-400" />
          <Bar label="Submitted" value={stats.submits} max={stats.impressions} tone="bg-green-500" />
        </div>
        <p className="mt-3 text-[11px] text-brand-ink-muted">
          Of {stats.impressions.toLocaleString()} people shown the pop, {stats.starts.toLocaleString()} engaged with it
          ({pct(stats.engagementRate)}) and {stats.submits.toLocaleString()} submitted an enquiry ({pct(stats.submitRate)}).
          A low engagement rate suggests the heading or image isn&apos;t landing; a good engagement rate but low submissions
          suggests the form or offer needs work.
        </p>
      </div>

      {/* Breakdowns */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">By trigger</p>
          {stats.byTrigger.length === 0 ? (
            <p className="text-xs text-brand-ink-muted">—</p>
          ) : (
            <div className="space-y-1.5">
              {stats.byTrigger.map((t) => (
                <div key={t.via} className="flex justify-between text-sm">
                  <span className="capitalize text-brand-ink-soft">{t.via}</span>
                  <span className="font-semibold text-brand-ink tabular-nums">{t.impressions.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">By device</p>
          {stats.byDevice.length === 0 ? (
            <p className="text-xs text-brand-ink-muted">—</p>
          ) : (
            <div className="space-y-1.5">
              {stats.byDevice.map((d) => (
                <div key={d.device} className="flex justify-between text-sm">
                  <span className="capitalize text-brand-ink-soft">{d.device}</span>
                  <span className="font-semibold text-brand-ink tabular-nums">{d.impressions.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top pages */}
      <div className="overflow-hidden rounded-2xl border border-brand-line bg-white">
        <p className="border-b border-brand-line px-4 py-3 text-xs font-semibold uppercase tracking-wide text-brand-ink-muted">
          Where the pop is seen (top pages)
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-line bg-brand-bg-warm text-left">
              <th className="px-4 py-2.5 font-semibold text-brand-ink">Page</th>
              <th className="px-3 py-2.5 text-center font-semibold text-brand-ink">Impressions</th>
              <th className="px-3 py-2.5 text-center font-semibold text-brand-ink">Started</th>
              <th className="px-3 py-2.5 text-center font-semibold text-brand-ink">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {stats.topPages.map((p) => (
              <tr key={p.path} className="border-b border-brand-line/50 last:border-0">
                <td className="px-4 py-2.5 text-brand-ink-soft">{p.path}</td>
                <td className="px-3 py-2.5 text-center font-semibold text-brand-ink tabular-nums">{p.impressions.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-center text-brand-ink-muted tabular-nums">{p.starts.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-center text-brand-ink-muted tabular-nums">{p.submits.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-brand-ink-muted">Last {stats.days} days. Views are naturally low on newly-installed sites and build over time.</p>
    </div>
  )
}
