'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

function safeRedirect(url: string): string {
  if (!url.startsWith('/') || url.startsWith('//')) return '/'
  return url
}

export async function signIn(formData: FormData) {
  const supabase = createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = safeRedirect((formData.get('redirect') as string) ?? '/admin')

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const params = new URLSearchParams({ error: error.message })
    if (redirectTo !== '/') params.set('redirect', redirectTo)
    redirect(`/auth/sign-in?${params.toString()}`)
  }

  redirect(redirectTo)
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/auth/sign-in')
}
