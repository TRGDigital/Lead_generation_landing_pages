import { requireAdmin } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase/server'
import { SEQUENCE } from '@/lib/tool-nurture/sequence'
import NurturePreviewButton from '@/components/admin/NurturePreviewButton'

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

export default async function EmailNurtureAdmin() {
  await requireAdmin()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any

  const [{ data: sends }, { data: enr }] = await Promise.all([
    db
      .from('nurture_sends')
      .select('email_id, is_preview, delivered_at, opened_at, clicked_at, bounced_at, unsubscribed_at')
      .limit(20000),
    db.from('nurture_enrollments').select('status'),
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

  const enrolments = (enr ?? []) as { status: string }[]
  const enrTotal = enrolments.length
  const enrActive = enrolments.filter((e) => e.status === 'active').length
  const enrUnsub = enrolments.filter((e) => e.status === 'unsubscribed').length
  const enrDone = enrolments.filter((e) => e.status === 'completed').length

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

      <p className="text-xs text-muted-foreground">
        Open and click tracking depends on SendGrid&apos;s Event Webhook and open/click tracking being enabled. Rates are
        shown against delivered where available, otherwise against sent.
      </p>
    </div>
  )
}
