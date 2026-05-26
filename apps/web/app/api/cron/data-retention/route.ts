import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyCronSecret, logCronRun } from '@/lib/cron'

export const runtime = 'nodejs'
export const maxDuration = 300

const DRY_RUN = process.env.RETENTION_DRY_RUN === 'true'

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log(`[cron:data-retention] Starting (dry_run=${DRY_RUN})`)
  const db = createServiceClient() as unknown as any

  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 24)

  // Find leads older than 24 months that haven't been anonymised yet
  const { data: candidates, count } = await db
    .from('leads')
    .select('id, full_name, created_at', { count: 'exact' })
    .lt('created_at', cutoff.toISOString())
    .not('full_name', 'eq', 'Anonymised [REDACTED]')

  const candidateCount = count ?? 0

  if (candidateCount === 0) {
    await logCronRun('data-retention', true, { anonymised: 0, dry_run: DRY_RUN })
    return NextResponse.json({ ok: true, summary: { anonymised: 0, dry_run: DRY_RUN } })
  }

  console.log(`[cron:data-retention] ${candidateCount} leads to anonymise (dry_run=${DRY_RUN})`)

  if (DRY_RUN) {
    console.log('[cron:data-retention] DRY RUN — no changes made')
    await logCronRun('data-retention', true, { anonymised: 0, would_anonymise: candidateCount, dry_run: true })
    return NextResponse.json({ ok: true, summary: { would_anonymise: candidateCount, dry_run: true } })
  }

  try {
    const ids = (candidates ?? []).map((r: { id: string }) => r.id)

    // Process in batches of 100 to avoid timeouts
    let anonymised = 0
    for (let i = 0; i < ids.length; i += 100) {
      const batch = ids.slice(i, i + 100)
      const { error } = await db
        .from('leads')
        .update({
          full_name: 'Anonymised [REDACTED]',
          phone: null,
          email: null,
          notes: null,
          ip_address: null,
          user_agent: null,
          message: null,
          resident_name: null,
        })
        .in('id', batch)

      if (error) throw error
      anonymised += batch.length
    }

    const summary = { anonymised, dry_run: false }
    await logCronRun('data-retention', true, summary)
    console.log('[cron:data-retention] Done', summary)
    return NextResponse.json({ ok: true, summary })
  } catch (err) {
    Sentry.captureException(err)
    await logCronRun('data-retention', false, { error: String(err) })
    return NextResponse.json({ ok: false, error: 'Anonymisation failed' }, { status: 500 })
  }
}
