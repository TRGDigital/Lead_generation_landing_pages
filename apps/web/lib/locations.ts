// County pages for TRG.
//
// The point of difference is the data. We own CareAssura, which holds every CQC
// registered care service in the country, so a county page can state how many services
// there are, the rating split, and how many have no website at all. That is checkable,
// locally specific, and no other agency can publish it, which also solves the problem
// these pages usually have: forty near-identical pages with the place name swapped.
//
// Two sources, in this order:
//   1. a live read of CareAssura, cached for a day, so the figures are never stale
//   2. lib/data/county-snapshots.json, written by scripts/build-counties.mjs, used when
//      the live read fails and dated so the page can say when it was counted
//
// What is not generated is the editorial. The standing sentence is written per county by
// a person, because "we are twenty minutes away" and "we would drive to you" are
// different promises and only one of them is true in any given county.

import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import { SMALL_WORDS, TOWN_ALIASES, TOWN_COORDS, TOWN_DISPLAY } from '@/lib/data/town-coords'
import snapshots from '@/lib/data/county-snapshots.json'

export type TownCount = { name: string; services: number }

export type CountyStats = {
  services: number
  towns: number
  residential: number
  nursing: number
  homeCare: number
  dementia: number
  learningDisability: number
  mentalHealth: number
  youngerAdults: number
  outstanding: number
  good: number
  requiresImprovement: number
  notRated: number
  noWebsite: number
  /** No website, split by what the service actually does. */
  noWebsiteByType: { residential: number; nursing: number; homeCare: number; dementia: number }
  /** Biggest markets first. */
  topTowns: TownCount[]
  /** The busiest single town, which is the one that decides how hard local search is. */
  busiestTown: TownCount | null
  /** Every town we can place on a map, for the county map. */
  townPoints: { name: string; services: number; noWebsite: number; lat: number; lng: number }[]
}

export type County = {
  slug: string
  name: string
  /** The CareAssura county_slug, when it differs from ours. */
  dataSlug?: string
  /**
   * The opening line: what is distinctive about this county's care market, in a sentence.
   * Never about where we are based. Providers buy from suppliers anywhere, and saying we
   * are forty minutes away reads as an excuse in the counties where we are not.
   */
  standing: string
  /**
   * The council that commissions and funds care here, and its adult social care page.
   * Named in the copy and linked once per page with different anchor text each time,
   * because it is the page a family is sent to first and the body every provider deals
   * with. Every URL here has been opened and checked, never guessed.
   */
  council: { name: string; url: string } | null
}

/**
 * The five that were live before the rollout queue existed, kept in code as the fallback
 * for when the database cannot be reached. Everything else comes from county_pages, which
 * is what lets the nightly cron publish an area without a deploy.
 */
export const COUNTIES: Record<string, County> = {
  'west-sussex': {
    slug: 'west-sussex',
    name: 'West Sussex',
    standing:
      'Care is the only sector we work in. West Sussex is a top heavy county: Worthing alone holds 116 of its registered services, more than one in five, and a search result in Worthing looks nothing like one in Horsham.',
    council: {
      name: 'West Sussex County Council',
      url: 'https://www.westsussex.gov.uk/social-care-and-health/',
    },
  },
  'east-sussex': {
    slug: 'east-sussex',
    name: 'East Sussex',
    standing:
      'Care is the only sector we work in. East Sussex concentrates: Eastbourne alone holds a quarter of the county\'s registered services, and the rest are spread thinly across the other 28 towns.',
    council: {
      name: 'East Sussex County Council',
      url: 'https://www.eastsussex.gov.uk/social-care',
    },
  },
  hampshire: {
    slug: 'hampshire',
    name: 'Hampshire',
    standing:
      'Care is the only sector we work in. Hampshire is two markets in one: Southampton and the cities at one end, holding 128 services between them, and a long tail of 50 towns at the other.',
    council: {
      name: 'Hampshire County Council',
      url: 'https://www.hants.gov.uk/socialcareandhealth/adultsocialcare',
    },
  },
  surrey: {
    slug: 'surrey',
    name: 'Surrey',
    standing:
      'Care is the only sector we work in. Surrey is the most fragmented market in the south east: 663 services across 64 towns, with no single town holding more than 56 of them. Search here is won town by town or not at all.',
    council: {
      name: 'Surrey County Council',
      url: 'https://www.surreycc.gov.uk/adults/getting-support',
    },
  },
  kent: {
    slug: 'kent',
    name: 'Kent',
    standing:
      'Care is the only sector we work in. Kent is the largest care market in the south east and the one with the most providers invisible online, which makes it the easiest county in the region to stand out in.',
    council: {
      name: 'Kent County Council',
      url: 'https://www.kent.gov.uk/social-care-and-health/adult-social-care/care-and-support',
    },
  },
}

