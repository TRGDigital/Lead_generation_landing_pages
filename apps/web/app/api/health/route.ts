import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
// No caching — health checks must always be fresh
export const dynamic = 'force-dynamic'

export async function GET() {
  let dbStatus: 'up' | 'down' = 'down'

  try {
    const db = createServiceClient() as unknown as any
    await db.from('care_homes').select('id', { count: 'exact', head: true })
    dbStatus = 'up'
  } catch {
    dbStatus = 'down'
  }

  const ok = dbStatus === 'up'
  return NextResponse.json(
    { ok, db: dbStatus, timestamp: new Date().toISOString() },
    { status: ok ? 200 : 503 }
  )
}
