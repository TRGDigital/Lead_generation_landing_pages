'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'

// Save the edited wording for a care-finder template. Only text fields are edited
// in the UI (titles, subtitles, option labels/descriptions); ids/types/values are
// preserved so existing leads + funnel data stay aligned.
export async function saveQuestionSet(key: string, questions: unknown) {
  await requireAdmin()
  if (!key || !Array.isArray(questions)) throw new Error('Invalid input')

  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('question_sets')
    .update({ questions, updated_at: new Date().toISOString() })
    .eq('key', key)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/quiz')
  revalidatePath('/lp', 'layout') // landing pages re-fetch the set (revalidate:60 anyway)
  return { ok: true as const }
}

// ---- A/B experiments -------------------------------------------------------

// Create a draft experiment for a template, seeding variant B with a clone of the
// current live wording so the admin edits from a known-good starting point.
export async function createExperiment(questionSet: string, name: string) {
  await requireAdmin()
  if (!questionSet || !name.trim()) throw new Error('Invalid input')

  const db = createServiceClient() as unknown as any
  const { data: set } = await db
    .from('question_sets')
    .select('questions')
    .eq('key', questionSet)
    .single()

  const { error } = await db.from('quiz_experiments').insert({
    question_set: questionSet,
    name: name.trim(),
    status: 'draft',
    variant_b: set?.questions ?? [],
  })
  if (error) throw new Error(error.message)

  revalidatePath('/admin/quiz')
  return { ok: true as const }
}

export async function saveExperimentVariant(id: string, questions: unknown) {
  await requireAdmin()
  if (!id || !Array.isArray(questions)) throw new Error('Invalid input')

  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('quiz_experiments')
    .update({ variant_b: questions, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/quiz')
  revalidatePath('/lp', 'layout')
  return { ok: true as const }
}

// Start/stop/draft an experiment. Starting one stops any other running experiment
// for the same template (the partial unique index also enforces one-running).
export async function setExperimentStatus(id: string, status: 'draft' | 'running' | 'stopped') {
  await requireAdmin()
  if (!id || !['draft', 'running', 'stopped'].includes(status)) throw new Error('Invalid input')

  const db = createServiceClient() as unknown as any

  if (status === 'running') {
    const { data: exp } = await db
      .from('quiz_experiments')
      .select('question_set')
      .eq('id', id)
      .single()
    if (exp?.question_set) {
      await db
        .from('quiz_experiments')
        .update({ status: 'stopped', updated_at: new Date().toISOString() })
        .eq('question_set', exp.question_set)
        .eq('status', 'running')
    }
  }

  const { error } = await db
    .from('quiz_experiments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/quiz')
  revalidatePath('/lp', 'layout')
  return { ok: true as const }
}
