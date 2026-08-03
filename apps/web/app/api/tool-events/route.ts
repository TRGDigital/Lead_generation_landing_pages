import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { TOOL_KEYS } from '@/lib/family-tools'

// Records anonymous usage of the free /tools (view + first interaction) so we can see whether the
// gateway tools are actually being used. Public + best-effort. No PII: just the tool slug, event
// type, a random client session id, the path and (for tools embedded on a client site) the site slug.

const TOOLS = new Set([
  // TRG's own B2B gateway tools on trgdigital.co.uk
  'funding-calculator',
  'empty-bed-calculator',
  'funding-mix-calculator',
  'website-grader',
  'cqc-rating-checker',
  'google-preview',
  // Family tools embedded on client sites (/embed/tools/<tool>?site=<slug>)
  ...TOOL_KEYS,
])
const EVENTS = new Set(['view', 'engaged', 'cta'])

export async function POST(req: NextRequest) {
  try {
    const b = (await req.json().catch(() => ({}))) as {
      tool?: string
      event?: string
      sessionId?: string
      path?: string
      site?: string
    }
    const tool = String(b?.tool ?? '')
    const event = String(b?.event ?? '')
    if (!TOOLS.has(tool) || !EVENTS.has(event)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const db = createServiceClient() as unknown as any
    await db.from('tool_events').insert({
      tool,
      event,
      session_id: b.sessionId ? String(b.sessionId).slice(0, 64) : null,
      path: b.path ? String(b.path).slice(0, 200) : null,
      site: b.site ? String(b.site).slice(0, 80) : null,
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
