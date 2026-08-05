'use client'

import { useEffect, useRef, useState } from 'react'
import { ManagedImage } from './ManagedImage'
import type { CaseToolShowcaseItem } from '@/lib/case-studies'

// Case-study tool showcase — the same pattern as /care-tools "The tools we add
// to your site": writeups scroll on the left while one pinned browser frame on
// the right crossfades to the active tool's real screenshot. Screenshots render
// at explicit dimensions (no CSS aspect-ratio in the absolute stack — Safari
// collapses that, which is what broke the first version). On mobile each
// screenshot sits above its writeup.

function Frame({ item, domain, priority }: { item: CaseToolShowcaseItem; domain: string; priority?: boolean }) {
  const portrait = item.height > item.width
  return (
    <div className={`overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card ${portrait ? 'mx-auto w-full max-w-[380px]' : 'w-full'}`}>
      <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">
          {domain}
        </span>
      </div>
      <ManagedImage
        src={item.image}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes="(max-width: 1024px) 100vw, 45vw"
        priority={priority}
        className="h-auto w-full"
      />
    </div>
  )
}

export function CaseToolShowcase({ items, domain }: { items: CaseToolShowcaseItem[]; domain: string }) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.idx))
        }
      },
      // Only the block crossing the middle band of the viewport counts as "active".
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    )
    refs.current.forEach((r) => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
      {/* Left: scrolling writeups */}
      <div>
        {items.map((it, i) => (
          <div
            key={it.key}
            data-idx={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            className="flex flex-col justify-center border-b border-brand-line/60 py-12 last:border-0 lg:min-h-[86vh] lg:border-0 lg:py-16"
          >
            {/* Mobile: the screenshot sits above its writeup */}
            <div className="mb-7 lg:hidden">
              <Frame item={it} domain={domain} priority={i === 0} />
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
        ))}
      </div>

      {/* Right: pinned frame that crossfades to the active tool (desktop only) */}
      <div className="hidden lg:block">
        <div className="sticky top-24 flex h-[86vh] items-center">
          <div className="relative w-full">
            {items.map((it, i) => (
              <div
                key={it.key}
                className={`transition-opacity duration-500 ${
                  i === active
                    ? 'relative opacity-100'
                    : 'pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-0'
                }`}
                aria-hidden={i !== active}
              >
                <Frame item={it} domain={domain} priority={i === 0} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
