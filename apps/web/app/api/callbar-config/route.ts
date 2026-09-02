import { type NextRequest, NextResponse } from 'next/server'
import { getWebsiteBySlug } from '@/lib/websites'

// Config for the embeddable sticky click-to-call bar (callbar.js) on client sites.
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
  if (!site || !site.callbar_enabled || !site.callbar_phone) {
    return NextResponse.json({ enabled: false }, { headers: { ...CORS, 'Cache-Control': 'public, max-age=120' } })
  }
  return NextResponse.json(
    {
      enabled: true,
      phone: site.callbar_phone,
      label: site.callbar_label || 'Speak to our team',
      color: site.overlay_color || '#F0532B',
      desktop: site.callbar_desktop,
      // Call-back capture. `hours` lets the snippet decide, in the visitor's own local time,
      // whether a call would actually be answered right now.
      callback: !!site.callbar_callback_enabled,
      hours: site.callbar_hours ?? null,
      callbackNote: site.callbar_callback_note || null,
      orgName: site.name || null,
    },
    { headers: { ...CORS, 'Cache-Control': 'public, max-age=120' } },
  )
}
