import { COPY } from '@/lib/copy/portal'

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  contacted: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  qualified: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  tour_booked: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  tour_completed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  assessed: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  moved_in: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
}

type Props = { status: string }

export default function StatusBadge({ status }: Props) {
  const color = STATUS_COLORS[status] ?? 'bg-muted text-muted-foreground'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {COPY.status[status] ?? status}
    </span>
  )
}
