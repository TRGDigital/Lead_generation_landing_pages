// Logos for the design examples. Each is a small inline SVG mark plus a wordmark, drawn in
// the design's own colours, so a prospect sees a finished brand rather than a text heading.
// They belong to fictional providers and are only ever used inside the examples.

type LogoProps = { className?: string; primary: string; accent: string; /** On a dark footer the solid mark would disappear, so it switches to an outline. */ onDark?: boolean }

/** Oakfield House: an oak leaf in a circle, with a serif wordmark. Traditional, established. */
export function OakfieldLogo({ className, primary, accent }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="23" fill="none" stroke={primary} strokeWidth="1.5" />
        <path
          d="M24 37V20m0 0c0-5 3-8 7-9 .5 4-1.5 7.5-4.5 8.7M24 20c0-5-3-8-7-9-.5 4 1.5 7.5 4.5 8.7M24 27c1.5-3.4 4.4-5 8-5 0 3.8-2.6 6.6-6 7M24 27c-1.5-3.4-4.4-5-8-5 0 3.8 2.6 6.6 6 7"
          fill="none"
          stroke={primary}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="24" cy="15" r="1.6" fill={accent} />
      </svg>
      <span className="leading-tight">
        <span className="block text-[21px] font-bold tracking-tight" style={{ color: primary }}>
          Oakfield House
        </span>
        <span className="block text-[10px] uppercase tracking-[0.22em]" style={{ color: accent }}>
          Residential &amp; respite care
        </span>
      </span>
    </span>
  )
}

/** Brightpath: a rising path through a rounded square. Modern, optimistic, a journey. */
export function BrightpathLogo({ className, primary, accent, onDark }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ''}`}>
      <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
        <rect
          x={onDark ? 1 : 0}
          y={onDark ? 1 : 0}
          width={onDark ? 38 : 40}
          height={onDark ? 38 : 40}
          rx={onDark ? 12 : 13}
          fill={onDark ? 'none' : primary}
          stroke={onDark ? primary : 'none'}
          strokeWidth={onDark ? 2 : 0}
        />
        <path d="M9 28c4.5 0 6-4.5 9.5-9S26 11 31 11" fill="none" stroke={onDark ? primary : '#ffffff'} strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="30.5" cy="11.5" r="4" fill={accent} />
      </svg>
      <span className="text-[20px] font-extrabold tracking-tight" style={{ color: primary }}>
        Brightpath<span style={{ color: accent }}>.</span>
      </span>
    </span>
  )
}

/** St Aidan's: a sheltering arch around a heart. Warm, protective, still dignified. */
export function StAidansLogo({ className, primary, accent }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M6 42V24C6 14 14 6 24 6s18 8 18 18v18" fill="none" stroke={primary} strokeWidth="2.2" strokeLinecap="round" />
        <path
          d="M24 34c-4.2-3-7.5-5.4-7.5-9.2 0-2.6 2-4.4 4.3-4.4 1.5 0 2.7.7 3.2 1.7.5-1 1.7-1.7 3.2-1.7 2.3 0 4.3 1.8 4.3 4.4 0 3.8-3.3 6.2-7.5 9.2Z"
          fill={accent}
        />
      </svg>
      <span className="leading-tight">
        <span className="block text-[20px] font-bold tracking-tight" style={{ color: primary }}>
          St Aidan&rsquo;s
        </span>
        <span className="block text-[10px] uppercase tracking-[0.2em]" style={{ color: accent }}>
          Nursing home
        </span>
      </span>
    </span>
  )
}
