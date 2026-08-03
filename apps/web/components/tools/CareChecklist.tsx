'use client'

import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { ToolButton, ResultBadge, Disclaimer, ToolLeadCapture, ACCENT, ACCENT_SOFT } from './ui'

// "Is it time for care?" — a gentle, private self-check for families wondering whether a loved
// one might need more support. Client-side only, nothing stored; a reflection prompt, not an
// assessment. Ported from the Crossways/Ferndale native tool into the brandable embed suite.

const QUESTIONS = [
  'Are everyday tasks like washing, dressing or cooking becoming harder for them to manage?',
  'Have there been falls, or do you worry about their safety at home?',
  'Are they struggling to take their medication correctly or on time?',
  'Is keeping the home clean, warm and looked after becoming difficult?',
  "Are you concerned they aren't eating well or regularly?",
  'Do they seem lonely, low or increasingly isolated?',
  'Is memory loss or confusion starting to affect daily life?',
  'Is caring for them taking a real toll on you or the wider family?',
]

const OPTIONS = [
  { label: 'Often', score: 2 },
  { label: 'Sometimes', score: 1 },
  { label: 'Rarely', score: 0 },
]

const RESULTS = {
  high: {
    tone: 'warn' as const,
    title: 'It may be time to consider more support',
    body: "You've noticed several signs that everyday life is becoming a struggle. That doesn't mean a care home is the only answer, but it does suggest it's worth talking things through properly. The right support, whether that's care at home, respite or a residential move, can bring safety, company and peace of mind.",
  },
  medium: {
    tone: 'info' as const,
    title: 'A little extra help could make a real difference',
    body: "You've spotted a few signs worth keeping an eye on. Many families find that a bit of support at this stage, from home care to the occasional respite stay, helps their loved one stay well and independent for longer.",
  },
  low: {
    tone: 'good' as const,
    title: 'Things seem manageable for now',
    body: "From your answers, your loved one seems to be coping well day to day, which is reassuring. It's still worth staying alert to changes over time, and whenever you'd like to understand the options, help is a phone call away.",
  },
}

export function CareChecklist({ site }: { site?: string }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const answered = QUESTIONS.every((_, i) => answers[i] !== undefined)
  const score = Object.values(answers).reduce((a, b) => a + b, 0)
  const flagged = Object.values(answers).filter((s) => s > 0).length
  const result = RESULTS[score >= 9 ? 'high' : score >= 4 ? 'medium' : 'low']

  if (submitted) {
    return (
      <div>
        <ResultBadge tone={result.tone}>
          <p className="text-sm font-semibold">
            You noted signs in {flagged} of {QUESTIONS.length} areas.
          </p>
          <p className="mt-1 text-lg font-bold text-brand-ink">{result.title}</p>
          <p className="mt-2 text-sm text-brand-ink-soft">{result.body}</p>
        </ResultBadge>

        <div className="mt-4 rounded-2xl p-5" style={{ background: ACCENT_SOFT }}>
          <p className="text-sm font-semibold text-brand-ink">What you can do next</p>
          <ul className="mt-2 space-y-1.5 text-sm text-brand-ink-soft">
            <li>• Talk it through with the home, honestly and with no pressure.</li>
            <li>• Arrange a visit to see what daily life there could look like.</li>
            <li>• If health or memory is a worry, it&rsquo;s always worth speaking to a GP too.</li>
          </ul>
        </div>

        {site && <ToolLeadCapture site={site} toolName="care-checklist" intent="callback" />}

        <button
          type="button"
          onClick={() => { setAnswers({}); setSubmitted(false) }}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-ink-muted underline hover:text-brand-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Start again
        </button>

        <Disclaimer>
          This checklist is a guide to help you reflect, not a medical or care assessment. It doesn&rsquo;t collect or
          store any personal details. Always speak to a GP about any health concern.
        </Disclaimer>
      </div>
    )
  }

  return (
    <div>
      <ol className="space-y-5">
        {QUESTIONS.map((q, i) => (
          <li key={i}>
            <p className="text-sm font-medium text-brand-ink">{q}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {OPTIONS.map((o) => {
                const selected = answers[i] === o.score
                return (
                  <button
                    key={o.label}
                    type="button"
                    onClick={() => setAnswers((a) => ({ ...a, [i]: o.score }))}
                    style={selected ? { borderColor: ACCENT, background: ACCENT_SOFT } : undefined}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${selected ? 'text-brand-ink' : 'border-brand-line text-brand-ink-soft hover:border-brand-ink/30'}`}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6">
        <ToolButton onClick={() => setSubmitted(true)} disabled={!answered}>
          See what your answers suggest
        </ToolButton>
        {!answered && (
          <p className="mt-2 text-xs text-brand-ink-muted">Answer each question to see your result.</p>
        )}
      </div>

      <Disclaimer>Private and anonymous — nothing you select is stored.</Disclaimer>
    </div>
  )
}
