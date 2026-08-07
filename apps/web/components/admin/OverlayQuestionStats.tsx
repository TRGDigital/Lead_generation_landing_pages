import type { OverlayQuestionStat } from '@/lib/websites'

// Per-question performance of the pop overlay quiz: where people drop off, and
// how they answer each question. Mirrors the /go Performance tab.
export default function OverlayQuestionStats({ data }: { data: { starts: number; questions: OverlayQuestionStat[] } }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-brand-ink-muted">
        {data.starts} visitor{data.starts === 1 ? '' : 's'} started the quiz in the last 30 days. Below: how each question performs.
      </p>
      {data.questions.map((q, i) => (
        <div key={q.question} className="rounded-xl border border-brand-line p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="font-medium text-brand-ink">{i + 1}. {q.question}</p>
            <span className="flex shrink-0 items-center gap-2 text-xs">
              <span className="rounded-full bg-brand-bg-warm px-2 py-0.5 font-semibold text-brand-ink-muted">{q.answered} answered</span>
              <span className={`rounded-full px-2 py-0.5 font-semibold ${q.dropOffPct > 30 ? 'bg-red-50 text-red-700' : q.dropOffPct > 15 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                {q.dropOffPct}% drop-off
              </span>
            </span>
          </div>
          <div className="mt-3 space-y-1.5">
            {q.options.map((o) => (
              <div key={o.option} className="flex items-center gap-3 text-sm">
                <span className="w-40 shrink-0 truncate text-brand-ink-soft sm:w-56" title={o.option}>{o.option}</span>
                <span className="h-3 flex-1 overflow-hidden rounded-full bg-brand-bg-warm">
                  <span className="block h-full rounded-full bg-brand-accent" style={{ width: `${o.pct}%` }} />
                </span>
                <span className="w-14 shrink-0 text-right text-xs font-semibold text-brand-ink">{o.count} · {o.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className="text-[11px] text-brand-ink-muted">
        Answer percentages are of all answers to that question. Drop-off is the share of quiz starters who never reached it.
      </p>
    </div>
  )
}
