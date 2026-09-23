'use client'

// The accessibility bar we build into every client site, now running on our own.
// Kept visible at the top rather than hidden behind a floating button, because the
// people who need it are the least likely to go looking for it.
//
// Text size, high contrast and the readable font are applied to <html> and remembered
// in localStorage (a small script in the root layout re-applies them before paint, so
// there is no flash). "Listen to page" plays a warm neural reading of the script set in
// the admin, cached on the platform, and falls back to the browser voice.

import { useRef, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { toggleMotion } from './MotionToggle'
import { Volume2, Square, Loader2, Accessibility, Pause, Play } from 'lucide-react'

const SCALES: Record<string, string> = { base: '100%', lg: '112.5%', xl: '125%' }
const SIZES = [
  { key: 'base', label: 'A', title: 'Default text size' },
  { key: 'lg', label: 'A+', title: 'Larger text' },
  { key: 'xl', label: 'A++', title: 'Largest text' },
]

function fire() {
  window.dispatchEvent(new Event('trg-a11y'))
}
function subscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('trg-a11y', cb)
  return () => window.removeEventListener('trg-a11y', cb)
}
function snapshot() {
  const d = document.documentElement
  return `${d.dataset.textsize || 'base'}|${d.classList.contains('hc') ? 1 : 0}|${d.classList.contains('readable') ? 1 : 0}|${d.classList.contains('no-motion') ? 1 : 0}`
}

function setSize(key: string) {
  const d = document.documentElement
  d.style.fontSize = SCALES[key] ?? '100%'
  d.dataset.textsize = key
  try { localStorage.setItem('trg_textsize', key) } catch { /* storage blocked */ }
  fire()
}

function toggleClass(cls: string, lsKey: string) {
  const d = document.documentElement
  const on = !d.classList.contains(cls)
  d.classList.toggle(cls, on)
  try { localStorage.setItem(lsKey, on ? '1' : '0') } catch { /* storage blocked */ }
  fire()
}

/** What this page actually says, for pages with no written script yet.
    Headings and body text from <main>, in order, skipping navigation, the footer and
    anything decorative, so the reading matches the page a visitor is looking at. */
function readPageAloudText(): string {
  const main = document.querySelector('main')
  if (!main) return ''
  const parts: string[] = []
  const nodes = main.querySelectorAll('h1, h2, h3, p, li')
  nodes.forEach((el) => {
    if (parts.join(' ').length > 9000) return
    if (el.closest('[aria-hidden="true"], [data-nosnippet], nav, footer, form, pre, code')) return
    const text = (el.textContent || '').replace(/\s+/g, ' ').trim()
    if (!text || text.length < 3) return
    // A heading introduces what follows, so give it a full stop and a breath.
    const isHeading = /^H[123]$/.test(el.tagName)
    parts.push(isHeading && !/[.!?]$/.test(text) ? `${text}.` : text)
  })
  // Collapse the odd duplicate (a heading repeated in a card, say).
  return Array.from(new Set(parts)).join(' ')
}

/** The warmest British voice the browser offers, for the fallback reading. */
function pickWarmVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  if (!voices.length) return null
  const enGB = voices.filter((v) => /en[-_]GB/i.test(v.lang))
  const enAny = voices.filter((v) => /^en/i.test(v.lang))
  const find = (pool: SpeechSynthesisVoice[], re: RegExp) => pool.find((v) => re.test(v.name)) ?? null
  return (
    find(enGB, /natural/i) ||
    find(enAny, /natural/i) ||
    find(voices, /google uk english female/i) ||
    find(voices, /google uk english/i) ||
    find(enGB, /serena|kate|stephanie|martha|fiona|jamie/i) ||
    enGB.find((v) => /female/i.test(v.name)) ||
    enGB[0] || enAny[0] || voices[0] || null
  )
}

