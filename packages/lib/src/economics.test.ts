import { describe, it, expect } from 'vitest'
import {
  calculateCPC,
  calculateCPL,
  calculateCPQL,
  calculateCPM,
  calculatePaybackWeeks,
  calculateROAS,
  classifyPerformance,
  calculateResponseMinutes,
  buildResponseHistogram,
  median,
  percentile,
  formatPennies,
  formatMinutes,
} from './economics'

// ── calculateCPC ──────────────────────────────────────────────────────────────

describe('calculateCPC', () => {
  it('calculates correctly', () => expect(calculateCPC(10_000, 100)).toBe(100))
  it('returns null for zero clicks', () => expect(calculateCPC(10_000, 0)).toBeNull())
  it('returns null for negative clicks', () => expect(calculateCPC(10_000, -5)).toBeNull())
  it('returns 0 for zero spend', () => expect(calculateCPC(0, 100)).toBe(0))
  it('rounds to nearest penny', () => expect(calculateCPC(10_000, 3)).toBe(3333))
  it('handles high spend', () => expect(calculateCPC(1_000_000, 1)).toBe(1_000_000))
})

// ── calculateCPL ──────────────────────────────────────────────────────────────

describe('calculateCPL', () => {
  it('calculates correctly', () => expect(calculateCPL(50_000, 10)).toBe(5_000))
  it('returns null for zero leads', () => expect(calculateCPL(50_000, 0)).toBeNull())
  it('returns null for negative leads', () => expect(calculateCPL(50_000, -1)).toBeNull())
  it('returns 0 for zero spend', () => expect(calculateCPL(0, 10)).toBe(0))
})

// ── calculateCPQL ─────────────────────────────────────────────────────────────

describe('calculateCPQL', () => {
  it('calculates correctly', () => expect(calculateCPQL(100_000, 5)).toBe(20_000))
  it('returns null for zero qualified leads', () => expect(calculateCPQL(100_000, 0)).toBeNull())
  it('returns 0 when spend is 0', () => expect(calculateCPQL(0, 5)).toBe(0))
})

// ── calculateCPM ──────────────────────────────────────────────────────────────

describe('calculateCPM', () => {
  it('calculates correctly', () => expect(calculateCPM(200_000, 2)).toBe(100_000))
  it('returns null for zero move-ins', () => expect(calculateCPM(200_000, 0)).toBeNull())
  it('handles one move-in', () => expect(calculateCPM(75_000, 1)).toBe(75_000))
})

// ── calculatePaybackWeeks ─────────────────────────────────────────────────────

describe('calculatePaybackWeeks', () => {
  it('calculates correctly', () => expect(calculatePaybackWeeks(80_000, 80_000)).toBe(1.0))
  it('returns null for null CPM', () => expect(calculatePaybackWeeks(null, 80_000)).toBeNull())
  it('returns null for zero CPM', () => expect(calculatePaybackWeeks(0, 80_000)).toBeNull())
  it('returns null for zero bed value', () => expect(calculatePaybackWeeks(80_000, 0)).toBeNull())
  it('gives 1 decimal precision', () => expect(calculatePaybackWeeks(100_000, 80_000)).toBe(1.3))
})

// ── calculateROAS ─────────────────────────────────────────────────────────────

describe('calculateROAS', () => {
  it('calculates correctly with default 52-week stay', () => {
    const moveIns = [{ weeklyFeePennies: 100_000 }] // £1,000/week × 52 = £52,000
    expect(calculateROAS(moveIns, 10_000_00)).toBe(5.2) // £52k / £10k
  })
  it('returns null for empty move-ins', () => {
    expect(calculateROAS([], 100_000)).toBeNull()
  })
  it('returns null for zero spend', () => {
    expect(calculateROAS([{ weeklyFeePennies: 100_000 }], 0)).toBeNull()
  })
  it('respects custom stay duration', () => {
    const moveIns = [{ weeklyFeePennies: 100_000, expectedStayWeeks: 4 }]
    // Revenue = £1k × 4 = £4k; spend = £1k; ROAS = 4
    expect(calculateROAS(moveIns, 100_000)).toBe(4.0)
  })
  it('returns null when weekly fees are zero', () => {
    expect(calculateROAS([{ weeklyFeePennies: 0 }], 100_000)).toBeNull()
  })
})

// ── classifyPerformance ───────────────────────────────────────────────────────

