'use client'

import { useState, useTransition } from 'react'
import type { Website } from '@/lib/websites'
import { saveCallbar } from '@/app/admin/websites/actions'
import EmbedSnippet from '@/components/admin/EmbedSnippet'

export default function CallbarPanel({ site, widgetOrigin }: { site: Website; widgetOrigin: string }) {
  const [enabled, setEnabled] = useState(site.callbar_enabled)
  const [phone, setPhone] = useState(site.callbar_phone)
  const [label, setLabel] = useState(site.callbar_label)
  const [desktop, setDesktop] = useState(site.callbar_desktop)
  const [callback, setCallback] = useState(site.callbar_callback_enabled)
  const [note, setNote] = useState(site.callbar_callback_note ?? '')
  const [hours, setHours] = useState<Record<string, [string, string] | null>>(
    site.callbar_hours ?? { mon: ['09:00', '17:00'], tue: ['09:00', '17:00'], wed: ['09:00', '17:00'], thu: ['09:00', '17:00'], fri: ['09:00', '17:00'], sat: null, sun: null },
  )
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const snippet = `<script src="${widgetOrigin}/callbar.js" data-site="${site.slug}" defer></script>`

  function save() {
    const fd = new FormData()
    if (enabled) fd.set('callbar_enabled', 'on')
    if (desktop) fd.set('callbar_desktop', 'on')
    fd.set('callbar_phone', phone)
    fd.set('callbar_label', label)
    if (callback) fd.set('callbar_callback_enabled', 'on')
    fd.set('callbar_callback_note', note)
    fd.set('callbar_hours', JSON.stringify(hours))
    startTransition(async () => {
      await saveCallbar(site.id, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const input = 'w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30'
  const lbl = 'mb-1 block text-sm font-medium text-brand-ink'

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-ink-muted">
        A sticky “call us” bar so visitors can phone in one tap, most care enquiries are phone calls. Shows on mobile by
        default (where it converts best), brand-coloured to match the site.
      </p>

      <label className="flex items-start gap-2.5 rounded-xl border border-brand-line p-3">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="mt-0.5" />
        <span>
          <span className="block text-sm font-semibold text-brand-ink">Enable the call bar</span>
          <span className="mt-0.5 block text-xs text-brand-ink-muted">Appears once the snippet below is on the site and a phone number is set.</span>
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className={lbl}>Phone number</span>
          <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01444 416 841" />
        </label>
        <label><span className={lbl}>Label</span>
          <input className={input} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Speak to our team" />
        </label>
      </div>

      <label className="flex items-start gap-2.5">
        <input type="checkbox" checked={desktop} onChange={(e) => setDesktop(e.target.checked)} className="mt-0.5" />
        <span className="text-sm text-brand-ink">Also show on desktop (a floating button, bottom-right)</span>
      </label>

      <div className="rounded-xl border border-brand-line p-3">
        <label className="flex items-start gap-2.5">
          <input type="checkbox" checked={callback} onChange={(e) => setCallback(e.target.checked)} className="mt-0.5" />
          <span>
            <span className="block text-sm font-semibold text-brand-ink">Offer a call back when they tap the number</span>
            <span className="mt-0.5 block text-xs text-brand-ink-muted">
              Tapping any phone number opens a small panel with two options: call now, which always goes straight to the
              dialler, or leave a name and number. The call is never blocked. Out of hours, and on desktop where tapping a
              number does little, the call back form leads. This is how a phone lead gets a name attached to it.
            </span>
          </span>
        </label>

        {callback && (
          <div className="mt-4 space-y-3 border-t border-brand-line pt-4">
            <label><span className={lbl}>Line above the options (optional)</span>
              <input className={input} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Call now, or leave your number and we will ring you back." />
            </label>
            <div>
              <span className={lbl}>Opening hours</span>
              <p className="mb-2 text-xs text-brand-ink-muted">Used to tell a visitor the office is closed and to promise a call back when it reopens. Leave a day unticked for closed.</p>
              <div className="space-y-1.5">
                {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((d) => {
                  const span = hours[d]
                  return (
                    <div key={d} className="flex items-center gap-2 text-sm">
                      <label className="flex w-24 items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!span}
                          onChange={(e) => setHours({ ...hours, [d]: e.target.checked ? ['09:00', '17:00'] : null })}
                        />
                        <span className="capitalize text-brand-ink">{d}</span>
                      </label>
                      {span ? (
                        <>
                          <input type="time" value={span[0]} onChange={(e) => setHours({ ...hours, [d]: [e.target.value, span[1]] })} className="rounded-lg border border-brand-line px-2 py-1 text-sm" />
                          <span className="text-brand-ink-muted">to</span>
                          <input type="time" value={span[1]} onChange={(e) => setHours({ ...hours, [d]: [span[0], e.target.value] })} className="rounded-lg border border-brand-line px-2 py-1 text-sm" />
                        </>
                      ) : (
                        <span className="text-xs text-brand-ink-muted">Closed</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={isPending} className="rounded-xl bg-brand-accent px-5 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60">
          {isPending ? 'Saving…' : 'Save'}
        </button>
        {saved && <span className="text-sm text-green-600">Saved</span>}
      </div>

      <div className="border-t border-brand-line pt-5">
        <p className="mb-1 text-sm font-semibold text-brand-ink">Install on {site.name}’s site</p>
        <p className="mb-3 text-xs text-brand-ink-muted">Paste this once, just before the closing &lt;/body&gt; tag.</p>
        <EmbedSnippet snippet={snippet} />
      </div>
    </div>
  )
}
