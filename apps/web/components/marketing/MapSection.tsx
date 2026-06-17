import { MapPin } from 'lucide-react'

const ADDRESS = 'Suite Ra01, 195-197 Wood Street, London, E17 3NU'

export function MapSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-stretch gap-0 overflow-hidden rounded-3xl border border-brand-line shadow-soft lg:grid-cols-[0.8fr_1.6fr]">
        <div className="flex flex-col justify-center bg-brand-ink p-8 text-white lg:p-12">
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
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-white"
          >
            Get directions
            <span aria-hidden>→</span>
          </a>
        </div>
        <div className="min-h-[520px]">
          <iframe
            title="TRG Digital location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
            className="h-full min-h-[520px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}
