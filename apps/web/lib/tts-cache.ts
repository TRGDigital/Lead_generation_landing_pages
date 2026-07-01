// Generate + cache the neural audio for a site's "Read-aloud welcome" in Supabase
// Storage. Shared by the /api/accessibility-tts endpoint (on demand) and the admin
// Save action (pre-warm), so the stored clip always matches the current welcome.

import { createServiceClient } from '@/lib/supabase/server'
import { tts, cacheKey, ttsProvider } from '@/lib/tts'

const BUCKET = 'tts-cache'
const MAX_CHARS = 20000 // sane ceiling for a spoken welcome (~15 min of audio)
const CHUNK_CHARS = 3800 // stay under OpenAI TTS's 4096-char per-request limit

export function normaliseWelcome(text: string): string {
  return (text || '').replace(/\s+/g, ' ').trim().slice(0, MAX_CHARS)
}

// Split long text into <=CHUNK_CHARS pieces, preferring sentence boundaries so
// each piece reads naturally (OpenAI TTS caps a single request at 4096 chars).
function chunkForTts(text: string): string[] {
  if (text.length <= CHUNK_CHARS) return [text]
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text]
  const chunks: string[] = []
  let cur = ''
  for (const s of sentences) {
    if (cur && (cur.length + s.length) > CHUNK_CHARS) {
      chunks.push(cur.trim())
      cur = ''
    }
    // A single sentence longer than the limit: hard-split it.
    if (s.length > CHUNK_CHARS) {
      for (let i = 0; i < s.length; i += CHUNK_CHARS) chunks.push(s.slice(i, i + CHUNK_CHARS).trim())
    } else {
      cur += s
    }
  }
  if (cur.trim()) chunks.push(cur.trim())
  return chunks.filter(Boolean)
}

// Returns the public URL of the cached MP3 (generating + uploading if needed), or
// null when no neural provider is configured / generation fails. Keyed by website
// id + a content hash, so changing the welcome text produces a new, correct clip.
export async function ensureWelcomeAudio(websiteId: string, rawText: string): Promise<string | null> {
  const text = normaliseWelcome(rawText)
  if (!text || !ttsProvider()) return null

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const path = `${websiteId}/${cacheKey(text)}.mp3`
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`

  // Already cached for this exact text + voice?
  try {
    const head = await fetch(publicUrl, { method: 'HEAD' })
    if (head.ok) return publicUrl
  } catch {
    /* fall through to generate */
  }

  // Generate each chunk and stitch the MP3s into one clip (browsers play back
  // concatenated MP3 frames fine). Any chunk failing aborts to the browser voice.
  const parts: Buffer[] = []
  for (const chunk of chunkForTts(text)) {
    const part = await tts(chunk)
    if (!part) return null
    parts.push(part)
  }
  const audio = Buffer.concat(parts)
  if (!audio.length) return null
  const db = createServiceClient() as unknown as {
    storage: { from: (b: string) => { upload: (p: string, body: Buffer, o: Record<string, unknown>) => Promise<{ error: unknown }> } }
  }
  const { error } = await db.storage.from(BUCKET).upload(path, audio, { contentType: 'audio/mpeg', upsert: true })
  if (error) { console.error('tts cache upload', error); return null }
  return publicUrl
}
