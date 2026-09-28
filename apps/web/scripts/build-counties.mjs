#!/usr/bin/env node
/**
 * Builds the county data the /locations, /care-website-design and /care-seo pages need.
 *
 *   node scripts/build-counties.mjs west-sussex hampshire surrey
 *   node scripts/build-counties.mjs --all          (every county in CareAssura)
 *
 * For each county it reads every registered service from CareAssura, counts the things
 * the pages state, and geocodes any town it has not seen before through postcodes.io,
 * using one representative postcode per town. Two files come out:
 *
 *   lib/data/county-snapshots.json   the counted figures, used when the live read fails
 *   lib/data/town-coords.generated.json   town centroids for the maps
 *
 * Both are committed. The pages still read CareAssura live at request time; these are the
 * fallback and the coordinates, neither of which changes often.
 *
 * Credentials come from the environment, or from ~/carecompass/.env.local, and are never
 * printed.
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(HERE, '..', 'lib', 'data')
const SNAPSHOTS = path.join(DATA, 'county-snapshots.json')
const COORDS = path.join(DATA, 'town-coords.generated.json')

const COLUMNS = [
  'town',
  'postcode',
  'website',
  'cqc_rating',
  'type_residential',
  'type_nursing',
  'type_homecare',
  'care_dementia',
  'care_learning_disability',
  'care_mental_health',
  'care_younger_adults',
].join(',')

function credentials() {
  let url = process.env.CAREASSURA_SUPABASE_URL
  let key = process.env.CAREASSURA_SUPABASE_SERVICE_KEY
  const envFile = path.join(os.homedir(), 'carecompass', '.env.local')
  if ((!url || !key) && fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
      const m = line.match(/^([A-Z_]+)=(.*)$/)
      if (!m) continue
      const v = m[2].trim().replace(/^["']|["']$/g, '')
      if (m[1] === 'SUPABASE_SERVICE_ROLE_KEY' && !key) key = v
    }
    url = url || 'https://ktaxsqqnhvrppbxwmitc.supabase.co'
  }
  if (!url || !key) {
    console.error('No CareAssura credentials found. Set CAREASSURA_SUPABASE_URL and CAREASSURA_SUPABASE_SERVICE_KEY.')
    process.exit(1)
  }
  return { url, key }
}

const { url: DB_URL, key: DB_KEY } = credentials()

async function rest(pathAndQuery) {
  const res = await fetch(`${DB_URL}/rest/v1/${pathAndQuery}`, {
    headers: { apikey: DB_KEY, Authorization: `Bearer ${DB_KEY}`, Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`CareAssura ${res.status} ${res.statusText}`)
  return res.json()
}

/** Every row for a county, in pages, because PostgREST caps a response at 1000. */
async function rowsFor(slug) {
  const out = []
  const size = 1000
  for (let from = 0; ; from += size) {
    const page = await fetch(
      `${DB_URL}/rest/v1/care_homes?select=${COLUMNS}&county_slug=eq.${encodeURIComponent(slug)}&order=id.asc&limit=${size}&offset=${from}`,
      { headers: { apikey: DB_KEY, Authorization: `Bearer ${DB_KEY}` } },
    ).then((r) => {
      if (!r.ok) throw new Error(`CareAssura ${r.status}`)
      return r.json()
    })
    out.push(...page)
    if (page.length < size) break
  }
  return out
}

