import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { QuizEditor } from '@/components/admin/QuizEditor'
import { ExperimentsSection, type ExperimentRow, type VariantStats } from '@/components/admin/ExperimentsSection'
import type { QuestionSet } from '@/lib/care-finder'

export const dynamic = 'force-dynamic'

export default async function QuizAdminPage() {
  await requireAdmin()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data } = await db
    .from('question_sets')
    .select('key, name, questions, status')
    .order('key', { ascending: true })

  const sets = (data ?? []) as unknown as Array<QuestionSet & { status: string }>

  // A/B experiments + per-variant conversion (aggregated from quiz_sessions).
  const { data: expData } = await db
    .from('quiz_experiments')
    .select('id, question_set, name, status, variant_b, created_at')
    .order('created_at', { ascending: false })
  const experiments = (expData ?? []) as unknown as ExperimentRow[]

  const { data: sessData } = await db
    .from('quiz_sessions')
    .select('experiment_id, variant, completed, lead_id')
    .not('experiment_id', 'is', null)

  const results: Record<string, VariantStats> = {}
  for (const s of (sessData ?? []) as Array<{ experiment_id: string; variant: string | null; completed: boolean; lead_id: string | null }>) {
    const v = s.variant === 'B' ? 'B' : 'A'
    const k = `${s.experiment_id}:${v}`
    const r = (results[k] ??= { started: 0, leads: 0, completed: 0 })
    r.started++
    if (s.lead_id) r.leads++
    if (s.completed) r.completed++
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Care Finder</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Edit the wording of the gamified quiz shown on your landing pages. Templates are global — a change here
          applies to every landing page that uses that template. Question order and answer values are fixed so your
          funnel and lead data stay aligned; you can rewrite any title, helper text, or answer label.
        </p>
      </div>
      <QuizEditor sets={sets} />

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold">A/B wording tests</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Test an alternate wording (variant B) against the live wording (variant A). While a test is running,
          visitors are split 50/50 and we track which version turns more visitors into leads.
        </p>
        <div className="mt-4">
          <ExperimentsSection sets={sets.map((s) => ({ key: s.key, name: s.name }))} experiments={experiments} results={results} />
        </div>
      </div>
    </div>
  )
}
