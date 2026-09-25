// The day's work, assembled from what the other systems already know.
//
// The point of this is not to be another to-do list. Work arrives faster than it can
// be triaged, and most of it is already recorded somewhere: the site audits know what
// is broken and how badly, and the content rotation knows whose turn it is. This turns
// both into a short list and keeps a dated record of what was done, which is what
// justifies a retainer at month three.

import { createServiceClient } from '@/lib/supabase/server'

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export type Task = {
  id: string | null
  fingerprint: string
  kind: 'audit' | 'content' | 'manual'
  host: string | null
  clientName: string | null
  title: string
  detail: string
  category: string
  severity: Severity | null
  status: 'open' | 'done' | 'skipped'
  doneAt: string | null
  doneNote: string | null
}

const SEVERITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
const ACTIONABLE = new Set(['critical', 'high', 'medium', 'low'])

/** How many audit items a day. Enough to be real progress, few enough to finish. */
export const DAILY_AUDIT_TARGET = 6

/**
 * The content task, which is the bar minimum every weekday: one piece for whichever
 * site it is the turn of. Five sites, five weekdays, so each gets one a week. It sits
 * in the list rather than above it, because a thing in a banner is a thing you stop
 * seeing, and this is the work that compounds.
 */
export const CONTENT_TASK_TITLE = 'New content: a blog post or a collection page'

/**
 * One property per weekday, because a piece of content for all five every day was
 * never going to happen. Sunday and Saturday are deliberately empty.
 */
export const CONTENT_ROTATION: Record<number, { key: string; label: string; url?: string }> = {
  1: { key: 'trgdigital', label: 'TRG Digital', url: 'https://www.trgdigital.co.uk/blog' },
  2: { key: 'carestream', label: 'CareStream', url: 'https://www.carestreamai.com/blog' },
  3: { key: 'careassura', label: 'CareAssura', url: 'https://careassura.com/blog' },
  4: { key: 'crossways', label: 'Crossways Care Home', url: 'https://crosswayscarehome.co.uk/blog/' },
  5: { key: 'ferndale', label: 'Ferndale Nursing Home', url: 'https://ferndalenursinghome.co.uk/blog/' },
}

/** host|category|title, lowercased. Stable across re-runs of the same audit. */
function fingerprintOf(host: string, category: string, title: string) {
  return `${host}|${category}|${title}`.toLowerCase().replace(/\s+/g, ' ').trim()
}

