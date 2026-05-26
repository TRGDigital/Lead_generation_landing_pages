import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function requireAdmin() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // Explicit cast: supabase-js column-select type inference limitation with this DB format
  const role = (data as { role: string } | null)?.role
  if (role !== 'admin') redirect('/forbidden')

  return user
}

export async function requireClient() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // Explicit cast: supabase-js column-select type inference limitation with this DB format
  const record = data as { role: string } | null
  if (!record) redirect('/forbidden')

  return user
}
