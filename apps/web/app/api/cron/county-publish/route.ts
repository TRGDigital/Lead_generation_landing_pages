import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyCronSecret, logCronRun } from '@/lib/cron'
import { checkCouncilUrl, type PublishedCounty } from '@/lib/county-rollout'

// Publishes county pages a few at a time, every night.
//
// 65 areas are queued and the plan is ten weeks, so roughly one area a night, which is
// three pages a night. Dripping matters: 200 pages that appear in a fortnight look like
// what they are, and a set that arrives steadily gets crawled, indexed and judged on its
// merits. Phase order first, then the biggest markets inside a phase.
//
// Nothing is generated here. The row already holds its opening line and its council link,
// and the figures are read live from CareAssura when the page renders. Publishing is a
// status flip plus a cache tag, which is why no deploy is needed.

export const runtime = 'nodejs'
export const maxDuration = 60

/** Areas per night. 65 queued over ten weeks is one a night, which is three pages. */
const PER_NIGHT = Number(process.env.COUNTY_PUBLISH_PER_NIGHT ?? 1)

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = createServiceClient() as any

    const { data: queued, error } = await db
      .from('county_pages')
      .select('slug, name, phase, services, council_url')
      .eq('status', 'queued')
      .order('phase', { ascending: true })
      .order('services', { ascending: false })
      .limit(PER_NIGHT)
    if (error) throw new Error(error.message)

    const batch = (queued ?? []) as (PublishedCounty & { council_url: string | null })[]
    if (batch.length === 0) {
      await logCronRun('county-publish', true, { published: 0, note: 'queue empty' })
      return NextResponse.json({ ok: true, published: 0, remaining: 0 })
    }

    const now = new Date().toISOString()

    // Open each council link before the page goes live. The seed only sets candidate
    // URLs with council_ok false, and the quarterly check is months away, so without this
    // every newly published area rendered with no council link at all.
    const councils: Record<string, boolean> = {}
    for (const b of batch) {
      if (!b.council_url) continue
      const result = await checkCouncilUrl(b.council_url)
      // Blocked means we could not see the page, so keep whatever a person confirmed.
      if (result.blocked) continue
      councils[b.slug] = result.ok
      await db
        .from('county_pages')
        .update({ council_ok: result.ok, council_checked_at: now })
        .eq('slug', b.slug)
    }

    const { error: upErr } = await db
      .from('county_pages')
      .update({ status: 'live', published_at: now, updated_at: now })
      .in(
        'slug',
        batch.map((b) => b.slug),
      )
    if (upErr) throw new Error(upErr.message)

    // Two caches to clear, not one. The tag covers the live list; the paths cover the
    // route cache, which is holding a 404 for each of these pages from before they
    // existed and would keep serving it until its own revalidate came round.
    revalidateTag('county-pages')
    for (const b of batch) {
      revalidatePath(`/locations/${b.slug}`)
      revalidatePath(`/care-website-design/${b.slug}`)
      revalidatePath(`/care-seo/${b.slug}`)
    }
    revalidatePath('/sitemap.xml')
    revalidatePath('/locations')

    const { count } = await db
      .from('county_pages')
      .select('slug', { count: 'exact', head: true })
      .eq('status', 'queued')

    await logCronRun('county-publish', true, {
      published: batch.length,
      slugs: batch.map((b) => b.slug),
      councils,
      remaining: count ?? 0,
    })

    return NextResponse.json({
      ok: true,
      published: batch.map((b) => b.slug),
      pages: batch.length * 3,
      remaining: count ?? 0,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error'
    await logCronRun('county-publish', false, { error: message })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
