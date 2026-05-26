'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requirePortalHome } from '@/lib/portal'

export async function markContacted(leadId: string) {
  await requirePortalHome()
  // ADR-002: rpc args resolve to `undefined` in strict mode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const { error } = await supabase.rpc('client_update_lead_status', {
    p_lead_id: leadId,
    p_status: 'contacted',
  })
  if (error) return { error: error.message }
  revalidatePath('/portal/enquiries')
  revalidatePath(`/portal/enquiries/${leadId}`)
  return { success: true }
}

export async function updateLeadStatus(leadId: string, status: string, note?: string) {
  await requirePortalHome()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const { error } = await supabase.rpc('client_update_lead_status', {
    p_lead_id: leadId,
    p_status: status,
    ...(note ? { p_note: note } : {}),
  })
  if (error) return { error: error.message }
  revalidatePath('/portal/enquiries')
  revalidatePath(`/portal/enquiries/${leadId}`)
  return { success: true }
}

export async function qualifyLead(
  leadId: string,
  qualified: boolean,
  reason?: string,
  notes?: string
) {
  await requirePortalHome()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const { error } = await supabase.rpc('client_qualify_lead', {
    p_lead_id: leadId,
    p_qualified: qualified,
    ...(reason ? { p_disqualification_reason: reason } : {}),
    ...(notes ? { p_disqualification_notes: notes } : {}),
  })
  if (error) return { error: error.message }
  revalidatePath('/portal/enquiries')
  revalidatePath(`/portal/enquiries/${leadId}`)
  return { success: true }
}

export async function saveNote(leadId: string, note: string) {
  await requirePortalHome()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any
  const { error } = await supabase.rpc('client_save_note', {
    p_lead_id: leadId,
    p_note: note,
  })
  if (error) return { error: error.message }
  revalidatePath(`/portal/enquiries/${leadId}`)
  return { success: true }
}
