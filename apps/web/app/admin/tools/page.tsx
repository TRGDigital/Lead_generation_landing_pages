import { createServiceClient } from '@/lib/supabase/server'
import { TOOLS } from '@/lib/tools'
import { getFamilyTool } from '@/lib/family-tools'
import { getWebsites } from '@/lib/websites'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Tool usage' }

type SiteToolRow = { site: string; siteName: string; tool: string; toolName: string; views: number; engaged: number; views28: number; views7: number }

// Usage of the family tools embedded on client sites, grouped site → tool.
// Aggregated in JS from raw events (same pattern as overlay stats).
async function getSiteToolUsage(db: any, siteNames: Map<string, string>): Promise<{ rows: SiteToolRow[]; totals: Map<string, { views: number; engaged: number }> }> {
  const { data } = await db
    .from('tool_events')
    .select('tool, event, site, created_at')
    .not('site', 'is', null)
    .order('created_at', { ascending: false })
    .limit(20000)
  const events = (data ?? []) as { tool: string; event: string; site: string; created_at: string }[]

  const d28 = Date.now() - 28 * 24 * 60 * 60 * 1000
  const d7 = Date.now() - 7 * 24 * 60 * 60 * 1000
  const map = new Map<string, SiteToolRow>()
  const totals = new Map<string, { views: number; engaged: number }>()

  for (const e of events) {
    const key = `${e.site}|${e.tool}`
    const row = map.get(key) ?? {
      site: e.site,
      siteName: siteNames.get(e.site) ?? e.site,
      tool: e.tool,
      toolName: getFamilyTool(e.tool)?.name ?? e.tool,
      views: 0,
      engaged: 0,
      views28: 0,
      views7: 0,
    }
    const t = new Date(e.created_at).getTime()
    if (e.event === 'view') {
      row.views++
      if (t >= d28) row.views28++
      if (t >= d7) row.views7++
    } else if (e.event === 'engaged') {
      row.engaged++
    }
    map.set(key, row)

    const st = totals.get(e.site) ?? { views: 0, engaged: 0 }
    if (e.event === 'view') st.views++
    else if (e.event === 'engaged') st.engaged++
    totals.set(e.site, st)
  }

  const rows = [...map.values()].sort((a, b) => (a.site === b.site ? b.views - a.views : a.siteName.localeCompare(b.siteName)))
  return { rows, totals }
}

type Stat = {
  tool: string
  views_all: number
  engaged_all: number
  sessions_all: number
  views_28d: number
  views_7d: number
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  )
}

const n = (v: unknown) => Number(v ?? 0)
const fmt = (v: number) => v.toLocaleString('en-GB')
const slugOf = (href: string) => href.split('/').filter(Boolean).pop() || href

export default async function ToolUsagePage() {
  const supabase = createServiceClient() as unknown as any
  const [{ data }, websites] = await Promise.all([supabase.rpc('tool_usage_stats'), getWebsites()])
  const stats = new Map<string, Stat>(((data ?? []) as Stat[]).map((r) => [r.tool, r]))
  const siteNames = new Map(websites.map((w) => [w.slug, w.name]))
  const { rows: siteRows, totals: siteTotals } = await getSiteToolUsage(supabase, siteNames)

  const rows = TOOLS.map((t) => {
    const slug = slugOf(t.href)
    const s = stats.get(slug)
    const views = n(s?.views_all)
    const engaged = n(s?.engaged_all)
    return {
      title: t.title,
      href: t.href,
      slug,
      views,
      engaged,
      sessions: n(s?.sessions_all),
      views28: n(s?.views_28d),
      views7: n(s?.views_7d),
      rate: views ? Math.round((engaged / views) * 100) : 0,
    }
  }).sort((a, b) => b.views - a.views)

  const totalViews = rows.reduce((sum, r) => sum + r.views, 0)
  const totalEngaged = rows.reduce((sum, r) => sum + r.engaged, 0)
  const totalSessions = rows.reduce((sum, r) => sum + r.sessions, 0)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Tool usage</h1>
        <p className="text-sm text-muted-foreground">
          How often the free gateway tools are opened and used. Anonymous, no personal data stored.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card label="Total tool views" value={fmt(totalViews)} />
        <Card label="Total interactions" value={fmt(totalEngaged)} />
        <Card label="Unique visitors" value={fmt(totalSessions)} />
        <Card label="Engagement rate" value={totalViews ? `${Math.round((totalEngaged / totalViews) * 100)}%` : '—'} />
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Tool</th>
              <th className="px-4 py-3 text-right font-medium">Views (all time)</th>
              <th className="px-4 py-3 text-right font-medium">28 days</th>
              <th className="px-4 py-3 text-right font-medium">7 days</th>
              <th className="px-4 py-3 text-right font-medium">Used</th>
              <th className="px-4 py-3 text-right font-medium">Engagement</th>
              <th className="px-4 py-3 text-right font-medium">Unique visitors</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3">
                  <a href={r.href} target="_blank" rel="noopener" className="font-medium hover:underline">
                    {r.title}
                  </a>
                  <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">{r.href}</span>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">{fmt(r.views)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmt(r.views28)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmt(r.views7)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmt(r.engaged)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.views ? `${r.rate}%` : '—'}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fmt(r.sessions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        &ldquo;Used&rdquo; counts visitors who interacted with a tool (changed an input or pressed a control), not just
        opened the page, so it&rsquo;s the truest signal of whether the gateway tools are working. Tracking is
        anonymous, with no personal data stored.
      </p>

      {/* Family tools embedded on client sites, broken down per site */}
      <div>
        <h2 className="text-lg font-semibold">Usage by client site</h2>
        <p className="text-sm text-muted-foreground">
          The family tools embedded on client websites (funding, FNC, CHC, checklists and so on), grouped by the
          site they ran on.
        </p>
      </div>

      {siteRows.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-white p-8 text-center text-sm text-muted-foreground">
          No per-site usage recorded yet. Tracking for embedded tools starts with this deploy, so numbers build up
          from today as families use the tools on client sites.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Site</th>
                <th className="px-4 py-3 font-medium">Tool</th>
                <th className="px-4 py-3 text-right font-medium">Views (all time)</th>
                <th className="px-4 py-3 text-right font-medium">28 days</th>
                <th className="px-4 py-3 text-right font-medium">7 days</th>
                <th className="px-4 py-3 text-right font-medium">Used</th>
                <th className="px-4 py-3 text-right font-medium">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {siteRows.map((r, i) => {
                const firstOfSite = i === 0 || siteRows[i - 1]!.site !== r.site
                const st = siteTotals.get(r.site)
                return (
                  <tr key={`${r.site}|${r.tool}`} className={`border-b last:border-0 hover:bg-muted/30 ${firstOfSite && i > 0 ? 'border-t-2' : ''}`}>
                    <td className="px-4 py-3">
                      {firstOfSite && (
                        <>
                          <span className="font-medium">{r.siteName}</span>
                          {st && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              {fmt(st.views)} views · {fmt(st.engaged)} used
                            </span>
                          )}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3">{r.toolName}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{fmt(r.views)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmt(r.views28)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmt(r.views7)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{fmt(r.engaged)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.views ? `${Math.round((r.engaged / r.views) * 100)}%` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
