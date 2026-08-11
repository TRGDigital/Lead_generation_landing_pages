'use client'

import { useState } from 'react'
import { GraduationCap, Check, X } from 'lucide-react'

// A taster of CareStream's Care Certificate training, shown on the mandatory-training
// tool as a selling point: a real lesson + question with feedback. The full interactive
// demo (with language options) lives on the CareStream site, linked below.

const OPTIONS = [
  { text: 'Carry on with the wash, it’s what’s scheduled.', correct: false },
  { text: 'Pause, offer Mrs Patel her tea first, then ask when she’d like her wash.', correct: true },
  { text: 'Skip her wash altogether today.', correct: false },
  { text: 'Explain that the morning routine has now changed.', correct: false },
]

export function CareCertificateDemo() {
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const correct = answered && !!OPTIONS[picked]?.correct

  return (
    <div className="overflow-hidden rounded-3xl border border-brand-line bg-white shadow-card">
      <div className="flex items-center gap-2 border-b border-brand-line bg-brand-bg-warm px-6 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-pop/10 text-brand-pop"><GraduationCap className="h-4 w-4" /></span>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-ink-muted">Care Certificate · Person-centred care</span>
      </div>
      <div className="p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">The lesson</p>
        <h3 className="mt-1 font-display text-xl font-bold text-brand-ink">Understanding person-centred care</h3>
        <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">
          Person-centred care means seeing the person, not just their condition. Their history, routines,
          preferences and what matters most shape the care you give, so they stay in control of their own day.
        </p>

        <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-pop">Check your understanding</p>
        <p className="mt-1 text-sm font-semibold text-brand-ink">
          Mrs Patel always has a cup of tea before her morning wash. A new carer wakes her and begins washing her
          straight away. What’s the most person-centred response?
        </p>
        <div className="mt-3 space-y-2">
          {OPTIONS.map((o, i) => {
            const state = !answered ? 'idle' : o.correct ? 'right' : i === picked ? 'wrong' : 'muted'
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => setPicked(i)}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  state === 'right' ? 'border-green-400 bg-green-50 text-green-900'
                  : state === 'wrong' ? 'border-red-300 bg-red-50 text-red-900'
                  : state === 'muted' ? 'border-brand-line bg-white text-brand-ink-muted'
                  : 'border-brand-line bg-white text-brand-ink hover:border-brand-pop'
                }`}
              >
                <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                  state === 'right' ? 'border-green-500 bg-green-500 text-white'
                  : state === 'wrong' ? 'border-red-500 bg-red-500 text-white'
                  : 'border-brand-line text-brand-ink-muted'
                }`}>
                  {state === 'right' ? <Check className="h-3 w-3" /> : state === 'wrong' ? <X className="h-3 w-3" /> : String.fromCharCode(65 + i)}
                </span>
                {o.text}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className={`mt-4 rounded-xl border p-4 text-sm ${correct ? 'border-green-200 bg-green-50 text-green-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
            <p className="font-semibold">{correct ? 'Correct.' : 'Not quite.'}</p>
            <p className="mt-1 leading-relaxed">
              Person-centred care respects someone’s established routines and choices. Offering Mrs Patel her tea
              first, then asking when she’d like her wash, keeps her in control of her own care, exactly what the
              Care Certificate expects.
            </p>
            <button type="button" onClick={() => setPicked(null)} className="mt-2 text-xs font-semibold text-brand-pop underline">Try again</button>
          </div>
        )}

        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl bg-brand-ink p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-white/85">
            One taster lesson. CareStream delivers the full Care Certificate, all 15 standards, in 60+ languages,
            with adaptive follow-ups, certificates and a live compliance dashboard.
          </p>
          <a href="https://www.carestreamai.com/staff-training/care-certificate" target="_blank" rel="noopener noreferrer" className="btn-cta whitespace-nowrap">
            See the full training <span className="btn-arrow" aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}
