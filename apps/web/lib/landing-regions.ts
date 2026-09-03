// Promoted landing pages, matched to claimed homes by region.
//
// A page covers a postcode area and one care type, and is shared by every claimed home that
// fits it. That is deliberate: one home cannot fund enough paid traffic on its own, but four
// homes in the same area sharing a page can, and each new client makes the page stronger
// rather than starting another from scratch.
//
// Crossways is the worked example. It sits in Lindfield, not Haywards Heath, so matching on
// town would have missed. Matching on the postcode district (RH16) puts it on the Haywards
// Heath page where it belongs.

import { buildLandingContent, buildMeta } from '@/lib/landing-content'

export type CareType = 'residential' | 'nursing' | 'homecare'

export type MatchInput = {
  home_id: string
  name: string
  town: string | null
  postcode: string | null
  care_type: CareType
}

// "RH16 2AA" -> "RH16". The outward code's area+district is the useful unit: it is roughly a
// town and its surrounding villages, which is how families actually search.
export function postcodeDistrict(postcode: string | null | undefined): string | null {
  const p = String(postcode ?? '').toUpperCase().replace(/\s+/g, '')
  const m = p.match(/^([A-Z]{1,2}\d{1,2}[A-Z]?)/)
  return m ? (m[1] ?? null) : null
}

export function careTypeOf(home: { type_nursing?: boolean | null; type_homecare?: boolean | null }): CareType {
  if (home.type_homecare) return 'homecare'
  if (home.type_nursing) return 'nursing'
  return 'residential'
}

const LABEL: Record<CareType, string> = {
  residential: 'care home',
  nursing: 'nursing home',
  homecare: 'home care',
}

// Slug for a new page, e.g. "crawley-nursing-home". Served at <slug>.careassura.com.
export function pageSlugFor(town: string, care: CareType) {
  const t = town.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return `${t}-${LABEL[care].replace(/\s+/g, '-')}`
}

// Find the page that already covers this home, if any. A page must match BOTH the postcode
// district and the care type: a family looking for nursing care in Crawley is not served by a
// residential page for the same town.
export async function findPageFor(db: any, input: MatchInput) {
  const district = postcodeDistrict(input.postcode)
  if (!district) return null
  const { data } = await db
    .from('location_pages')
    .select('id, slug, area_name, care_type, postcode_districts, status')
    .contains('postcode_districts', [district])
    .eq('care_type', input.care_type)
    .limit(1)
  return data?.[0] ?? null
}

// Link a claimed home to a page. Idempotent: claiming twice must not create a second seat in
// the rota, and re-claiming reactivates rather than duplicating.
export async function linkHomeToPage(db: any, pageId: string, input: MatchInput) {
  const { data: existing } = await db
    .from('location_page_homes')
    .select('id, active')
    .eq('page_id', pageId)
    .eq('home_id', input.home_id)
    .limit(1)

  if (existing?.[0]) {
    if (!existing[0].active) await db.from('location_page_homes').update({ active: true }).eq('id', existing[0].id)
    return { linked: existing[0].id, created: false }
  }
  const { data } = await db
    .from('location_page_homes')
    .insert({ page_id: pageId, home_id: input.home_id, home_name: input.name, town: input.town })
    .select('id')
    .single()
  return { linked: data?.id ?? null, created: true }
}

// No page covers this home yet, so create one as a DRAFT. Drafts are never served, which
// means a new client never points ad spend at an empty page: someone writes the content and
// publishes it deliberately.
export async function createPageFor(db: any, input: MatchInput) {
  const district = postcodeDistrict(input.postcode)
  const town = input.town || input.name
  const slug = pageSlugFor(town, input.care_type)

  const { data: clash } = await db.from('location_pages').select('id').eq('slug', slug).limit(1)
  if (clash?.[0]) return clash[0]      // someone already made it; use it

  const { data } = await db
    .from('location_pages')
    .insert({
      slug,
      area_name: town,
      status: 'draft',
      care_type: input.care_type,
      question_set: input.care_type,
      postcode_districts: district ? [district] : null,
      noindex: true,
      ...buildMeta(town, input.care_type),
      // Start from the structure that already converts, filled in for this town and care
      // type, so a new page is never blank. It still wants editing: local detail is what
      // makes a page feel local.
      content: buildLandingContent(town, input.care_type),
    })
    .select('id, slug, area_name, care_type, status')
    .single()
  return data ?? null
}

// The whole flow for one claim: find the page for this home's region and care type, create it
// as a draft if there isn't one, and put the home in the rota either way.
export async function assignHomeToRegion(db: any, input: MatchInput) {
  const found = await findPageFor(db, input)
  const page = found ?? (await createPageFor(db, input))
  if (!page) return { ok: false as const, reason: 'could not resolve a page' }
  const link = await linkHomeToPage(db, page.id, input)
  return {
    ok: true as const,
    page,
    created_page: !found,
    ...link,
    district: postcodeDistrict(input.postcode),
  }
}
