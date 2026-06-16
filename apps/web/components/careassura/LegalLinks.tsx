'use client'

import { useEffect, useState } from 'react'
import { PRIVACY_HTML, TERMS_HTML, COOKIES_HTML } from './legal-content'

// Footer legal links that open the policy as an on-page overlay (no navigation),
// mirroring the CareStream demos landing pages. Content is the official CareAssura
// wording from careassura.com/resources/* (see legal-content.ts).

type LegalKey = 'privacy' | 'terms' | 'cookies'

const TITLES: Record<LegalKey, string> = {
  privacy: 'Privacy policy',
  terms: 'Terms and conditions',
  cookies: 'Cookie policy',
}

const HTML: Record<LegalKey, string> = {
  privacy: PRIVACY_HTML,
  terms: TERMS_HTML,
  cookies: COOKIES_HTML,
}

export function LegalLinks({ className }: { className?: string }) {
  const [open, setOpen] = useState<LegalKey | null>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const links: [LegalKey, string][] = [
    ['privacy', 'Privacy'],
    ['terms', 'Terms and conditions'],
    ['cookies', 'Cookie policy'],
  ]

  return (
    <nav className={className ?? 'flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-400'}>
      {links.map(([key, label]) => (
        <button key={key} type="button" onClick={() => setOpen(key)} className="transition-colors hover:text-violet-600">
          {label}
        </button>
      ))}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={TITLES[open]}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(null)}
        >
          <div className="relative my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">{TITLES[open]}</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-6 text-left">
              <div
                className="text-[15px] leading-relaxed text-slate-600 [&_a]:font-medium [&_a]:text-violet-600 [&_a:hover]:underline [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2:first-child]:mt-0 [&_h3]:mb-1.5 [&_h3]:mt-4 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-slate-900 [&_li]:mb-1 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-slate-800 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: HTML[open] }}
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
