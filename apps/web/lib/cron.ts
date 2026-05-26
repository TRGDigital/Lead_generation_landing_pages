import { createServiceClient } from '@/lib/supabase/server'

export function verifyCronSecret(req: Request): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) return false
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${secret}`
}

export async function logCronRun(
  name: string,
  ok: boolean,
  summary: Record<string, unknown>
): Promise<void> {
  try {
    const db = createServiceClient() as unknown as any
    await db.from('cron_logs').insert({ cron_name: name, ok, summary })
  } catch (err) {
    console.error('[cron] Failed to write cron_log:', err)
  }
}
