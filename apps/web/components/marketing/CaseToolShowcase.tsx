import { ManagedImage } from './ManagedImage'
import type { CaseToolShowcaseItem } from '@/lib/case-studies'

// Case-study tool showcase: one row per tool — the writeup on the left, the tool's
// real screenshot pinned on the right (sticky within its own row, so the image stays
// in view while its text scrolls, then hands over to the next tool's image). Natural
// aspect ratios, nothing cropped. On mobile the screenshot sits above its writeup.

function Frame({ item, priority }: { item: CaseToolShowcaseItem; priority?: boolean }) {
  const portrait = item.height > item.width
  return (
    <div className={`overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card ${portrait ? 'mx-auto w-full max-w-[400px]' : 'w-full'}`}>
      <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">
          crosswayscarehome.co.uk
        </span>
      </div>
      <ManagedImage
        src={item.image}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority={priority}
        className="h-auto w-full"
      />
    </div>
  )
}

export function CaseToolShowcase({ items }: { items: CaseToolShowcaseItem[] }) {
  return (
    <div className="divide-y divide-brand-line/60">
      {items.map((it, i) => (
        <div key={it.key} className="grid gap-8 py-12 first:pt-6 lg:grid-cols-2 lg:gap-16 lg:py-16">
          {/* Writeup */}
          <div>
            {/* Mobile: the screenshot sits above its writeup */}
            <div className="mb-7 lg:hidden">
              <Frame item={it} priority={i === 0} />
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">{it.category}</p>
            <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
              {it.name}
            </h3>

            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{it.blurb}</p>

            <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-brand-ink-muted">
              How families use it
            </p>
            <ol className="mt-2.5 space-y-2.5">
              {it.how.map((s, j) => (
                <li key={j} className="flex gap-3 text-sm leading-relaxed text-brand-ink-soft">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-pop/10 text-[11px] font-bold text-brand-pop">
                    {j + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            <div className="mt-7 grid gap-4 rounded-2xl border border-brand-line bg-white/60 p-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-pop">Why it works</p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">{it.why}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-pop">The gateway effect</p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">{it.gateway}</p>
              </div>
            </div>

            <div className="mt-7">
              <a href={it.liveHref} target="_blank" rel="noopener noreferrer" className="btn-pop">
                See it live
                <span className="btn-arrow" aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* Screenshot: sticky within its own row (desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Frame item={it} priority={i === 0} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
