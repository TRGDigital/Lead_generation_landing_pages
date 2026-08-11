'use client'

import { useState } from 'react'
import { GraduationCap, Check, X, ArrowLeft, RotateCcw, Globe, Send } from 'lucide-react'

const CS_LOGO = 'https://www.carestreamai.com/logo-color.svg'

// Renders the exact same Care Certificate taster lesson CareStream shows on its
// staff-training page. The data is fetched live from the CareStream API by the page
// and passed in, so the lesson, question and answers always match. Styled for TRG.

export type TrainingDemoData = {
  slug: string
  title: string
  lesson: { heading: string; body: string; image_url: string | null } | null
  question: { text: string; options: string[]; correct: number; explanation: string | null } | null
  total_sections: number
  total_questions: number
  translations?: Record<string, { lesson: { heading: string; body: string }; question: { text: string; options: string[]; explanation: string | null } }>
}

const CS = 'https://api.carestreamai.com'
const CS_TRAINING = 'https://www.carestreamai.com/staff-training/care-certificate'
type Step = 'lesson' | 'question' | 'result'

export function CareCertificateDemo({ demo }: { demo: TrainingDemoData | null }) {
  const [step, setStep] = useState<Step>('lesson')
  const [selected, setSelected] = useState<number | null>(null)
  const [lang, setLang] = useState<'eng' | 'pol' | 'hin'>('eng')

  // Fallback if the live demo can't be reached.
  if (!demo?.lesson || !demo?.question) {
    return (
      <div className="rounded-3xl border border-brand-line bg-brand-ink p-8 text-center text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://www.carestreamai.com/logo-white.png" alt="CareStream" className="mx-auto h-6 w-auto" />
        <span className="mx-auto mt-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"><GraduationCap className="h-5 w-5" /></span>
        <p className="mt-4 font-display text-xl font-bold">CareStream Care Certificate training</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-white/80">All 15 standards, 60+ languages, adaptive follow-ups, certificates and a live compliance dashboard.</p>
        <a href={CS_TRAINING} target="_blank" rel="noopener noreferrer" className="btn-cta mt-5 inline-flex">Try the training <span className="btn-arrow" aria-hidden>→</span></a>
      </div>
    )
  }

  const { lesson, question } = demo
  const availableLangs = (['pol', 'hin'] as const).filter((l) => demo.translations?.[l])
  const tr = lang !== 'eng' ? demo.translations?.[lang] : undefined
  const L = tr ? { heading: tr.lesson.heading, body: tr.lesson.body, image_url: lesson.image_url } : lesson
  const Q = tr ? { text: tr.question.text, options: tr.question.options, correct: question.correct, explanation: tr.question.explanation } : question
  const idx = ['lesson', 'question', 'result'].indexOf(step)
  const answered = selected !== null
  const isCorrect = selected === Q.correct

  return (
    <div className="overflow-hidden rounded-3xl border border-brand-line bg-white shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-brand-line bg-brand-bg-warm px-5 py-3">
        <span className="text-[11px] font-bold uppercase tracking-widest text-brand-ink-muted">Demo lesson</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={CS_LOGO} alt="CareStream" className="h-5 w-auto" />
      </div>
      {availableLangs.length > 0 && (
        <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-5 py-2.5">
          <span className="mr-auto flex items-center gap-1.5 text-xs font-semibold text-brand-ink-muted"><Globe className="h-3.5 w-3.5" /> This lesson in</span>
          {([['eng', 'English'], ['pol', 'Polski'], ['hin', 'हिन्दी']] as [string, string][])
            .filter(([c]) => c === 'eng' || availableLangs.includes(c as 'pol' | 'hin'))
            .map(([code, label]) => (
              <button key={code} type="button" onClick={() => setLang(code as 'eng' | 'pol' | 'hin')}
                className={`rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${lang === code ? 'bg-brand-pop text-white' : 'border border-brand-line text-brand-ink-muted hover:border-brand-pop'}`}>{label}</button>
            ))}
        </div>
      )}

      <div className="flex items-center gap-2 border-b border-brand-line px-5 py-3">
        {(['Lesson', 'Question', 'Result'] as const).map((label, i) => {
          const active = i === idx, done = i < idx
          return (
            <div key={label} className="flex items-center gap-2">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-brand-pop text-white' : done ? 'bg-brand-pop/15 text-brand-pop' : 'bg-brand-line/40 text-brand-ink-muted'}`}>{done ? <Check className="h-3 w-3" /> : i + 1}</span>
              <span className={`text-xs font-bold ${active ? 'text-brand-ink' : 'text-brand-ink-muted'}`}>{label}</span>
              {i < 2 && <span className="h-px w-4 bg-brand-line" />}
            </div>
          )
        })}
      </div>

      {/* Lesson */}
      <div className={step === 'lesson' ? '' : 'hidden'}>
        {L.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${CS}${L.image_url}`} alt={`${demo.title}: ${L.heading}`} className="aspect-[16/7] w-full object-cover" />
        )}
        <div className="p-6 sm:p-8">
          <span className="text-xs font-bold uppercase tracking-wide text-brand-pop">Lesson 1 of {demo.total_sections}</span>
          <h3 className="mt-2 font-display text-xl font-bold text-brand-ink">{L.heading}</h3>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-brand-ink-soft">{L.body}</p>
          <button type="button" onClick={() => setStep('question')} className="btn-pop mt-6">Next: answer a question <span className="btn-arrow" aria-hidden>→</span></button>
        </div>
      </div>

      {/* Question */}
      <div className={step === 'question' ? 'p-6 sm:p-8' : 'hidden'}>
        <span className="text-xs font-bold uppercase tracking-wide text-brand-pop">Quick check</span>
        <p className="mt-2 text-sm font-semibold text-brand-ink">{Q.text}</p>
        <div className="mt-3 space-y-2">
          {Q.options.map((opt, i) => {
            const chosen = selected === i
            return (
              <button key={i} type="button" onClick={() => setSelected(i)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${chosen ? 'border-brand-pop bg-brand-pop/5' : 'border-brand-line bg-white hover:border-brand-pop'}`}>
                <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${chosen ? 'bg-brand-pop text-white' : 'border border-brand-line text-brand-ink-muted'}`}>{String.fromCharCode(65 + i)}</span>
                <span className={chosen ? 'font-semibold text-brand-ink' : 'text-brand-ink'}>{opt}</span>
              </button>
            )
          })}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button type="button" onClick={() => setStep('lesson')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink-muted hover:text-brand-pop"><ArrowLeft className="h-4 w-4" /> Back</button>
          <button type="button" disabled={!answered} onClick={() => setStep('result')} className="btn-pop disabled:opacity-40">See result <span className="btn-arrow" aria-hidden>→</span></button>
        </div>
      </div>

      {/* Result */}
      <div className={step === 'result' ? 'p-6 sm:p-8' : 'hidden'}>
        {answered && (
          <div className={`mb-4 flex items-center gap-2 rounded-xl p-3 ${isCorrect ? 'bg-green-50 text-green-900' : 'bg-amber-50 text-amber-900'}`}>
            {isCorrect ? <Check className="h-5 w-5 text-green-600" /> : <X className="h-5 w-5 text-amber-600" />}
            <p className="font-bold">{isCorrect ? 'Correct.' : 'Not quite.'}</p>
          </div>
        )}
        <div className="space-y-2">
          {Q.options.map((opt, i) => {
            const right = i === Q.correct, wrong = answered && i === selected && i !== Q.correct
            return (
              <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${right ? 'border-green-500 bg-green-50' : wrong ? 'border-red-400 bg-red-50' : 'border-brand-line bg-white opacity-60'}`}>
                <span className="mt-0.5 flex-shrink-0">{right ? <Check className="h-4 w-4 text-green-600" /> : wrong ? <X className="h-4 w-4 text-red-500" /> : <span className="flex h-4 w-4 items-center justify-center rounded-full border border-brand-line text-[10px] font-bold text-brand-ink-muted">{String.fromCharCode(65 + i)}</span>}</span>
                <span className={right ? 'font-semibold text-green-900' : wrong ? 'text-red-900' : 'text-brand-ink'}>{opt}</span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 rounded-xl bg-brand-bg-warm/60 p-4 text-sm leading-relaxed text-brand-ink">
          <span className="font-bold">The correct answer is “{Q.options[Q.correct]}”.</span>{' '}
          {Q.explanation ?? 'In the full module, a wrong answer triggers a short follow-up lesson and a fresh question, so the gap is always closed before completion.'}
        </div>

        {answered && !isCorrect && (
          <div className="mt-3 rounded-xl border border-brand-pop/25 bg-brand-pop/5 p-4">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 flex-shrink-0 text-brand-pop" />
              <span className="text-sm font-semibold text-brand-ink">A follow-up has been sent to this staff member.</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
              In the CareStream hub, getting a question wrong automatically sends the staff member a short follow-up
              lesson and a fresh question on the same point. They close the gap before they can finish the module, and
              every attempt is recorded as evidence for your CQC file.
            </p>
          </div>
        )}

        <div className="mt-5 border-t border-brand-line pt-5">
          <p className="text-sm font-semibold text-brand-ink">That’s how the training works, all {demo.total_sections} lessons and {demo.total_questions} questions, in 60+ languages, with certificates.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <a href={CS_TRAINING} target="_blank" rel="noopener noreferrer" className="btn-pop">See the full training <span className="btn-arrow" aria-hidden>→</span></a>
            <button type="button" onClick={() => { setSelected(null); setStep('lesson') }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-ink-muted hover:text-brand-pop"><RotateCcw className="h-4 w-4" /> Try again</button>
          </div>
        </div>
      </div>
    </div>
  )
}
