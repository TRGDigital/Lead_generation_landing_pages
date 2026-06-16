'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { BuyerFormSchema } from '@lib/schemas'

function buildInput(fd: FormData) {
  const price = fd.get('price_per_lead')
  const cap = fd.get('monthly_cap')
  return {
    name: fd.get('name'),
    contact_email: (fd.get('contact_email') as string) ?? '',
    contact_phone: (fd.get('contact_phone') as string) ?? '',
    areas: fd.getAll('areas').map(String).filter(Boolean),       // multi-select of landing-page areas
    care_types: fd.getAll('care_types').map(String).filter(Boolean), // multi-select of care types
    price_per_lead_pennies: price ? Math.round(Number(price) * 100) : undefined,
    monthly_cap: cap ? Number(cap) : undefined,
    notify_email: fd.get('notify_email') === 'true',
    notify_sms: fd.get('notify_sms') === 'true',
    active: fd.get('active') === 'true',
    notes: (fd.get('notes') as string) ?? '',
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
  const parsed = BuyerFormSchema.safeParse(buildInput(formData))
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
  const parsed = BuyerFormSchema.safeParse(buildInput(formData))
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
