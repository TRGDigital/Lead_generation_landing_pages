import { createServiceClient } from '@/lib/supabase/server'

// Distinct published landing-page area names — used to let buyers pick which
// landing pages they receive leads from (the area is the lead↔buyer match key).
export async function getPublishedAreas(): Promise<string[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data } = await db.from('location_pages').select('area_name').eq('status', 'published').order('area_name')
  return [...new Set(((data ?? []) as { area_name: string }[]).map((r) => r.area_name).filter(Boolean))]
}
