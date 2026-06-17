import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'
import { QuizEditor } from '@/components/admin/QuizEditor'
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
    </div>
  )
}