export function AccessibilityBar() {
  const pathname = usePathname()
  const state = useSyncExternalStore(subscribe, snapshot, () => 'base|0|0|0')
  const [size, hc, readable, stillness] = state.split('|')
  const [speaking, setSpeaking] = useState(false)
  const [loading, setLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const playIdRef = useRef(0)

  function stopAll() {
    playIdRef.current++
    if (audioRef.current) {
      audioRef.current.pause()
      try { audioRef.current.currentTime = 0 } catch { /* ignore */ }
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    setSpeaking(false)
    setLoading(false)
  }

  function browserSpeak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
      setSpeaking(false)
      return
    }
    const synth = window.speechSynthesis
    const start = () => {
      const voice = pickWarmVoice(synth.getVoices() || [])
      const chunks = text.match(/[^.!?]+[.!?]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [text]
      synth.cancel()
      chunks.forEach((chunk, i) => {
        const u = new SpeechSynthesisUtterance(chunk)
        if (voice) { u.voice = voice; u.lang = voice.lang }
        u.rate = 0.95
        if (i === chunks.length - 1) u.onend = () => setSpeaking(false)
        u.onerror = () => setSpeaking(false)
        synth.speak(u)
      })
      setSpeaking(true)
    }
    if ((synth.getVoices() || []).length) start()
    else {
      let done = false
      const on = () => {
        if (done) return
        done = true
        synth.removeEventListener('voiceschanged', on)
        start()
      }
      synth.addEventListener('voiceschanged', on)
      setTimeout(on, 300)
    }
  }

  async function toggleSpeak() {
    if (speaking || loading) { stopAll(); return }
    const myId = ++playIdRef.current
    setLoading(true)
    try {
      const r = await fetch(`/api/accessibility-tts?site=trgdigital&path=${encodeURIComponent(pathname || '/')}`)
      const data = (await r.json().catch(() => ({}))) as { url?: string | null; text?: string }
      if (myId !== playIdRef.current) return
      // No script written for this page yet: read the page itself rather than the
      // homepage welcome, which would describe the wrong thing entirely.
      const text = (data.text || '').trim() || readPageAloudText()
      setLoading(false)
      if (data.url) {
        let audio = audioRef.current
        if (!audio) { audio = new Audio(); audioRef.current = audio }
        audio.src = data.url
        audio.onended = () => setSpeaking(false)
        audio.onerror = () => browserSpeak(text)
        setSpeaking(true)
        await audio.play().catch(() => browserSpeak(text))
      } else {
        browserSpeak(text)
      }
    } catch {
      setLoading(false)
      setSpeaking(false)
    }
  }

  const btn = 'rounded-full px-3 py-1 text-[12.5px] font-semibold transition-colors'
  const off = 'text-brand-ink-soft hover:bg-brand-ink/5 hover:text-brand-ink'
  const on = 'bg-brand-ink text-white'

  return (
    <div className="border-b border-brand-line bg-white" data-nosnippet>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-5 gap-y-1 px-6 py-1.5 sm:justify-between">
        <span className="flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-wide text-brand-ink">
          <Accessibility className="h-3.5 w-3.5 text-brand-pop" aria-hidden />
          Accessibility
        </span>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <div className="flex items-center gap-1">
            <span className="text-[12.5px] text-brand-ink-soft">Text size</span>
            {SIZES.map((s) => (
              <button
                key={s.key}
                type="button"
                title={s.title}
                aria-pressed={size === s.key}
                onClick={() => setSize(s.key)}
                className={`${btn} ${size === s.key ? on : off}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button type="button" aria-pressed={hc === '1'} onClick={() => toggleClass('hc', 'trg_contrast')} className={`${btn} ${hc === '1' ? on : off}`}>
            High contrast
          </button>

          <button type="button" aria-pressed={readable === '1'} onClick={() => toggleClass('readable', 'trg_font')} className={`${btn} ${readable === '1' ? on : off}`}>
            Readable font
          </button>

          <button type="button" aria-pressed={stillness === '1'} onClick={toggleMotion} className={`${btn} inline-flex items-center gap-1.5 ${stillness === '1' ? on : off}`}>
            {stillness === '1' ? <Play className="h-3 w-3" aria-hidden /> : <Pause className="h-3 w-3" aria-hidden />}
            {stillness === '1' ? 'Play movement' : 'Pause movement'}
          </button>

          <button type="button" onClick={toggleSpeak} aria-pressed={speaking} className={`${btn} inline-flex items-center gap-1.5 ${speaking || loading ? on : off}`}>
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : speaking ? <Square className="h-3 w-3" aria-hidden /> : <Volume2 className="h-3.5 w-3.5" aria-hidden />}
            {loading ? 'Loading' : speaking ? 'Stop' : 'Listen to page'}
          </button>
        </div>
      </div>
    </div>
  )
}
