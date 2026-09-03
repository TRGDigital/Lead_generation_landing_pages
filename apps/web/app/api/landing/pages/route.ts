import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// A summary of the promoted pages and who is on them, for CareAssura's Paid Leads view.
// Read only, server to server: the pages live here, the leads land there, and this is the
// join between them.
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const secret = process.env.LANDING_CLAIM_SECRET || process.env.ROUTINE_TOKEN || ''
  if (!secret || req.headers.get('x-landing-secret') !== secret) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const db = createServiceClient() as unknown as any
  const { data: pages } = await db
    .from('location_pages')
    .select('id, slug, area_name, status, care_type, postcode_districts')
    .order('area_name', { ascending: true })

  const { data: seats } = await db
    .from('location_page_homes')
    .select('page_id, home_id, home_name, town, active, leads_total, last_lead_at')

  const byPage = new Map<string, any[]>()
  for (const s of seats ?? []) byPage.set(s.page_id, [...(byPage.get(s.page_id) ?? []), s])

  return NextResponse.json({
    pages: (pages ?? []).map((p: any) => ({
      slug: p.slug,
      area: p.area_name,
      status: p.status,
      care_type: p.care_type,
      districts: p.postcode_districts ?? [],
      url: `https://${p.slug}.careassura.com/`,
      homes: (byPage.get(p.id) ?? []).map((s) => ({
        home_id: s.home_id,
        name: s.home_name,
        town: s.town,
        active: s.active,
        leads_total: s.leads_total,
        last_lead_at: s.last_lead_at,
      })),
    })),
  })
}
