import { createHmac, timingSafeEqual } from 'node:crypto'
import { createServiceClient } from '@/lib/supabase/server'

// Dynamic Number Insertion (Phase 1): one static Twilio tracking number per website.
// dni.js swaps the number client-side only, so crawlers/GBP keep the canonical number (NAP-safe).

export type TrackingNumber = {
  id: string
  website_id: string
  enabled: boolean
  twilio_number: string // E.164, e.g. +441444416841
  display_number: string // as shown to visitors, e.g. "01444 123 456"
  forward_to: string // E.164 of the home's real line
  canonical_numbers: string[] // formats of the real number to find/replace in page text
  notes: string
  created_at: string
  updated_at: string
}

export type TrackedCall = {
  id: string
  website_id: string
  tracking_number_id: string | null
  twilio_call_sid: string | null
  caller: string | null
  to_number: string | null
  status: string
  outcome: 'answered' | 'missed' | null
  duration_secs: number | null
  started_at: string
  ended_at: string | null
}

export type CallStats = {
  total: number
  last30: number
  missed30: number
  avgDurationSecs: number
}

export async function getTrackingNumber(websiteId: string): Promise<TrackingNumber | null> {
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('tracking_numbers').select('*').eq('website_id', websiteId).maybeSingle()
  return (data as TrackingNumber) ?? null
}

export async function getTrackingNumberByTwilioNumber(twilioNumber: string): Promise<TrackingNumber | null> {
  if (!twilioNumber) return null
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('tracking_numbers').select('*').eq('twilio_number', twilioNumber).maybeSingle()
  return (data as TrackingNumber) ?? null
}

export async function getTrackedCalls(websiteId: string, limit = 50): Promise<TrackedCall[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('tracked_calls')
    .select('*')
    .eq('website_id', websiteId)
    .order('started_at', { ascending: false })
    .limit(limit)
  return (data as TrackedCall[]) ?? []
}

export async function getCallStats(websiteId: string): Promise<CallStats> {
  const db = createServiceClient() as unknown as any
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { count: total } = await db.from('tracked_calls').select('id', { count: 'exact', head: true }).eq('website_id', websiteId)
  const { data: recent } = await db
    .from('tracked_calls')
    .select('outcome, duration_secs')
    .eq('website_id', websiteId)
    .gte('started_at', since)
    .limit(5000)
  const rows = (recent as Array<{ outcome: string | null; duration_secs: number | null }>) ?? []
  const answered = rows.filter((r) => r.outcome === 'answered')
  const totalSecs = answered.reduce((n, r) => n + (r.duration_secs ?? 0), 0)
  return {
    total: total ?? 0,
    last30: rows.length,
    missed30: rows.filter((r) => r.outcome === 'missed').length,
    avgDurationSecs: answered.length ? Math.round(totalSecs / answered.length) : 0,
  }
}

// ── Twilio webhook signature (X-Twilio-Signature) ────────────────────────────
// HMAC-SHA1 over the full public URL + POST params sorted by key, base64.
// https://www.twilio.com/docs/usage/security#validating-requests
export function validateTwilioSignature(url: string, params: Record<string, string>, signature: string): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!token || !signature) return false
  const data = url + Object.keys(params).sort().map((k) => k + params[k]).join('')
  const expected = createHmac('sha1', token).update(Buffer.from(data, 'utf-8')).digest('base64')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature)
  return a.length === b.length && timingSafeEqual(a, b)
}

// The public URL Twilio signed. Vercel serves behind a proxy, so rebuild from a
// fixed public base rather than trusting forwarded headers.
export function publicWebhookUrl(pathname: string, search = ''): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
  return base.replace(/\/$/, '') + pathname + search
}
