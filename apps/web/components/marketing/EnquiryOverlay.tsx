'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import ContactForm from '@/components/marketing/ContactForm'

// "Start your project" enquiry overlay. Mid-page CTAs open this modal instead of
// navigating to /contact, so an interested reader never loses their place. Reuses
// the same ContactForm (and lead pipeline) as the contact page. The nav/footer
// "Contact us" links and /book-a-demo stay as real pages by design.

const EnquiryContext = createContext<{ open: () => void } | null>(null)

export function EnquiryButton({ className = '', children }: { className?: string; children: React.ReactNode }) {
  const ctx = useContext(EnquiryContext)
  // Outside the provider (shouldn't happen), degrade to a normal contact link.
  if (!ctx) {
    return (
      <a href="/contact" className={className}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" onClick={ctx.open} className={className}>
      {children}
    </button>
  )
}

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const show = useCallback(() => setOpen(true), [])
  const hide = useCallback(() => setOpen(false), [])

  // Esc closes; lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, hide])

  return (
    <EnquiryContext.Provider value={{ open: show }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Start your project"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={hide}
            className="absolute inset-0 bg-brand-ink/60 backdrop-blur-sm"
          />
          <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border-2 border-brand-ink bg-white p-6 shadow-[6px_6px_0_0_#F0532B] sm:rounded-3xl sm:p-8">
            <button
              type="button"
              onClick={hide}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 border-brand-ink text-brand-ink transition-colors hover:bg-brand-ink hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">Start your project</p>
            <h2 className="mt-1.5 font-display text-2xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-3xl">
              Let&rsquo;s fill your beds
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
              Tell us where you want to grow and we&rsquo;ll come back within one business day with a
              clear, no-obligation plan.
            </p>
            <div className="mt-5">
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </EnquiryContext.Provider>
  )
}
