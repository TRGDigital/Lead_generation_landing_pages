'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getPortalContext, PORTAL_HOME_COOKIE } from '@/lib/portal'

export async function setPortalHome(homeId: string) {
  const { homes } = await getPortalContext()
  if (!homes.find((h) => h.id === homeId)) return { error: 'Forbidden' }
  cookies().set(PORTAL_HOME_COOKIE, homeId, { path: '/', httpOnly: true, sameSite: 'lax' })
  revalidatePath('/portal', 'layout')
  return { success: true }
}

export async function updateCampaign(homeId: string, isActive: boolean, bedTarget: number) {
  const { homes } = await getPortalContext()
  if (!homes.find((h) => h.id === homeId)) return { error: 'Forbidden' }

  // ADR-002: rpc args resolve to `undefined` in strict mode — cast client to any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const { error } = await supabase.rpc('client_update_campaign', {
    p_care_home_id: homeId,
    p_is_active: isActive,
    p_bed_target: bedTarget,
  })

  if (error) return { error: error.message }

  revalidatePath('/portal')
  return { success: true }
}
