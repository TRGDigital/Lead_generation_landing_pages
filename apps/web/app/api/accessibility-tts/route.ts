import { type NextRequest, NextResponse } from 'next/server'
import { getWebsiteBySlug } from '@/lib/websites'
import { ensureWelcomeAudio, normaliseWelcome } from '@/lib/tts-cache'

// Neural audio of a site's "Read-aloud welcome" (accessibility_intro), for the
// warm "Listen to page" button on client sites. Generated once per welcome text
// and cached in Supabase Storage, so repeat plays are free. Returns { url, text }:
// when no provider is configured (or generation fails) url is null and the site
// falls back to the browser voice reading `text`.
//
// The welcome is read LIVE from the DB and keyed by a content hash, so editing it
// in the admin (and saving) yields a fresh clip. `no-store` keeps this immediate.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

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
  const text = normaliseWelcome(site?.accessibility_intro || '')

  const json = (body: unknown) =>
    NextResponse.json(body, { headers: { ...CORS, 'Cache-Control': 'no-store' } })

  if (!site || !text) return json({ url: null, text })

  // TEMP diagnostic (no secrets): ?debug=1 runs the full generate + upload.
  if (req.nextUrl.searchParams.get('debug') === '1') {
    const { ttsProvider, tts } = await import('@/lib/tts')
    const out: Record<string, unknown> = { provider: ttsProvider(), textLen: text.length }
    const t0 = Date.now()
    let audio: Buffer | null = null
    try { audio = await tts(text) } catch (e) { out.genErr = String(e).slice(0, 300) }
    out.genMs = Date.now() - t0
    out.genBytes = audio?.length ?? 0
    if (audio) {
      try {
        const { createServiceClient } = await import('@/lib/supabase/server')
        const db = createServiceClient() as unknown as { storage: { from: (b: string) => { upload: (p: string, body: Buffer, o: Record<string, unknown>) => Promise<{ error: unknown }> } } }
        const { error } = await db.storage.from('tts-cache').upload(`${site.id}/_debug.mp3`, audio, { contentType: 'audio/mpeg', upsert: true })
        out.uploadErr = error ? String((error as { message?: string })?.message ?? JSON.stringify(error)).slice(0, 300) : null
      } catch (e) { out.uploadErr = String(e).slice(0, 300) }
    }
    return json(out)
  }

  try {
    const url = await ensureWelcomeAudio(site.id, text)
    return json({ url, text })
  } catch (e) {
    console.error('accessibility-tts', e)
    return json({ url: null, text })
  }
}
