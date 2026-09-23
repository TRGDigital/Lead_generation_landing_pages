'use client'

import { useRef, useState, useTransition } from 'react'
import { Volume2, Square, Loader2 } from 'lucide-react'
import { saveAccessibility } from '@/app/admin/websites/actions'

// The script read aloud when someone presses "Listen to page" on trgdigital.co.uk.
// Saving regenerates the neural audio and caches it, so repeat plays cost nothing.
// Written for the ear, not the eye, which is why it lives here rather than being
// scraped from the page.

const GUIDANCE = [
  'Write it as if you were speaking to one person, not addressing a room.',
  'Short sentences. A full stop is a breath; a comma is a pause.',
  'Say the important thing first. Many people stop listening after twenty seconds.',
  'Spell out anything that reads badly aloud: "twenty four hours", not "24/7".',
  'Avoid brackets, bullet points, slashes and jargon. They all read badly.',
  'Read it out loud yourself before saving. If you stumble, so will the voice.',
]

export default function ListenScriptEditor({
  siteId,
  initialScript,
  voiceConfigured,
}: {
  siteId: string
  initialScript: string
  voiceConfigured: boolean
}) {
  const [script, setScript] = useState(initialScript)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [playing, setPlaying] = useState(false)
  const [loadingAudio, setLoadingAudio] = useState(false)
  const [playError, setPlayError] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const words = script.trim() ? script.trim().split(/\s+/).length : 0
  // About 150 words a minute for a warm, unhurried read.
  const seconds = Math.round((words / 150) * 60)
  const spoken = seconds >= 60 ? `${Math.floor(seconds / 60)} min ${seconds % 60}s` : `${seconds}s`

  function save() {
    const fd = new FormData()
    // Keep the existing embeddable-toolbar settings: our own site uses the built-in bar.
    fd.set('accessibility_position', 'bottom-right')
    fd.set('accessibility_intro', script)
    startTransition(async () => {
      await saveAccessibility(siteId, fd)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
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
    setPlayError('')
    setLoadingAudio(true)
    try {
      const r = await fetch('/api/accessibility-tts?site=trgdigital')
      const data = (await r.json().catch(() => ({}))) as { url?: string | null; text?: string }
      setLoadingAudio(false)
      if (data.url) {
        let audio = audioRef.current
        if (!audio) { audio = new Audio(); audioRef.current = audio }
        audio.src = data.url
        audio.onended = () => setPlaying(false)
        setPlaying(true)
        await audio.play().catch(() => setPlayError('The browser blocked playback. Press play again.'))
      } else if (data.text && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(data.text)
        u.rate = 0.95
        u.onend = () => setPlaying(false)
        window.speechSynthesis.speak(u)
        setPlaying(true)
        setPlayError('No neural voice is configured, so this is the browser voice.')
      } else {
        setPlayError('Nothing to play yet. Write a script and save it first.')
      }
    } catch {
      setLoadingAudio(false)
      setPlayError('Could not load the audio. Try again in a moment.')
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <label htmlFor="listen-script" className="mb-1 block text-sm font-medium text-brand-ink">
          The script people hear
        </label>
        <p className="mb-3 text-xs text-brand-ink-muted">
          Never shown on screen. Saving regenerates the audio and caches it, so every later play is instant and free.
        </p>
        <textarea
          id="listen-script"
          value={script}
          onChange={(e) => setScript(e.target.value)}
          rows={18}
          maxLength={20000}
          placeholder="Hello, and welcome to TRG Digital..."
          className="w-full rounded-xl border border-brand-line px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-accent/30"
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-ink-muted">
          <span>{words.toLocaleString()} words · about {spoken} spoken · {script.length.toLocaleString()} / 20,000 characters</span>
          <span>{voiceConfigured ? 'Neural voice configured' : 'No neural voice key set, visitors hear the browser voice'}</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="rounded-xl bg-brand-accent px-5 py-2 text-sm font-semibold text-white hover:bg-brand-accent/90 disabled:opacity-60"
          >
            {isPending ? 'Saving and generating audio…' : 'Save and generate audio'}
          </button>
          <button
            type="button"
            onClick={preview}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-line px-5 py-2 text-sm font-semibold text-brand-ink hover:bg-brand-bg-warm"
          >
            {loadingAudio ? <Loader2 className="h-4 w-4 animate-spin" /> : playing ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-4 w-4" />}
            {loadingAudio ? 'Loading' : playing ? 'Stop' : 'Play the saved version'}
          </button>
          {saved && <span className="text-sm text-green-600">Saved</span>}
        </div>
        {playError && <p className="mt-2 text-xs text-amber-700">{playError}</p>}
      </div>

      <aside className="rounded-xl border border-brand-line bg-brand-bg-warm p-5">
        <h2 className="font-display text-base font-semibold text-brand-ink">Writing for the ear</h2>
        <ul className="mt-3 space-y-2">
          {GUIDANCE.map((g) => (
            <li key={g} className="text-xs leading-relaxed text-brand-ink-soft">• {g}</li>
          ))}
        </ul>
        <h3 className="mt-5 text-sm font-semibold text-brand-ink">How it works</h3>
        <p className="mt-2 text-xs leading-relaxed text-brand-ink-soft">
          A visitor presses &ldquo;Listen to page&rdquo; in the bar at the top of the site. We play a warm British
          voice reading this script. The audio is generated once per version and stored, so it plays instantly after
          that. Edit and save, and a new version is generated automatically.
        </p>
      </aside>
    </div>
  )
}
