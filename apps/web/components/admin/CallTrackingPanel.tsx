'use client'

import { useState, useTransition } from 'react'
import type { Website } from '@/lib/websites'
import type { TrackingNumber, TrackedCall, CallStats } from '@/lib/dni'
import { saveCallTracking } from '@/app/admin/websites/actions'
import EmbedSnippet from '@/components/admin/EmbedSnippet'

// Dynamic Number Insertion (call tracking): configure the Twilio tracking number
// for this site and see every call it generated. Phase 1 = one static number.
export default function CallTrackingPanel({
  site,
  widgetOrigin,
  tracking,
  calls,
  stats,
  twilioReady,
}: {
  site: Website
  widgetOrigin: string
  tracking: TrackingNumber | null
  calls: TrackedCall[]
  stats: CallStats
  twilioReady: boolean
}) {
  const [enabled, setEnabled] = useState(tracking?.enabled ?? false)
  const [twilioNumber, setTwilioNumber] = useState(tracking?.twilio_number ?? '')
  const [displayNumber, setDisplayNumber] = useState(tracking?.display_number ?? '')
  const [forwardTo, setForwardTo] = useState(tracking?.forward_to ?? '')
  const [canonical, setCanonical] = useState((tracking?.canonical_numbers ?? []).join('\n'))
  const [notes, setNotes] = useState(tracking?.notes ?? '')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const snippet = `<script src="${widgetOrigin}/dni.js" data-site="${site.slug}" defer></script>`
  const voiceWebhook = `${widgetOrigin}/api/dni/voice`

  function save() {
    const fd = new FormData()
    if (enabled) fd.set('enabled', 'on')
    fd.set('twilio_number', twilioNumber)
    fd.set('display_number', displayNumber)
    fd.set('forward_to', forwardTo)
    fd.set('canonical_numbers', canonical)
    fd.set('notes', notes)
    startTransition(async () => {
      await saveCallTracking(site.id, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const fmtWhen = (s: string) => {
    try {
      return new Date(s).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }
  const fmtDur = (secs: number | null) => {
    if (!secs) return '—'
    const m = Math.floor(secs / 60)
    return m ? `${m}m ${secs % 60}s` : `${secs}s`
  }

  const input = 'w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30'
  const lbl = 'mb-1 block text-sm font-medium text-brand-ink'

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-ink-muted">
        Shows a TRG tracking number to website visitors, so every call it receives is proof of a lead we generated.
        The number is swapped in by JavaScript only: search engines and the Google Business Profile keep the home&rsquo;s
        real number, protecting local SEO. Calls forward instantly to the home&rsquo;s line and are logged below.
      </p>

      {!twilioReady && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Twilio credentials are not set yet (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN in Vercel). Calls to the tracking
          number will be rejected until they are added — configuration below can be saved in the meantime.
        </p>
      )}

      {/* Call stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-brand-line bg-brand-bg-warm/60 p-3">
          <p className="font-display text-xl font-bold text-brand-ink">{stats.total}</p>
          <p className="text-[11px] text-brand-ink-muted">Calls (all time)</p>
        </div>
        <div className="rounded-xl border border-brand-line bg-brand-bg-warm/60 p-3">
          <p className="font-display text-xl font-bold text-brand-ink">{stats.last30}</p>
          <p className="text-[11px] text-brand-ink-muted">Last 30 days</p>
        </div>
        <div className="rounded-xl border border-brand-line bg-brand-bg-warm/60 p-3">
          <p className={`font-display text-xl font-bold ${stats.missed30 > 0 ? 'text-red-600' : 'text-brand-ink'}`}>{stats.missed30}</p>
          <p className="text-[11px] text-brand-ink-muted">Missed · 30d</p>
        </div>
        <div className="rounded-xl border border-brand-line bg-brand-bg-warm/60 p-3">
          <p className="font-display text-xl font-bold text-brand-ink">{fmtDur(stats.avgDurationSecs)}</p>
          <p className="text-[11px] text-brand-ink-muted">Avg call length</p>
        </div>
      </div>

      <label className="flex items-start gap-2.5 rounded-xl border border-brand-line p-3">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="mt-0.5" />
        <span>
          <span className="block text-sm font-semibold text-brand-ink">Enable call tracking</span>
          <span className="mt-0.5 block text-xs text-brand-ink-muted">
            Starts swapping the number once the snippet below is installed on the site.
          </span>
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label>
          <span className={lbl}>Twilio tracking number (E.164)</span>
          <input className={input} value={twilioNumber} onChange={(e) => setTwilioNumber(e.target.value)} placeholder="+441444XXXXXX" />
        </label>
        <label>
          <span className={lbl}>Display format (what visitors see)</span>
          <input className={input} value={displayNumber} onChange={(e) => setDisplayNumber(e.target.value)} placeholder="01444 XXX XXX" />
        </label>
        <label>
          <span className={lbl}>Forward calls to (the home&rsquo;s real line, E.164)</span>
          <input className={input} value={forwardTo} onChange={(e) => setForwardTo(e.target.value)} placeholder="+441444416841" />
        </label>
        <label>
          <span className={lbl}>Notes (internal)</span>
          <input className={input} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. bought 03/08, Sussex local" />
        </label>
      </div>

      <label>
        <span className={lbl}>Number formats to replace on the site (one per line)</span>
        <textarea
          className={input}
          rows={3}
          value={canonical}
          onChange={(e) => setCanonical(e.target.value)}
          placeholder={'01444 416 841\n01444 416841\n+44 1444 416 841'}
        />
        <span className="mt-1 block text-xs text-brand-ink-muted">
          Exactly as the number appears in the site&rsquo;s text. tel: links are matched automatically in any format.
        </span>
      </label>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-xl bg-brand-accent px-5 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : 'Save'}
        </button>
        {saved && <span className="text-sm text-green-600">Saved</span>}
      </div>

      <div className="border-t border-brand-line pt-5">
        <p className="mb-1 text-sm font-semibold text-brand-ink">1. Point the Twilio number at this webhook</p>
        <p className="mb-3 text-xs text-brand-ink-muted">
          In the Twilio console, set the number&rsquo;s <em>A call comes in</em> webhook to this URL (HTTP POST):
        </p>
        <EmbedSnippet snippet={voiceWebhook} />
        <p className="mb-1 mt-4 text-sm font-semibold text-brand-ink">2. Install on {site.name}&rsquo;s site</p>
        <p className="mb-3 text-xs text-brand-ink-muted">Paste this once, just before the closing &lt;/body&gt; tag.</p>
        <EmbedSnippet snippet={snippet} />
      </div>

      {/* Recent calls */}
      <div className="border-t border-brand-line pt-5">
        <p className="mb-3 text-sm font-semibold text-brand-ink">Recent calls</p>
        {calls.length === 0 ? (
          <p className="rounded-xl border border-brand-line bg-brand-bg-warm/40 px-4 py-6 text-center text-sm text-brand-ink-muted">
            No tracked calls yet. Once the number is live and the snippet is installed, every call appears here.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-brand-line">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-line bg-brand-bg-warm text-left">
                  <th className="px-3 py-2 font-semibold text-brand-ink">Caller</th>
                  <th className="px-3 py-2 font-semibold text-brand-ink">Outcome</th>
                  <th className="px-3 py-2 font-semibold text-brand-ink hidden sm:table-cell">Length</th>
                  <th className="px-3 py-2 font-semibold text-brand-ink">When</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((c) => (
                  <tr key={c.id} className="border-b border-brand-line/50 last:border-0">
                    <td className="px-3 py-2 font-medium text-brand-ink">{c.caller || 'Withheld'}</td>
                    <td className="px-3 py-2">
                      {c.outcome === 'answered' ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">Answered</span>
                      ) : c.outcome === 'missed' ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">Missed</span>
                      ) : (
                        <span className="rounded-full bg-brand-bg-warm px-2 py-0.5 text-[11px] font-semibold text-brand-ink-muted">{c.status}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 hidden text-brand-ink-muted sm:table-cell">{fmtDur(c.duration_secs)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-brand-ink-muted">{fmtWhen(c.started_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
