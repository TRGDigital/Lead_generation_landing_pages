import Image from 'next/image'

// "Brands that have chosen TRG Digital" — a horizontal auto-scrolling logo strip.
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
]

export function BrandStrip() {
  return (
    <section className="overflow-hidden border-b border-brand-line/60 bg-[#f4f1e8] py-12">
      <p className="px-6 text-center text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
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
              className="h-14 w-auto flex-shrink-0 object-contain opacity-70 mix-blend-multiply grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-16"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
