import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createServiceClient } from '@/lib/supabase/server'
import { sendTemplateEmail } from '@lib/sendgrid'
import { verifyCronSecret, logCronRun } from '@/lib/cron'

export const runtime = 'nodejs'
export const maxDuration = 60

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[cron:sla-alerts] Starting')
  const db = createServiceClient() as unknown as any
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()

  // Overdue: new leads > 2h old, not contacted, not yet alerted
  const { data: overdue } = await db
    .from('leads')
    .select('id, full_name, phone, care_type, created_at, care_home:care_homes!inner(id, name, is_active)')
    .eq('status', 'new')
    .is('contacted_at', null)
    .is('sla_alerted_at', null)
    .lt('created_at', twoHoursAgo)
    .eq('care_home.is_active', true)

  if (!overdue?.length) {
    await logCronRun('sla-alerts', true, { alerted: 0 })
    return NextResponse.json({ ok: true, summary: { alerted: 0 } })
  }

  // Get admin users for alerting
  const { data: adminUsers } = await db
    .from('users')
    .select('email, notification_preferences')
    .eq('role', 'admin')

  const adminEmails = (adminUsers ?? [])
    .filter((u: { email: string; notification_preferences: Record<string, unknown> }) =>
      u.notification_preferences?.email !== false
    )
    .map((u: { email: string }) => u.email)
    .filter(Boolean)

  const templateId = process.env.SENDGRID_TPL_SLA_ALERT
  const notifyEmail = process.env.NOTIFY_EMAIL ?? adminEmails[0]

  let alerted = 0
  let errored = 0

  for (const lead of overdue) {
    const ageHours = Math.round(
      (Date.now() - new Date(lead.created_at).getTime()) / 3_600_000
    )
    try {
      if (templateId && notifyEmail) {
        await sendTemplateEmail({
          to: notifyEmail,
          templateId,
          dynamicData: {
            lead_id: lead.id,
            full_name: lead.full_name,
            phone: lead.phone,
            care_type: lead.care_type ?? '',
            care_home_name: lead.care_home?.name ?? '',
            age_hours: ageHours,
            admin_url: `${SITE_URL}/admin/leads/${lead.id}`,
          },
        })
      }
      // Mark as alerted (idempotency)
      await db.from('leads').update({ sla_alerted_at: new Date().toISOString() }).eq('id', lead.id)
      alerted++
    } catch (err) {
      console.error(`[cron:sla-alerts] Failed for lead ${lead.id}:`, err)
      Sentry.captureException(err, { extra: { leadId: lead.id } })
      errored++
    }
  }

  const summary = { alerted, errored, total: overdue.length }
  await logCronRun('sla-alerts', errored === 0, summary)
  console.log('[cron:sla-alerts] Done', summary)
  return NextResponse.json({ ok: true, summary })
}
