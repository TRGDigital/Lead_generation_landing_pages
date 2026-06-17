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
