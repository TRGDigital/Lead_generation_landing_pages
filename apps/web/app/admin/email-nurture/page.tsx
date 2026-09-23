import { requireAdmin } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { SEQUENCE } from '@/lib/tool-nurture/sequence'
import NurturePreviewButton from '@/components/admin/NurturePreviewButton'
import NurtureSubscribersCsv, { type SubscriberRow } from '@/components/admin/NurtureSubscribersCsv'
import { TOOLS } from '@/lib/tools'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Email nurture' }

type SendRow = {
  email_id: string
  is_preview: boolean
  delivered_at: string | null
  opened_at: string | null
  clicked_at: string | null
  bounced_at: string | null
  unsubscribed_at: string | null
}

type Agg = { sent: number; previews: number; delivered: number; opened: number; clicked: number; bounced: number; unsub: number }

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}

const pct = (n: number, d: number) => (d > 0 ? `${Math.round((n / d) * 100)}%` : '—')

type Props = { searchParams?: { tab?: string } }

const toolName = (slug: string) => {
  const t = TOOLS.find((x) => x.href.split('/').filter(Boolean).pop() === slug)
  return t?.title ?? slug.replace(/-/g, ' ')
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export default async function EmailNurtureAdmin({ searchParams }: Props) {
  await requireAdmin()
  const tab = searchParams?.tab === 'signups' ? 'signups' : 'performance'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any

  const [{ data: sends }, { data: enr }] = await Promise.all([
    db
      .from('nurture_sends')
      .select('email_id, is_preview, delivered_at, opened_at, clicked_at, bounced_at, unsubscribed_at')
      .limit(20000),
    db
      .from('nurture_enrollments')
      .select('id, email, name, tool_slug, status, enrolled_at')
      .order('enrolled_at', { ascending: false })
      .limit(5000),
  ])

  const rows = (sends ?? []) as SendRow[]
  const byEmail = new Map<string, Agg>()
  for (const r of rows) {
    const a = byEmail.get(r.email_id) ?? { sent: 0, previews: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsub: 0 }
    a.sent++
    if (r.is_preview) a.previews++
    if (r.delivered_at) a.delivered++
    if (r.opened_at) a.opened++
    if (r.clicked_at) a.clicked++
    if (r.bounced_at) a.bounced++
    if (r.unsubscribed_at) a.unsub++
    byEmail.set(r.email_id, a)
  }

  const totals = rows.reduce(
    (t, r) => {
      t.sent++
      if (r.delivered_at) t.delivered++
      if (r.opened_at) t.opened++
      if (r.clicked_at) t.clicked++
      return t
    },
    { sent: 0, delivered: 0, opened: 0, clicked: 0 },
  )
  const denomAll = totals.delivered || totals.sent

  const enrolments = (enr ?? []) as {
    id: string
    email: string
    name: string | null
    tool_slug: string | null
    status: string
    enrolled_at: string
  }[]
  const enrTotal = enrolments.length
  const enrActive = enrolments.filter((e) => e.status === 'active').length
  const enrUnsub = enrolments.filter((e) => e.status === 'unsubscribed').length
  const enrDone = enrolments.filter((e) => e.status === 'completed').length

  // Per-person engagement, so the warmest sign-ups can be approached first.
  const { data: perPerson } = await db
    .from('nurture_sends')
    .select('enrollment_id, opened_at, clicked_at, is_preview')
    .limit(20000)
  const engagement = new Map<string, { sent: number; opened: number; clicked: number }>()
  for (const r of (perPerson ?? []) as { enrollment_id: string; opened_at: string | null; clicked_at: string | null; is_preview: boolean }[]) {
    if (r.is_preview || !r.enrollment_id) continue
    const e = engagement.get(r.enrollment_id) ?? { sent: 0, opened: 0, clicked: 0 }
    e.sent++
    if (r.opened_at) e.opened++
    if (r.clicked_at) e.clicked++
    engagement.set(r.enrollment_id, e)
  }

  const subscribers: SubscriberRow[] = enrolments.map((e) => {
    const eng = engagement.get(e.id) ?? { sent: 0, opened: 0, clicked: 0 }
    return {
      name: e.name ?? '',
      email: e.email,
      tool: e.tool_slug ? toolName(e.tool_slug) : 'Unknown',
      status: e.status,
      enrolled_at: e.enrolled_at,
      sent: eng.sent,
      opened: eng.opened,
      clicked: eng.clicked,
    }
  })

  const nurtureLive = process.env.NURTURE_ENABLED === 'true'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Email nurture</h1>
        <p className="text-sm text-muted-foreground">
          The automated email series sent to people who use a free tool. Preview each email, send yourself the whole
          set, and track how each one performs.
        </p>
      </div>

      <div
        className={`flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm ${
          nurtureLive ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'
        }`}
      >
        <span className={`inline-block h-2 w-2 rounded-full ${nurtureLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        {nurtureLive ? (
          <span>Live: new tool sign-ups are being enrolled and emailed automatically.</span>
        ) : (
          <span>
            Paused: sign-ups are <strong>not</strong> being emailed yet. Previews still work. Set{' '}
            <code className="rounded bg-white/70 px-1">NURTURE_ENABLED=true</code> in Vercel to go live.
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card label="Enrolled" value={String(enrTotal)} hint={`${enrActive} active · ${enrDone} finished · ${enrUnsub} unsubscribed`} />
        <Card label="Emails sent" value={String(totals.sent)} hint="incl. previews" />
        <Card label="Open rate" value={pct(totals.opened, denomAll)} hint={`${totals.opened} opened`} />
        <Card label="Click rate" value={pct(totals.clicked, denomAll)} hint={`${totals.clicked} clicked`} />
      </div>

      <div className="flex gap-1 border-b">
        {[
          { id: 'performance', label: 'Sequence performance' },
          { id: 'signups', label: `Sign-ups (${subscribers.length})` },
        ].map((t) => (
          <a
            key={t.id}
            href={t.id === 'performance' ? '/admin/email-nurture' : `/admin/email-nurture?tab=${t.id}`}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? 'border-[#F0532B] text-[#F0532B]'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      {tab === 'performance' && (
      <div className="rounded-lg border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Send yourself the full sequence</div>
            <div className="text-xs text-muted-foreground">One preview email per day, straight to your inbox.</div>
          </div>
          <NurturePreviewButton />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Day</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 text-right font-medium">Sent</th>
                <th className="px-4 py-3 text-right font-medium">Delivered</th>
                <th className="px-4 py-3 text-right font-medium">Opened</th>
                <th className="px-4 py-3 text-right font-medium">Clicked</th>
                <th className="px-4 py-3 text-right font-medium">Unsub</th>
                <th className="px-4 py-3 text-right font-medium">Preview</th>
              </tr>
            </thead>
            <tbody>
              {SEQUENCE.map((e) => {
                const a = byEmail.get(e.id) ?? { sent: 0, previews: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsub: 0 }
                const denom = a.delivered || a.sent
                return (
                  <tr key={e.id} className="border-b align-top last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-semibold tabular-nums">{e.day}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{e.subject}</div>
                      <div className="text-xs text-muted-foreground">{e.preheader}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {a.sent}
                      {a.previews > 0 && <span className="ml-1 text-xs text-muted-foreground">({a.previews} prev)</span>}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{a.delivered}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {a.opened} <span className="text-xs text-muted-foreground">{pct(a.opened, denom)}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {a.clicked} <span className="text-xs text-muted-foreground">{pct(a.clicked, denom)}</span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{a.unsub}</td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/api/admin/nurture/preview/${e.id}`}
                        target="_blank"
                        rel="noopener"
                        className="font-medium text-[#F0532B] hover:underline"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      )}

      {tab === 'signups' && (
        <div className="rounded-lg border bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Everyone who signed up through a free tool</div>
              <div className="text-xs text-muted-foreground">
                Newest first, with the tool they used and how they have engaged with the emails so far. Worth
                approaching the ones who have opened or clicked first.
              </div>
            </div>
            <NurtureSubscribersCsv rows={subscribers} />
          </div>

          {subscribers.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Nobody has signed up through a tool yet. As soon as someone leaves their details on a tool page they
              appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Tool used</th>
                    <th className="px-4 py-3 font-medium">Signed up</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 text-right font-medium">Sent</th>
                    <th className="px-4 py-3 text-right font-medium">Opened</th>
                    <th className="px-4 py-3 text-right font-medium">Clicked</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((r) => (
                    <tr key={`${r.email}-${r.enrolled_at}`} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{r.name || <span className="text-muted-foreground">—</span>}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${r.email}`} className="text-[#F0532B] hover:underline">
                          {r.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">{r.tool}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{fmtDate(r.enrolled_at)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            r.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : r.status === 'unsubscribed'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">{r.sent}</td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {r.opened > 0 ? <span className="font-semibold text-emerald-700">{r.opened}</span> : 0}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {r.clicked > 0 ? <span className="font-semibold text-emerald-700">{r.clicked}</span> : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="border-t px-4 py-3 text-xs text-muted-foreground">
            These people gave their details to get a tool result, so they expect to hear from TRG. Anyone marked
            unsubscribed has opted out and must not be contacted again.
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Open and click tracking depends on SendGrid&apos;s Event Webhook and open/click tracking being enabled. Rates are
        shown against delivered where available, otherwise against sent.
      </p>
    </div>
  )
}
