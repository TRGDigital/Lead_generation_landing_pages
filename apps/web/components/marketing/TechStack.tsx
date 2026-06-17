// Our technology stack — the best-in-class tools we build on. Brand-coloured marks,
// greyscale at rest and popping to colour on hover. (Swap any item for an official
// SVG later if you want pixel-perfect marks.)

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

const TECH = [Vercel, Google, Claude, OpenAI, Supabase, Stripe, NextJs]

export function TechStack() {
  return (
    <section className="border-y border-brand-line/60 bg-white px-6 py-14">
      <div className="mx-auto max-w-6xl">
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
