#!/usr/bin/env node
/**
 * Fills the county_pages rollout queue from CareAssura.
 *
 *   node scripts/seed-counties.mjs            (dry run, prints what it would write)
 *   node scripts/seed-counties.mjs --write
 *
 * One row per local authority area in CareAssura. Until 2026-09-28 this stopped at 150
 * services, which left out 84 areas and 27% of the market. Each row carries its phase, an opening line written
 * from its own figures, and a candidate council URL.
 *
 * Nothing here publishes anything: rows land as `queued` and the nightly cron promotes a
 * few a day. Rows that already exist keep their status, their edited standing line and
 * their checked council link, so this is safe to re-run.
 *
 * Council URLs are candidates only. They are rendered on the pages only once the link
 * checker has confirmed them (council_ok), so a wrong guess shows nothing rather than a
 * broken link.
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
// Every area CareAssura holds. A small market is still somewhere a provider needs a site.
const MIN_SERVICES = 1

// Phase by region, as agreed: what we can see working first, then out from there.
const PHASE_BY_REGION = {
  'South East': 2,
  London: 2,
  East: 3,
  'South West': 3,
  'East Midlands': 3,
  'West Midlands': 4,
  'Yorkshire & Humberside': 4,
  'North West': 4,
  'North East': 4,
}

// Already live, so they are never re-queued.
const LIVE = ['west-sussex', 'east-sussex', 'hampshire', 'surrey', 'kent']

// Candidate adult social care pages. Checked by the link checker before any page shows
// one; an area missing from here simply has no council link until someone adds it.
const COUNCILS = JSON.parse(fs.readFileSync(path.join(HERE, 'councils.json'), 'utf8'))

function env(file, keys) {
  const out = {}
  if (!fs.existsSync(file)) return out
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && keys.includes(m[1])) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
  }
  return out
}

const care = (() => {
  const url = process.env.CAREASSURA_SUPABASE_URL ?? 'https://ktaxsqqnhvrppbxwmitc.supabase.co'
  const key =
    process.env.CAREASSURA_SUPABASE_SERVICE_KEY ??
    env(path.join(os.homedir(), 'carecompass', '.env.local'), ['SUPABASE_SERVICE_ROLE_KEY'])
      .SUPABASE_SERVICE_ROLE_KEY
  if (!key) throw new Error('No CareAssura service key')
  return { url, key }
})()

const trg = (() => {
  const local = env(path.join(HERE, '..', '.env.local'), [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ])
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? local.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? local.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('No TRG Supabase credentials (.env.local)')
  return { url, key }
})()

async function get(base, q) {
  const res = await fetch(`${base.url}/rest/v1/${q}`, {
    headers: { apikey: base.key, Authorization: `Bearer ${base.key}` },
  })
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  return res.json()
}

/** PostgREST caps a response at 1000 rows, and there are 29,000 services. */
async function getAll(base, select, table = 'care_homes') {
  const out = []
  const size = 1000
  for (let from = 0; ; from += size) {
    const page = await get(base, `${table}?select=${select}&order=id.asc&limit=${size}&offset=${from}`)
    out.push(...page)
    if (page.length < size) break
  }
  return out
}

// CareAssura carries the ONS official names, which read badly in a page title.
const DISPLAY_NAMES = {
  'bristol-city-of': 'Bristol',
  'kingston-upon-hull-city-of': 'Hull',
  'herefordshire-county-of': 'Herefordshire',
}

/**
 * Council adult social care pages from CareAssura, which already holds one per local
 * authority on its collection pages. Used for any area not in councils.json, so every area
 * gets a candidate link; the link checker still has to open it before a page shows it.
 *
 * CareAssura names the council in full ("London Borough of Barnet", "Hull City Council")
 * while care_homes carries the ONS area name ("Barnet", "Kingston upon Hull, City of"), so
 * the match is on the core name, preferring an exact council form and a deep link over a
 * bare homepage.
 */
async function careAssuraCouncils(rows) {
  const pages = await getAll(care, 'local_authority_name,local_authority_url', 'collection_pages')
  const counts = new Map()
  for (const p of pages) {
    if (!p.local_authority_name || !p.local_authority_url) continue
    const k = `${p.local_authority_name}\t${p.local_authority_url}`
    counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  const candidates = [...counts.entries()].map(([k, c]) => {
    const [name, url] = k.split('\t')
    return { name, url, c }
  })

  // The commonest local_authority per area.
  const tally = new Map()
  for (const r of rows) {
    if (!r.county_slug || !r.local_authority) continue
    const m = tally.get(r.county_slug) ?? new Map()
    m.set(r.local_authority, (m.get(r.local_authority) ?? 0) + 1)
    tally.set(r.county_slug, m)
  }

  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const out = {}
  for (const [slug, m] of tally) {
    const la = [...m.entries()].sort((a, b) => b[1] - a[1])[0][0]
    const core = la.replace(/,\s*(City|County) of$/, '').trim()
    const exact = new RegExp(
      `^(London Borough of |Royal Borough of )?${esc(core)}( (City|County|Metropolitan Borough|Borough|District|Metropolitan District) Council| Council| Corporation)?$`,
      'i',
    )
    const best = candidates
      .filter((c) => c.name.toLowerCase().includes(core.toLowerCase()))
      .sort(
        (a, b) =>
          Number(exact.test(b.name)) - Number(exact.test(a.name)) ||
          Number(/\.uk\/.+/.test(b.url)) - Number(/\.uk\/.+/.test(a.url)) ||
          b.c - a.c,
      )[0]
    if (best) out[slug] = { name: best.name, url: best.url }
  }
  return out
}

const title = (s) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase())

/**
 * The opening line, from the shape of that county's own market rather than from a
 * template with the name swapped. Whichever fact is most distinctive wins, so a
 * fragmented county reads differently from a top heavy one.
 */
