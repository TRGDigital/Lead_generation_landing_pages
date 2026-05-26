import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  categoriseResponseTime,
  responseTimeBadgeClass,
  responseTimeLabel,
} from './response-time'

describe('categoriseResponseTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it('returns fast for leads under 1 hour old', () => {
    const createdAt = new Date('2024-01-01T11:30:00Z').toISOString()
    expect(categoriseResponseTime(createdAt)).toBe('fast')
  })

  it('returns medium for leads 1–24 hours old', () => {
    const createdAt = new Date('2024-01-01T06:00:00Z').toISOString()
    expect(categoriseResponseTime(createdAt)).toBe('medium')
  })

  it('returns slow for leads over 24 hours old', () => {
    const createdAt = new Date('2023-12-30T12:00:00Z').toISOString()
    expect(categoriseResponseTime(createdAt)).toBe('slow')
  })

  it('returns fast for brand-new lead', () => {
    const createdAt = new Date('2024-01-01T12:00:00Z').toISOString()
    expect(categoriseResponseTime(createdAt)).toBe('fast')
  })
})

describe('responseTimeBadgeClass', () => {
  it('returns green for fast', () => {
    expect(responseTimeBadgeClass('fast')).toContain('green')
  })

  it('returns yellow for medium', () => {
    expect(responseTimeBadgeClass('medium')).toContain('yellow')
  })

  it('returns red for slow', () => {
    expect(responseTimeBadgeClass('slow')).toContain('red')
  })

  it('returns gray for none', () => {
    expect(responseTimeBadgeClass('none')).toContain('gray')
  })
})

describe('responseTimeLabel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it('shows minutes for recent leads', () => {
    const createdAt = new Date('2024-01-01T11:45:00Z').toISOString()
    expect(responseTimeLabel(createdAt)).toBe('15m ago')
  })

  it('shows hours for older leads', () => {
    const createdAt = new Date('2024-01-01T09:00:00Z').toISOString()
    expect(responseTimeLabel(createdAt)).toBe('3h ago')
  })

  it('shows days for very old leads', () => {
    const createdAt = new Date('2023-12-29T12:00:00Z').toISOString()
    expect(responseTimeLabel(createdAt)).toBe('3d ago')
  })
})
