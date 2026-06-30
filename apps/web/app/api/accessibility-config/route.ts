import { type NextRequest, NextResponse } from 'next/server'
import { getWebsiteBySlug } from '@/lib/websites'

// Config for the embeddable accessibility toolbar (accessibility.js) on client sites.
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
  if (!site) {
    return NextResponse.json({ enabled: false, intro: '' }, { headers: { ...CORS, 'Cache-Control': 'public, max-age=120' } })
  }
  // `intro` (the read-aloud welcome) is returned regardless of `enabled`, so a
  // site running its own accessibility bar can still read the platform-managed
  // welcome text. `enabled`/`position` only drive the embeddable accessibility.js bar.
  return NextResponse.json(
    {
      enabled: !!site.accessibility_enabled,
      color: site.overlay_color || '#F0532B',
      position: site.accessibility_position || 'bottom-right',
      intro: site.accessibility_intro || '',
    },
    { headers: { ...CORS, 'Cache-Control': 'public, max-age=120' } },
  )
}
