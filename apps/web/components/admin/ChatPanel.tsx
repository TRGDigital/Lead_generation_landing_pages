'use client'

import { useState, useTransition } from 'react'
import type { Website } from '@/lib/websites'
import { saveChat, fetchChatKnowledge } from '@/app/admin/websites/actions'
import EmbedSnippet from '@/components/admin/EmbedSnippet'

export default function ChatPanel({ site, widgetOrigin, aiReady }: { site: Website; widgetOrigin: string; aiReady: boolean }) {
  const [enabled, setEnabled] = useState(site.chat_enabled)
  const [greeting, setGreeting] = useState(site.chat_greeting)
  const [knowledge, setKnowledge] = useState(site.chat_knowledge)
  const [prompt, setPrompt] = useState(site.chat_prompt || '')
  const [color, setColor] = useState(site.chat_color || site.overlay_color || '#F0532B')
  const [saved, setSaved] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [isPending, startTransition] = useTransition()

  const snippet = `<script src="${widgetOrigin}/chat.js" data-site="${site.slug}" defer></script>`

  function save() {
    const fd = new FormData()
    if (enabled) fd.set('chat_enabled', 'on')
    fd.set('chat_greeting', greeting)
    fd.set('chat_knowledge', knowledge)
    fd.set('chat_prompt', prompt)
    fd.set('chat_color', color)
    startTransition(async () => {
      await saveChat(site.id, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  async function autofill() {
    setFetching(true)
    try {
      const text = await fetchChatKnowledge(site.id)
      if (text) setKnowledge((k) => (k ? k + '\n\n' + text : text))
    } finally {
      setFetching(false)
    }
  }

  const input = 'w-full rounded-lg border border-brand-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent/30'
  const lbl = 'mb-1 block text-sm font-medium text-brand-ink'

  return (
    <div className="space-y-5">
      <p className="text-sm text-brand-ink-muted">
        A branded AI assistant that answers families’ questions about the home, fees, visiting and availability from
        the home’s own content, and captures callbacks. It only uses the facts and knowledge below, and offers a
        callback when it is unsure.
      </p>

      {!aiReady && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
          The AI is not connected yet. Add an <code className="font-mono">ANTHROPIC_API_KEY</code> in Vercel to switch it on. Until then, the chat will offer a callback instead of answering.
        </div>
      )}

      <label className="flex items-start gap-2.5 rounded-xl border border-brand-line p-3">
        <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="mt-0.5" />
        <span>
          <span className="block text-sm font-semibold text-brand-ink">Enable the AI chat</span>
          <span className="mt-0.5 block text-xs text-brand-ink-muted">Shows a chat bubble once the snippet below is on the site.</span>
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="block"><span className={lbl}>Greeting</span>
          <input className={input} value={greeting} onChange={(e) => setGreeting(e.target.value)} maxLength={300} />
        </label>
        <label className="block"><span className={lbl}>Chat colour</span>
          <span className="flex items-center gap-2">
            <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : '#F0532B'} onChange={(e) => setColor(e.target.value)} className="h-9 w-12 cursor-pointer rounded border border-brand-line" />
            <input className={`${input} w-28 font-mono`} value={color} onChange={(e) => setColor(e.target.value)} />
          </span>
        </label>
      </div>
      <p className="-mt-2 text-xs text-brand-ink-muted">Tip: pick a colour that stands out against the site so families notice the chat.</p>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className={lbl}>What the assistant knows (the home’s content)</span>
          <button type="button" onClick={autofill} disabled={fetching} className="text-xs font-semibold text-brand-accent hover:underline disabled:opacity-50">
            {fetching ? 'Fetching…' : 'Fetch from website'}
          </button>
        </div>
        <textarea className={`${input} font-mono text-xs`} rows={10} value={knowledge} onChange={(e) => setKnowledge(e.target.value)} placeholder="Paste the key details families ask about: care types, fees guidance, visiting, facilities, ethos… or click ‘Fetch from website’ to pull the homepage." />
        <p className="mt-1 text-xs text-brand-ink-muted">{knowledge.length.toLocaleString()} / 12,000 characters. The home’s name, phone, address, availability and CQC link are added automatically.</p>
      </div>

      <div>
        <span className={lbl}>AI instructions (how it should answer)</span>
        <textarea className={`${input} font-mono text-xs`} rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Optional. Tune the assistant's tone and focus, e.g. 'Always mention our dementia specialism and the secure garden. Emphasise our family-run, home-from-home feel. If asked about fees, give the £1,200–£1,500/week guide range and offer a callback.'" />
        <p className="mt-1 text-xs text-brand-ink-muted">{prompt.length.toLocaleString()} / 4,000 characters. These instructions steer the assistant on top of the knowledge above. The safety rules (never invent fees or the CQC rating, offer a callback when unsure) always apply.</p>
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
