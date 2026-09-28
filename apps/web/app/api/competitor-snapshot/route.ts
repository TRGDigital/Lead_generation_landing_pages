import { type NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'
import { getSnapshot, lookupPlace, PlaceError, RADII, SERVICE_TYPES, type ServiceType } from '@/lib/competitor-snapshot'

export const dynamic = 'force-dynamic'
export const maxDuration = 20

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const { allowed } = await checkRateLimit(`competitor-snapshot:${ip}`, 20, 600)
  if (!allowed) {
    return NextResponse.json({ error: 'You have run a lot of searches. Please wait a few minutes and try again.' }, { status: 429 })
  }

  let body: { postcode?: string; service?: string; radius?: number | string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const postcode = String(body.postcode ?? '').trim()
  if (!postcode) return NextResponse.json({ error: 'Please enter a postcode.' }, { status: 400 })
  if (postcode.length > 10) return NextResponse.json({ error: 'That postcode looks too long.' }, { status: 400 })

  const service = String(body.service ?? 'care-home') as ServiceType
  if (!SERVICE_TYPES.includes(service)) return NextResponse.json({ error: 'Please pick a type of service.' }, { status: 400 })

  const radius = Number(body.radius ?? 5)
  if (!(RADII as readonly number[]).includes(radius)) return NextResponse.json({ error: 'Please pick a search radius.' }, { status: 400 })

  let place
  try {
    place = await lookupPlace(postcode)
  } catch (err) {
    if (err instanceof PlaceError) return NextResponse.json({ error: err.message }, { status: err.status })
    return NextResponse.json({ error: 'We could not look up that postcode right now. Please try again in a moment.' }, { status: 502 })
  }

  try {
    const snapshot = await getSnapshot(place, service, radius)
    return NextResponse.json(snapshot)
  } catch (err) {
    console.error('[competitor-snapshot]', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'We could not reach the care register right now. Please try again in a moment.' }, { status: 502 })
  }
}
