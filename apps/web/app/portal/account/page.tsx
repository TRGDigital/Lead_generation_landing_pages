import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requirePortalHome } from '@/lib/portal'
import { COPY } from '@/lib/copy/portal'
import AccountForm from './AccountForm'
import type { Json } from '@db/types'

export const metadata = { title: COPY.accountTitle }

type NotifPrefs = { email_new_lead: boolean; sms_new_lead: boolean }

function parsePrefs(raw: Json): NotifPrefs {
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    return {
      email_new_lead: Boolean((raw as Record<string, unknown>).email_new_lead ?? true),
      sms_new_lead: Boolean((raw as Record<string, unknown>).sms_new_lead ?? false),
    }
  }
  return { email_new_lead: true, sms_new_lead: false }
}

export default async function AccountPage() {
  const { userId, home } = await requirePortalHome()
  // ADR-002: users select resolves to never in strict mode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createClient() as any

  const { data: userRow } = await db
    .from('users')
    .select('full_name, phone, email, notification_preferences')
    .eq('id', userId)
    .single()

  if (!userRow) redirect('/auth/sign-in')

  const row = userRow as { full_name: string | null; phone: string | null; email: string; notification_preferences: Json }
  const prefs = parsePrefs(row.notification_preferences)

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-semibold">{COPY.accountTitle}</h1>
      <AccountForm
        fullName={row.full_name}
        phone={row.phone}
        email={row.email}
        prefs={prefs}
        home={home}
      />

      {/* Sign out */}
      <form
        action={async () => {
          'use server'
          const sb = createClient()
          await sb.auth.signOut()
          redirect('/auth/sign-in')
        }}
      >
        <button
          type="submit"
          className="w-full rounded-xl border border-destructive/40 py-3 text-sm font-medium text-destructive hover:bg-destructive/5"
        >
          {COPY.signOut}
        </button>
      </form>
    </div>
  )
}
