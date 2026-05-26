import { cn } from '@/lib/utils'
import {
  categoriseResponseTime,
  responseTimeBadgeClass,
  responseTimeLabel,
} from '@lib/response-time'

export default function ResponseTimeBadge({ createdAt }: { createdAt: string }) {
  const category = categoriseResponseTime(createdAt)
  const label = responseTimeLabel(createdAt)
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        responseTimeBadgeClass(category)
      )}
    >
      {label}
    </span>
  )
}
