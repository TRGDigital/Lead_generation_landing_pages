'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TrgGoQuiz } from '@/components/go/TrgGoQuiz'
import type { GoQuizQuestion } from '@/lib/go-pages'

// Exit intent for the /go/ ad pages. When the cursor leaves the top of the viewport on
// desktop, the quiz itself opens in the overlay, carrying over any answers already given
// on the page. Sending someone back down the page to start again, at the exact moment
// they were leaving, lost most of them.
export function GoExitIntent({
  heading,
  body,
  ctaLabel,
  slug,
  intro,
  questions,
}: {
  heading: string
  body: string
  ctaLabel: string
  slug: string
  intro: string
  questions: GoQuizQuestion[]
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!heading) return
    try {
      if (sessionStorage.getItem('go-exit-shown')) return
      // Never interrupt someone who has already sent their details.
      if (sessionStorage.getItem('go-quiz-done')) return
    } catch { /* private mode */ }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 8 || e.relatedTarget) return
      try { sessionStorage.setItem('go-exit-shown', '1') } catch { /* ignore */ }
      setShow(true)
      document.removeEventListener('mouseout', onLeave)
    }
    document.addEventListener('mouseout', onLeave)
    return () => document.removeEventListener('mouseout', onLeave)
  }, [heading])

  // Close on Escape, as any dialog should.
  useEffect(() => {
    if (!show) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShow(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [show])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brand-ink/60 p-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      onClick={(e) => { if (e.target === e.currentTarget) setShow(false) }}
    >
      <div className="relative w-full max-w-lg rounded-3xl border-2 border-brand-ink bg-white shadow-[8px_8px_0_0_#2a2620]">
        <button
          type="button"
          onClick={() => setShow(false)}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-1 text-brand-ink-muted hover:text-brand-ink"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="border-b-2 border-brand-line px-8 pb-5 pt-8">
          <h3 className="pr-6 font-display text-2xl font-bold uppercase leading-tight tracking-tight text-brand-ink">{heading}</h3>
          {body && <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>}
        </div>

        {/* The quiz itself, resuming wherever they got to on the page */}
        <TrgGoQuiz
          slug={slug}
          intro={intro}
          questions={questions}
          ctaLabel={ctaLabel}
          resumeFromSaved
          onSubmitted={() => {
            // Leave the thank you on screen for a moment, then let them carry on.
            setTimeout(() => setShow(false), 6000)
          }}
        />

        <button
          type="button"
          onClick={() => setShow(false)}
          className="w-full rounded-b-3xl px-8 pb-5 text-center text-xs font-medium text-brand-ink-muted hover:text-brand-ink"
        >
          No thanks
        </button>
      </div>
    </div>
  )
}
