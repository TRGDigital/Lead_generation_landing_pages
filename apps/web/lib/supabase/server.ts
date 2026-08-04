import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '../../../../packages/db/src/types'

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> }

// Next 14 puts fetch() responses in the Data Cache (which survives deploys), so
// Supabase REST reads can go stale — e.g. a site's tools_enabled kept serving an
// old value after the admin ticked new tools. Force every Supabase call to skip it.
const freshFetch: typeof fetch = (url, opts) => fetch(url, { ...opts, cache: 'no-store' })

export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: freshFetch },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — middleware handles session refresh.
          }
        },
      },
    }
  )
}

export function createServiceClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: { fetch: freshFetch },
      cookies: {
        getAll() {
          return []
        },
        setAll(_cookiesToSet: CookieToSet[]) {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
