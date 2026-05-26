import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createServiceClient } from '@/lib/supabase/server'
import { getCampaignSpend } from '@/lib/google-ads'
import { verifyCronSecret, logCronRun } from '@/lib/cron'

export const runtime = 'nodejs'
export const maxDuration = 300

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[cron:google-ads-sync] Starting')
  const today = toDateString(new Date())
  const yesterday = toDateString(new Date(Date.now() - 86_400_000))

  const db = createServiceClient() as unknown as any
  const { data: homes } = await db
    .from('care_homes')
    .select('id, name, google_ads_customer_id, google_ads_campaign_id')
    .not('google_ads_campaign_id', 'is', null)

  const results = { success: 0, failed: 0, skipped: 0 }

  for (const home of homes ?? []) {
    if (!home.google_ads_customer_id) { results.skipped++; continue }
    try {
      const rows = await getCampaignSpend(home.google_ads_customer_id, yesterday, today)
      for (const row of rows) {
        await db.from('campaign_spend').upsert({
          care_home_id: home.id,
          date: row.date,
          source: `google_ads:${row.campaignId}`,
          impressions: row.impressions,
          clicks: row.clicks,
          spend_pennies: Math.round(row.costMicros / 10_000), // micros → pennies
        }, { onConflict: 'care_home_id,date,source' })
      }
      // Mark last synced
      await db.from('care_homes').update({ google_ads_last_synced_at: new Date().toISOString() }).eq('id', home.id)
      results.success++
    } catch (err) {
      console.error(`[cron:google-ads-sync] Failed for ${home.name}:`, err)
      Sentry.captureException(err, { extra: { homeName: home.name, homeId: home.id } })
      results.failed++
    }
  }

  // Alert if >50% of homes fail
  const total = results.success + results.failed
  if (total > 0 && results.failed / total > 0.5) {
    Sentry.captureMessage(`[google-ads-sync] >50% of homes failed (${results.failed}/${total})`, 'error')
  }

  await logCronRun('google-ads-sync', results.failed === 0, results)
  console.log('[cron:google-ads-sync] Done', results)
  return NextResponse.json({ ok: true, summary: results })
}
