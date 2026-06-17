'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { QuestionSet, QuizQuestion, QuizOption } from '@/lib/care-finder'
import { saveQuestionSet } from '@/app/admin/quiz/actions'

type SetRow = QuestionSet & { status: string }

const TYPE_LABEL: Record<QuizQuestion['type'], string> = {
  single: 'Single choice',
  multi: 'Multiple choice',
  budget: 'Budget range',
  contact: 'Contact details',
}

export function QuizEditor({ sets }: { sets: SetRow[] }) {
  const [active, setActive] = useState(sets[0]?.key ?? '')
  const current = sets.find((s) => s.key === active)

  if (!current) {
    return <p className="text-sm text-muted-foreground">No quiz templates found.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {sets.map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(s.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              s.key === active
                ? 'border-violet-600 bg-violet-600 text-white'
                : 'border-border bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            {s.name}
            <span className="ml-1.5 opacity-70">({s.questions.length})</span>
          </button>
        ))}
      </div>

      {/* key forces fresh local state when switching templates */}
      <QuestionsEditor
        key={current.key}
        initial={current.questions}
        onSave={(qs) => saveQuestionSet(current.key, qs)}
        savedHint="live on your landing pages"
      />
    </div>
  )
}

// Reusable wording form for a questions array. Used for the live template wording
// and (with a different onSave) for an experiment's variant-B wording.
export function QuestionsEditor({
  initial,
  onSave,
  savedHint,
}: {
  initial: QuizQuestion[]
  onSave: (questions: QuizQuestion[]) => Promise<unknown>
  savedHint: string
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    JSON.parse(JSON.stringify(initial)) as QuizQuestion[],
  )
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dirty = JSON.stringify(questions) !== JSON.stringify(initial)

  function patchQuestion(idx: number, patch: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)))
    setSaved(false)
  }

  function patchOption(qIdx: number, oIdx: number, patch: Partial<QuizOption>) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx || !q.options) return q
        return { ...q, options: q.options.map((o, j) => (j === oIdx ? { ...o, ...patch } : o)) }
      }),
    )
    setSaved(false)
  }

  function save() {
    setError(null)
    startTransition(async () => {
      try {
        await onSave(questions)
        setSaved(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Save failed')
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 -mx-1 flex items-center justify-between gap-3 rounded-md border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="text-sm text-muted-foreground">
          {dirty ? (
            <span className="font-medium text-amber-600">Unsaved changes</span>
          ) : saved ? (
            <span className="font-medium text-emerald-600">Saved · {savedHint}</span>
          ) : (
            <span>{questions.length} questions</span>
          )}
        </div>
        <Button onClick={save} disabled={pending || !dirty}>
          {pending ? 'Saving…' : 'Save wording'}
        </Button>
      </div>
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {questions.map((q, qIdx) => (
        <div key={q.id} className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
              {qIdx + 1}
            </span>
            <Badge variant="secondary">{TYPE_LABEL[q.type]}</Badge>
            {q.optional && <Badge variant="outline">Skippable</Badge>}
            <code className="ml-auto text-[11px] text-muted-foreground">{q.id}</code>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Question</label>
            <Input value={q.title} onChange={(e) => patchQuestion(qIdx, { title: e.target.value })} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Helper text (optional)</label>
            <Textarea
              rows={2}
              value={q.subtitle ?? ''}
              onChange={(e) => patchQuestion(qIdx, { subtitle: e.target.value || undefined })}
              placeholder="Shown under the question…"
            />
          </div>

          {q.titleIf && (
            <div className="space-y-1 rounded-md bg-muted/40 p-2">
              <label className="text-xs font-medium text-muted-foreground">
                Alternate question (when “{q.titleIf.questionId}” = “{q.titleIf.equals}”)
              </label>
              <Input
                value={q.titleIf.title}
                onChange={(e) =>
                  patchQuestion(qIdx, { titleIf: { ...q.titleIf!, title: e.target.value } })
                }
              />
            </div>
          )}

          {q.options && q.options.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Answer options</label>
              {q.options.map((o, oIdx) => (
                <div key={o.value} className="grid grid-cols-1 gap-2 rounded-md border bg-muted/20 p-2 sm:grid-cols-2">
                  <Input
                    value={o.label}
                    onChange={(e) => patchOption(qIdx, oIdx, { label: e.target.value })}
                    placeholder="Option label"
                  />
                  <Input
                    value={o.description ?? ''}
                    onChange={(e) => patchOption(qIdx, oIdx, { description: e.target.value || undefined })}
                    placeholder="Description (optional)"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end pt-2">
        <Button onClick={save} disabled={pending || !dirty}>
          {pending ? 'Saving…' : 'Save wording'}
        </Button>
      </div>
    </div>
  )
}
