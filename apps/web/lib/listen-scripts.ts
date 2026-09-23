// Per-page scripts for the "Listen to page" button.
//
// The welcome written for the homepage should not play on the SEO page, so each page
// can have its own script, written for the ear. Where no script has been written yet,
// the bar reads that page's own content with the browser voice, so a visitor is never
// told the wrong thing about the page they are on.

import { createServiceClient } from '@/lib/supabase/server'

export type ListenScript = { path: string; script: string; updated_at: string }

/** Trailing slashes and query strings stripped, so "/seo/" and "/seo" are one page. */
export function normalisePath(raw: string): string {
  const path = (raw || '/').split('?')[0]!.split('#')[0]!
  const trimmed = path.replace(/\/+$/, '')
  return trimmed === '' ? '/' : trimmed
}

export async function getListenScript(path: string): Promise<string> {
  const db = createServiceClient() as unknown as any
  const { data } = await db
    .from('listen_scripts')
    .select('script')
    .eq('path', normalisePath(path))
    .maybeSingle()
  return (data?.script ?? '').trim()
}

export async function getAllListenScripts(): Promise<ListenScript[]> {
  const db = createServiceClient() as unknown as any
  const { data } = await db.from('listen_scripts').select('path, script, updated_at').order('path')
  return (data ?? []) as ListenScript[]
}

export async function saveListenScript(path: string, script: string): Promise<void> {
  const db = createServiceClient() as unknown as any
  const { error } = await db
    .from('listen_scripts')
    .upsert({ path: normalisePath(path), script: script.slice(0, 20000), updated_at: new Date().toISOString() })
  if (error) throw new Error(error.message)
}
