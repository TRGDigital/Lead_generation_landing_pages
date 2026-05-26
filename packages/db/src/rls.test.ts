/**
 * RLS integration tests — run against the real Supabase project.
 * Requires: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_ANON_KEY in env.
 * Tests are skipped (not failed) when env vars are absent (e.g. in contributors' environments).
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const SKIP = !SUPABASE_URL || !SERVICE_KEY || !ANON_KEY

const PREFIX = `rls-test-${Date.now()}`
const userA = { email: `${PREFIX}-a@test.invalid`, password: 'Rls-test-A1!' }
const userB = { email: `${PREFIX}-b@test.invalid`, password: 'Rls-test-B1!' }

let service: SupabaseClient<Database>
let clientA: SupabaseClient<Database>
let clientB: SupabaseClient<Database>

let homeAId: string
let homeBId: string
let leadAId: string
let leadBId: string
let userAId: string
let userBId: string

async function signInAs(email: string, password: string): Promise<SupabaseClient<Database>> {
  const anon = createClient<Database>(SUPABASE_URL, ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data, error } = await anon.auth.signInWithPassword({ email, password })
  if (error ?? !data.session) throw new Error(`Sign in failed: ${error?.message ?? 'no session'}`)
  return createClient<Database>(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${data.session.access_token}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

describe.skipIf(SKIP)('RLS — care home isolation', () => {
  beforeAll(async () => {
    service = createClient<Database>(SUPABASE_URL, SERVICE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Create two auth users
    const { data: ua, error: ueA } = await service.auth.admin.createUser({
      email: userA.email,
      password: userA.password,
      email_confirm: true,
    })
    const { data: ub, error: ueB } = await service.auth.admin.createUser({
      email: userB.email,
      password: userB.password,
      email_confirm: true,
    })
    if (ueA ?? !ua.user) throw new Error(`Create user A: ${ueA?.message}`)
    if (ueB ?? !ub.user) throw new Error(`Create user B: ${ueB?.message}`)
    userAId = ua.user!.id
    userBId = ub.user!.id

    // Create two care homes via service role (bypasses RLS)
    const db = service as unknown as any
    const { data: homes, error: heErr } = await db
      .from('care_homes')
      .insert([
        {
          slug: `${PREFIX}-a`,
          name: 'Test Home A',
          location: 'London',
          postcode: 'SW1 1AA',
          phone_display: '020 0000 0001',
          care_types: ['residential'],
          content: {},
        },
        {
          slug: `${PREFIX}-b`,
          name: 'Test Home B',
          location: 'London',
          postcode: 'SW1 1AB',
          phone_display: '020 0000 0002',
          care_types: ['residential'],
          content: {},
        },
      ])
      .select('id')
    if (heErr ?? homes?.length < 2) throw new Error(`Create homes: ${heErr?.message}`)
    homeAId = homes[0].id as string
    homeBId = homes[1].id as string

    // Assign: user A → home A, user B → home B
    await db.from('care_home_users').insert([
      { care_home_id: homeAId, user_id: userAId, role: 'manager' },
      { care_home_id: homeBId, user_id: userBId, role: 'manager' },
    ])

    // Create one lead per home
    const { data: leads, error: leErr } = await db
      .from('leads')
      .insert([
        {
          care_home_id: homeAId,
          full_name: 'Lead A Person',
          email: 'lead-a@test.invalid',
          phone: '07700000001',
        },
        {
          care_home_id: homeBId,
          full_name: 'Lead B Person',
          email: 'lead-b@test.invalid',
          phone: '07700000002',
        },
      ])
      .select('id')
    if (leErr ?? leads?.length < 2) throw new Error(`Create leads: ${leErr?.message}`)
    leadAId = leads[0].id as string
    leadBId = leads[1].id as string

    // Sign in both users
    clientA = await signInAs(userA.email, userA.password)
    clientB = await signInAs(userB.email, userB.password)
  })

  afterAll(async () => {
    if (!service) return
    const db = service as unknown as any
    if (leadAId ?? leadBId) {
      await db.from('lead_activities').delete().in('lead_id', [leadAId, leadBId].filter(Boolean))
      await db.from('leads').delete().in('id', [leadAId, leadBId].filter(Boolean))
    }
    if (homeAId ?? homeBId) {
      await db.from('care_home_users').delete().in('care_home_id', [homeAId, homeBId].filter(Boolean))
      await db.from('care_homes').delete().in('id', [homeAId, homeBId].filter(Boolean))
    }
    if (userAId) await service.auth.admin.deleteUser(userAId)
    if (userBId) await service.auth.admin.deleteUser(userBId)
  })

  // ── Read isolation ──────────────────────────────────────────────────────────

  it('user A sees only their home in care_homes', async () => {
    const dbA = clientA as unknown as any
    const { data } = await dbA.from('care_homes').select('id').in('id', [homeAId, homeBId])
    const ids = ((data ?? []) as { id: string }[]).map((r) => r.id)
    expect(ids).toContain(homeAId)
    expect(ids).not.toContain(homeBId)
  })

  it('user B sees only their home in care_homes', async () => {
    const dbB = clientB as unknown as any
    const { data } = await dbB.from('care_homes').select('id').in('id', [homeAId, homeBId])
    const ids = ((data ?? []) as { id: string }[]).map((r) => r.id)
    expect(ids).toContain(homeBId)
    expect(ids).not.toContain(homeAId)
  })

  it('user A sees only their lead', async () => {
    const dbA = clientA as unknown as any
    const { data } = await dbA.from('leads').select('id').in('id', [leadAId, leadBId])
    const ids = ((data ?? []) as { id: string }[]).map((r) => r.id)
    expect(ids).toContain(leadAId)
    expect(ids).not.toContain(leadBId)
  })

  it('user B sees only their lead', async () => {
    const dbB = clientB as unknown as any
    const { data } = await dbB.from('leads').select('id').in('id', [leadAId, leadBId])
    const ids = ((data ?? []) as { id: string }[]).map((r) => r.id)
    expect(ids).toContain(leadBId)
    expect(ids).not.toContain(leadAId)
  })

  // ── SECURITY DEFINER functions ──────────────────────────────────────────────

  it('client_update_campaign succeeds on own home', async () => {
    const { error } = await clientA.rpc('client_update_campaign', {
      p_care_home_id: homeAId,
      p_is_active: false,
      p_bed_target: 5,
    })
    expect(error).toBeNull()
  })

  it('client_update_campaign rejects access to foreign home', async () => {
    const { error } = await clientA.rpc('client_update_campaign', {
      p_care_home_id: homeBId,
      p_is_active: true,
      p_bed_target: 3,
    })
    expect(error).not.toBeNull()
  })

  it('client_update_lead_status succeeds on own lead', async () => {
    const { error } = await clientA.rpc('client_update_lead_status', {
      p_lead_id: leadAId,
      p_status: 'contacted',
    })
    expect(error).toBeNull()
  })

  it('client_update_lead_status rejects access to foreign lead', async () => {
    const { error } = await clientA.rpc('client_update_lead_status', {
      p_lead_id: leadBId,
      p_status: 'contacted',
    })
    expect(error).not.toBeNull()
  })

  it('client_qualify_lead rejects access to foreign lead', async () => {
    const { error } = await clientA.rpc('client_qualify_lead', {
      p_lead_id: leadBId,
      p_qualified: true,
    })
    expect(error).not.toBeNull()
  })

  it('lead_activities are isolated by care home', async () => {
    // After status update in the test above, lead A has an activity entry
    const dbA = clientA as unknown as any
    const { data } = await dbA
      .from('lead_activities')
      .select('id')
      .eq('lead_id', leadAId)
    expect((data ?? []).length).toBeGreaterThan(0)

    // User A should not see activities for lead B
    const { data: crossData } = await dbA
      .from('lead_activities')
      .select('id')
      .eq('lead_id', leadBId)
    expect((crossData ?? []).length).toBe(0)
  })
})
