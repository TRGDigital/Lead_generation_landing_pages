import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Tables } from '@db/types'

export type PortalHome = Pick<
  Tables<'care_homes'>,
  'id' | 'name' | 'is_active' | 'bed_target' | 'cqc_rating' | 'phone_display' | 'location'
>

export const PORTAL_HOME_COOKIE = 'portal_home_id'

export async function getPortalContext() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in?redirect=/portal')

  // RLS scopes this query to the current user's assignments
  const { data: homes } = await supabase
    .from('care_homes')
    .select('id, name, is_active, bed_target, cqc_rating, phone_display, location')
    .order('name')

  const homeList = (homes ?? []) as unknown as PortalHome[]

  const savedId = cookies().get(PORTAL_HOME_COOKIE)?.value
  const selectedHome =
    homeList.find((h) => h.id === savedId) ?? homeList[0] ?? null

  return { user, homes: homeList, selectedHome }
}

// Lightweight variant for pages that just need the selected home
export async function requirePortalHome(): Promise<{ userId: string; home: PortalHome }> {
  const { user, selectedHome } = await getPortalContext()
  if (!selectedHome) redirect('/portal/no-homes')
  return { userId: user.id, home: selectedHome }
}

export type WeeklyStats = {
  newEnquiries: number
  qualified: number
  toursBooked: number
  moveIns: number
  unreviewedCount: number
}

export async function getWeeklyStats(homeId: string): Promise<WeeklyStats> {
  const supabase = createClient()
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [newRes, qualRes, tourRes, moveInRes, unreviewedRes] = await Promise.all([
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('care_home_id', homeId)
      .gte('created_at', weekAgo),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('care_home_id', homeId)
      .eq('qualified', true),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('care_home_id', homeId)
      .not('tour_booked_at', 'is', null)
      .gte('tour_booked_at', weekAgo),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('care_home_id', homeId)
      .eq('status', 'moved_in')
      .not('moved_in_at', 'is', null)
      .gte('moved_in_at', weekAgo),
    supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .eq('care_home_id', homeId)
      .eq('status', 'new'),
  ])

  return {
    newEnquiries: newRes.count ?? 0,
    qualified: qualRes.count ?? 0,
    toursBooked: tourRes.count ?? 0,
    moveIns: moveInRes.count ?? 0,
    unreviewedCount: unreviewedRes.count ?? 0,
  }
}