describe('classifyPerformance', () => {
  const annualRevenue = 5_200_000 // £52,000 p.a.

  it('classifies as good when CPM < 4% of annual revenue', () => {
    // CPM = £2,000 = 200_000p; annual = £52k = 5_200_000p; ratio = 3.8%
    expect(classifyPerformance({ cpmPennies: 200_000, annualBedRevenuePennies: annualRevenue, moveInCount: 10 }))
      .toBe('good')
  })
  it('classifies as monitor when CPM is 4–8%', () => {
    // CPM = £3,000; ratio = 5.8%
    expect(classifyPerformance({ cpmPennies: 300_000, annualBedRevenuePennies: annualRevenue, moveInCount: 10 }))
      .toBe('monitor')
  })
  it('classifies as review when CPM > 8%', () => {
    // CPM = £5,000; ratio = 9.6%
    expect(classifyPerformance({ cpmPennies: 500_000, annualBedRevenuePennies: annualRevenue, moveInCount: 10 }))
      .toBe('review')
  })
  it('classifies as insufficient when fewer than 5 move-ins', () => {
    expect(classifyPerformance({ cpmPennies: 200_000, annualBedRevenuePennies: annualRevenue, moveInCount: 4 }))
      .toBe('insufficient')
  })
  it('classifies as insufficient when CPM is null', () => {
    expect(classifyPerformance({ cpmPennies: null, annualBedRevenuePennies: annualRevenue, moveInCount: 10 }))
      .toBe('insufficient')
  })
  it('classifies as insufficient when annual revenue is 0', () => {
    expect(classifyPerformance({ cpmPennies: 200_000, annualBedRevenuePennies: 0, moveInCount: 10 }))
      .toBe('insufficient')
  })
})

// ── calculateResponseMinutes ──────────────────────────────────────────────────

describe('calculateResponseMinutes', () => {
  it('returns minutes between creation and contact', () => {
    const created = new Date('2024-01-01T10:00:00Z').toISOString()
    const contacted = new Date('2024-01-01T11:30:00Z').toISOString()
    expect(calculateResponseMinutes(created, contacted)).toBe(90)
  })
  it('returns null when not contacted', () => {
    expect(calculateResponseMinutes('2024-01-01T10:00:00Z', null)).toBeNull()
  })
  it('returns null when contacted before created (data error)', () => {
    expect(calculateResponseMinutes('2024-01-01T11:00:00Z', '2024-01-01T10:00:00Z')).toBeNull()
  })
  it('returns 0 for simultaneous creation and contact', () => {
    const t = new Date().toISOString()
    expect(calculateResponseMinutes(t, t)).toBe(0)
  })
})

// ── buildResponseHistogram ────────────────────────────────────────────────────

describe('buildResponseHistogram', () => {
  it('buckets correctly', () => {
    const hist = buildResponseHistogram([15, 45, 90, 180, 360, 720, 2000, null])
    expect(hist[0]).toMatchObject({ label: '<30 min', count: 1 })
    expect(hist[1]).toMatchObject({ label: '30–60 min', count: 1 })
    expect(hist[2]).toMatchObject({ label: '1–2 h', count: 1 })
    expect(hist[6]).toMatchObject({ label: '>24 h', count: 1 })
  })
  it('ignores null (no contact)', () => {
    const hist = buildResponseHistogram([null, null])
    expect(hist.every((b) => b.count === 0)).toBe(true)
  })
  it('returns 7 buckets', () => {
    expect(buildResponseHistogram([]).length).toBe(7)
  })
})

// ── median / percentile ───────────────────────────────────────────────────────

describe('median', () => {
  it('returns middle value for odd array', () => expect(median([1, 3, 5])).toBe(3))
  it('returns average of two middles for even array', () => expect(median([1, 3, 5, 7])).toBe(4))
  it('returns null for empty array', () => expect(median([])).toBeNull())
})

describe('percentile', () => {
  it('returns p90 correctly', () => {
    const values = Array.from({ length: 100 }, (_, i) => i + 1)
    expect(percentile(values, 90)).toBe(90)
  })
  it('returns null for empty array', () => expect(percentile([], 90)).toBeNull())
})

// ── formatPennies ─────────────────────────────────────────────────────────────

describe('formatPennies', () => {
  it('formats pennies as GBP', () => expect(formatPennies(150_00)).toBe('£150'))
  it('returns em dash for null', () => expect(formatPennies(null)).toBe('—'))
  it('formats with pence when needed', () => expect(formatPennies(150_50)).toBe('£150.50'))
})

// ── formatMinutes ─────────────────────────────────────────────────────────────

describe('formatMinutes', () => {
  it('formats minutes', () => expect(formatMinutes(45)).toBe('45m'))
  it('formats hours', () => expect(formatMinutes(120)).toBe('2h'))
  it('formats hours and minutes', () => expect(formatMinutes(90)).toBe('1h 30m'))
  it('returns dash for null', () => expect(formatMinutes(null)).toBe('—'))
})
