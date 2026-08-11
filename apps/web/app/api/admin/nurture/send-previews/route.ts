import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { verifyCronSecret } from '@/lib/cron'
import { SEQUENCE } from '@/lib/tool-nurture/sequence'
import { sendNurtureEmail } from '@/lib/tool-nurture/send'

export const runtime = 'nodejs'
export const maxDuration = 120

// Sends the whole sequence as previews to one address (default lenny@trgdigital.co.uk),
// one email per sequence day, so the copy and design can be reviewed in a real inbox.
// Auth: an admin session, or the cron secret (Bearer) so it can be triggered server-side.
export async function POST(req: NextRequest) {
  let authed = verifyCronSecret(req)
  if (!authed) {
    try {
      await requireAdmin()
      authed = true
    } catch {
      authed = false
    }
  }
  if (!authed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let to = 'lenny@trgdigital.co.uk'
  let name: string | undefined
  try {
    const b = await req.json()
    if (b?.to) to = String(b.to)
    if (b?.name) name = String(b.name)
  } catch {
    // no body — use defaults
  }

  const results: { id: string; day: number; ok: boolean; error?: string }[] = []
  for (const e of SEQUENCE) {
    const r = await sendNurtureEmail({ emailId: e.id, to, name, isPreview: true })
    results.push({ id: e.id, day: e.day, ok: r.ok, error: r.error })
  }

  return NextResponse.json({ ok: true, to, sent: results.filter((r) => r.ok).length, total: SEQUENCE.length, results })
}
