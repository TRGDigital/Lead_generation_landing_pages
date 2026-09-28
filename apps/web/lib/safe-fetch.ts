import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

// Shared SSRF guard for the free tools that fetch a website the visitor types in.
//
// Only http and https, never localhost or a private, link local, carrier grade NAT or multicast
// address, and the hostname must resolve to public addresses only. Redirects are followed by hand
// (up to 4 hops) so every hop is re-checked, and the body is capped. Returns null on any failure,
// so callers never see an internal error message.

const DEFAULT_UA = 'TRG-SiteChecker/1.0 (+https://www.trgdigital.co.uk)'
const DEFAULT_MAX_BYTES = 1_500_000

export function blockedHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '')
  if (!h || h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal')) return true
  if (isIP(h)) return privateIp(h)
  return false
}

export function privateIp(ip: string): boolean {
  const v = ip.toLowerCase()
  if (isIP(v) === 4) {
    if (/^(127\.|10\.|192\.168\.|169\.254\.|0\.)/.test(v)) return true
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(v)) return true
    if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(v)) return true // carrier-grade NAT
    if (/^(22[4-9]|2[3-5]\d)\./.test(v)) return true // multicast / reserved
    return false
  }
  if (v === '::1' || v === '::') return true
  if (/^f[cd]/.test(v) || /^fe[89ab]/.test(v)) return true // unique local + link local
  const mapped = v.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped?.[1]) return privateIp(mapped[1])
  return false
}

export async function resolvesPublic(host: string): Promise<boolean> {
  if (blockedHost(host)) return false
  if (isIP(host.replace(/^\[|\]$/g, ''))) return true
  try {
    const addrs = await lookup(host, { all: true })
    return addrs.length > 0 && addrs.every((a) => !privateIp(a.address))
  } catch {
    return false
  }
}

export type SafeFetchOptions = { userAgent?: string; maxBytes?: number }

// Fetch a page, following up to 4 redirects by hand so every hop is re-checked against the guard.
export async function safeFetch(
  url: string,
  timeoutMs: number,
  opts: SafeFetchOptions = {},
): Promise<{ url: string; html: string } | null> {
  const userAgent = opts.userAgent ?? DEFAULT_UA
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_BYTES
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    let current = url
    for (let hop = 0; hop < 5; hop++) {
      const u = new URL(current)
      if (!/^https?:$/.test(u.protocol) || !(await resolvesPublic(u.hostname))) return null
      const r = await fetch(current, {
        redirect: 'manual',
        signal: ctrl.signal,
        headers: { 'User-Agent': userAgent, Accept: 'text/html,application/xhtml+xml' },
      })
      if (r.status >= 300 && r.status < 400) {
        const loc = r.headers.get('location')
        if (!loc) return null
        current = new URL(loc, current).toString()
        continue
      }
      if (!r.ok) return null
      const type = r.headers.get('content-type') || ''
      if (type && !/html|xml|text\/plain/i.test(type)) return null
      const html = (await r.text()).slice(0, maxBytes)
      return { url: current, html }
    }
    return null
  } catch {
    return null
  } finally {
    clearTimeout(t)
  }
}
