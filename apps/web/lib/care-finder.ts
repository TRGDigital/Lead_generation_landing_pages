import { createServiceClient } from '@/lib/supabase/server'

// A gamified multi-step "care finder" quiz, rendered on the location landing pages.
// Templates ('residential' | 'nursing') live in question_sets and are editable in
// admin. Answers are captured on the lead and emailed to buyers.

export type QuizOption = { value: string; label: string; description?: string }

export type QuizQuestion = {
  id: string
  type: 'single' | 'multi' | 'budget' | 'contact'
  title: string
  subtitle?: string
  optional?: boolean
  options?: QuizOption[]
  // Conditional title (e.g. age question becomes "How old are you?" when who_for = myself).
  titleIf?: { questionId: string; equals: string; title: string }
}

export type QuestionSet = { key: string; name: string; questions: QuizQuestion[] }

export type QuizExperiment = {
  id: string
  question_set: string
  name: string
  status: string
  variant_b: QuizQuestion[]
}

// Map a quiz care_type answer → a buyer-matchable care_type string (buyers tick
// Residential / Nursing / Dementia; the others fold into the nearest).
const CARE_TYPE_LABEL: Record<string, string> = {
  residential: 'Residential care',
  nursing:     'Nursing care',
  dementia:    'Dementia care',
  palliative:  'Nursing care',
  respite:     'Residential care',
  assisted:    'Residential care',
}
export function careTypeLabel(value?: string | null): string {
  return (value && CARE_TYPE_LABEL[value]) || 'Residential care'
}

export async function getQuestionSet(key: string): Promise<QuestionSet | null> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('question_sets')
    .select('key, name, questions')
    .eq('key', key)
    .eq('status', 'active')
    .single()
  return (data as QuestionSet | null) ?? null
}

// The running A/B experiment for a template (variant B wording), if any.
export async function getRunningExperiment(key: string): Promise<QuizExperiment | null> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('quiz_experiments')
    .select('id, question_set, name, status, variant_b')
    .eq('question_set', key)
    .eq('status', 'running')
    .maybeSingle()
  return (data as QuizExperiment | null) ?? null
}

// Pretty-print the captured answers for the buyer email / admin (label-resolved,
// in the template's question order). Returns [{ question, answer }] skipping blanks.
export function formatAnswers(set: QuestionSet | null, answers: Record<string, any>): Array<{ question: string; answer: string }> {
  if (!set) return []
  const out: Array<{ question: string; answer: string }> = []
  for (const q of set.questions) {
    if (q.type === 'contact') continue
    const raw = answers?.[q.id]
    if (raw == null || raw === '' || (Array.isArray(raw) && raw.length === 0)) continue

    // Resolve the conditional title.
    let title = q.title
    if (q.titleIf && answers?.[q.titleIf.questionId] === q.titleIf.equals) title = q.titleIf.title

    let answer = ''
    if (q.type === 'budget' && typeof raw === 'object') {
      const min = raw.min ? `£${raw.min}` : ''
      const max = raw.max ? `£${raw.max}` : ''
      answer = [min, max].filter(Boolean).join(' to ') || ''
      if (!answer) continue
    } else {
      const labelFor = (v: string) => q.options?.find(o => o.value === v)?.label ?? v
      answer = Array.isArray(raw) ? raw.map(labelFor).join(', ') : labelFor(String(raw))
    }
    out.push({ question: title, answer })
  }
  return out
}
