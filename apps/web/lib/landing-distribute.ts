// Who gets the next lead from a promoted landing page.
//
// Two rules, in order:
//   1. Only homes with availability. Sending a family to a full home wastes the ad spend and
//      wastes their time, and they are the ones in a hurry.
//   2. Longest since their last lead goes first. A plain rota, so a page shared by four homes
//      shares fairly rather than favouring whoever joined first.
//
// Availability lives in CareAssura, which owns the profile, so it is asked at lead time rather
// than mirrored here where it would go stale.

export type Candidate = { id: string; home_id: string; home_name: string | null; last_lead_at: string | null }

export async function eligibleHomes(homeIds: string[]): Promise<Set<string>> {
  if (!homeIds.length) return new Set()
  const base = process.env.CAREASSURA_URL || 'https://careassura.com'
  const secret = process.env.LANDING_CLAIM_SECRET || process.env.ROUTINE_TOKEN || ''
  try {
    const r = await fetch(`${base}/api/landing-availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-landing-secret': secret },
      body: JSON.stringify({ home_ids: homeIds }),
    })
    if (!r.ok) return new Set(homeIds)          // never drop a lead over a failed check
    const j = await r.json()
    return new Set<string>(Array.isArray(j.available) ? j.available : homeIds)
  } catch {
    return new Set(homeIds)
  }
}

// Returns the home that should receive this lead, or null when nobody in the area has a bed.
export async function pickHomeForLead(db: any, pageId: string): Promise<Candidate | null> {
  const { data } = await db
    .from('location_page_homes')
    .select('id, home_id, home_name, last_lead_at')
    .eq('page_id', pageId)
    .eq('active', true)
    .order('last_lead_at', { ascending: true, nullsFirst: true })

  const rota: Candidate[] = data ?? []
  if (!rota.length) return null

  const available = await eligibleHomes(rota.map((r) => r.home_id))
  const next = rota.find((r) => available.has(r.home_id))
  return next ?? null      // everyone full: the lead still gets captured, it just is not assigned
}

export async function recordLeadSent(db: any, rowId: string) {
  const { data } = await db.from('location_page_homes').select('leads_total').eq('id', rowId).single()
  await db
    .from('location_page_homes')
    .update({ last_lead_at: new Date().toISOString(), leads_total: (data?.leads_total ?? 0) + 1 })
    .eq('id', rowId)
}
