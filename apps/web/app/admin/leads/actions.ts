'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { LeadStatusUpdateSchema } from '@lib/schemas'
import { distributeLead } from '@/lib/distribution'

type LeadStatusInput = {
  leadId: string
  status: string
  note?: string
  weeklyFeePennies?: number
  disqualificationReason?: string
}

export async function updateLeadStatus(input: LeadStatusInput) {
  const user = await requireAdmin()

  const parsed = LeadStatusUpdateSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Invalid input', issues: parsed.error.issues }
  }

  const { leadId, status, note, weeklyFeePennies, disqualificationReason } = parsed.data
  const supabase = createServiceClient()

  const timestampField = statusToTimestampField(status)
  const timestampUpdate = timestampField ? { [timestampField]: new Date().toISOString() } : {}

  const updatePayload = {
    status,
    ...timestampUpdate,
    ...(weeklyFeePennies !== undefined ? { weekly_fee_pennies: weeklyFeePennies } : {}),
    ...(disqualificationReason !== undefined
      ? { disqualification_reason: disqualificationReason }
      : {}),
  }

  // ADR-002: cast db to any — leads update/insert parameter types resolve to never
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any
  const { error } = await db.from('leads').update(updatePayload).eq('id', leadId)

  if (error) return { error: (error as { message: string }).message }

  // Log activity
  await db.from('lead_activities').insert({
    lead_id: leadId,
    type: 'status_change',
    new_value: status,
    note: note ?? null,
    performed_by: user.id,
  })

  revalidatePath(`/admin/leads/${leadId}`)
  revalidatePath('/admin/leads')
  revalidatePath('/admin')

  return { success: true }
}

export async function distributeLeadAction(leadId: string, buyerIds: string[]) {
  const user = await requireAdmin()
  if (!Array.isArray(buyerIds) || buyerIds.length === 0) {
    return { error: 'Select at least one buyer' }
  }
  const results = await distributeLead(leadId, buyerIds, user.id)
  revalidatePath(`/admin/leads/${leadId}`)
  revalidatePath('/admin/leads')
  return { success: true, results }
}

export async function addLeadNote(leadId: string, note: string) {
  const user = await requireAdmin()
  if (!note.trim()) return { error: 'Note cannot be empty' }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  await db.from('lead_activities').insert({
    lead_id: leadId,
    type: 'note_added',
    note,
    performed_by: user.id,
  })

  revalidatePath(`/admin/leads/${leadId}`)
  return { success: true }
}

function statusToTimestampField(status: string): string | null {
  const map: Record<string, string> = {
    contacted: 'contacted_at',
    tour_booked: 'tour_booked_at',
    tour_completed: 'tour_completed_at',
    assessed: 'assessed_at',
    moved_in: 'moved_in_at',
    lost: 'lost_at',
  }
  return map[status] ?? null
}
