import PhoneLink from './PhoneLink'
import type { PhoneTracking } from '@/lib/types/care-home'

interface HeaderProps {
  name: string
  phoneDisplay: string
  phoneTracking?: PhoneTracking
}

export default function Header({ name, phoneDisplay, phoneTracking }: HeaderProps) {
  return (
    <header className="bg-white border-b border-brand-line py-4 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <span className="font-display text-xl text-brand-ink">{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-brand-ink-muted text-sm hidden sm:block">Call us free:</span>
          <PhoneLink phoneDisplay={phoneDisplay} phoneTracking={phoneTracking} />
        </div>
      </div>
    </header>
  )
}
