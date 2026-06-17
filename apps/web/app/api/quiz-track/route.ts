import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// Records a visitor's furthest progress through the care-finder quiz (for funnel
// drop-off analytics). Upsert by the client session id; the client sends its MAX
// step so progress is monotonic. Public + best-effort.
export async function POST(req: NextRequest) {
  try {
    const b = (await req.json().catch(() => ({}))) as {
      sessionId?: string; slug?: string; questionSet?: string; variant?: string; experimentId?: string
      step?: number; total?: number; completed?: boolean; leadId?: string
    }
    const id = String(b?.sessionId ?? '')
    if (!/^[0-9a-fA-F-]{36}$/.test(id)) return NextResponse.json({ ok: false }, { status: 400 })

    const db = createServiceClient() as unknown as any
    await db.from('quiz_sessions').upsert(
      {
        id,
        slug: String(b.slug ?? '').slice(0, 120),
        question_set: String(b.questionSet ?? '').slice(0, 40),
        variant: b.variant ? String(b.variant).slice(0, 40) : null,
        ...(b.experimentId && /^[0-9a-fA-F-]{36}$/.test(b.experimentId) ? { experiment_id: b.experimentId } : {}),
        step_reached: Math.max(0, Math.min(99, Number(b.step) || 0)),
        total_steps: Math.max(0, Math.min(99, Number(b.total) || 0)),
        completed: !!b.completed,
        ...(b.leadId && /^[0-9a-fA-F-]{36}$/.test(b.leadId) ? { lead_id: b.leadId } : {}),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
