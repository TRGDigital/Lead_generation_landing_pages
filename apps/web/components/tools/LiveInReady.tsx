'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { ToolButton, ResultBadge, Disclaimer, ToolLeadCapture, ACCENT, ACCENT_SOFT } from './ui'

// "Is our home ready for live-in care?" A short practical checklist for families preparing
// for a live-in carer. Anything answered No or Not sure becomes an item on a personalised
// to do list. Client-side only, nothing stored.

const QUESTIONS: { q: string; todo: string }[] = [
  {
    q: 'Is there a spare bedroom the carer can have as their own?',
    todo: 'A live-in carer needs a private bedroom of their own. Talk to the provider if space is tight, as they may be able to suggest options.',
  },
  {
    q: 'Does that room have a comfortable bed, storage and somewhere to relax?',
    todo: 'Set the room up with a comfortable bed, somewhere to store clothes and a space to relax during breaks.',
  },
  {
    q: 'Have you agreed how the carer’s food will be provided?',
    todo: 'Agree whether the carer’s food will be included in the household shopping or covered by a food allowance, before the placement starts.',
  },
  {
    q: 'Is there someone who can cover the carer’s daily break?',
    todo: 'Live-in carers need a break each day. If your loved one cannot safely be left alone, plan who will cover, such as a family member or a visiting carer.',
  },
  {
    q: 'Do they usually sleep through the night?',
    todo: 'A live-in carer needs to sleep. If help is needed regularly through the night, ask the provider about waking night care alongside live-in care.',
  },
  {
    q: 'Is there internet access the carer can use?',
    todo: 'Internet access helps the carer keep in touch with their family and the provider’s office, and many care records are kept online.',
  },
  {
    q: 'Is there parking or good transport nearby for the carer?',
    todo: 'Check how the carer will arrive and get around on their breaks, and whether there is parking if they drive.',
  },
  {
    q: 'Has the person needing care been involved in the decision?',
    todo: 'Involve your loved one as much as possible. Live-in care works best when they are comfortable with the idea of someone living with them.',
  },
]

const OPTIONS = ['Yes', 'No', 'Not sure'] as const
type Answer = (typeof OPTIONS)[number]

export function LiveInReady({ site }: { site?: string }) {
  const [answers, setAnswers] = useState<Record<number, Answer>>({})
  const [submitted, setSubmitted] = useState(false)

  const answered = QUESTIONS.every((_, i) => answers[i] !== undefined)
  const todo = QUESTIONS.filter((_, i) => answers[i] && answers[i] !== 'Yes')
  const readyCount = QUESTIONS.length - todo.length

  if (submitted) {
    return (
      <div>
        <ResultBadge tone={todo.length === 0 ? 'good' : todo.length <= 3 ? 'info' : 'warn'}>
          <p className="text-sm font-semibold">{readyCount} of {QUESTIONS.length} things are ready</p>
          <p className="mt-1 text-lg font-bold text-brand-ink">
            {todo.length === 0
              ? 'Your home looks ready for live-in care'
              : todo.length <= 3
                ? 'Nearly there, with a few things to sort out'
                : 'A little preparation will make live-in care work well'}
          </p>
        </ResultBadge>

        {todo.length > 0 && (
          <div className="mt-4 rounded-2xl p-5" style={{ background: ACCENT_SOFT }}>
            <p className="text-sm font-semibold text-brand-ink">Your to do list</p>
            <ol className="mt-3 space-y-3">
              {todo.map((t, i) => (
                <li key={t.q} className="flex gap-3 text-sm text-brand-ink-soft">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: ACCENT }}>{i + 1}</span>
                  <span>{t.todo}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {site && (
          <ToolLeadCapture
            site={site}
            toolName="live-in-ready"
            intent="callback"
            answers={Object.fromEntries(QUESTIONS.map((q, i) => [q.q, answers[i] ?? '']))}
          />
        )}

        <button
          type="button"
          onClick={() => { setAnswers({}); setSubmitted(false) }}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-ink-muted underline hover:text-brand-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Start again
        </button>

        <Disclaimer>
          A practical guide to help you prepare. Your live-in care provider will talk through the arrangements with you
          in detail. Nothing you select is stored.
        </Disclaimer>
      </div>
    )
  }

  return (
    <div>
      <ol className="space-y-5">
        {QUESTIONS.map((item, i) => (
          <li key={item.q}>
            <p className="text-sm font-medium text-brand-ink">{item.q}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {OPTIONS.map((o) => {
                const selected = answers[i] === o
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [i]: o }))}
                    style={selected ? { borderColor: ACCENT, background: ACCENT_SOFT } : undefined}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${selected ? 'text-brand-ink' : 'border-brand-line text-brand-ink-soft hover:border-brand-ink/30'}`}
                  >
                    {o}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <ToolButton onClick={() => setSubmitted(true)} disabled={!answered}>See my to do list</ToolButton>
        {!answered && <p className="mt-2 text-xs text-brand-ink-muted">Answer each question to see your list.</p>}
      </div>

      <Disclaimer>Private and anonymous. Nothing you select is stored.</Disclaimer>
    </div>
  )
}
