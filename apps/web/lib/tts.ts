// Neural text-to-speech for the "Listen to page" welcome. Provider-agnostic and
// env-gated: set ELEVENLABS_API_KEY (warmest) or OPENAI_API_KEY to activate. With
// neither set, tts() returns null and callers fall back to the browser voice.
//
// Used only for each site's short, purpose-written "Read-aloud welcome", so the
// output is cached (one clip per site) and cost stays negligible.

import { createHash } from 'crypto'

export type TtsProvider = 'elevenlabs' | 'openai'

export function ttsProvider(): TtsProvider | null {
  if (process.env.ELEVENLABS_API_KEY) return 'elevenlabs'
  if (process.env.OPENAI_API_KEY) return 'openai'
  return null
}

// Warm, natural defaults (British where possible), overridable by env.
const ELEVEN_VOICE = process.env.ELEVENLABS_VOICE_ID || 'Xb7hH8MSUJpSbSDYk0k2' // "Alice" — warm British female
const ELEVEN_MODEL = process.env.ELEVENLABS_MODEL || 'eleven_multilingual_v2'
const OPENAI_VOICE = process.env.OPENAI_TTS_VOICE || 'shimmer' // warm female
const OPENAI_MODEL = process.env.OPENAI_TTS_MODEL || 'gpt-4o-mini-tts'
// gpt-4o-* TTS models take an `instructions` prompt to steer accent/tone. Default
// to a warm British English accent (OpenAI voices are American otherwise).
const OPENAI_INSTRUCTIONS =
  process.env.OPENAI_TTS_INSTRUCTIONS ||
  'Speak in a warm, friendly British English accent (standard UK English / received pronunciation), at a calm, natural, unhurried pace.'
const OPENAI_USE_INSTRUCTIONS = /gpt-4o/i.test(OPENAI_MODEL)

// A stable identifier for the current provider+voice, so cached audio is
// regenerated if you switch provider or voice (it's part of the cache key).
export function ttsVoiceTag(): string {
  const p = ttsProvider()
  if (p === 'elevenlabs') return `el:${ELEVEN_MODEL}:${ELEVEN_VOICE}`
  if (p === 'openai') return `oa:${OPENAI_MODEL}:${OPENAI_VOICE}:${OPENAI_USE_INSTRUCTIONS ? OPENAI_INSTRUCTIONS : ''}`
  return 'none'
}

export function cacheKey(text: string): string {
  return createHash('sha256').update(`${ttsVoiceTag()}::${text}`).digest('hex').slice(0, 40)
}

// Generate MP3 audio for the given text, or null on any failure / no provider.
export async function tts(text: string): Promise<Buffer | null> {
  const provider = ttsProvider()
  if (!provider || !text.trim()) return null
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 55_000)
  try {
    if (provider === 'elevenlabs') {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': process.env.ELEVENLABS_API_KEY as string,
            'content-type': 'application/json',
            accept: 'audio/mpeg',
          },
          body: JSON.stringify({ text, model_id: ELEVEN_MODEL }),
          signal: ctrl.signal,
        },
      )
      if (!res.ok) { console.error('elevenlabs tts', res.status, await res.text().catch(() => '')); return null }
      return Buffer.from(await res.arrayBuffer())
    }
    // openai
    const res = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        voice: OPENAI_VOICE,
        input: text,
        response_format: 'mp3',
        ...(OPENAI_USE_INSTRUCTIONS ? { instructions: OPENAI_INSTRUCTIONS } : {}),
      }),
      signal: ctrl.signal,
    })
    if (!res.ok) { console.error('openai tts', res.status, await res.text().catch(() => '')); return null }
    return Buffer.from(await res.arrayBuffer())
  } catch (e) {
    console.error('tts error', e)
    return null
  } finally {
    clearTimeout(timer)
  }
}
