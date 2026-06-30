'use client'

import { useState, useTransition } from 'react'
import type { Website } from '@/lib/websites'
import { saveAccessibility } from '@/app/admin/websites/actions'
import EmbedSnippet from '@/components/admin/EmbedSnippet'

export default function AccessibilityPanel({ site, widgetOrigin }: { site: Website; widgetOrigin: string }) {
  const [enabled, setEnabled] = useState(site.accessibility_enabled)
  const [position, setPosition] = useState(site.accessibility_position)
  const [intro, setIntro] = useState(site.accessibility_intro || '')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  const snippet = `<script src="${widgetOrigin}/accessibility.js" data-site="${site.slug}" defer></script>`

  function save() {
    const fd = new FormData()
    if (enabled) fd.set('accessibility_enabled', 'on')
    fd.set('accessibility_position', position)
    fd.set('accessibility_intro', intro)
    startTransition(async () => {
      await saveAccessibility(site.id, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-ink-muted">
        A floating “Accessibility” button that lets visitors make the site easier to use: bigger text, high contrast,
        a readable font, highlighted links, a bigger cursor and reduced motion. Choices are remembered on their device.
        Great for older families, and it helps the site pass accessibility checks.
      </p>

      <label className="flex items-start gap-2.5 rounded-xl border border-brand-line p-3">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="mt-0.5" />
        <span>
          <span className="block text-sm font-semibold text-brand-ink">Enable the accessibility toolbar</span>
          <span className="mt-0.5 block text-xs text-brand-ink-muted">Once the snippet below is on the site, the button only appears while this is on.</span>
        </span>
      </label>

      <label className="block max-w-xs">
        <span className="mb-1 block text-sm font-medium text-brand-ink">Button position</span>
        <select value={position} onChange={(e) => setPosition(e.target.value as Website['accessibility_position'])} className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30">
          <option value="bottom-right">Bottom right</option>
          <option value="bottom-left">Bottom left</option>
        </select>
      </label>

      <div>
        <span className="mb-1 block text-sm font-medium text-brand-ink">Read-aloud welcome (spoken first)</span>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={6}
          maxLength={4000}
          placeholder="A warm welcome read aloud first when a visitor presses ‘Listen to page’. Never shown on screen. Leave blank to use the site’s built-in default."
          className="w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
        />
        <p className="mt-1 text-xs text-brand-ink-muted">{intro.length.toLocaleString()} / 4,000 characters. Spoken first by the “Listen to page” button, before the page content. Never displayed on the page.</p>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={isPending} className="rounded-xl bg-brand-accent px-5 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60">
          {isPending ? 'Saving…' : 'Save'}
        </button>
        {saved && <span className="text-sm text-green-600">Saved</span>}
      </div>

      <div className="border-t border-brand-line pt-5">
        <p className="mb-1 text-sm font-semibold text-brand-ink">Install on {site.name}’s site</p>
        <p className="mb-3 text-xs text-brand-ink-muted">Paste this once, just before the closing &lt;/body&gt; tag. The button is brand-coloured automatically.</p>
        <EmbedSnippet snippet={snippet} />
      </div>
    </div>
  )
}
