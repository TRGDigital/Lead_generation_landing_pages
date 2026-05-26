export type ResponseTimeCategory = 'fast' | 'medium' | 'slow' | 'none'

export function categoriseResponseTime(createdAt: string): ResponseTimeCategory {
  const ageMs = Date.now() - new Date(createdAt).getTime()
  const ageHours = ageMs / (1000 * 60 * 60)
  if (ageHours < 1) return 'fast'
  if (ageHours < 24) return 'medium'
  if (ageHours < Infinity) return 'slow'
  return 'none'
}

export function responseTimeBadgeClass(category: ResponseTimeCategory): string {
  switch (category) {
    case 'fast':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'slow':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export function responseTimeLabel(createdAt: string): string {
  const ageMs = Date.now() - new Date(createdAt).getTime()
  const mins = Math.floor(ageMs / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
