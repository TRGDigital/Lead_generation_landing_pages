import { sendHtmlEmail } from '@lib/sendgrid'
import { createServiceClient } from '@/lib/supabase/server'
import { renderEmailHtml, SITE } from './layout'
import { SEQUENCE, SEQUENCE_BY_ID } from './sequence'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Db = any

const REPLY_TO = 'lenny@trgdigital.co.uk'
const FROM_NAME = 'TRG Digital'
function fromEmail(): string {
  return process.env.TRG_FROM_EMAIL ?? process.env.SENDGRID_FROM_EMAIL ?? 'leads@careassura.com'
}

export type EnrollResult = { id: string; unsubscribe_token: string; status: string } | null

// Upsert an enrollment keyed on the lower-cased email. Returns the row and whether
// it was newly created (so the caller can fire the day-0 welcome only once).
export async function enrollLead(opts: {
  db?: Db
  leadId?: string | null
  email: string
  name?: string | null
  toolSlug?: string | null
}): Promise<{ enrollment: EnrollResult; isNew: boolean }> {
  const db: Db = opts.db ?? (createServiceClient() as Db)
  const email = opts.email.trim()

  const { data: existing } = await db
    .from('nurture_enrollments')
    .select('id, unsubscribe_token, status')
    .ilike('email', email)
    .maybeSingle()

  if (existing) return { enrollment: existing, isNew: false }

  const { data: created, error } = await db
    .from('nurture_enrollments')
    .insert({ lead_id: opts.leadId ?? null, email, name: opts.name ?? null, tool_slug: opts.toolSlug ?? null })
    .select('id, unsubscribe_token, status')
    .single()

  if (error) {
    // Likely a race on the unique email index; re-read.
    const { data: again } = await db
      .from('nurture_enrollments')
      .select('id, unsubscribe_token, status')
      .ilike('email', email)
      .maybeSingle()
    return { enrollment: again ?? null, isNew: false }
  }
  return { enrollment: created, isNew: true }
}

// Render + send one sequence email. Records a nurture_sends row first (so the
// SendGrid Event Webhook can tie delivered/opened/clicked back via custom_args),
// and removes it again if the send fails so the cron can retry.
export async function sendNurtureEmail(opts: {
  db?: Db
  emailId: string
  to: string
  name?: string | null
  enrollmentId?: string | null
  unsubscribeToken?: string | null
  isPreview?: boolean
}): Promise<{ ok: boolean; sendId?: string; error?: string }> {
  const email = SEQUENCE_BY_ID[opts.emailId]
  if (!email) return { ok: false, error: `unknown email '${opts.emailId}'` }

  const db: Db = opts.db ?? (createServiceClient() as Db)

  const { data: row, error: insErr } = await db
    .from('nurture_sends')
    .insert({
      enrollment_id: opts.enrollmentId ?? null,
      email_id: email.id,
      recipient: opts.to,
      is_preview: opts.isPreview ?? false,
    })
    .select('id')
    .single()

  if (insErr || !row) return { ok: false, error: insErr?.message ?? 'failed to record send' }

  const token = opts.unsubscribeToken ?? 'preview'
  const unsubscribeUrl = `${SITE}/api/nurture/unsubscribe?t=${encodeURIComponent(token)}`
  const html = renderEmailHtml({
    subject: email.subject,
    preheader: email.preheader,
    bodyHtml: email.body({ name: opts.name ?? undefined }),
    unsubscribeUrl,
  })

  try {
    await sendHtmlEmail({
      to: opts.to,
      toName: opts.name ?? undefined,
      subject: opts.isPreview ? `[Preview] ${email.subject}` : email.subject,
      html,
      fromEmail: fromEmail(),
      fromName: FROM_NAME,
      replyTo: REPLY_TO,
      customArgs: { nsend: row.id, nemail: email.id, ntype: 'nurture' },
    })
  } catch (err) {
    // Roll back the ledger row so this email is retried on the next run.
    await db.from('nurture_sends').delete().eq('id', row.id)
    return { ok: false, error: err instanceof Error ? err.message : 'send failed' }
  }

  return { ok: true, sendId: row.id }
}

// Count working days (Mon-Fri) strictly after `from` up to and including today (UTC).
export function workingDaysSince(from: string | Date): number {
  const start = new Date(from)
  const startDay = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
  const now = new Date()
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  let count = 0
  for (let d = startDay + 86400000; d <= today; d += 86400000) {
    const dow = new Date(d).getUTCDay() // 0 Sun .. 6 Sat
    if (dow !== 0 && dow !== 6) count++
  }
  return count
}

export { SEQUENCE }
