import { Vercel, GitHub, Google, OpenAI, Claude, Supabase, ReactLogo, TypeScript, Tailwind, Meta, Cloudflare, Twilio } from './tech-logos'

// A curated cluster of tech-logo badges that float around a hero image (place inside
// a `relative` container). Kept to ~12 so it reads as a cluster, not noise — the full
// stack lives in the homepage tech strip.
const ICONS = [
  { Logo: Vercel, pos: '-top-5 left-6', delay: '0s', dur: '6s' },
  { Logo: ReactLogo, pos: '-top-6 left-1/3', delay: '0.7s', dur: '7.2s' },
  { Logo: GitHub, pos: '-top-4 right-1/4', delay: '0.3s', dur: '6.6s' },
  { Logo: Google, pos: 'top-6 -right-5', delay: '1s', dur: '7s' },
  { Logo: Tailwind, pos: 'top-1/3 -right-6', delay: '0.4s', dur: '6.4s' },
  { Logo: OpenAI, pos: 'top-1/2 -right-5', delay: '1.2s', dur: '7.4s' },
  { Logo: Twilio, pos: 'bottom-1/4 -right-4', delay: '0.6s', dur: '6.8s' },
  { Logo: Supabase, pos: '-left-5 top-8', delay: '0.9s', dur: '7.1s' },
  { Logo: TypeScript, pos: '-left-6 top-1/3', delay: '0.2s', dur: '6.3s' },
  { Logo: Meta, pos: '-left-5 top-1/2', delay: '1.3s', dur: '7.3s' },
  { Logo: Cloudflare, pos: '-bottom-4 right-1/4', delay: '0.5s', dur: '6.7s' },
  { Logo: Claude, pos: '-bottom-3 right-12', delay: '1.1s', dur: '6.2s' },
]

export function FloatingTechIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
      {ICONS.map(({ Logo, pos, delay, dur }, i) => (
        <span
          key={i}
          className={`absolute ${pos} flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-line bg-white p-2.5 shadow-card`}
          style={{ animation: `floaty ${dur} ease-in-out infinite`, animationDelay: delay }}
        >
          <Logo />
        </span>
      ))}
    </div>
  )
}
