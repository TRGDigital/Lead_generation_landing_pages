// Local Competitor Snapshot: the registered care services near a postcode, read from
// CareAssura (our sister directory, which holds every CQC registered service in England).
//
// Load on the CareAssura database matters: it has had connection starvation before. So:
//   * one bounded query per search, a lat/lng bounding box on the partial index
//     care_homes_lat_lng_idx (lat, lng) WHERE status = 'published', with a hard row limit
//   * a short, named column list, never select *
//   * results cached for a day per (rounded point, service, radius) with unstable_cache,
//     so repeat searches for the same area never reach the database
//
// Distance is worked out here (haversine) rather than in SQL, which keeps the query a
// plain indexed range scan. Public, competitor-level information only: name, town,
// distance, CQC rating, care types and whether a website is listed.

import { createClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'

export type ServiceType = 'care-home' | 'nursing-home' | 'home-care'
export const SERVICE_TYPES: ServiceType[] = ['care-home', 'nursing-home', 'home-care']
export const RADII = [3, 5, 10, 15] as const

/** Which CareAssura flag each service type filters on. */
const SERVICE_COLUMN: Record<ServiceType, string> = {
  'care-home': 'type_residential',
  'nursing-home': 'type_nursing',
  'home-care': 'type_homecare',
}

export type Rating = 'Outstanding' | 'Good' | 'Requires improvement' | 'Inadequate' | 'Not yet rated'

export type Competitor = {
  id: string
  name: string
  town: string
  postcode: string
  distance: number
  rating: Rating
  careTypes: string[]
  hasWebsite: boolean
}

export type Place = { postcode: string; label: string; lat: number; lng: number }

export type Snapshot = {
  place: Place
  service: ServiceType
  radius: number
  /** Every matching service in the radius (may be a floor when `capped`). */
  total: number
  capped: boolean
  ratings: Record<Rating, number>
  withWebsite: number
  noWebsite: number
  /** Nearest first, at most LIST_LIMIT. */
  competitors: Competitor[]
}

const ROW_LIMIT = 1500
const LIST_LIMIT = 60

const CORE_COLUMNS =
  'id, name, town, postcode, lat, lng, website, cqc_rating, type_residential, type_nursing, type_homecare, care_dementia, care_learning_disability, care_mental_health, care_younger_adults'

type Row = {
  id: string | number
  name: string | null
  town: string | null
  postcode: string | null
  lat: number | null
  lng: number | null
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

function careAssura() {
  const url = process.env.CAREASSURA_SUPABASE_URL
  const key = process.env.CAREASSURA_SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

// ── Postcodes ──────────────────────────────────────────────────────────────

const FULL_POSTCODE = /^([A-Z]{1,2}\d[A-Z\d]?) ?(\d[A-Z]{2})$/
const OUTCODE = /^[A-Z]{1,2}\d[A-Z\d]?$/

/** Upper-cased and spaced ("rh101aa" becomes "RH10 1AA"), or null when it is not a UK postcode shape. */
export function normalisePostcode(input: string): { value: string; kind: 'full' | 'outcode' } | null {
  const s = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const full = s.match(FULL_POSTCODE)
  if (full) return { value: `${full[1]} ${full[2]}`, kind: 'full' }
  if (OUTCODE.test(s)) return { value: s, kind: 'outcode' }
  return null
}

// Postcode results carry strings; outcode results carry arrays for the same fields.
type PcResult = {
  latitude: number | null
  longitude: number | null
  country?: string | string[] | null
  admin_district?: string | string[] | null
}

const first = (v: string | string[] | null | undefined) => (Array.isArray(v) ? v[0] : v) ?? undefined

async function pcFetch(path: string): Promise<{ status: number; result: PcResult | null }> {
  const res = await fetch(`https://api.postcodes.io${path}`, {
    next: { revalidate: 60 * 60 * 24 * 7 },
    signal: AbortSignal.timeout(6000),
  })
  if (res.status === 404) return { status: 404, result: null }
  if (!res.ok) throw new Error(`postcodes.io ${res.status}`)
  const j = (await res.json()) as { result?: PcResult }
  return { status: res.status, result: j.result ?? null }
}

export class PlaceError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

/** The centre point for a postcode or outcode, from postcodes.io. */
export async function lookupPlace(input: string): Promise<Place> {
  const pc = normalisePostcode(input)
  if (!pc) throw new PlaceError('Please enter a full UK postcode, for example RH10 1AA.', 400)

  let r: PcResult | null
  if (pc.kind === 'full') {
    r = (await pcFetch(`/postcodes/${encodeURIComponent(pc.value)}`)).result
    // Terminated postcodes still have a point, and some providers are registered at one.
    // They carry no country, so take that from the outcode.
    if (!r) {
      const old = (await pcFetch(`/terminated_postcodes/${encodeURIComponent(pc.value)}`)).result
      if (old) {
        const area = (await pcFetch(`/outcodes/${encodeURIComponent(pc.value.split(' ')[0]!)}`)).result
        r = { ...old, country: area?.country, admin_district: area?.admin_district }
      }
    }
  } else {
    r = (await pcFetch(`/outcodes/${encodeURIComponent(pc.value)}`)).result
  }
  const country = first(r?.country)
  const district = first(r?.admin_district)
  const label = district ? `${pc.value}, ${district}` : pc.value

  if (!r || r.latitude == null || r.longitude == null) {
    throw new PlaceError(`We could not find ${pc.value}. Please check the postcode and try again.`, 404)
  }
  if (country && country !== 'England') {
    throw new PlaceError(
      `${pc.value} is in ${country}. This snapshot uses the CQC register, which covers care services in England only.`,
      422,
    )
  }
  return { postcode: pc.value, label, lat: r.latitude, lng: r.longitude }
}

// ── Formatting ─────────────────────────────────────────────────────────────

function rating(raw: string | null): Rating {
  switch ((raw ?? '').toLowerCase().replace(/[\s-]+/g, '_')) {
    case 'outstanding':
      return 'Outstanding'
    case 'good':
      return 'Good'
    case 'requires_improvement':
      return 'Requires improvement'
    case 'inadequate':
      return 'Inadequate'
    default:
      return 'Not yet rated'
  }
}

function careTypes(r: Row): string[] {
  const out: string[] = []
  if (r.type_residential) out.push('Residential')
  if (r.type_nursing) out.push('Nursing')
  if (r.type_homecare) out.push('Home care')
  if (r.care_dementia) out.push('Dementia')
  if (r.care_learning_disability) out.push('Learning disability')
  if (r.care_mental_health) out.push('Mental health')
  if (r.care_younger_adults) out.push('Younger adults')
  return out
}

function titleCase(s: string): string {
  const t = s.trim()
  if (!t) return ''
  // Leave mixed-case names alone; only fix ones stored in all caps.
  if (t !== t.toUpperCase()) return t
  return t.toLowerCase().replace(/\b([a-z])/g, (m) => m.toUpperCase())
}

function haversineMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

// ── Query ──────────────────────────────────────────────────────────────────

async function readBox(lat: number, lng: number, miles: number, service: ServiceType, limit: number): Promise<Row[]> {
  const db = careAssura()
  if (!db) throw new Error('CareAssura is not configured')
  const dLat = miles / 69.0
  const dLng = miles / (69.0 * Math.max(Math.cos((lat * Math.PI) / 180), 0.1))
  const { data, error } = await db
    .from('care_homes')
    .select(CORE_COLUMNS)
    .eq('status', 'published')
    .eq(SERVICE_COLUMN[service], true)
    .gte('lat', lat - dLat)
    .lte('lat', lat + dLat)
    .gte('lng', lng - dLng)
    .lte('lng', lng + dLng)
    .limit(limit)
  if (error) throw new Error(`CareAssura: ${error.message}`)
  return (data ?? []) as unknown as Row[]
}

function toCompetitors(rows: Row[], lat: number, lng: number, radius: number): Competitor[] {
  const out: Competitor[] = []
  for (const r of rows) {
    if (r.lat == null || r.lng == null || !r.name) continue
    const distance = haversineMiles(lat, lng, r.lat, r.lng)
    if (distance > radius) continue
    out.push({
      id: String(r.id),
      name: titleCase(r.name),
      town: titleCase(r.town ?? ''),
      postcode: (r.postcode ?? '').trim().toUpperCase(),
      distance: Math.round(distance * 10) / 10,
      rating: rating(r.cqc_rating),
      careTypes: careTypes(r),
      hasWebsite: !!r.website && r.website.trim().length > 3,
    })
  }
  return out.sort((a, b) => a.distance - b.distance || a.name.localeCompare(b.name))
}

async function computeSnapshot(lat: number, lng: number, service: ServiceType, radius: number) {
  const rows = await readBox(lat, lng, radius, service, ROW_LIMIT)
  const all = toCompetitors(rows, lat, lng, radius)
  const capped = rows.length >= ROW_LIMIT

  // A dense city at a wide radius can overflow the limit, and a capped box is an
  // arbitrary slice rather than the nearest ones. Re-read a tighter box so the list
  // at least shows the genuinely closest services. Summary figures stay a floor.
  let nearest = all
  if (capped) {
    for (const r of [radius / 3, radius / 8]) {
      const inner = await readBox(lat, lng, r, service, ROW_LIMIT)
      if (inner.length < ROW_LIMIT) {
        nearest = toCompetitors(inner, lat, lng, r)
        break
      }
    }
  }

  const ratings: Record<Rating, number> = {
    Outstanding: 0,
    Good: 0,
    'Requires improvement': 0,
    Inadequate: 0,
    'Not yet rated': 0,
  }
  let withWebsite = 0
  for (const c of all) {
    ratings[c.rating]++
    if (c.hasWebsite) withWebsite++
  }
  const total = all.length
  const competitors = nearest.slice(0, LIST_LIMIT)
  return { total, capped, ratings, withWebsite, noWebsite: total - withWebsite, competitors }
}

const cachedSnapshot = unstable_cache(
  async (lat: number, lng: number, service: ServiceType, radius: number) => computeSnapshot(lat, lng, service, radius),
  ['competitor-snapshot-v1'],
  { tags: ['competitor-snapshot'], revalidate: 86400 },
)

export async function getSnapshot(place: Place, service: ServiceType, radius: number): Promise<Snapshot> {
  // Round the point to about 100m so neighbouring postcodes share a cache entry.
  const lat = Math.round(place.lat * 1000) / 1000
  const lng = Math.round(place.lng * 1000) / 1000
  const s = await cachedSnapshot(lat, lng, service, radius)
  return { place, service, radius, ...s }
}
