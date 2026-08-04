'use client'

import { useEffect, useState } from 'react'

// Conversion elements ported from the TRG /go/ pages, restyled for CareAssura
// (violet/slate, consumer-facing). All are additive and JS-only, so the ISR
// pages stay static and fast.

// ?h= headline override for ad-group message match. Client-side so the page can
// stay statically generated; crawlers and first paint see the default headline.
export function LpHeadlineOverride({ children }: { children: React.ReactNode }) {
  const [override, setOverride] = useState<string | null>(null)
  useEffect(() => {
    try {
      const h = new URLSearchParams(window.location.search).get('h')
      if (h) setOverride(h.replace(/<[^>]*>/g, '').trim().slice(0, 90) || null)
    } catch { /* ignore */ }
  }, [])
  return <>{override ?? children}</>
}

// Persistent mobile action bar — once the quiz scrolls out of view there's
// otherwise nothing to act on.
export function LpStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <a
        href="#enquire"
        className="block rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm"
      >
        Find my matched care homes
      </a>
    </div>
  )
}

// Desktop exit-intent: one polite prompt per session when the cursor heads for
// the tab bar, pointing back to the quiz.
export function LpExitIntent({ area }: { area: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try { if (sessionStorage.getItem('lp-exit-shown')) return } catch { return }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 8 || e.relatedTarget) return
      try { sessionStorage.setItem('lp-exit-shown', '1') } catch { /* ignore */ }
      setShow(true)
      document.removeEventListener('mouseout', onLeave)
    }
    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [])

  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-6" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-slate-100">
        <button type="button" onClick={() => setShow(false)} aria-label="Close" className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
        </button>
        <h3 className="pr-6 text-2xl font-bold tracking-tight text-slate-900">Before you go — one minute could save hours of ringing round</h3>
        <p className="mt-3 leading-relaxed text-slate-600">
          Tell us what you need and care homes in {area} with genuine availability will come to you. Free, no obligation.
        </p>
        <a
          href="#enquire"
          onClick={() => setShow(false)}
          className="mt-6 block rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:opacity-95"
        >
          Find my matched care homes
        </a>
        <button type="button" onClick={() => setShow(false)} className="mt-3 w-full text-center text-xs font-medium text-slate-400 hover:text-slate-600">
          No thanks
        </button>
      </div>
    </div>
  )
}
