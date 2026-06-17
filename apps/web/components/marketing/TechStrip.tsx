// "Powered by" strip — the best-in-class tools TRG builds on. Real, non-fabricated
// credibility. Currently rendered as clean monochrome wordmarks; drop official SVG/PNG
// logos into /public/tech and swap the <span> for <Image> when you have them.
const TOOLS = ['Vercel', 'Google Partner', 'Anthropic Claude', 'OpenAI', 'Supabase', 'Stripe', 'Next.js']

export function TechStrip() {
  return (
    <section className="border-y border-brand-line/60 bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
          We build on the same best-in-class technology as the world&apos;s leading companies
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {TOOLS.map((t) => (
            <span
              key={t}
              className="text-lg font-semibold tracking-tight text-brand-ink-soft/60 transition-colors hover:text-brand-ink"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
