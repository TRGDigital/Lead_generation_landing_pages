'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requirePortalHome } from '@/lib/portal'

type NotifPrefs = { email_new_lead: boolean; sms_new_lead: boolean }

export async function saveNotificationPrefs(prefs: NotifPrefs) {
  const { userId } = await requirePortalHome()
  // ADR-002: cast to any — users update parameter type resolves to never
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createClient() as any
  const { error } = await db
    .from('users')
    .update({ notification_preferences: prefs })
    .eq('id', userId)
  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/portal/account')
  return { success: true }
}

export async function saveProfile(fullName: string, phone: string) {
  const { userId } = await requirePortalHome()
  // ADR-002
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createClient() as any
  const { error } = await db
    .from('users')
    .update({ full_name: fullName, phone: phone || null })
    .eq('id', userId)
  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/portal/account')
  return { success: true }
}
