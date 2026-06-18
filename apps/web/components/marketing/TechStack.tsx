// "The technology we build on", the full stack, auto-scrolling across the page.
// Icon logos with brand colour (greyscale at rest, colour on hover); a few tools
// without clean marks render as brand-coloured wordmarks.
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

function items() {
  return [
    ...TECH.map(({ name, Icon }) => (
      <div
        key={name}
        className="flex flex-shrink-0 items-center gap-2 opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
      >
        <span className="h-7 w-7">
          <Icon />
        </span>
        <span className="text-base font-semibold tracking-tight text-brand-ink">{name}</span>
      </div>
    )),
    ...EXTRAS.map(({ name, color }) => (
      <span
        key={name}
        className="flex-shrink-0 text-base font-semibold tracking-tight opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
        style={{ color }}
      >
        {name}
      </span>
    )),
  ]
}

export function TechStack() {
  const row = items()
  return (
    <section className="relative overflow-hidden border-y border-brand-line/60 bg-white py-12">
      <Star className="absolute -left-3 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 -rotate-12 text-brand-accent lg:block" />
      <Star className="absolute -right-3 top-1/2 z-10 hidden h-14 w-14 -translate-y-1/2 rotate-12 text-brand-pop lg:block" />
      <p className="px-6 text-center text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
        The technology we build on
      </p>
      <div className="marquee-mask mt-8">
        <div className="animate-marquee flex w-max items-center gap-12 px-6">
          {[...row, ...row].map((node, i) => (
            <div key={i} className="flex-shrink-0">{node}</div>
          ))}
        </div>
      </div>
    </section>
  )
}
