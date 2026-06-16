import type { VercelKV } from '@vercel/kv'

let kv: VercelKV | null = null

async function getKv() {
  if (kv) return kv
  // Don't even load @vercel/kv unless KV is configured — its proxy throws on
  // access when the env vars are missing.
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) return null
  try {
    const mod = await import('@vercel/kv')
    kv = mod.kv
    return kv
  } catch {
    return null
  }
}

export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const store = await getKv()
  if (!store) {
    return { allowed: true, remaining: limit }
  }

  // Fail open: if KV isn't configured (env missing) the calls throw — never let
  // that break a form submission.
  try {
    const key = `rl:${identifier}`
    const count = await store.incr(key)
    if (count === 1) {
      await store.expire(key, windowSeconds)
    }
    const remaining = Math.max(0, limit - count)
    return { allowed: count <= limit, remaining }
  } catch {
    return { allowed: true, remaining: limit }
  }
}

export async function checkIdempotency(key: string): Promise<boolean> {
  const store = await getKv()
  if (!store) return false
  try {
    const exists = await store.get(`idempotency:${key}`)
    return exists !== null
  } catch {
    return false
  }
}

export async function setIdempotency(key: string, ttlSeconds = 86400): Promise<void> {
  const store = await getKv()
  if (!store) return
  try {
    await store.set(`idempotency:${key}`, '1', { ex: ttlSeconds })
  } catch {
    /* fail open */
  }
}
