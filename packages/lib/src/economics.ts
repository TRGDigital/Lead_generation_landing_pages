// All monetary values are in pennies (GBP × 100) for integer precision.

export const DEFAULT_EXPECTED_STAY_WEEKS = 52

// ── Core calculations ─────────────────────────────────────────────────────────

export function calculateCPC(spendPennies: number, clicks: number): number | null {
  if (clicks <= 0) return null
  return Math.round(spendPennies / clicks)
}

export function calculateCPL(spendPennies: number, leads: number): number | null {
  if (leads <= 0) return null
  return Math.round(spendPennies / leads)
}

export function calculateCPQL(spendPennies: number, qualifiedLeads: number): number | null {
  if (qualifiedLeads <= 0) return null
  return Math.round(spendPennies / qualifiedLeads)
}

export function calculateCPM(spendPennies: number, moveIns: number): number | null {
  if (moveIns <= 0) return null
  return Math.round(spendPennies / moveIns)
}

export function calculatePaybackWeeks(
  cpmPennies: number | null,
  weeklyBedValuePennies: number
): number | null {
  if (cpmPennies === null || cpmPennies <= 0) return null
  if (weeklyBedValuePennies <= 0) return null
  return Math.round((cpmPennies / weeklyBedValuePennies) * 10) / 10
}

export function calculateROAS(
  moveIns: Array<{ weeklyFeePennies: number; expectedStayWeeks?: number }>,
  spendPennies: number
): number | null {
  if (spendPennies <= 0 || !moveIns.length) return null
  const totalRevenue = moveIns.reduce(
    (sum, m) => sum + m.weeklyFeePennies * (m.expectedStayWeeks ?? DEFAULT_EXPECTED_STAY_WEEKS),
    0
  )
  if (totalRevenue <= 0) return null
  return Math.round((totalRevenue / spendPennies) * 100) / 100
}

// ── Performance classification ────────────────────────────────────────────────

export type EconomicsRating = 'good' | 'monitor' | 'review' | 'insufficient'

export function classifyPerformance(params: {
  cpmPennies: number | null
  annualBedRevenuePennies: number
  moveInCount: number
}): EconomicsRating {
  const { cpmPennies, annualBedRevenuePennies, moveInCount } = params
  if (moveInCount < 5 || cpmPennies === null || annualBedRevenuePennies <= 0) {
    return 'insufficient'
  }
  const ratio = cpmPennies / annualBedRevenuePennies
  if (ratio < 0.04) return 'good'
  if (ratio < 0.08) return 'monitor'
  return 'review'
}

// ── Response time analysis ────────────────────────────────────────────────────

export function calculateResponseMinutes(
  createdAt: string,
  contactedAt: string | null
): number | null {
  if (!contactedAt) return null
  const ms = new Date(contactedAt).getTime() - new Date(createdAt).getTime()
  return ms < 0 ? null : Math.round(ms / 60_000)
}

export type ResponseTimeBucket = {
  label: string
  minMinutes: number
  maxMinutes: number
  count: number
  pct: number
}

export const RESPONSE_BUCKETS: Array<{ label: string; min: number; max: number }> = [
  { label: '<30 min',  min: 0,    max: 30 },
  { label: '30–60 min', min: 30,  max: 60 },
  { label: '1–2 h',   min: 60,   max: 120 },
  { label: '2–4 h',   min: 120,  max: 240 },
  { label: '4–8 h',   min: 240,  max: 480 },
  { label: '8–24 h',  min: 480,  max: 1440 },
  { label: '>24 h',   min: 1440, max: Infinity },
]

export function buildResponseHistogram(
  responseMinutes: Array<number | null>
): ResponseTimeBucket[] {
  const contacted = responseMinutes.filter((m): m is number => m !== null)
  const total = contacted.length || 1

  return RESPONSE_BUCKETS.map(({ label, min, max }) => {
    const count = contacted.filter((m) => m >= min && m < max).length
    return { label, minMinutes: min, maxMinutes: max, count, pct: Math.round((count / total) * 100) }
  })
}

export function median(values: number[]): number | null {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return Math.round(((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2)
  }
  return sorted[mid] ?? null
}

export function percentile(values: number[], p: number): number | null {
  if (!values.length) return null
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, idx)] ?? null
}

// ── Formatting helpers ────────────────────────────────────────────────────────

export function formatPennies(pennies: number | null): string {
  if (pennies === null) return '—'
  const fractionDigits = pennies % 100 === 0 ? 0 : 2
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(pennies / 100)
}

export function formatMultiplier(value: number | null): string {
  if (value === null) return '—'
  return `${value.toFixed(1)}×`
}

export function formatMinutes(minutes: number | null): string {
  if (minutes === null) return '—'
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}
