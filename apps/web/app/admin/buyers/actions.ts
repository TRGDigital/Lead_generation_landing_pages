'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { BuyerFormSchema } from '@lib/schemas'

function lines(v: FormDataEntryValue | undefined): string[] {
  return typeof v === 'string' ? v.split('\n').map((s) => s.trim()).filter(Boolean) : []
}

function coerce(raw: Record<string, FormDataEntryValue>) {
  return {
    name: raw['name'],
    contact_email: (raw['contact_email'] as string) ?? '',
    contact_phone: (raw['contact_phone'] as string) ?? '',
    areas: lines(raw['areas']),
    care_types: lines(raw['care_types']),
    price_per_lead_pennies: raw['price_per_lead']
      ? Math.round(Number(raw['price_per_lead']) * 100)
      : undefined,
    monthly_cap: raw['monthly_cap'] ? Number(raw['monthly_cap']) : undefined,
    notify_email: raw['notify_email'] === 'true' || raw['notify_email'] === 'on',
    notify_sms: raw['notify_sms'] === 'true' || raw['notify_sms'] === 'on',
    active: raw['active'] === 'true' || raw['active'] === 'on',
    notes: (raw['notes'] as string) ?? '',
  }
}

function toRow(d: ReturnType<typeof BuyerFormSchema.parse>) {
  return {
    name: d.name,
    contact_email: d.contact_email || null,
    contact_phone: d.contact_phone || null,
    areas: d.areas,
    care_types: d.care_types,
    price_per_lead_pennies: d.price_per_lead_pennies ?? null,
    monthly_cap: d.monthly_cap ?? null,
    notify_email: d.notify_email,
    notify_sms: d.notify_sms,
    active: d.active,
    notes: d.notes || null,
    updated_at: new Date().toISOString(),
  }
}

export async function createBuyer(formData: FormData) {
  await requireAdmin()
  const parsed = BuyerFormSchema.safeParse(coerce(Object.fromEntries(formData)))
  if (!parsed.success) return { error: 'Validation failed', issues: parsed.error.issues }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { error } = await db.from('buyers').insert(toRow(parsed.data))
  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/admin/buyers')
  redirect('/admin/buyers')
}

export async function updateBuyer(id: string, formData: FormData) {
  await requireAdmin()
  const parsed = BuyerFormSchema.safeParse(coerce(Object.fromEntries(formData)))
  if (!parsed.success) return { error: 'Validation failed', issues: parsed.error.issues }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { error } = await db.from('buyers').update(toRow(parsed.data)).eq('id', id)
  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/admin/buyers')
  revalidatePath(`/admin/buyers/${id}/edit`)
  redirect('/admin/buyers')
}

export async function toggleBuyerActive(id: string, active: boolean) {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { error } = await db.from('buyers').update({ active, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { error: (error as { message: string }).message }
  revalidatePath('/admin/buyers')
  return { success: true }
}
