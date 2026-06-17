'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'

const ALLOWED = new Set(['residential', 'nursing'])

// Switch which care-finder template a landing page shows. The chosen template's
// questions appear in the quiz on that page (and feed its funnel + leads).
export async function setPageQuestionSet(slug: string, key: string) {
  await requireAdmin()
  if (!slug || !ALLOWED.has(key)) throw new Error('Invalid input')

  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('location_pages')
    .update({ question_set: key })
    .eq('slug', slug)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/pages')
  revalidatePath(`/lp/${slug}`)
  return { ok: true as const }
}
