'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { QuizQuestion } from '@/lib/care-finder'
import { QuestionsEditor } from '@/components/admin/QuizEditor'
import { createExperiment, saveExperimentVariant, setExperimentStatus } from '@/app/admin/quiz/actions'

export type ExperimentRow = {
  id: string
  question_set: string
  name: string
  status: string
  variant_b: QuizQuestion[]
  created_at: string
}
export type VariantStats = { started: number; leads: number; completed: number }

function rate(n: number, d: number) {
  return d > 0 ? `${Math.round((n / d) * 1000) / 10}%` : '—'
}

const STATUS_TONE: Record<string, string> = {
  running: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-slate-100 text-slate-600',
  stopped: 'bg-slate-200 text-slate-500',
}

export function ExperimentsSection({
  sets,
  experiments,
  results,
}: {
  sets: { key: string; name: string }[]
  experiments: ExperimentRow[]
  results: Record<string, VariantStats>
}) {
  const [name, setName] = useState('')
  const [tpl, setTpl] = useState(sets[0]?.key ?? '')
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function create() {
    if (!name.trim() || !tpl) return
    setError(null)
    startTransition(async () => {
      try {
        await createExperiment(tpl, name.trim())
        setName('')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to create')
      }
    })
  }

  return (
    <div className="space-y-5">
      {/* create */}
      <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/20 p-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Test name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Friendlier hero question" className="w-64" />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Template</label>
          <select value={tpl} onChange={(e) => setTpl(e.target.value)} className="rounded-md border bg-background px-2 py-2 text-sm">
            {sets.map((s) => (
              <option key={s.key} value={s.key}>{s.name}</option>
            ))}
          </select>
        </div>
        <Button onClick={create} disabled={pending || !name.trim()}>
          {pending ? 'Creating…' : 'New test'}
        </Button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {experiments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tests yet. Create one, edit its variant B wording, then start it.</p>
      ) : (
        <div className="space-y-3">
          {experiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              exp={exp}
              setName={sets.find((s) => s.key === exp.question_set)?.name ?? exp.question_set}
              a={results[`${exp.id}:A`]}
              b={results[`${exp.id}:B`]}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ExperimentCard({
  exp,
  setName,
  a,
  b,
}: {
  exp: ExperimentRow
  setName: string
  a?: VariantStats
  b?: VariantStats
}) {
  const [pending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function setStatus(status: 'draft' | 'running' | 'stopped') {
    setError(null)
    startTransition(async () => {
      try {
        await setExperimentStatus(exp.id, status)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed')
      }
    })
  }

  const sA = a ?? { started: 0, leads: 0, completed: 0 }
  const sB = b ?? { started: 0, leads: 0, completed: 0 }
  const winner =
    sA.started >= 5 && sB.started >= 5
      ? sB.leads / sB.started > sA.leads / sA.started
        ? 'B'
        : sA.leads / sA.started > sB.leads / sB.started
          ? 'A'
          : null
      : null

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{exp.name}</span>
        <Badge variant="outline">{setName}</Badge>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[exp.status] ?? STATUS_TONE.draft}`}>
          {exp.status}
        </span>
        <div className="ml-auto flex items-center gap-2">
          {exp.status !== 'running' ? (
            <Button size="sm" onClick={() => setStatus('running')} disabled={pending}>Start</Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={() => setStatus('stopped')} disabled={pending}>Stop</Button>
          )}
          <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>
            {editing ? 'Close wording' : 'Edit variant B'}
          </Button>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {/* results */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        {([['A (live wording)', sA], ['B (variant)', sB]] as const).map(([label, s], i) => {
          const v = i === 0 ? 'A' : 'B'
          return (
            <div key={label} className={`rounded-md border p-3 ${winner === v ? 'border-emerald-400 bg-emerald-50/50' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{label}</span>
                {winner === v && <span className="text-xs font-semibold text-emerald-700">leading</span>}
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <Stat label="Started" value={s.started} />
                <Stat label="Leads" value={s.leads} />
                <Stat label="Conv." value={rate(s.leads, s.started)} />
              </div>
            </div>
          )
        })}
      </div>
      {sA.started < 5 || sB.started < 5 ? (
        <p className="mt-2 text-xs text-muted-foreground">Collect more visitors per variant before reading the result.</p>
      ) : null}

      {editing && (
        <div className="mt-4 border-t pt-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Variant B wording (shown to half of visitors while the test runs). Question structure mirrors the live template.
          </p>
          <QuestionsEditor
            initial={exp.variant_b}
            onSave={(qs) => saveExperimentVariant(exp.id, qs)}
            savedHint="variant B updated"
          />
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded bg-muted/40 py-1.5">
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  )
}
