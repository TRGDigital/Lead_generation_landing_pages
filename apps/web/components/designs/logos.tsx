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

/** Willow Court: a willow leaf over an open door. Independence first, support behind it. */
export function WillowLogo({ className, primary, accent }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <svg width="42" height="42" viewBox="0 0 48 48" aria-hidden="true">
        <rect x="10" y="16" width="28" height="26" rx="4" fill="none" stroke={primary} strokeWidth="2.4" />
        <path d="M24 16V9" stroke={primary} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M24 9c5 0 9 3.4 9 7.6-5 0-9-3.4-9-7.6Z" fill={accent} />
        <circle cx="30" cy="30" r="2" fill={primary} />
      </svg>
      <span className="leading-tight">
        <span className="block text-[21px] font-extrabold tracking-tight" style={{ color: primary }}>Willow Court</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: accent }}>Supported living</span>
      </span>
    </span>
  )
}

/** Marchmont Gardens: a serif M in a fine ring. Understated, premium, established. */
export function MarchmontLogo({ className, primary, accent }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3.5 ${className ?? ''}`}>
      <svg width="44" height="44" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="none" stroke={accent} strokeWidth="1" />
        <text
          x="24"
          y="32"
          textAnchor="middle"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontSize="24"
          fill={primary}
        >
          M
        </text>
      </svg>
      <span className="leading-tight">
        <span className="block text-[20px] tracking-[0.04em]" style={{ color: primary, fontFamily: 'Georgia, serif' }}>
          MARCHMONT
        </span>
        <span className="block text-[9.5px] uppercase tracking-[0.32em]" style={{ color: accent }}>Gardens</span>
      </span>
    </span>
  )
}

/** Ravenswood Group: three rooflines together, for a group of homes under one standard. */
export function RavenswoodLogo({ className, primary, accent }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ''}`}>
      <svg width="44" height="42" viewBox="0 0 52 44" aria-hidden="true">
        <path d="M4 24 14 14l10 10" fill="none" stroke={accent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 30 26 20l10 10" fill="none" stroke={primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M28 24 38 14l10 10" fill="none" stroke={accent} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 34h12" stroke={primary} strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[20px] font-bold tracking-tight" style={{ color: primary }}>Ravenswood</span>
        <span className="block text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>Care Group</span>
      </span>
    </span>
  )
}
