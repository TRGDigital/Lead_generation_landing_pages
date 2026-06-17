// "The technology we build on" — the full stack. Icon logos with brand colour,
// greyscale at rest and popping to colour on hover; a few tools without clean marks
// render as brand-coloured wordmarks.
import { TECH } from './tech-logos'
import { Star } from './Decor'

const EXTRAS = [
  { name: 'Meta Ads', color: '#0082FB' },
  { name: 'Semrush', color: '#FF642D' },
  { name: 'SendGrid', color: '#1A82E2' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'Pinecone', color: '#128A7D' },
  { name: 'Hugging Face', color: '#E8A100' },
]

export function TechStack() {
  return (
    <section className="relative overflow-hidden border-y border-brand-line/60 bg-white px-6 py-14">
      <Star className="absolute -left-3 top-1/2 hidden h-16 w-16 -translate-y-1/2 -rotate-12 text-brand-accent lg:block" />
      <Star className="absolute -right-3 top-1/2 hidden h-16 w-16 -translate-y-1/2 rotate-12 text-brand-pop lg:block" />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
          The technology we build on
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
          {TECH.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex items-center gap-2 opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
            >
              <span className="h-6 w-6">
                <Icon />
              </span>
              <span className="text-base font-semibold tracking-tight text-brand-ink">{name}</span>
            </div>
          ))}
          {EXTRAS.map(({ name, color }) => (
            <span
              key={name}
              className="text-base font-semibold tracking-tight opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              style={{ color }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
