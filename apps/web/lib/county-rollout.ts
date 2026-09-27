import { createServiceClient } from '@/lib/supabase/server'

// The rollout queue, read from outside the cron that writes it. A route file may only
// export route handlers, so anything the morning email needs lives here instead.

export type PublishedCounty = { slug: string; name: string; phase: number; services: number }

/** What went live in the last day, for the morning email. */
export async function recentlyPublished(hours = 24): Promise<PublishedCounty[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const since = new Date(Date.now() - hours * 3600 * 1000).toISOString()
  const { data } = await db
    .from('county_pages')
    .select('slug, name, phase, services')
    .eq('status', 'live')
    .gte('published_at', since)
    .order('services', { ascending: false })
  return (data ?? []) as PublishedCounty[]
}

// Councils block obvious bots, so we ask the way a browser would.
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36'

/** Opens a council URL the way a browser would. Used at publish time and by the quarterly check. */
// A 403 or 429 from a council is its bot wall (Cloudflare, mostly), not a dead page. We
// cannot tell either way, so callers leave council_ok as it was rather than hide a link
// that works in a browser. Kent, Hampshire, Norfolk and Manchester all do this.
export async function checkCouncilUrl(
  url: string,
): Promise<{ ok: boolean; blocked: boolean; status: number | string; finalUrl?: string }> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
      signal: AbortSignal.timeout(15000),
    })
    // A redirect to a working page is fine, but worth reporting so the URL can be updated.
    const blocked = res.status === 403 || res.status === 429
    return { ok: res.ok, blocked, status: res.status, finalUrl: res.url !== url ? res.url : undefined }
  } catch (e) {
    return { ok: false, blocked: false, status: e instanceof Error ? e.name : 'failed' }
  }
}
