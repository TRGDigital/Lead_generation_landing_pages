import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getWebsite } from '@/lib/websites'
import { sendCallbackEmail } from '@/lib/callback-email'

// The safety net behind call back notifications.
//
// A call back is emailed once the visitor finishes the follow-up questions. Plenty never do:
// they close the tab, lose signal, or simply stop. This runs every minute and sends anything
// still waiting after a short grace period, with whatever answers were given, so a request can
// never be captured and then sit there unsent.
export const dynamic = 'force-dynamic'

// Long enough for someone to work through four questions, short enough that a provider is not
// left waiting on a call back that has already come in.
const GRACE_MS = 90 * 1000

export async function GET() {
  const db = createServiceClient() as unknown as any
  const cutoff = new Date(Date.now() - GRACE_MS).toISOString()

  const { data: pending } = await db
    .from('organic_leads')
    .select('id, website_id, name, phone, email, message, answers, created_at')
    .eq('trigger', 'callback')
    .is('notified_at', null)
    .lt('created_at', cutoff)
    .order('created_at', { ascending: true })
    .limit(25)

  if (!pending?.length) return NextResponse.json({ ok: true, sent: 0 })

  const sites = new Map<string, Awaited<ReturnType<typeof getWebsite>>>()
  let sent = 0
  for (const lead of pending) {
    if (!sites.has(lead.website_id)) sites.set(lead.website_id, await getWebsite(lead.website_id))
    const site = sites.get(lead.website_id)
    if (!site) continue
    if (await sendCallbackEmail(db, site, lead)) sent += 1
  }

  return NextResponse.json({ ok: true, considered: pending.length, sent })
}
