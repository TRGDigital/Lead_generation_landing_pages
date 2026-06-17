// A bold scrolling-text band for energy between sections (BoxChilli-style).
const PHRASES = ['More enquiries', 'Fewer empty beds', 'Get found first', 'Fill your beds', 'Built for care']

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="mx-8 h-6 w-6 flex-shrink-0 fill-brand-ink" aria-hidden>
      <path d="M12 2c.4 4.6 1.4 5.6 6 6-4.6.4-5.6 1.4-6 6-.4-4.6-1.4-5.6-6-6 4.6-.4 5.6-1.4 6-6z" />
    </svg>
  )
}

export function ScrollingBanner() {
  const run = [...PHRASES, ...PHRASES]
  return (
    <section className="overflow-hidden bg-brand-accent py-5">
      <div className="animate-marquee flex w-max items-center">
        {[...run, ...run].map((p, i) => (
          <div key={i} className="flex items-center">
            <span className="whitespace-nowrap font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
              {p}
            </span>
            <Star />
          </div>
        ))}
      </div>
    </section>
  )
}
