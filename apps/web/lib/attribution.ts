// First-touch lead attribution for the TRG marketing site. On a visitor's first page
// view we note where they landed, the site that sent them and any UTM tags, then the
// lead forms send it with the enquiry so every marketing_leads row says where it came from.
// Held in memory for the visit; only saved to localStorage (to survive a return visit)
// once the visitor has accepted cookies, matching the consent gate in components/Analytics.

const KEY = 'trg_attr'
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000

export type Attribution = {
  landing_page?: string
  first_referrer?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

type Stored = Attribution & { ts: number }

let memory: Stored | null = null

function consented() {
  try {
    return localStorage.getItem('cookie_consent') === 'accepted'
  } catch {
    return false
  }
}

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Stored
    return Date.now() - parsed.ts < MAX_AGE_MS ? parsed : null
  } catch {
    return null
  }
}

function persist() {
  if (!memory || !consented()) return
  try {
    if (!readStored()) localStorage.setItem(KEY, JSON.stringify(memory))
  } catch {
    // Storage blocked; the in-memory copy still covers this visit.
  }
}

export function captureAttribution() {
  if (!memory) memory = readStored()
  if (memory) return
  try {
    const params = new URLSearchParams(window.location.search)
    const ref = document.referrer
    const external = ref && !ref.startsWith(window.location.origin) ? ref : undefined
    const value: Stored = {
      ts: Date.now(),
      landing_page: (window.location.pathname + window.location.search).slice(0, 500),
      first_referrer: external?.slice(0, 500),
      utm_source: params.get('utm_source') ?? undefined,
      utm_medium: params.get('utm_medium') ?? (params.get('gclid') ? 'cpc' : undefined),
      utm_campaign: params.get('utm_campaign') ?? undefined,
    }
    memory = value
    persist()
    window.addEventListener('cookieConsentAccepted', persist, { once: true })
  } catch {
    // Attribution is best effort.
  }
}

export function getAttribution(): Attribution {
  const value = memory ?? readStored()
  if (!value) return {}
  return {
    landing_page: value.landing_page,
    first_referrer: value.first_referrer,
    utm_source: value.utm_source,
    utm_medium: value.utm_medium,
    utm_campaign: value.utm_campaign,
  }
}

export const HEARD_ABOUT_OPTIONS = [
  'Google search',
  'AI assistant (ChatGPT, Gemini etc.)',
  'LinkedIn',
  'Recommendation',
  'Another care provider',
  'Email from TRG',
  'Other',
] as const
