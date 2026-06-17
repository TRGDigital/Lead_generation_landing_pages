import { Vercel, GitHub, Google, GoogleCloud, OpenAI, Claude, Supabase, ReactLogo, TypeScript, Tailwind, Meta, Cloudflare, Twilio } from './tech-logos'

// A curated cluster of tech-logo badges that float around a hero image (place inside
// a `relative` container). Hover a badge to reveal its name.
const ICONS = [
  { Logo: Vercel, name: 'Vercel', pos: '-top-5 left-6', delay: '0s', dur: '6s' },
  { Logo: ReactLogo, name: 'React', pos: '-top-6 left-1/3', delay: '0.7s', dur: '7.2s' },
  { Logo: GitHub, name: 'GitHub', pos: '-top-4 right-1/4', delay: '0.3s', dur: '6.6s' },
  { Logo: Google, name: 'Google', pos: 'top-4 -right-5', delay: '1s', dur: '7s' },
  { Logo: Tailwind, name: 'Tailwind CSS', pos: 'top-1/4 -right-6', delay: '0.4s', dur: '6.4s' },
  { Logo: OpenAI, name: 'OpenAI', pos: 'top-1/2 -right-5', delay: '1.2s', dur: '7.4s' },
  { Logo: GoogleCloud, name: 'Google Cloud', pos: 'bottom-1/4 -right-4', delay: '0.6s', dur: '6.8s' },
  { Logo: Supabase, name: 'Supabase', pos: '-left-5 top-6', delay: '0.9s', dur: '7.1s' },
  { Logo: TypeScript, name: 'TypeScript', pos: '-left-6 top-1/4', delay: '0.2s', dur: '6.3s' },
  { Logo: Meta, name: 'Meta', pos: '-left-5 top-1/2', delay: '1.3s', dur: '7.3s' },
  { Logo: Twilio, name: 'Twilio', pos: '-left-4 bottom-1/4', delay: '0.5s', dur: '6.9s' },
  { Logo: Cloudflare, name: 'Cloudflare', pos: '-bottom-4 right-1/4', delay: '0.55s', dur: '6.7s' },
  { Logo: Claude, name: 'Claude', pos: '-bottom-3 right-12', delay: '1.1s', dur: '6.2s' },
]

export function FloatingTechIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block">
      {ICONS.map(({ Logo, name, pos, delay, dur }, i) => (
        <span
          key={i}
          className={`group pointer-events-auto absolute ${pos} flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-line bg-white p-2.5 shadow-card`}
          style={{ animation: `floaty ${dur} ease-in-out infinite`, animationDelay: delay }}
        >
          <Logo />
          <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-brand-ink px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100">
            {name}
          </span>
        </span>
      ))}
    </div>
  )
}
