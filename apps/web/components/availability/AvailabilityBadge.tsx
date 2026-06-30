import { AVAILABILITY_LABELS, type Website } from '@/lib/websites'

// A small status pill driven by the client's self-updated availability. Used on the
// landing page hero (and reusable elsewhere). Only shown when there is genuine
// availability: 'full' ("Currently full") and 'unknown' (enquiries-only) are hidden
// unless showWhenUnknown is set.
export function AvailabilityBadge({ site, showWhenUnknown = false, className = '' }: {
  site: Pick<Website, 'availability_status' | 'rooms_available' | 'availability_note'>
  showWhenUnknown?: boolean
  className?: string
}) {
  const meta = AVAILABILITY_LABELS[site.availability_status] ?? AVAILABILITY_LABELS.unknown
  if ((site.availability_status === 'unknown' || site.availability_status === 'full') && !showWhenUnknown) return null

  const tone = {
    good: 'border-green-300 bg-green-50 text-green-800',
    warn: 'border-amber-300 bg-amber-50 text-amber-800',
    bad: 'border-red-200 bg-red-50 text-red-700',
    muted: 'border-brand-line bg-brand-bg-warm text-brand-ink-soft',
  }[meta.tone]

  const dot = { good: 'bg-green-500', warn: 'bg-amber-500', bad: 'bg-red-500', muted: 'bg-brand-ink-muted' }[meta.tone]
  const rooms = site.availability_status !== 'full' && site.rooms_available > 0
  const label = rooms ? `${site.rooms_available} ${site.rooms_available === 1 ? 'room' : 'rooms'} available` : meta.label

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold ${tone} ${className}`}>
      <span className={`relative flex h-2 w-2`}>
        {meta.tone === 'good' && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dot} opacity-60`} />}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
      </span>
      {label}
      {site.availability_note && <span className="font-normal opacity-80">· {site.availability_note}</span>}
    </span>
  )
}
