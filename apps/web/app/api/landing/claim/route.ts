import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { assignHomeToRegion, type CareType } from '@/lib/landing-regions'

// Called by CareAssura when a profile is claimed.
//
// Works out whether the new client's region already has a promoted landing page. If it does,
// they join the rota on it and the existing ad spend starts working harder. If it does not, a
// draft page is created for their area so someone can write it and publish.
//
// Server to server only: the shared secret is the same one CareAssura uses for its other
// platform calls.
export const dynamic = 'force-dynamic'

const schema = z.object({
  home_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  town: z.string().max(120).nullable().optional(),
  postcode: z.string().max(20).nullable().optional(),
  care_type: z.enum(['residential', 'nursing', 'homecare']),
})

export async function POST(req: NextRequest) {
  const secret = process.env.LANDING_CLAIM_SECRET || process.env.ROUTINE_TOKEN || ''
  const given = req.headers.get('x-landing-secret') || ''
  if (!secret || given !== secret) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 422 })

  const db = createServiceClient() as unknown as any
  const out = await assignHomeToRegion(db, {
    home_id: parsed.data.home_id,
    name: parsed.data.name,
    town: parsed.data.town ?? null,
    postcode: parsed.data.postcode ?? null,
    care_type: parsed.data.care_type as CareType,
  })

  if (!out.ok) return NextResponse.json(out, { status: 422 })
  return NextResponse.json(out)
}
