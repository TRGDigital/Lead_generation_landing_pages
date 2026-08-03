'use client'

import { useEffect, useRef, useState } from 'react'
import type { FamilyToolKey } from '@/lib/family-tools'
import { ToolMock } from './ToolMock'
import { ToolPreviewProvider, ToolPreviewButton } from './ToolPreview'

export type ShowcaseItem = {
  key: FamilyToolKey
  name: string
  category: string
  nursing: boolean
  blurb: string
  how: string[]
  points: string[]
  why: string
  unique: string
  site?: string
}

export function ToolShowcase({ items }: { items: ShowcaseItem[] }) {
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
    <ToolPreviewProvider>
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
              {/* Mobile: the mock sits above its writeup */}
              <div className="mb-7 lg:hidden">
                <ToolMock toolKey={it.key} name={it.name} />
              </div>

              <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">{it.category}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
                  {it.name}
                </h3>
                {it.nursing && (
                  <span className="rounded-full bg-brand-accent/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-ink">
                    Nursing
                  </span>
                )}
              </div>

              <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{it.blurb}</p>

              <ol className="mt-6 space-y-2.5">
                {it.how.map((s, j) => (
                  <li key={j} className="flex gap-3 text-sm leading-relaxed text-brand-ink-soft">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-pop/10 text-[11px] font-bold text-brand-pop">
                      {j + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>

              <ul className="mt-6 flex flex-wrap gap-2">
                {it.points.map((p) => (
                  <li
                    key={p}
                    className="rounded-full border border-brand-line bg-white px-3 py-1 text-xs font-medium text-brand-ink-soft"
                  >
                    {p}
                  </li>
                ))}
              </ul>

              <div className="mt-7 grid gap-4 rounded-2xl border border-brand-line bg-white/60 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand-pop">Why it works</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">{it.why}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand-pop">What makes it unique</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">{it.unique}</p>
                </div>
              </div>

              <div className="mt-7">
                <ToolPreviewButton
                  preview={{ key: it.key, label: it.name, site: it.site }}
                  className="btn-pop"
                >
                  See it in action
                  <span className="btn-arrow" aria-hidden>→</span>
                </ToolPreviewButton>
              </div>
            </div>
          ))}
        </div>

        {/* Right: pinned mock that crossfades to the active tool (desktop only) */}
        <div className="hidden lg:block">
          <div className="sticky top-24 h-[80vh]">
            <div className="relative flex h-full items-center">
              {items.map((it, i) => (
                <div
                  key={it.key}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${
                    i === active ? 'opacity-100' : 'pointer-events-none opacity-0'
                  }`}
                  aria-hidden={i !== active}
                >
                  <ToolMock toolKey={it.key} name={it.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolPreviewProvider>
  )
}
