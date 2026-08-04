// Decorative graphic accents (BoxChilli-style), sparkle stars, wiggly lines, dot
// grids and starbursts. Colour them with a `text-*` class (they use currentColor).
// Always decorative: pointer-events-none + aria-hidden, positioned absolutely by the
// caller.

export function Star({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`pointer-events-none ${className}`} fill="currentColor" aria-hidden>
      <path d="M50 0c5 35 10 45 50 50-40 5-45 15-50 50-5-35-10-45-50-50 40-5 45-15 50-50z" />
    </svg>
  )
}

export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 24" className={`pointer-events-none ${className}`} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" aria-hidden>
      <path d="M4 12c12-14 24 14 36 0s24 14 36 0 24 14 36 0 24 14 36 0 24 14 36 0 24 14 36 0" />
    </svg>
  )
}

export function Dots({ className = '' }: { className?: string }) {
  const dots = []
  for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) dots.push(<circle key={`${x}-${y}`} cx={6 + x * 20} cy={6 + y * 20} r="3.5" />)
  return (
    <svg viewBox="0 0 80 80" className={`pointer-events-none ${className}`} fill="currentColor" aria-hidden>
      {dots}
    </svg>
  )
}

export function Burst({ className = '' }: { className?: string }) {
  // 12-point starburst / seal
  const pts: string[] = []
  const cx = 50, cy = 50
  for (let i = 0; i < 24; i++) {
    const r = i % 2 === 0 ? 50 : 34
    const a = (Math.PI / 12) * i
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
  }
  return (
    <svg viewBox="0 0 100 100" className={`pointer-events-none ${className}`} fill="currentColor" aria-hidden>
      <polygon points={pts.join(' ')} />
    </svg>
  )
}

// Hand-drawn arrow used as a directional cue (points at the conversion element).
export function SketchArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 70" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className={`overflow-visible ${className}`} aria-hidden>
      <path d="M10 30c70 30 180 38 266 14 44-15 88-74 96-96" />
      <path d="M350 -34 372 -52 380 -22" />
    </svg>
  )
}
