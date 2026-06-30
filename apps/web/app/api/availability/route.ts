import { type NextRequest, NextResponse } from 'next/server'
import { getWebsiteBySlug } from '@/lib/websites'

// Public availability feed for the embeddable badge (availability.js) on client sites.
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

const COLOR: Record<string, string> = { available: '#16a34a', limited: '#d97706', full: '#dc2626', unknown: '#6b665e' }

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('site') || ''
  const site = slug ? await getWebsiteBySlug(slug) : null
  if (!site) return NextResponse.json({ show: false }, { headers: { ...CORS, 'Cache-Control': 'public, max-age=30' } })

  const status = site.availability_status
  const rooms = site.rooms_available
  const label = status === 'full'
    ? 'Currently full'
    : status === 'unknown'
      ? 'Enquire for availability'
      : rooms > 0
        ? `${rooms} ${rooms === 1 ? 'room' : 'rooms'} available`
        : status === 'limited' ? 'Limited availability' : 'Rooms available'

  // Only advertise availability when there genuinely is some. "Currently full"
  // and "Enquire" (enquiries-only) are hidden from the site.
  return NextResponse.json(
    { show: status === 'available' || status === 'limited', status, rooms, note: site.availability_note, label, color: COLOR[status] || COLOR.unknown },
    { headers: { ...CORS, 'Cache-Control': 'public, max-age=30' } },
  )
}
