import { createServiceClient } from '@/lib/supabase/server'
import FunnelChart from '@/components/admin/FunnelChart'
import type { Tables } from '@db/types'
import type { LeadStatus } from '@db/types'

type LeadRow = Pick<Tables<'leads'>, 'status'>

const FUNNEL_ORDER: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'tour_booked',
  'tour_completed',
  'assessed',
  'moved_in',
  'lost',
]

async function getFunnelData() {
  const supabase = createServiceClient()
  const { data } = await supabase.from('leads').select('status')
  const leads = (data ?? []) as unknown as LeadRow[]

  const counts: Record<string, number> = {}
  for (const lead of leads) {
    counts[lead.status] = (counts[lead.status] ?? 0) + 1
  }

  return FUNNEL_ORDER.filter((s) => (counts[s] ?? 0) > 0).map((s) => ({
    stage: s,
    count: counts[s] ?? 0,
  }))
}

// Care-finder quiz drop-off: per step, how many sessions reached it (per template).
async function getQuizFunnels() {
  const supabase = createServiceClient() as unknown as any
  const [{ data: sessions }, { data: sets }] = await Promise.all([
    supabase.from('quiz_sessions').select('question_set, step_reached, completed, lead_id'),
    supabase.from('question_sets').select('key, name, questions'),
  ])
  const setMap = new Map((sets ?? []).map((s: any) => [s.key, s]))
  const bySet: Record<string, any[]> = {}
  for (const s of (sessions ?? []) as any[]) (bySet[s.question_set] ??= []).push(s)

  return Object.entries(bySet).map(([key, sess]) => {
    const set = setMap.get(key) as any
    const questions = (set?.questions ?? []) as any[]
    const started = sess.length
    const steps = questions.map((qq: any, i: number) => ({
      index: i,
      label: String(qq.title ?? `Step ${i + 1}`),
      type: String(qq.type ?? ''),
      reached: sess.filter((x: any) => (x.step_reached ?? 0) >= i).length,
    }))
    return {
      key,
      name: String(set?.name ?? key),
      started,
      completed: sess.filter((x: any) => x.completed).length,
      leads: sess.filter((x: any) => x.lead_id).length,
      steps,
    }
  }).sort((a, b) => b.started - a.started)
}

export default async function FunnelPage() {
  const [data, quizFunnels] = await Promise.all([getFunnelData(), getQuizFunnels()])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Funnel</h1>
      {data.length === 0 ? (
        <p className="text-muted-foreground">No leads yet.</p>
      ) : (
        <div className="rounded-lg border bg-card p-6">
          <FunnelChart data={data} />
        </div>
      )}
      {/* Summary table */}
      {data.length > 0 && (
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Stage</th>
                <th className="px-4 py-2 text-right font-medium">Leads</th>
                <th className="px-4 py-2 text-right font-medium">% of total</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => {
                const total = data.reduce((s, r) => s + r.count, 0)
                return (
                  <tr key={row.stage} className="border-b last:border-0">
                    <td className="px-4 py-2 capitalize">{row.stage.replace(/_/g, ' ')}</td>
                    <td className="px-4 py-2 text-right">{row.count}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">
                      {total > 0 ? ((row.count / total) * 100).toFixed(1) : '0'}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Care-finder quiz drop-off */}
      {quizFunnels.length > 0 && (
        <div className="space-y-6 pt-2">
          <h2 className="text-xl font-semibold">Care Finder Quiz</h2>
          {quizFunnels.map((f) => (
            <div key={f.key} className="rounded-lg border bg-card p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-medium">{f.name}</h3>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span><strong className="text-foreground">{f.started}</strong> started</span>
                  <span><strong className="text-foreground">{f.leads}</strong> leads</span>
                  <span><strong className="text-foreground">{f.completed}</strong> completed</span>
                  <span><strong className="text-foreground">{f.started ? ((f.leads / f.started) * 100).toFixed(0) : 0}%</strong> capture</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {f.steps.map((s) => {
                  const pct = f.started ? (s.reached / f.started) * 100 : 0
                  return (
                    <div key={s.index} className="flex items-center gap-3 text-sm">
                      <span className="w-56 shrink-0 truncate text-muted-foreground" title={s.label}>{s.index + 1}. {s.label}{s.type === 'contact' ? ' (contact)' : ''}</span>
                      <div className="h-4 flex-1 overflow-hidden rounded bg-muted">
                        <div className={`h-full rounded ${s.type === 'contact' ? 'bg-emerald-500' : 'bg-violet-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-24 shrink-0 text-right tabular-nums">{s.reached} ({pct.toFixed(0)}%)</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
