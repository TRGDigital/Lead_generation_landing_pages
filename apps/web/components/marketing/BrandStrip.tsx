import Image from 'next/image'

// "Brands that have chosen TRG Digital" — client logos. Greyscale at rest, full
// colour on hover (the "pop" effect).
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
    <section className="border-b border-brand-line/60 bg-brand-bg-warm px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
          Brands that have chosen TRG Digital
        </p>
        <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CLIENTS.map((c) => (
            <div
              key={c.name}
              className="flex h-24 items-center justify-center rounded-xl border border-brand-line bg-white px-4"
            >
              <Image
                src={c.src}
                alt={c.name}
                width={320}
                height={120}
                className="h-16 w-auto max-w-full object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
