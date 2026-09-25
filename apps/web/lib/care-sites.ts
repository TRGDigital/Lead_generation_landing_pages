// Read-only views into the two care sites we run, so their outstanding work can sit
// in the same queue as everything else.
//
// Crossways and Ferndale are separate Next apps on separate Supabase projects, each
// with its own AreaPage table (Prisma, so the table name is quoted camelCase). Rather
// than build an API on each site, this reads their tables directly with their service
// keys, which are held in this project's environment. Read only: nothing here writes
// to a client database.

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type CareSite = { key: string; label: string; host: string; adminUrl: string }

export const CARE_SITES: CareSite[] = [
  {
    key: 'crossways',
    label: 'Crossways',
    host: 'crosswayscarehome.co.uk',
    adminUrl: 'https://crosswayscarehome.co.uk/admin/?tab=areas',
  },
  {
    key: 'ferndale',
    label: 'Ferndale',
    host: 'ferndalenursinghome.co.uk',
    adminUrl: 'https://ferndalenursinghome.co.uk/admin/?tab=areas',
  },
]

function clientFor(site: CareSite): SupabaseClient | null {
  const prefix = site.key.toUpperCase()
  const url = process.env[`${prefix}_SUPABASE_URL`]
  const key = process.env[`${prefix}_SUPABASE_SERVICE_KEY`]
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export type AreaPageTask = {
  site: CareSite
  path: string
  /** What is actually missing, in the order we would fix it. */
  need: 'no local facts' | 'not refreshed' | 'unpublished'
  published: boolean
}

/**
 * The local area pages with work outstanding. Two signals, both of which are things
 * the care site admin already tracks: whether the page has local facts (the thing that
 * stops every page reading the same) and whether it has been marked as refreshed.
 */
export async function getAreaPageTasks(): Promise<AreaPageTask[]> {
  const out: AreaPageTask[] = []

  await Promise.all(
    CARE_SITES.map(async (site) => {
      const db = clientFor(site)
      if (!db) return
      const { data, error } = await db
        .from('AreaPage')
        .select('path, published, pageUpdated, localFacts')
        .order('path')
      if (error || !data) return

      for (const row of data as Record<string, unknown>[]) {
        const path = row.path as string
        const published = row.published !== false
        const facts = ((row.localFacts as string) ?? '').trim()
        const refreshed = row.pageUpdated === true
        if (!published) {
          out.push({ site, path, need: 'unpublished', published })
        } else if (!facts) {
          out.push({ site, path, need: 'no local facts', published })
        } else if (!refreshed) {
          out.push({ site, path, need: 'not refreshed', published })
        }
      }
    }),
  )

  // Local facts first: it is the one that changes what the page says, rather than
  // just recording that somebody looked at it.
  const order = { 'no local facts': 0, 'not refreshed': 1, unpublished: 2 }
  out.sort((a, b) => order[a.need] - order[b.need] || a.site.key.localeCompare(b.site.key))
  return out
}

/** True when neither care database is reachable, so the page can say so rather than showing nothing. */
export function careSitesConfigured() {
  return CARE_SITES.some((s) => clientFor(s) !== null)
}
