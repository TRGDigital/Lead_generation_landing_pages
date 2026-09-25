import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import {
  DAILY_AUDIT_TARGET,
  contentTask,
  getAuditTasks,
  getCompleted,
  getContentSlot,
  getManualTasks,
  type Task,
} from '@/lib/daily'
import { getAreaPageTasks, careSitesConfigured } from '@/lib/care-sites'
import { completeTask, reopenTask, snoozeTask, addManualTask } from './actions'

export const metadata: Metadata = { title: 'Today — Admin' }
export const dynamic = 'force-dynamic'

const SEVERITY_STYLE: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-neutral-100 text-neutral-600',
}

function TaskRow({ task, link }: { task: Task; link?: string }) {
  const hidden = (
    <>
      <input type="hidden" name="fingerprint" value={task.fingerprint} />
      <input type="hidden" name="kind" value={task.kind} />
      <input type="hidden" name="host" value={task.host ?? ''} />
      <input type="hidden" name="clientName" value={task.clientName ?? ''} />
      <input type="hidden" name="title" value={task.title} />
      <input type="hidden" name="detail" value={task.detail} />
      <input type="hidden" name="category" value={task.category} />
      <input type="hidden" name="severity" value={task.severity ?? ''} />
    </>
  )

  return (
    <li className="flex items-start gap-3 border-b border-brand-line py-3 last:border-0">
      <form action={completeTask} className="pt-0.5">
        {hidden}
        <button
          type="submit"
          title="Mark as done"
          aria-label={`Mark done: ${task.title}`}
          className="h-5 w-5 rounded border-2 border-brand-line hover:border-brand-pop hover:bg-brand-pop/10"
        />
      </form>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {task.severity && (
            <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium uppercase ${SEVERITY_STYLE[task.severity]}`}>
              {task.severity}
            </span>
          )}
          <span className="text-xs text-brand-ink-muted">{task.clientName ?? 'Internal'}</span>
          {task.category && <span className="text-xs text-brand-ink-muted">· {task.category}</span>}
        </div>
        <p className="mt-1 text-sm font-medium text-brand-ink">
          {task.title}
          {link && (
            <a href={link} target="_blank" rel="noopener" className="ml-2 text-xs text-brand-pop underline">
              open the blog
            </a>
          )}
        </p>
        {task.detail && <p className="mt-0.5 text-sm leading-snug text-brand-ink-soft">{task.detail}</p>}
      </div>

      {task.kind === 'content' ? (
        // No snoozing the minimum. It is one piece a week per site.
        <span className="pt-0.5 text-xs text-brand-ink-muted">minimum</span>
      ) : (
        <form action={snoozeTask} className="pt-0.5">
          {hidden}
          <input type="hidden" name="days" value="7" />
          <button type="submit" className="text-xs text-brand-ink-muted underline hover:text-brand-ink">
            Not this week
          </button>
        </form>
      )}
    </li>
  )
}

export default async function TodayPage() {
  await requireAdmin()
  const [auditTasks, manual, content, completed, areaTasks] = await Promise.all([
    getAuditTasks(),
    getManualTasks(),
    getContentSlot(),
    getCompleted(undefined, 40),
    careSitesConfigured() ? getAreaPageTasks() : Promise.resolve([]),
  ])

  const open = auditTasks.filter((t) => t.status === 'open')
  const todays = open.slice(0, DAILY_AUDIT_TARGET)
  // The content piece leads, because it is the minimum for the day and the work that
  // compounds. Six audit items behind it, so seven in total.
  const dayList: Task[] =
    content.slot && !content.done
      ? [contentTask(content.slot, content.fingerprint), ...todays]
      : todays
  const doneToday = completed.filter(
    (t) => t.doneAt && new Date(t.doneAt).toDateString() === new Date().toDateString(),
  )

  // Per client, so the numbers can be read out loud on a call.
  const byClient = new Map<string, { open: number; done: number }>()
  for (const t of auditTasks) {
    const key = t.clientName ?? 'Internal'
    const row = byClient.get(key) ?? { open: 0, done: 0 }
    if (t.status === 'done') row.done++
    else row.open++
    byClient.set(key, row)
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-brand-ink">Today</h1>
        <p className="text-sm text-brand-ink-soft">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          {doneToday.length > 0 && ` · ${doneToday.length} done so far`}
        </p>
      </div>

      {/* Today's work: the content piece, then the six */}
      <section className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold text-brand-ink">
            {dayList.length} to do today
          </h2>
          <span className="text-xs text-brand-ink-muted">
            {open.length} audit items open. Worst first. Anything left is still here tomorrow.
          </span>
        </div>

        {dayList.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-brand-line p-6 text-center text-sm text-brand-ink-soft">
            Nothing open. Either run an audit, or take the afternoon off.
          </p>
        ) : (
          <ul className="mt-2 rounded-xl border border-brand-line bg-white px-4">
            {dayList.map((t) => (
              <TaskRow key={t.fingerprint} task={t} link={t.kind === 'content' ? content.slot?.url : undefined} />
            ))}
          </ul>
        )}

        {content.slot && content.done && (
          <p className="mt-2 text-xs text-brand-ink-soft">
            Content for {content.slot.label} is done this week. Nothing else owed there until next week.
          </p>
        )}
        {!content.slot && (
          <p className="mt-2 text-xs text-brand-ink-soft">No content slot at the weekend. Enjoy it.</p>
        )}
      </section>

      {/* Anything added by hand */}
      <section className="mt-6">
        <h2 className="font-display text-lg font-semibold text-brand-ink">Your own list</h2>
        {manual.length > 0 && (
          <ul className="mt-2 rounded-xl border border-brand-line bg-white px-4">
            {manual.map((t) => (
              <TaskRow key={t.fingerprint} task={t} />
            ))}
          </ul>
        )}
        <form action={addManualTask} className="mt-2 flex flex-wrap gap-2">
          <input
            name="title"
            placeholder="Something that is not in an audit"
            className="min-w-[240px] flex-1 rounded-lg border border-brand-line px-3 py-2 text-sm"
          />
          <input
            name="clientName"
            placeholder="Client (optional)"
            className="w-44 rounded-lg border border-brand-line px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-lg bg-brand-ink px-3 py-2 text-sm font-semibold text-white">
            Add
          </button>
        </form>
      </section>

      {/* Area pages on the care sites: in the mix, but not competing with today's six */}
      <section className="mt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold text-brand-ink">Local area pages</h2>
          <span className="text-xs text-brand-ink-muted">
            {areaTasks.length} with work outstanding, across Crossways and Ferndale
          </span>
        </div>
        {areaTasks.length === 0 ? (
          <p className="mt-2 text-sm text-brand-ink-soft">
            Nothing outstanding, or the care databases are not reachable from here.
          </p>
        ) : (
          <>
            <ul className="mt-2 rounded-xl border border-brand-line bg-white px-4">
              {areaTasks.slice(0, 3).map((a) => (
                <li
                  key={`${a.site.key}${a.path}`}
                  className="flex items-center justify-between gap-3 border-b border-brand-line py-2.5 text-sm last:border-0"
                >
                  <span className="min-w-0 truncate">
                    <span className="text-brand-ink-muted">{a.site.label}</span>{' '}
                    <span className="font-mono text-xs text-brand-ink">{a.path}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[11px] ${
                        a.need === 'no local facts'
                          ? 'bg-amber-100 text-amber-800'
                          : a.need === 'unpublished'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {a.need}
                    </span>
                    <a
                      href={a.site.adminUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-xs text-brand-pop underline"
                    >
                      Open
                    </a>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-brand-ink-muted">
              Ordered by what actually changes the page: local facts first, then pages never refreshed. Three shown
              so they stay in the mix without crowding out the audit work.
            </p>
          </>
        )}
      </section>

      {/* The record, which is the bit clients pay attention to */}
      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-brand-ink">Completed</h2>
        <p className="mt-1 text-sm text-brand-ink-soft">
          Dated, per client, so a month of work can be shown rather than described.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {[...byClient.entries()].map(([client, n]) => (
            <span key={client} className="rounded-lg border border-brand-line bg-white px-3 py-1.5 text-xs">
              <span className="font-semibold text-brand-ink">{client}</span>
              <span className="text-brand-ink-muted">
                {' '}
                · {n.done} done · {n.open} open
              </span>
            </span>
          ))}
        </div>

        {completed.length > 0 && (
          <ul className="mt-3 rounded-xl border border-brand-line bg-white px-4">
            {completed.slice(0, 15).map((t) => (
              <li
                key={t.fingerprint}
                className="flex items-start justify-between gap-3 border-b border-brand-line py-2.5 text-sm last:border-0"
              >
                <div className="min-w-0">
                  <span className="text-brand-ink">{t.title}</span>
                  <span className="ml-2 text-xs text-brand-ink-muted">{t.clientName}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-brand-ink-muted">
                    {t.doneAt && new Date(t.doneAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                  <form action={reopenTask}>
                    <input type="hidden" name="fingerprint" value={t.fingerprint} />
                    <input type="hidden" name="kind" value={t.kind} />
                    <input type="hidden" name="host" value={t.host ?? ''} />
                    <input type="hidden" name="clientName" value={t.clientName ?? ''} />
                    <input type="hidden" name="title" value={t.title} />
                    <input type="hidden" name="category" value={t.category} />
                    <input type="hidden" name="severity" value={t.severity ?? ''} />
                    <button type="submit" className="text-xs text-brand-ink-muted underline hover:text-brand-ink">
                      Reopen
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
