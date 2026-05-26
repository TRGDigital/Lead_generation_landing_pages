import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Settings — Admin' }
export const dynamic = 'force-dynamic'

type CronLog = { cron_name: string; ran_at: string; ok: boolean; summary: Record<string, unknown> | null }

async function getIntegrationHealth() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as unknown as any
  const CRON_NAMES = ['google-ads-sync', 'daily-summary', 'sla-alerts', 'data-retention']

  const [cronResults, lastSyncRes] = await Promise.all([
    Promise.all(
      CRON_NAMES.map((name) =>
        db.from('cron_logs')
          .select('cron_name, ran_at, ok, summary')
          .eq('cron_name', name)
          .order('ran_at', { ascending: false })
          .limit(1)
          .single()
          .catch(() => ({ data: null }))
      )
    ),
    db.from('care_homes')
      .select('name, google_ads_last_synced_at')
      .not('google_ads_campaign_id', 'is', null)
      .order('google_ads_last_synced_at', { ascending: false })
      .limit(1)
      .single()
      .catch(() => ({ data: null })),
  ])

  const cronLogs = cronResults
    .map((r: { data: CronLog | null }) => r.data)
    .filter(Boolean) as CronLog[]

  return { cronLogs, lastGoogleAdsSync: lastSyncRes.data as { name: string; google_ads_last_synced_at: string | null } | null }
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(ms / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const CRON_SCHEDULES = [
  { name: 'google-ads-sync', schedule: 'Hourly (0 * * * *)' },
  { name: 'daily-summary',   schedule: 'Daily 8am (0 8 * * *)' },
  { name: 'sla-alerts',      schedule: 'Every 15 min (*/15 * * * *)' },
  { name: 'data-retention',  schedule: 'Daily 2am (0 2 * * *)' },
]

const INTEGRATIONS: { name: string; envKey: string }[] = [
  { name: 'SendGrid',             envKey: 'SENDGRID_API_KEY' },
  { name: 'SendGrid From Email',  envKey: 'SENDGRID_FROM_EMAIL' },
  { name: 'Twilio SID',           envKey: 'TWILIO_ACCOUNT_SID' },
  { name: 'Google Ads Developer', envKey: 'GOOGLE_ADS_DEVELOPER_TOKEN' },
  { name: 'Google Ads OAuth',     envKey: 'GOOGLE_ADS_CLIENT_ID' },
  { name: 'Mediahawk Webhook',    envKey: 'MEDIAHAWK_WEBHOOK_SECRET' },
  { name: 'Sentry',               envKey: 'NEXT_PUBLIC_SENTRY_DSN' },
  { name: 'Cron Secret',          envKey: 'CRON_SECRET' },
]

export default async function SettingsPage() {
  await requireAdmin()
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { cronLogs, lastGoogleAdsSync } = await getIntegrationHealth()

  return (
    <div className="max-w-3xl space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* Account */}
      <section className="space-y-3">
        <h2 className="font-semibold">Account</h2>
        <div className="rounded-xl border bg-card p-5 text-sm space-y-2">
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

      {/* Integration health */}
      <section className="space-y-3">
        <h2 className="font-semibold">Integration health</h2>
        <div className="rounded-xl border bg-card divide-y text-sm overflow-hidden">
          {INTEGRATIONS.map(({ name, envKey }) => {
            const configured = !!(process.env[envKey])
            return (
              <div key={envKey} className="flex items-center justify-between px-5 py-3">
                <span>{name}</span>
                <div className="flex items-center gap-3">
                  <code className="text-xs text-muted-foreground hidden sm:block">{envKey}</code>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${configured ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {configured ? 'Configured' : 'Missing'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Google Ads last sync */}
      <section className="space-y-3">
        <h2 className="font-semibold">Google Ads</h2>
        <div className="rounded-xl border bg-card p-5 text-sm">
          {lastGoogleAdsSync ? (
            <p className="text-muted-foreground">
              Last sync: <strong>{lastGoogleAdsSync.google_ads_last_synced_at ? timeAgo(lastGoogleAdsSync.google_ads_last_synced_at) : 'never'}</strong>
              {' '}({lastGoogleAdsSync.name})
            </p>
          ) : (
            <p className="text-muted-foreground">No care homes configured with Google Ads campaign IDs yet.</p>
          )}
        </div>
      </section>

      {/* Cron schedules */}
      <section className="space-y-3">
        <h2 className="font-semibold">Cron jobs</h2>
        <div className="rounded-xl border bg-card divide-y text-sm overflow-hidden">
          {CRON_SCHEDULES.map(({ name, schedule }) => {
            const log = cronLogs.find((l) => l.cron_name === name)
            return (
              <div key={name} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-xs text-muted-foreground">{schedule}</p>
                </div>
                <div className="text-right">
                  {log ? (
                    <>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${log.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {log.ok ? 'OK' : 'Failed'}
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(log.ran_at)}</p>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">Never run</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Error tracking */}
      <section className="space-y-3">
        <h2 className="font-semibold">Error tracking</h2>
        <div className="rounded-xl border bg-card p-5 text-sm space-y-2">
          <p className="text-muted-foreground">
            Errors are captured by Sentry. View recent events in the{' '}
            <a
              href="https://sentry.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2"
            >
              Sentry dashboard
            </a>
            .
          </p>
          <p className="text-xs text-muted-foreground">PII (email, phone, name) is scrubbed before transmission.</p>
        </div>
      </section>
    </div>
  )
}
