import { type NextRequest, NextResponse } from 'next/server'
import { getWebsiteBySlug } from '@/lib/websites'
import { createServiceClient } from '@/lib/supabase/server'
import { tts, cacheKey, ttsProvider } from '@/lib/tts'

// Neural audio of a site's "Read-aloud welcome" (accessibility_intro), for the
// warm "Listen to page" button on client sites. Generated once per site and
// cached in Supabase Storage, so repeat plays are free. Returns { url, text }:
// when no provider is configured (or generation fails) url is null and the site
// falls back to the browser voice reading `text`.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

const BUCKET = 'tts-cache'
const MAX_CHARS = 3000

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('site') || ''
  const site = slug ? await getWebsiteBySlug(slug) : null
  const text = (site?.accessibility_intro || '').replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS)

  const json = (body: unknown) =>
    NextResponse.json(body, { headers: { ...CORS, 'Cache-Control': 'public, max-age=300' } })

  if (!text) return json({ url: null, text: '' })
  // No neural provider configured — the site reads `text` with the browser voice.
  if (!ttsProvider()) return json({ url: null, text })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const path = `${slug}/${cacheKey(text)}.mp3`
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`

  // Cache hit? (public bucket — a HEAD confirms the object exists.)
  try {
    const head = await fetch(publicUrl, { method: 'HEAD' })
    if (head.ok) return json({ url: publicUrl, text })
  } catch { /* fall through to generate */ }

  // Generate + cache.
  try {
    const audio = await tts(text)
    if (!audio) return json({ url: null, text }) // provider failed — browser fallback
    const db = createServiceClient() as unknown as { storage: { from: (b: string) => { upload: (p: string, body: Buffer, o: Record<string, unknown>) => Promise<{ error: unknown }> } } }
    const { error } = await db.storage.from(BUCKET).upload(path, audio, { contentType: 'audio/mpeg', upsert: true })
    if (error) { console.error('tts cache upload', error); return json({ url: null, text }) }
    return json({ url: publicUrl, text })
  } catch (e) {
    console.error('accessibility-tts', e)
    return json({ url: null, text })
  }
}
