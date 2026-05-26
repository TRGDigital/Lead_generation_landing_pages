import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createServiceClient } from '@/lib/supabase/server'
import { sendTemplateEmail } from '@lib/sendgrid'
import { verifyCronSecret, logCronRun } from '@/lib/cron'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[cron:daily-summary] Starting')
  const db = createServiceClient() as unknown as any

  const now = new Date()
  // Yesterday 00:00 → 23:59 UK time — approximate via UTC offset
  const todayStart = new Date(now)
  todayStart.setUTCHours(0, 0, 0, 0)
  const yesterdayStart = new Date(todayStart.getTime() - 86_400_000)

  // Active homes with their portal users
  const { data: homes } = await db
    .from('care_homes')
    .select(`
      id, name,
      care_home_users(
        users(email, notification_preferences)
      )
    `)
    .eq('is_active', true)

  const templateId = process.env.SENDGRID_TPL_DAILY_SUMMARY
  const summary = { sent: 0, skipped: 0, errored: 0 }

  for (const home of homes ?? []) {
    const { data: leads } = await db
      .from('leads')
      .select('id, status, qualified, contacted_at, move_in_timeframe, created_at')
      .eq('care_home_id', home.id)
      .gte('created_at', yesterdayStart.toISOString())
      .lt('created_at', todayStart.toISOString())

    if (!leads?.length) { summary.skipped++; continue }

    const totalLeads = leads.length
    const qualifiedCount = leads.filter((l: { qualified: boolean }) => l.qualified).length
    const unreviewedCount = leads.filter((l: { contacted_at: string | null }) => !l.contacted_at).length

    // Users who want email notifications
    const recipients = (home.care_home_users ?? [])
      .map((chu: { users: { email: string; notification_preferences: Record<string, unknown> } }) => chu.users)
      .filter((u: { email: string; notification_preferences: Record<string, unknown> } | null) =>
        u && u.notification_preferences?.email !== false
      )

    if (!recipients.length || !templateId) { summary.skipped++; continue }

    for (const user of recipients) {
      try {
        await sendTemplateEmail({
          to: user.email,
          templateId,
          dynamicData: {
            care_home_name: home.name,
            total_leads: totalLeads,
            qualified_count: qualifiedCount,
            unreviewed_count: unreviewedCount,
            date: yesterdayStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          },
        })
        summary.sent++
      } catch (err) {
        console.error(`[cron:daily-summary] Failed for ${user.email}:`, err)
        Sentry.captureException(err, { extra: { email: '[filtered]', homeId: home.id } })
        summary.errored++
      }
    }
  }

  await logCronRun('daily-summary', summary.errored === 0, summary)
  console.log('[cron:daily-summary] Done', summary)
  return NextResponse.json({ ok: true, summary })
}