function standingFor(name, s) {
  const lead = 'Care is the only sector we work in.'
  const topShare = s.services ? s.top / s.services : 0
  const perTown = s.towns ? s.services / s.towns : 0
  const noSiteShare = s.services ? s.noWebsite / s.services : 0

  if (s.services < 40) {
    return `${lead} ${name} is a small market, ${s.services} registered ${s.services === 1 ? 'service' : 'services'}, and in a market this size the few families searching see the same handful of names every time. Being one of them is most of the job.`
  }
  // A London borough or a single city comes back as one town holding nearly everything
  // ("London alone holds 145 of its services, 100 in every hundred"), which says nothing.
  if (topShare >= 0.9 || s.towns < 2) {
    return `${lead} ${name} is a single urban market rather than a county of towns: ${s.services} registered services, most of them competing for the same families in the same search results.`
  }
  if (topShare >= 0.3) {
    return `${lead} ${name} is concentrated: ${s.topName} alone holds ${s.top} of its registered services, ${Math.round(topShare * 100)} in every hundred, and the search results there work nothing like the rest of the area.`
  }
  if (perTown <= 11 && s.towns >= 20) {
    return `${lead} ${name} is a fragmented market: ${s.services} services spread across ${s.towns} towns, with no single town holding more than ${s.top}. Search here is won town by town or not at all.`
  }
  if (noSiteShare >= 0.45) {
    return `${lead} ${name} has one of the widest gaps we count anywhere: ${Math.round(noSiteShare * 100)} in every hundred registered services have no website at all, which makes it one of the easier places to stand out.`
  }
  if (s.towns <= 6) {
    return `${lead} ${name} is a single urban market rather than a county of towns: ${s.services} registered services, most of them competing for the same families in the same search results.`
  }
  return `${lead} ${name} holds ${s.services} registered care services across ${s.towns} towns, and ${s.topName} is the busiest of them with ${s.top}.`
}

async function main() {
  const write = process.argv.includes('--write')

  const rows = await getAll(care, 'county_slug,county,region,town,website,local_authority')
  const fromCareAssura = await careAssuraCouncils(rows)

  const byArea = new Map()
  for (const r of rows) {
    if (!r.county_slug) continue
    const a =
      byArea.get(r.county_slug) ??
      { slug: r.county_slug, name: r.county ?? title(r.county_slug.replace(/-/g, ' ')), region: r.region, services: 0, noWebsite: 0, towns: new Map() }
    a.services++
    if (!r.website || !String(r.website).trim()) a.noWebsite++
    const t = String(r.town ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    if (t && t !== a.name.toLowerCase()) a.towns.set(t, (a.towns.get(t) ?? 0) + 1)
    if (!a.region && r.region) a.region = r.region
    byArea.set(r.county_slug, a)
  }

  const areas = [...byArea.values()]
    .filter((a) => a.services >= MIN_SERVICES)
    .map((a) => {
      const ranked = [...a.towns.entries()].sort((x, y) => y[1] - x[1])
      const [topName, top] = ranked[0] ?? ['', 0]
      return {
        slug: a.slug,
        name: a.name,
        region: a.region ?? null,
        services: a.services,
        noWebsite: a.noWebsite,
        towns: a.towns.size,
        top,
        topName: title(topName),
      }
    })
    .sort((x, y) => y.services - x.services)

  const existing = await get(trg, 'county_pages?select=slug,status,standing,council_name,council_url,council_ok')
  const known = new Map(existing.map((r) => [r.slug, r]))

  const payload = areas.map((a) => {
    const prior = known.get(a.slug)
    const council = COUNCILS[a.slug] ?? fromCareAssura[a.slug]
    return {
      slug: a.slug,
      name: DISPLAY_NAMES[a.slug] ?? a.name,
      region: a.region,
      phase: LIVE.includes(a.slug) ? 1 : (PHASE_BY_REGION[a.region ?? ''] ?? 4),
      services: a.services,
      // An edited line is never overwritten by a re-run.
      standing: prior?.standing ?? standingFor(DISPLAY_NAMES[a.slug] ?? a.name, a),
      council_name: prior?.council_url ? prior.council_name : (council?.name ?? null),
      council_url: prior?.council_url ?? council?.url ?? null,
      council_ok: prior?.council_ok ?? false,
      status: prior?.status ?? (LIVE.includes(a.slug) ? 'live' : 'queued'),
      published_at: prior ? undefined : LIVE.includes(a.slug) ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }
  })

  const byPhase = payload.reduce((m, r) => ({ ...m, [r.phase]: (m[r.phase] ?? 0) + 1 }), {})
  console.log(`${payload.length} areas at ${MIN_SERVICES}+ services`)
  console.log('by phase:', byPhase, '| with a candidate council link:', payload.filter((r) => r.council_url).length)
  console.log('\nsample:')
  for (const r of payload.slice(0, 3)) console.log(` ${r.slug} (p${r.phase}) ${r.standing}`)

  if (!write) {
    console.log('\nDry run. Add --write to save.')
    return
  }

  // PostgREST wants every object in one request to carry the same keys, and existing rows
  // leave published_at out so it is never reset. So existing and new rows go separately.
  const clean = (r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined))
  const groups = [payload.filter((r) => known.has(r.slug)), payload.filter((r) => !known.has(r.slug))]
  for (const group of groups) {
    if (group.length === 0) continue
    const res = await fetch(`${trg.url}/rest/v1/county_pages?on_conflict=slug`, {
      method: 'POST',
      headers: {
        apikey: trg.key,
        Authorization: `Bearer ${trg.key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(group.map(clean)),
    })
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`)
  }
  console.log(`\nWrote ${payload.length} rows.`)
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
