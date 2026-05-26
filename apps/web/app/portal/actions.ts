'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import * as Sentry from '@sentry/nextjs'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getPortalContext, PORTAL_HOME_COOKIE } from '@/lib/portal'
import { syncCampaignStatus } from '@/lib/google-ads'

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

  // Sync Google Ads — non-blocking; failure must not block the portal toggle
  void (async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = createServiceClient() as unknown as any
      const { data: home } = await db
        .from('care_homes')
        .select('google_ads_customer_id, google_ads_campaign_id')
        .eq('id', homeId)
        .single()
      if (home?.google_ads_customer_id && home?.google_ads_campaign_id) {
        await syncCampaignStatus(home.google_ads_customer_id, home.google_ads_campaign_id, isActive)
      }
    } catch (err) {
      Sentry.captureException(err, { extra: { homeId, isActive } })
      console.error('[portal:updateCampaign] Google Ads sync failed (non-fatal):', err)
    }
  })()

  return { success: true }
}
