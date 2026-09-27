#!/usr/bin/env node
/**
 * Builds the national care market figures for /research.
 *
 *   node scripts/build-national.mjs
 *
 * Reads every registered service from CareAssura once, counts what the research page
 * states, and writes lib/data/national-snapshot.json with the date it was counted.
 *
 * This is a snapshot on purpose, not a live read. The county pages read one area at a
 * time; a national page would read all 29,000 rows on every cache miss, and CareAssura
 * has already had one outage from crawler load. Re-run this when the figures should move.
 *
 * Credentials come from the environment, or from ~/carecompass/.env.local, and are never
 * printed.
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(HERE, '..', 'lib', 'data', 'national-snapshot.json')

const COLUMNS = [
  'id',
  'county',
  'county_slug',
  'region',
  'website',
  'cqc_rating',
  'type_residential',
  'type_nursing',
  'type_homecare',
  'care_dementia',
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

/** Every row, keyset paged by id so each request is an index range rather than an offset scan. */
async function allRows() {
  const out = []
  let last = null
  for (;;) {
    const after = last ? `&id=gt.${last}` : ''
    const res = await fetch(`${DB_URL}/rest/v1/care_homes?select=${COLUMNS}&order=id.asc&limit=1000${after}`, {
      headers: { apikey: DB_KEY, Authorization: `Bearer ${DB_KEY}` },
    })
    if (!res.ok) throw new Error(`CareAssura ${res.status}`)
    const page = await res.json()
    out.push(...page)
    if (page.length < 1000) break
    last = page[page.length - 1].id
    // Gentle on a database that has been starved before.
    await new Promise((r) => setTimeout(r, 150))
  }
  return out
}

const rows = await allRows()
const missing = (r) => !r.website || !String(r.website).trim()
const count = (list, p) => list.filter(p).length
const rating = (v) => count(rows, (r) => String(r.cqc_rating ?? '').toLowerCase() === v)
const rated = new Set(['outstanding', 'good', 'requires_improvement', 'inadequate'])

const byType = (flag) => {
  const list = rows.filter((r) => r[flag] === true)
  return { services: list.length, noWebsite: count(list, missing) }
}

const group = (keyOf, nameOf) => {
  const map = new Map()
  for (const r of rows) {
    const key = keyOf(r)
    if (!key) continue
    const row = map.get(key) ?? { slug: key, name: nameOf(r), services: 0, noWebsite: 0 }
    row.services++
    if (missing(r)) row.noWebsite++
    map.set(key, row)
  }
  return [...map.values()].sort((a, b) => b.services - a.services || a.name.localeCompare(b.name))
}

const snapshot = {
  countedAt: new Date().toISOString().slice(0, 10),
  services: rows.length,
  noWebsite: count(rows, missing),
  types: {
    residential: byType('type_residential'),
    nursing: byType('type_nursing'),
    homeCare: byType('type_homecare'),
    dementia: byType('care_dementia'),
  },
  ratings: {
    outstanding: rating('outstanding'),
    good: rating('good'),
    requiresImprovement: rating('requires_improvement'),
    inadequate: rating('inadequate'),
    notRated: count(rows, (r) => !rated.has(String(r.cqc_rating ?? '').toLowerCase())),
  },
  regions: group(
    (r) => r.region,
    (r) => r.region,
  ).map(({ name, services, noWebsite }) => ({ name, services, noWebsite })),
  areas: group(
    (r) => r.county_slug,
    (r) => r.county ?? r.county_slug,
  ),
}

fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + '\n')
console.log(
  `${snapshot.services} services, ${snapshot.noWebsite} with no website, ${snapshot.areas.length} areas, ${snapshot.regions.length} regions, counted ${snapshot.countedAt}`,
)
