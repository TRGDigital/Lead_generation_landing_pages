'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

// Light exit-intent for the /go/ ad pages: when the cursor leaves the top of the
// viewport (desktop), offer the quiz once per session. Copy is admin-editable.
export function GoExitIntent({ heading, body, ctaLabel }: { heading: string; body: string; ctaLabel: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!heading) return
    try { if (sessionStorage.getItem('go-exit-shown')) return } catch { /* private mode */ }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 8 || e.relatedTarget) return
      try { sessionStorage.setItem('go-exit-shown', '1') } catch { /* ignore */ }
      setShow(true)
      document.removeEventListener('mouseout', onLeave)
    }
    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [heading])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/60 p-6" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-3xl border-2 border-brand-ink bg-white p-8 shadow-[8px_8px_0_0_#2a2620]">
        <button
          type="button"
          onClick={() => setShow(false)}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-brand-ink-muted hover:text-brand-ink"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="pr-6 font-display text-2xl font-bold uppercase leading-tight tracking-tight text-brand-ink">{heading}</h3>
        <p className="mt-3 leading-relaxed text-brand-ink-soft">{body}</p>
        <a
          href="#quiz"
          onClick={() => setShow(false)}
          className="mt-6 block rounded-2xl bg-brand-pop px-6 py-4 text-center font-display text-lg font-bold uppercase tracking-tight text-white shadow-[4px_4px_0_0_#2a2620] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-brand-pop-dark hover:shadow-[2px_2px_0_0_#2a2620]"
        >
          {ctaLabel}
        </a>
        <button type="button" onClick={() => setShow(false)} className="mt-3 w-full text-center text-xs font-medium text-brand-ink-muted hover:text-brand-ink">
          No thanks
        </button>
      </div>
    </div>
  )
}
