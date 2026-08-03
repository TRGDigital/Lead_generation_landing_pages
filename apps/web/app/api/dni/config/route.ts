import { type NextRequest, NextResponse } from 'next/server'
import { getWebsiteBySlug } from '@/lib/websites'
import { getTrackingNumber } from '@/lib/dni'

// Config for dni.js (Dynamic Number Insertion) on client sites: which number to
// show and which canonical formats to replace. Static per site in Phase 1.
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('site') || ''
  const site = slug ? await getWebsiteBySlug(slug) : null
  const tn = site ? await getTrackingNumber(site.id) : null
  if (!site || !tn || !tn.enabled || !tn.twilio_number || !tn.display_number) {
    return NextResponse.json({ enabled: false }, { headers: { ...CORS, 'Cache-Control': 'public, max-age=120' } })
  }
  return NextResponse.json(
    {
      enabled: true,
      display: tn.display_number,
      tel: tn.twilio_number,
      replace: tn.canonical_numbers,
    },
    { headers: { ...CORS, 'Cache-Control': 'public, max-age=120' } },
  )
}
