'use client'

import { useEffect, useState } from 'react'
import { CareFinderQuiz } from './CareFinderQuiz'
import type { QuizQuestion } from '@/lib/care-finder'

export function GetMatchedModal({
  locationSlug,
  questions,
  questionSetKey,
  label = 'Get matched',
  className,
}: {
  locationSlug: string
  questions: QuizQuestion[]
  questionSetKey?: string
  areaName?: string
  timeframes?: string[]
  label?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const btn =
    className ??
    'inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95'

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btn}>
        {label}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative my-8 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-100 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
            <CareFinderQuiz locationSlug={locationSlug} questions={questions} questionSetKey={questionSetKey} flat />
          </div>
        </div>
      )}
    </>
  )
}
