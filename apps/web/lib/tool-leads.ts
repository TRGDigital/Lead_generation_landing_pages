// Leads captured by the free tools.
//
// A tool lead lands in marketing_leads with the tool page as its source, which is
// stored as a full URL (and sometimes a preview deployment URL), so the tool is
// identified by the /tools/<slug> segment rather than by an exact match.

export type ToolLeadCount = { total: number; last28: number; latest: string | null }

const TOOL_PATH = /\/tools\/([a-z0-9-]+)/i

/** slug -> counts, for every tool that has ever captured a lead. */
export async function getToolLeadCounts(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any
): Promise<Map<string, ToolLeadCount>> {
  const { data } = await db
    .from('marketing_leads')
    .select('source, created_at')
    .order('created_at', { ascending: false })
    .limit(5000)

  const rows = (data ?? []) as { source: string | null; created_at: string }[]
  const cutoff = Date.now() - 28 * 24 * 60 * 60 * 1000
  const counts = new Map<string, ToolLeadCount>()

  for (const r of rows) {
    const match = TOOL_PATH.exec(r.source ?? '')
    if (!match) continue
    const slug = match[1]!.toLowerCase()
    const c = counts.get(slug) ?? { total: 0, last28: 0, latest: null }
    c.total++
    if (new Date(r.created_at).getTime() >= cutoff) c.last28++
    // Rows arrive newest first, so the first one seen is the latest.
    if (!c.latest) c.latest = r.created_at
    counts.set(slug, c)
  }
  return counts
}
