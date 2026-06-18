import Image from 'next/image'
import { Star } from './Decor'

// "Brands that have chosen TRG Digital", a horizontal auto-scrolling logo strip.
// The supplied logos have a cream paper background; placing them on a matching cream
// band with mix-blend-multiply makes that background disappear. Greyscale at rest,
// full colour on hover.
const CLIENTS = [
  { name: 'Meadow Rose Nursing Home', src: '/clients/meadow-rose.png' },
  { name: 'Charlotte House', src: '/clients/charlotte-house.png' },
  { name: 'Nightingale Domiciliary Care', src: '/clients/nightingale.png' },
  { name: 'Crossfields Lodge', src: '/clients/crossfields.png' },
  { name: 'Crossways Care Home', src: '/clients/crossways.png' },
  { name: 'Ascot Grange Care Home', src: '/clients/ascot-grange.png' },
  { name: 'Riverwell Beck Care Home', src: '/clients/riverwell-beck.png' },
  { name: 'Ferndale Nursing Home', src: '/clients/ferndale.png' },
  { name: 'Crossways Residential Care Home', src: '/clients/crossways-residential.png' },
]

export function BrandStrip() {
  return (
    <section className="relative overflow-hidden border-b border-brand-line/60 bg-brand-bg pb-12 pt-6">
      <Star className="absolute -left-4 top-2 hidden h-16 w-16 -rotate-12 text-brand-pop/70 lg:block" />
      <Star className="absolute -right-4 bottom-2 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
      <p className="relative px-6 text-center text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
        Brands that have chosen TRG Digital
      </p>
      <div className="marquee-mask mt-8">
        <div className="animate-marquee flex w-max items-center gap-14 px-7">
          {[...CLIENTS, ...CLIENTS].map((c, i) => (
            <Image
              key={i}
              src={c.src}
              alt={c.name}
              width={320}
              height={120}
              className="h-14 w-auto flex-shrink-0 object-contain opacity-80 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-16"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
