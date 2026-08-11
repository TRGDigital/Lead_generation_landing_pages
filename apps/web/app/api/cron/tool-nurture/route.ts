import { NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret, logCronRun } from '@/lib/cron'
import { createServiceClient } from '@/lib/supabase/server'
import { SEQUENCE, sendNurtureEmail, workingDaysSince } from '@/lib/tool-nurture/send'

export const runtime = 'nodejs'
export const maxDuration = 120

// Daily nurture drip. For each active enrolment, works out how many working days
// (Mon-Fri) have passed since signup and sends the next due, not-yet-sent email,
// at most one per enrolment per run so the cadence stays gentle and self-heals if
// a day is ever missed. Day 0 (welcome) is sent immediately at enrolment.
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (process.env.NURTURE_ENABLED !== 'true') {
    return NextResponse.json({ ok: true, skipped: 'NURTURE_ENABLED not set' })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const dueEmails = SEQUENCE.filter((e) => e.day > 0).sort((a, b) => a.day - b.day)

  const { data: enrollments } = await db
    .from('nurture_enrollments')
    .select('id, email, name, unsubscribe_token, enrolled_at')
    .eq('status', 'active')

  let sent = 0
  let completed = 0
  const errors: string[] = []

  for (const en of enrollments ?? []) {
    const elapsed = workingDaysSince(en.enrolled_at)

    const { data: already } = await db
      .from('nurture_sends')
      .select('email_id')
      .eq('enrollment_id', en.id)
    const sentIds = new Set((already ?? []).map((r: { email_id: string }) => r.email_id))

    // The earliest due email this enrolment has not yet received.
    const next = dueEmails.find((e) => e.day <= elapsed && !sentIds.has(e.id))
    if (next) {
      const res = await sendNurtureEmail({
        db,
        emailId: next.id,
        to: en.email,
        name: en.name,
        enrollmentId: en.id,
        unsubscribeToken: en.unsubscribe_token,
      })
      if (res.ok) sent++
      else errors.push(`${en.email}/${next.id}: ${res.error}`)
    }

    // Mark the enrolment complete once the final email has gone out.
    const lastId = dueEmails[dueEmails.length - 1]?.id
    if (lastId && (sentIds.has(lastId) || next?.id === lastId)) {
      await db.from('nurture_enrollments').update({ status: 'completed', updated_at: new Date().toISOString() }).eq('id', en.id)
      completed++
    }
  }

  const summary = { enrollments: enrollments?.length ?? 0, sent, completed, errors: errors.slice(0, 20) }
  await logCronRun('tool-nurture', errors.length === 0, summary)
  return NextResponse.json({ ok: true, ...summary })
}
