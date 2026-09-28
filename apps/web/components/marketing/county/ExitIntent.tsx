'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { CountyLeadForm, type Need } from '@/components/marketing/county/CountyLeadForm'

// An exit intent enquiry form, on the county pages only.
//
// Rules it follows, because a popup that ignores them is just an annoyance: once per
// session and never again once it has been closed or sent, never within the first fifteen
// seconds, desktop pointer leaving the top of the window only, and closable with Escape,
// the button or the backdrop. On touch devices there is no exit intent to detect, so it
// waits for a decisive scroll back up the page instead, which is the mobile equivalent of
// reaching for the back button.

const SEEN_KEY = 'trg_county_exit_seen'

export function ExitIntent({
  countyName,
  context,
  need,
}: {
  countyName: string
  context: string
  /** The option this page's readers most likely want, shown first in the dropdown. */
  need?: Need
}) {
  const [open, setOpen] = useState(false)
  const armed = useRef(false)
  const dialog = useRef<HTMLDivElement>(null)

  const dismiss = useCallback(() => {
    setOpen(false)
    try {
      sessionStorage.setItem(SEEN_KEY, '1')
    } catch {
      /* private browsing, in which case it can show again next page */
    }
  }, [])

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1'
    } catch {
      seen = false
    }
    if (seen) return

    const arm = window.setTimeout(() => {
      armed.current = true
    }, 15000)

    const show = () => {
      if (!armed.current) return
      armed.current = false
      setOpen(true)
    }

    // Desktop: the pointer heading out of the top of the window.
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) show()
    }

    // Touch: a decisive flick back up the page after reading a good way down it.
    let lastY = window.scrollY
    let upward = 0
    const onScroll = () => {
      const y = window.scrollY
      const delta = lastY - y
      lastY = y
      if (y < 400) return
      upward = delta > 0 ? upward + delta : 0
      if (upward > 900) show()
    }

    document.addEventListener('mouseout', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(arm)
      document.removeEventListener('mouseout', onLeave)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, dismiss])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-brand-ink/70 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss()
      }}
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-title"
        tabIndex={-1}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-brand-bg-warm p-6 shadow-2xl outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full border border-brand-line bg-white p-1.5 text-brand-ink-muted hover:text-brand-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <h2
          id="exit-intent-title"
          className="max-w-md font-display text-2xl font-bold uppercase leading-tight tracking-tight text-brand-ink"
        >
          Before you go, one honest answer
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-brand-ink-soft">
          Tell us where you are in {countyName} and what is not working, and you will get a straight reply from a
          person within one working day. No call centre, no sequence of chasing emails, and we will say so if you do
          not need us.
        </p>

        <div className="mt-5">
          <CountyLeadForm countyName={countyName} context={`${context} (exit intent)`} defaultNeed={need} />
        </div>
      </div>
    </div>
  )
}
