// Our technology stack — the best-in-class tools we build on. Brand-coloured marks,
// greyscale at rest and popping to colour on hover. (Swap any item for an official
// SVG later if you want pixel-perfect marks.)
import { Star } from './Decor'

function Vercel() {
  return (
    <span className="inline-flex items-center gap-2 text-[#000]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden><path d="M12 3 22 21 2 21Z" /></svg>
      <span className="text-lg font-semibold tracking-tight">Vercel</span>
    </span>
  )
}
function NextJs() {
  return <span className="text-lg font-semibold tracking-tight text-[#000]">Next.js</span>
}
function GitHub() {
  return (
    <span className="inline-flex items-center gap-2 text-[#181717]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
      <span className="text-lg font-semibold tracking-tight">GitHub</span>
    </span>
  )
}
function OpenAI() {
  return (
    <span className="inline-flex items-center gap-2 text-[#0f9d8c]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8" aria-hidden><circle cx="12" cy="12" r="8" /><path d="M12 4v16M4 12h16" /></svg>
      <span className="text-lg font-semibold tracking-tight">OpenAI</span>
    </span>
  )
}
function Claude() {
  return (
    <span className="inline-flex items-center gap-2 text-[#D97757]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden><path d="M12 2l2.4 6.5L21 11l-6.6 2.5L12 22l-2.4-8.5L3 11l6.6-2.5z" /></svg>
      <span className="text-lg font-semibold tracking-tight">Claude</span>
    </span>
  )
}
function Google() {
  return (
    <span className="text-lg font-semibold tracking-tight">
      <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
      <span className="ml-1 text-[#5f6368]">Partner</span>
    </span>
  )
}
function Supabase() {
  return (
    <span className="inline-flex items-center gap-2 text-[#3ECF8E]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
      <span className="text-lg font-semibold tracking-tight text-brand-ink">Supabase</span>
    </span>
  )
}
function Stripe() {
  return <span className="text-lg font-bold italic tracking-tight text-[#635BFF]">stripe</span>
}

const TECH = [Vercel, GitHub, Google, Claude, OpenAI, Supabase, Stripe, NextJs]

export function TechStack() {
  return (
    <section className="relative overflow-hidden border-y border-brand-line/60 bg-white px-6 py-14">
      <Star className="absolute -left-3 top-1/2 hidden h-16 w-16 -translate-y-1/2 -rotate-12 text-brand-accent lg:block" />
      <Star className="absolute -right-3 top-1/2 hidden h-16 w-16 -translate-y-1/2 rotate-12 text-brand-pop lg:block" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
          The technology we build on
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {TECH.map((Logo, i) => (
            <div
              key={i}
              className="opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
            >
              <Logo />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