// ---------------------------------------------------------------------------
// The live list, from the rollout queue
// ---------------------------------------------------------------------------

type QueueRow = {
  slug: string
  name: string
  data_slug: string | null
  standing: string | null
  council_name: string | null
  council_url: string | null
  council_ok: boolean | null
  status: string
  phase: number | null
  published_at: string | null
}

function toCounty(r: QueueRow): County {
  return {
    slug: r.slug,
    name: r.name,
    dataSlug: r.data_slug ?? undefined,
    standing: r.standing ?? `Care is the only sector we work in, and ${r.name} is one of the places we work in it.`,
    // A council link is rendered only when the checker has confirmed the URL, so a page
    // never carries a guess or a dead link.
    council: r.council_ok && r.council_name && r.council_url ? { name: r.council_name, url: r.council_url } : null,
  }
}

/**
 * Every county with pages live right now. Cached for ten minutes and tagged, so the
 * publishing cron makes an area appear without a deploy and without a cold read on every
 * request. Throws if the database cannot be read, so a blip never unpublishes an area.
 */
/**
 * A TRG client for the live list only. createServiceClient fetches with no-store, and a
 * no-store fetch inside unstable_cache is refused during a build or a background
 * revalidation ("Dynamic server usage"). That refusal came back as a read error, the list
 * fell back to the five in code, and every area the cron had published was built as a 404.
 * This fetch is cacheable and carries the same tag, so publishing still clears it.
 */
function queueClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 600, tags: ['county-pages'] } }),
    },
  })
}

export const liveCounties = unstable_cache(
  async (): Promise<Record<string, County>> => {
    const db = queueClient()
    const { data, error } = await db
      .from('county_pages')
      .select('slug, name, data_slug, standing, council_name, council_url, council_ok, status, phase, published_at')
      .eq('status', 'live')
    // A failed read must throw, not fall back. Falling back to the five in code made every
    // area the cron had published 404, and the 404 was then cached as the page for an hour
    // (Oxfordshire and Croydon, 27 Sept). A throw is not cached here, and a page whose
    // background revalidation throws keeps serving its last good version.
    if (error) throw new Error(`county_pages read failed: ${error.message}`)
    if (!data || data.length === 0) return COUNTIES
    const out: Record<string, County> = {}
    for (const r of data as QueueRow[]) out[r.slug] = toCounty(r)
    return out
  },
  ['county-pages-live'],
  { tags: ['county-pages'], revalidate: 600 },
)

export async function getCounty(slug: string): Promise<County | undefined> {
  const live = await liveCounties()
  return live[slug]
}

/**
 * The live slugs, for the sitemap and for generateStaticParams, where a failed read should
 * cost us the newer areas for one build rather than the whole sitemap.
 */
export async function countySlugs(): Promise<string[]> {
  try {
    return Object.keys(await liveCounties())
  } catch {
    return Object.keys(COUNTIES)
  }
}

/** The share with no website, rounded, because 42.38% reads like a spreadsheet. */
export function pctNoWebsite(stats: CountyStats) {
  return pct(stats.noWebsite, stats.services)
}

