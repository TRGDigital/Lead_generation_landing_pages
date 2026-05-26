import type { TrustItem } from '@/lib/types/care-home'

const ICONS: Record<string, string> = {
  cqc: '⭐',
  years: '🏛️',
  staff: '👥',
  meals: '🍽️',
  outstanding: '🏆',
  good: '✅',
  rated: '⭐',
}

interface TrustStripProps {
  cqcRating: string | null
  trustItems: TrustItem[]
}

export default function TrustStrip({ trustItems }: TrustStripProps) {
  return (
    <section className="bg-white border-b border-brand-line py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-4">
        {trustItems.map((item) => (
          <div key={item.icon} className="flex items-center gap-2 text-brand-ink-soft">
            <span className="text-lg leading-none" aria-hidden="true">
              {ICONS[item.icon] ?? '✓'}
            </span>
            <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
