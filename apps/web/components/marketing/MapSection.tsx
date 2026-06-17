import { MapPin } from 'lucide-react'

const ADDRESS = 'Suite Ra01, 195-197 Wood Street, London, E17 3NU'

// Full-width (edge-to-edge) map with a floating address card, BoxChilli-style.
export function MapSection() {
  return (
    <section className="relative">
      <iframe
        title="TRG Digital location"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
        className="block h-[460px] w-full border-0 sm:h-[560px]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="mx-auto flex h-full max-w-6xl items-center px-6">
          <div className="pointer-events-auto w-full max-w-sm rounded-2xl bg-brand-ink p-7 text-white shadow-card lg:p-9">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Find us</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight">Where we are</h2>
            <p className="mt-4 flex items-start gap-3 text-white/80">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-accent" />
              <span>{ADDRESS}</span>
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pop btn-on-dark mt-7 w-fit"
            >
              Get directions
              <span className="btn-arrow" aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