/**
 * London boroughs and single cities come out of CareAssura as one town or none (the town
 * matching the area name is not counted), so "across 1 towns" and a busiest town that is
 * really the whole city would both be wrong. Town level copy needs at least two towns.
 */
export function hasTowns(stats: CountyStats) {
  return stats.towns >= 2
}

/** The busiest town, only where the area really is made of towns. */
export function mainTown(stats: CountyStats) {
  return hasTowns(stats) ? stats.busiestTown : null
}

/** A rounded percentage that never divides by zero. */
export function pct(part: number, whole: number) {
  if (!whole) return 0
  return Math.round((part / whole) * 100)
}

// ---------------------------------------------------------------------------
// Town names
// ---------------------------------------------------------------------------

/**
 * Town names as typed by whoever registered the service, so "Shoreham-by-sea" and
 * "Shoreham By Sea" are two towns unless they are normalised. Lowercase, punctuation to
 * spaces, and the result is the map key as well as the grouping key.
 */
export function normaliseTown(raw: string) {
  const key = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return TOWN_ALIASES[key] ?? key
}

/** Title case, but "stoke on trent" becomes "Stoke on Trent" rather than "Stoke On Trent". */
export function displayTown(key: string) {
  const override = TOWN_DISPLAY[key]
  if (override) return override
  return key
    .split(' ')
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

// ---------------------------------------------------------------------------
// Figures: live from CareAssura, snapshot when it cannot be reached
// ---------------------------------------------------------------------------

type Row = {
  town: string | null
  website: string | null
  cqc_rating: string | null
  type_residential: boolean | null
  type_nursing: boolean | null
  type_homecare: boolean | null
  care_dementia: boolean | null
  care_learning_disability: boolean | null
  care_mental_health: boolean | null
  care_younger_adults: boolean | null
}

const COLUMNS =
  'town, website, cqc_rating, type_residential, type_nursing, type_homecare, care_dementia, care_learning_disability, care_mental_health, care_younger_adults'

function careAssura() {
  const url = process.env.CAREASSURA_SUPABASE_URL
  const key = process.env.CAREASSURA_SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

function tally(rows: Row[], county: County): CountyStats {
  const has = (r: Row, k: keyof Row) => r[k] === true
  const missing = (r: Row) => !r.website || !r.website.trim()
  const countWhere = (p: (r: Row) => boolean) => rows.filter(p).length

  // Some records carry the county in the town field, which is not a town.
  const countyKey = normaliseTown(county.name)
  const townCounts = new Map<string, { services: number; noWebsite: number }>()
  for (const r of rows) {
    const key = normaliseTown(r.town ?? '')
    if (!key || key === countyKey) continue
    const row = townCounts.get(key) ?? { services: 0, noWebsite: 0 }
    row.services++
    if (missing(r)) row.noWebsite++
    townCounts.set(key, row)
  }
  const ranked = [...townCounts.entries()]
    .map(([key, v]) => ({ key, name: displayTown(key), ...v }))
    .sort((a, b) => b.services - a.services || a.name.localeCompare(b.name))

  const coords = TOWN_COORDS[county.dataSlug ?? county.slug] ?? {}
  const townPoints = ranked.flatMap((t) => {
    const c = coords[t.key]
    return c ? [{ name: t.name, services: t.services, noWebsite: t.noWebsite, lat: c[0], lng: c[1] }] : []
  })

  const rating = (v: string) => countWhere((r) => (r.cqc_rating ?? '').toLowerCase() === v)
  const rated = new Set(['outstanding', 'good', 'requires_improvement', 'inadequate'])

  return {
    services: rows.length,
    towns: townCounts.size,
    residential: countWhere((r) => has(r, 'type_residential')),
    nursing: countWhere((r) => has(r, 'type_nursing')),
    homeCare: countWhere((r) => has(r, 'type_homecare')),
    dementia: countWhere((r) => has(r, 'care_dementia')),
    learningDisability: countWhere((r) => has(r, 'care_learning_disability')),
    mentalHealth: countWhere((r) => has(r, 'care_mental_health')),
    youngerAdults: countWhere((r) => has(r, 'care_younger_adults')),
    outstanding: rating('outstanding'),
    good: rating('good'),
    requiresImprovement: rating('requires_improvement'),
    notRated: countWhere((r) => !rated.has((r.cqc_rating ?? '').toLowerCase())),
    noWebsite: countWhere(missing),
    noWebsiteByType: {
      residential: countWhere((r) => has(r, 'type_residential') && missing(r)),
      nursing: countWhere((r) => has(r, 'type_nursing') && missing(r)),
      homeCare: countWhere((r) => has(r, 'type_homecare') && missing(r)),
      dementia: countWhere((r) => has(r, 'care_dementia') && missing(r)),
    },
    topTowns: ranked.slice(0, 8).map((t) => ({ name: t.name, services: t.services })),
    busiestTown: ranked[0] ? { name: ranked[0].name, services: ranked[0].services } : null,
    townPoints,
  }
}

const readCounty = unstable_cache(
  async (slug: string, name: string, dataSlug: string): Promise<CountyStats | null> => {
    const db = careAssura()
    if (!db) return null
    const { data, error } = await db.from('care_homes').select(COLUMNS).eq('county_slug', dataSlug).limit(5000)
    if (error || !data || data.length === 0) return null
    return tally(data as unknown as Row[], { slug, name, standing: '', council: null })
  },
  ['county-stats'],
  { tags: ['county-stats'], revalidate: 86400 },
)

type Snapshot = Omit<CountyStats, 'topTowns' | 'busiestTown' | 'townPoints'> & {
  countedAt: string
  topTowns: { key: string; services: number }[]
  busiestTown: { key: string; services: number } | null
  townPoints: { key: string; services: number; noWebsite: number; lat: number; lng: number }[]
}

const SNAPSHOTS = snapshots as unknown as Record<string, Snapshot>

/** The counted figures, with town keys turned back into names people read. */
function fromSnapshot(slug: string): { stats: CountyStats; countedAt: string } | null {
  const s = SNAPSHOTS[slug]
  if (!s) return null
  const { countedAt, topTowns, busiestTown, townPoints, ...rest } = s
  return {
    countedAt,
    stats: {
      ...rest,
      topTowns: topTowns.map((t) => ({ name: displayTown(t.key), services: t.services })),
      busiestTown: busiestTown ? { name: displayTown(busiestTown.key), services: busiestTown.services } : null,
      townPoints: townPoints.map((t) => ({
        name: displayTown(t.key),
        services: t.services,
        noWebsite: t.noWebsite,
        lat: t.lat,
        lng: t.lng,
      })),
    },
  }
}

/**
 * The counted figures without touching CareAssura, for places that need the numbers but
 * not the freshness: the admin list, which would otherwise make 70 live reads to render.
 */
export function snapshotFigures(slug: string): CountyFigures | null {
  const snap = fromSnapshot(slug)
  if (!snap) return null
  return { stats: snap.stats, live: false, asAt: monthYear(snap.countedAt) }
}

/** "September 2026" from an ISO date, because a number without a date is a claim. */
function monthYear(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export type CountyFigures = { stats: CountyStats; live: boolean; asAt: string }

/**
 * The county's figures: live from CareAssura when it answers, the counted snapshot when
 * it does not. `asAt` is what the page prints, so the date always matches where the
 * numbers actually came from.
 */
export async function getCountyFigures(county: County): Promise<CountyFigures> {
  const today = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  try {
    const live = await readCounty(county.slug, county.name, county.dataSlug ?? county.slug)
    if (live) return { stats: live, live: true, asAt: today }
  } catch {
    /* fall through to the snapshot rather than break the page */
  }
  const snap = fromSnapshot(county.dataSlug ?? county.slug)
  if (!snap) throw new Error(`No figures for ${county.slug}. Run scripts/build-counties.mjs ${county.slug}.`)
  return { stats: snap.stats, live: false, asAt: monthYear(snap.countedAt) }
}