/** Monday-based ISO week key, so a content slot is once per week per property. */
export function weekKey(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const day = t.getUTCDay() || 7
  t.setUTCDate(t.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((t.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}

type Finding = {
  title?: string
  summary?: string
  detail?: string
  fix?: string
  category?: string
  severity?: string
  count?: number | null
}

/**
 * Open audit work across every client, newest audit per host only, merged with
 * whatever has already been ticked off. A finding that has been fixed stays out of
 * the list even when the audit is re-run and reports it again, until someone reopens
 * it, which is the honest behaviour: the record says when it was done.
 */
export async function getAuditTasks(): Promise<Task[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any

  const [{ data: audits }, { data: saved }, { data: sites }] = await Promise.all([
    db
      .from('site_audits')
      .select('id, host, client_name, findings, created_at')
      .eq('status', 'done')
      .order('created_at', { ascending: false })
      .limit(50),
    db.from('daily_tasks').select('*').eq('kind', 'audit'),
    db.from('websites').select('url'),
  ])

  // The audit tool is also run over prospects. Only sites we actually run belong in
  // the day's work, and the websites table is the list of those.
  const ours = new Set<string>()
  for (const w of (sites ?? []) as { url: string }[]) {
    try {
      ours.add(new URL(w.url).hostname.replace(/^www\./, '').toLowerCase())
    } catch {
      /* a malformed url in the table should not break the page */
    }
  }

  const savedByFingerprint = new Map<string, Record<string, unknown>>()
  for (const row of (saved ?? []) as Record<string, unknown>[]) {
    savedByFingerprint.set(row.fingerprint as string, row)
  }

  // Newest audit per host wins; older runs are history.
  const latestPerHost = new Map<string, Record<string, unknown>>()
  for (const a of (audits ?? []) as Record<string, unknown>[]) {
    const host = ((a.host as string) ?? '').replace(/^www\./, '').toLowerCase()
    if (!host || !ours.has(host)) continue
    if (!latestPerHost.has(host)) latestPerHost.set(host, a)
  }

  const tasks: Task[] = []
  for (const [host, audit] of latestPerHost) {
    const findings = Array.isArray(audit.findings) ? (audit.findings as Finding[]) : []
    for (const f of findings) {
      const severity = (f.severity ?? '').toLowerCase()
      if (!ACTIONABLE.has(severity)) continue
      const title = (f.title ?? '').trim()
      if (!title) continue
      const category = (f.category ?? 'other').trim()
      const fingerprint = fingerprintOf(host, category, title)
      const row = savedByFingerprint.get(fingerprint)
      tasks.push({
        id: (row?.id as string) ?? null,
        fingerprint,
        kind: 'audit',
        host,
        clientName: (audit.client_name as string) ?? host,
        title,
        detail: [f.summary, f.fix].filter(Boolean).join(' ').trim(),
        category,
        severity: severity as Severity,
        status: ((row?.status as Task['status']) ?? 'open'),
        doneAt: (row?.done_at as string) ?? null,
        doneNote: (row?.done_note as string) ?? null,
      })
    }
  }

  tasks.sort(
    (a, b) =>
      (SEVERITY_ORDER[a.severity ?? 'low'] ?? 9) - (SEVERITY_ORDER[b.severity ?? 'low'] ?? 9) ||
      a.clientName!.localeCompare(b.clientName!),
  )
  return tasks
}

/** Manual tasks someone added by hand, plus anything else not from an audit. */
export async function getManualTasks(): Promise<Task[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data } = await db
    .from('daily_tasks')
    .select('*')
    .eq('kind', 'manual')
    .neq('status', 'done')
    .order('created_at', { ascending: true })
  return ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    id: r.id as string,
    fingerprint: r.fingerprint as string,
    kind: 'manual' as const,
    host: (r.host as string) ?? null,
    clientName: (r.client_name as string) ?? null,
    title: r.title as string,
    detail: (r.detail as string) ?? '',
    category: (r.category as string) ?? 'manual',
    severity: (r.severity as Severity) ?? null,
    status: r.status as Task['status'],
    doneAt: (r.done_at as string) ?? null,
    doneNote: (r.done_note as string) ?? null,
  }))
}

/** The content slot as a task, so it can sit in the same list as everything else. */
export function contentTask(
  slot: { key: string; label: string; url?: string },
  fingerprint: string,
): Task {
  return {
    id: null,
    fingerprint,
    kind: 'content',
    host: null,
    clientName: slot.label,
    title: CONTENT_TASK_TITLE,
    detail: 'The minimum for today. One piece per site per week, so this is the only one owed.',
    category: 'content',
    severity: null,
    status: 'open',
    doneAt: null,
    doneNote: null,
  }
}

/** Whose turn it is to get a piece of content today, and whether it has been done. */
export async function getContentSlot(now = new Date()) {
  const slot = CONTENT_ROTATION[now.getDay()]
  if (!slot) return { slot: null, done: false, fingerprint: '' }
  const fingerprint = `content|${slot.key}|${weekKey(now)}`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data } = await db
    .from('daily_tasks')
    .select('status, done_at')
    .eq('fingerprint', fingerprint)
    .maybeSingle()
  return { slot, fingerprint, done: data?.status === 'done', doneAt: data?.done_at ?? null }
}

/** What was completed, newest first, for the client-facing record. */
export async function getCompleted(host?: string, limit = 200): Promise<Task[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  let q = db.from('daily_tasks').select('*').eq('status', 'done').order('done_at', { ascending: false }).limit(limit)
  if (host) q = q.eq('host', host)
  const { data } = await q
  return ((data ?? []) as Record<string, unknown>[]).map((r) => ({
    id: r.id as string,
    fingerprint: r.fingerprint as string,
    kind: (r.kind as Task['kind']) ?? 'audit',
    host: (r.host as string) ?? null,
    clientName: (r.client_name as string) ?? null,
    title: r.title as string,
    detail: (r.detail as string) ?? '',
    category: (r.category as string) ?? '',
    severity: (r.severity as Severity) ?? null,
    status: 'done',
    doneAt: (r.done_at as string) ?? null,
    doneNote: (r.done_note as string) ?? null,
  }))
}
