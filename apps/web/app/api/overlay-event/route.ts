import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServiceClient } from '@/lib/supabase/server'
import { getWebsiteBySlug } from '@/lib/websites'

export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const schema = z.object({
  site: z.string().min(1).max(80),
  event: z.enum(['impression', 'start', 'close', 'submit', 'preview', 'question']),
  via: z.string().max(40).optional(),
  pageUrl: z.string().max(500).optional(),
  path: z.string().max(300).optional(),
  device: z.enum(['desktop', 'mobile']).optional(),
  vid: z.string().max(64).optional(),
  step: z.number().int().min(0).max(50).optional(),
  question: z.string().max(300).optional(),
  option: z.string().max(300).optional(),
})

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

// Records an overlay engagement event (impression / start / close / submit) from the embed widget.
export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: CORS })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 422, headers: CORS })

  const { site: slug, event, via, pageUrl, path, device, vid, step, question, option } = parsed.data
  const site = await getWebsiteBySlug(slug)
  if (!site) return NextResponse.json({ error: 'Unknown site' }, { status: 404, headers: CORS })

  const db = createServiceClient() as unknown as any
  await db.from('overlay_events').insert({
    website_id: site.id,
    event,
    via: via ?? null,
    page_url: pageUrl ?? null,
    path: path ?? null,
    device: device ?? null,
    visitor_id: vid ?? null,
    step: step ?? null,
    question: question ?? null,
    option: option ?? null,
  })

  return new NextResponse(null, { status: 204, headers: CORS })
}
