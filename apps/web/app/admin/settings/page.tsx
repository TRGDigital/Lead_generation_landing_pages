import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

async function getProfile() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export default async function SettingsPage() {
  await requireAdmin()
  const user = await getProfile()

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <section className="space-y-4">
        <h2 className="font-medium">Account</h2>
        <div className="rounded-lg border bg-card p-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{user?.email ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role</span>
            <span>Admin</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-medium">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Lead alert email and SMS settings are configured via environment variables:
          <code className="ml-1 rounded bg-muted px-1">NOTIFY_EMAIL</code> and{' '}
          <code className="rounded bg-muted px-1">NOTIFY_PHONE</code>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-medium">Integrations</h2>
        <div className="rounded-lg border bg-card divide-y text-sm">
          {[
            { name: 'SendGrid', env: 'SENDGRID_API_KEY' },
            { name: 'Twilio SMS', env: 'TWILIO_ACCOUNT_SID' },
            { name: 'Google Analytics 4', env: 'GA4_MEASUREMENT_ID' },
            { name: 'Vercel KV (rate limiting)', env: 'KV_REST_API_URL' },
          ].map(({ name, env }) => (
            <div key={env} className="flex items-center justify-between px-5 py-3">
              <span>{name}</span>
              <code className="text-xs text-muted-foreground">{env}</code>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
