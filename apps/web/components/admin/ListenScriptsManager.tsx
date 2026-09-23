'use client'

import { useMemo, useRef, useState, useTransition } from 'react'
import { Volume2, Square, Loader2, Check } from 'lucide-react'
import { saveListenScriptAction } from '@/app/admin/websites/actions'

// One script per page. Pick a page on the left, write what the voice should say on the
// right. Pages with no script still work: the bar reads that page's own content with the
// browser voice, so a visitor never hears the homepage welcome on the wrong page.

const GUIDANCE = [
  'Write it as if you were speaking to one person, not addressing a room.',
  'Short sentences. A full stop is a breath; a comma is a pause.',
  'Say the important thing first. Many people stop listening after twenty seconds.',
  'Spell out anything that reads badly aloud: "twenty four hours", not "24/7".',
  'Avoid brackets, bullet points, slashes and jargon. They all read badly.',
  'Read it out loud yourself before saving. If you stumble, so will the voice.',
]

export type PageChoice = { path: string; label: string; group: string }

export default function ListenScriptsManager({
  pages,
  scripts,
  voiceConfigured,
}: {
  pages: PageChoice[]
  scripts: Record<string, string>
  voiceConfigured: boolean
}) {
  const [current, setCurrent] = useState(pages[0]?.path ?? '/')
  const [drafts, setDrafts] = useState<Record<string, string>>(scripts)
  const [savedPath, setSavedPath] = useState('')
  const [isPending, startTransition] = useTransition()
  const [playing, setPlaying] = useState(false)
  const [loadingAudio, setLoadingAudio] = useState(false)
  const [note, setNote] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const script = drafts[current] ?? ''
  const words = script.trim() ? script.trim().split(/\s+/).length : 0
  const seconds = Math.round((words / 150) * 60)
  const spoken = seconds >= 60 ? `${Math.floor(seconds / 60)} min ${seconds % 60}s` : `${seconds}s`

  const grouped = useMemo(() => {
    const out: Record<string, PageChoice[]> = {}
    for (const p of pages) (out[p.group] ||= []).push(p)
    return out
  }, [pages])

  function save() {
    setNote('')
    startTransition(async () => {
      await saveListenScriptAction(current, script)
      setSavedPath(current)
      setTimeout(() => setSavedPath(''), 2500)
    })
  }

  async function preview() {
    if (playing || loadingAudio) {
      audioRef.current?.pause()
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
      setPlaying(false)
      setLoadingAudio(false)
      return
    }
    setNote('')
    setLoadingAudio(true)
    try {
      const r = await fetch(`/api/accessibility-tts?site=trgdigital&path=${encodeURIComponent(current)}`)
      const data = (await r.json().catch(() => ({}))) as { url?: string | null; text?: string }
      setLoadingAudio(false)
      if (data.url) {
        let audio = audioRef.current
        if (!audio) { audio = new Audio(); audioRef.current = audio }
        audio.src = data.url
        audio.onended = () => setPlaying(false)
        setPlaying(true)
        await audio.play().catch(() => setNote('The browser blocked playback. Press play again.'))
      } else if (data.text && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(data.text)
        u.rate = 0.95
        u.onend = () => setPlaying(false)
        window.speechSynthesis.speak(u)
        setPlaying(true)
        setNote('No neural voice available for this one, so this is the browser voice.')
      } else {
        setNote('Nothing saved for this page yet. Write a script and save it, or leave it blank and visitors will hear the page itself read out.')
      }
    } catch {
      setLoadingAudio(false)
      setNote('Could not load the audio. Try again in a moment.')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="max-h-[70vh] overflow-y-auto rounded-xl border border-brand-line bg-white p-3">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="mb-4">
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-brand-ink-muted">{group}</p>
            {items.map((p) => {
              const has = (drafts[p.path] ?? '').trim().length > 0
              return (
                <button
                  key={p.path}
                  type="button"
                  onClick={() => setCurrent(p.path)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm ${
                    current === p.path ? 'bg-brand-accent/15 font-semibold text-brand-ink' : 'text-brand-ink-soft hover:bg-brand-bg-warm'
                  }`}
                >
                  <span className="truncate">{p.label}</span>
                  {has && <Check className="h-3.5 w-3.5 flex-shrink-0 text-green-600" />}
                </button>
              )
            })}
          </div>
        ))}
      </aside>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <label htmlFor="script" className="text-sm font-medium text-brand-ink">
              Script for <code className="rounded bg-brand-bg-warm px-1.5 py-0.5 text-xs">{current}</code>
            </label>
            <a href={current} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-pop underline">
              Open the page
            </a>
          </div>
          <textarea
            id="script"
            value={script}
            onChange={(e) => setDrafts((d) => ({ ...d, [current]: e.target.value }))}
            rows={16}
            maxLength={20000}
            placeholder="Leave blank and the bar reads this page's own content aloud. Write something here when you want it said properly."
            className="w-full rounded-xl border border-brand-line px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-ink-muted">
            <span>{words.toLocaleString()} words · about {spoken} spoken</span>
            <span>{voiceConfigured ? 'Neural voice configured' : 'No neural voice key set, visitors hear the browser voice'}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={save} disabled={isPending} className="rounded-xl bg-brand-accent px-5 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60">
              {isPending ? 'Saving and generating audio…' : 'Save and generate audio'}
            </button>
            <button type="button" onClick={preview} className="inline-flex items-center gap-2 rounded-xl border border-brand-line px-5 py-2 text-sm font-semibold text-brand-ink hover:bg-brand-bg-warm">
              {loadingAudio ? <Loader2 className="h-4 w-4 animate-spin" /> : playing ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-4 w-4" />}
              {loadingAudio ? 'Loading' : playing ? 'Stop' : 'Play the saved version'}
            </button>
            {savedPath === current && <span className="text-sm text-green-600">Saved</span>}
          </div>
          {note && <p className="mt-2 text-xs text-amber-700">{note}</p>}
        </div>

        <aside className="rounded-xl border border-brand-line bg-brand-bg-warm p-5">
          <h2 className="font-display text-base font-semibold text-brand-ink">Writing for the ear</h2>
          <ul className="mt-3 space-y-2">
            {GUIDANCE.map((g) => (
              <li key={g} className="text-xs leading-relaxed text-brand-ink-soft">• {g}</li>
            ))}
          </ul>
          <h3 className="mt-5 text-sm font-semibold text-brand-ink">Pages without a script</h3>
          <p className="mt-2 text-xs leading-relaxed text-brand-ink-soft">
            They still work. The bar reads that page&apos;s own headings and text aloud with the voice built into the
            visitor&apos;s device. Write a script for the pages that matter most, and leave the rest.
          </p>
        </aside>
      </div>
    </div>
  )
}
