'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'

// Ticking an audit finding off has to work whether or not a row exists yet: the list
// is derived from the audit each time, and a task only becomes a row the moment
// something happens to it.

type Upsert = {
  fingerprint: string
  kind?: 'audit' | 'content' | 'manual'
  host?: string | null
  clientName?: string | null
  title: string
  detail?: string
  category?: string | null
  severity?: string | null
  status: 'open' | 'done' | 'skipped'
  doneNote?: string | null
}

async function save(t: Upsert) {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const done = t.status === 'done'
  const { error } = await db.from('daily_tasks').upsert(
    {
      fingerprint: t.fingerprint,
      kind: t.kind ?? 'audit',
      host: t.host ?? null,
      client_name: t.clientName ?? null,
      title: t.title,
      detail: t.detail ?? null,
      category: t.category ?? null,
      severity: t.severity ?? null,
      status: t.status,
      done_at: done ? new Date().toISOString() : null,
      done_note: done ? (t.doneNote ?? null) : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'fingerprint' },
  )
  if (error) throw new Error(error.message)
  revalidatePath('/admin/today')
}

export async function completeTask(fd: FormData) {
  await save({
    fingerprint: String(fd.get('fingerprint') ?? ''),
    kind: (String(fd.get('kind') ?? 'audit') as Upsert['kind']),
    host: String(fd.get('host') ?? '') || null,
    clientName: String(fd.get('clientName') ?? '') || null,
    title: String(fd.get('title') ?? ''),
    detail: String(fd.get('detail') ?? ''),
    category: String(fd.get('category') ?? '') || null,
    severity: String(fd.get('severity') ?? '') || null,
    status: 'done',
    doneNote: String(fd.get('doneNote') ?? '') || null,
  })
}

/** Put it back on the list. Used when something was ticked off by mistake. */
export async function reopenTask(fd: FormData) {
  await save({
    fingerprint: String(fd.get('fingerprint') ?? ''),
    kind: (String(fd.get('kind') ?? 'audit') as Upsert['kind']),
    host: String(fd.get('host') ?? '') || null,
    clientName: String(fd.get('clientName') ?? '') || null,
    title: String(fd.get('title') ?? ''),
    detail: String(fd.get('detail') ?? ''),
    category: String(fd.get('category') ?? '') || null,
    severity: String(fd.get('severity') ?? '') || null,
    status: 'open',
  })
}

/** Not today. Stays open, drops out of the six until the date given. */
export async function snoozeTask(fd: FormData) {
  await requireAdmin()
  const days = Number(fd.get('days') ?? 7) || 7
  const until = new Date()
  until.setDate(until.getDate() + days)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  await db.from('daily_tasks').upsert(
    {
      fingerprint: String(fd.get('fingerprint') ?? ''),
      kind: String(fd.get('kind') ?? 'audit'),
      host: String(fd.get('host') ?? '') || null,
      client_name: String(fd.get('clientName') ?? '') || null,
      title: String(fd.get('title') ?? ''),
      detail: String(fd.get('detail') ?? '') || null,
      category: String(fd.get('category') ?? '') || null,
      severity: String(fd.get('severity') ?? '') || null,
      status: 'open',
      snoozed_to: until.toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'fingerprint' },
  )
  revalidatePath('/admin/today')
}

export async function addManualTask(fd: FormData) {
  const title = String(fd.get('title') ?? '').trim()
  if (!title) return
  await save({
    fingerprint: `manual|${Date.now()}|${title.toLowerCase().slice(0, 60)}`,
    kind: 'manual',
    host: String(fd.get('host') ?? '') || null,
    clientName: String(fd.get('clientName') ?? '') || null,
    title,
    detail: '',
    category: 'manual',
    severity: String(fd.get('severity') ?? 'medium'),
    status: 'open',
  })
}