// Kept in step with normaliseTown and displayTown in lib/locations.ts.
const ALIASES = { waterloovile: 'waterlooville' }
const normalise = (raw) => {
  const key = String(raw ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return ALIASES[key] ?? key
}

function tally(rows, countyName) {
  const countyKey = normalise(countyName)
  const missing = (r) => !r.website || !String(r.website).trim()
  const count = (p) => rows.filter(p).length
  const rated = new Set(['outstanding', 'good', 'requires_improvement', 'inadequate'])
  const rating = (v) => count((r) => String(r.cqc_rating ?? '').toLowerCase() === v)

  const towns = new Map()
  for (const r of rows) {
    const key = normalise(r.town)
    if (!key || key === countyKey) continue
    const row = towns.get(key) ?? { services: 0, noWebsite: 0, postcode: null }
    row.services++
    if (missing(r)) row.noWebsite++
    if (!row.postcode && r.postcode) row.postcode = String(r.postcode).trim()
    towns.set(key, row)
  }
  const ranked = [...towns.entries()]
    .map(([key, v]) => ({ key, ...v }))
    .sort((a, b) => b.services - a.services || a.key.localeCompare(b.key))

  return {
    ranked,
    stats: {
      services: rows.length,
      towns: towns.size,
      residential: count((r) => r.type_residential === true),
      nursing: count((r) => r.type_nursing === true),
      homeCare: count((r) => r.type_homecare === true),
      dementia: count((r) => r.care_dementia === true),
      learningDisability: count((r) => r.care_learning_disability === true),
      mentalHealth: count((r) => r.care_mental_health === true),
      youngerAdults: count((r) => r.care_younger_adults === true),
      outstanding: rating('outstanding'),
      good: rating('good'),
      requiresImprovement: rating('requires_improvement'),
      notRated: count((r) => !rated.has(String(r.cqc_rating ?? '').toLowerCase())),
      noWebsite: count(missing),
      noWebsiteByType: {
        residential: count((r) => r.type_residential === true && missing(r)),
        nursing: count((r) => r.type_nursing === true && missing(r)),
        homeCare: count((r) => r.type_homecare === true && missing(r)),
        dementia: count((r) => r.care_dementia === true && missing(r)),
      },
    },
  }
}

/** postcodes.io, 100 at a time, free and keyless. Failures are skipped, not guessed. */
async function geocode(postcodes) {
  const found = {}
  for (let i = 0; i < postcodes.length; i += 100) {
    const batch = postcodes.slice(i, i + 100)
    const res = await fetch('https://api.postcodes.io/postcodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postcodes: batch }),
    })
    if (!res.ok) continue
    const body = await res.json()
    for (const r of body.result ?? []) {
      if (r.result) found[r.query] = [round(r.result.latitude), round(r.result.longitude)]
    }
  }
  return found
}
const round = (n) => Math.round(n * 10000) / 10000

const readJson = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {})

async function main() {
  const args = process.argv.slice(2)
  let slugs = args.filter((a) => !a.startsWith('--'))

  if (args.includes('--all')) {
    const rows = await rest('care_homes?select=county_slug&limit=100000')
    slugs = [...new Set(rows.map((r) => r.county_slug).filter(Boolean))].sort()
    console.log(`${slugs.length} counties in CareAssura`)
  }
  if (slugs.length === 0) {
    console.error('Usage: node scripts/build-counties.mjs <county-slug> [...] | --all')
    process.exit(1)
  }

  const snapshots = readJson(SNAPSHOTS)
  const coords = readJson(COORDS)

  for (const slug of slugs) {
    const rows = await rowsFor(slug)
    if (rows.length === 0) {
      console.log(`${slug}: no rows, skipped`)
      continue
    }
    const countyName = slug.replace(/-/g, ' ').replace(/\b[a-z]/g, (c) => c.toUpperCase())
    const { ranked, stats } = tally(rows, countyName)

    // Geocode only towns we do not already hold, so a rerun costs almost nothing.
    const known = coords[slug] ?? {}
    const need = ranked.filter((t) => !known[t.key] && t.postcode)
    if (need.length > 0) {
      const found = await geocode(need.map((t) => t.postcode))
      for (const t of need) {
        const c = found[t.postcode]
        if (c) known[t.key] = c
      }
      coords[slug] = known
    } else {
      coords[slug] = known
    }

    const placed = ranked.filter((t) => known[t.key])
    snapshots[slug] = {
      ...stats,
      topTowns: ranked.slice(0, 8).map((t) => ({ key: t.key, services: t.services })),
      busiestTown: ranked[0] ? { key: ranked[0].key, services: ranked[0].services } : null,
      townPoints: placed.map((t) => ({
        key: t.key,
        services: t.services,
        noWebsite: t.noWebsite,
        lat: known[t.key][0],
        lng: known[t.key][1],
      })),
      countedAt: new Date().toISOString().slice(0, 10),
    }

    console.log(
      `${slug}: ${stats.services} services, ${stats.towns} towns, ${stats.noWebsite} with no website, ${placed.length} towns on the map`,
    )
  }

  fs.writeFileSync(SNAPSHOTS, JSON.stringify(sortKeys(snapshots), null, 2) + '\n')
  fs.writeFileSync(COORDS, JSON.stringify(sortKeys(coords), null, 2) + '\n')
  console.log(`\nWrote ${path.relative(process.cwd(), SNAPSHOTS)} and ${path.relative(process.cwd(), COORDS)}`)
}

const sortKeys = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)))

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
