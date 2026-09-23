'use client'

// A visible pause control for the scrolling bands, and the shared state behind the
// "Pause motion" button in the accessibility bar.
//
// Movement is one of the first things dementia friendly design removes, and it is a
// problem for vestibular conditions too. So: the operating system setting is honoured
// automatically, anyone can stop the movement themselves in one press, and the choice
// is remembered. The control is a real button next to the thing that moves, because a
// setting nobody can find is no setting at all.

import { useSyncExternalStore } from 'react'
import { Pause, Play } from 'lucide-react'

const KEY = 'trg_motion' // '1' = paused by choice

export function motionSubscribe(cb: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('trg-a11y', cb)
  return () => window.removeEventListener('trg-a11y', cb)
}

export function motionSnapshot() {
  return document.documentElement.classList.contains('no-motion') ? '1' : '0'
}

export function toggleMotion() {
  const d = document.documentElement
  const paused = !d.classList.contains('no-motion')
  d.classList.toggle('no-motion', paused)
  try { localStorage.setItem(KEY, paused ? '1' : '0') } catch { /* storage blocked */ }
  window.dispatchEvent(new Event('trg-a11y'))
}

export function MotionToggle({ className }: { className?: string }) {
  const paused = useSyncExternalStore(motionSubscribe, motionSnapshot, () => '0') === '1'
  return (
    <button
      type="button"
      onClick={toggleMotion}
      aria-pressed={paused}
      className={`inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white/95 px-3 py-1.5 text-[12px] font-semibold text-brand-ink shadow-soft transition-colors hover:border-brand-pop/50 ${className ?? ''}`}
    >
      {paused ? <Play className="h-3 w-3" aria-hidden /> : <Pause className="h-3 w-3" aria-hidden />}
      {paused ? 'Play movement' : 'Pause movement'}
    </button>
  )
}
