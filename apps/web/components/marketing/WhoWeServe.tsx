import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SECTORS } from '@/lib/sectors'
import { Star, Dots } from './Decor'

// A site-wide "who we serve" band, shown above the footer, linking to the care-setting
// hub pages. Cross-links the programmatic sector pages and reinforces TRG's specialism.
export function WhoWeServe() {
  return (
    <section className="relative overflow-hidden border-t border-brand-line bg-brand-bg-warm px-6 py-20">
      <Star className="absolute left-6 top-10 hidden h-12 w-12 -rotate-12 text-brand-accent lg:block" />
      <Dots className="absolute bottom-8 right-10 hidden h-20 w-20 text-brand-pop/30 lg:block" />
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Who we serve</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Specialists in your kind of care
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
            We work with care providers right across the sector. Find the marketing, websites and enquiry generation built for yours.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SECTORS.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="group flex flex-col justify-between rounded-2xl border border-brand-line bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card"
            >
              <span className="font-display text-base font-semibold leading-tight text-brand-ink">{s.name}</span>
              <ArrowRight className="mt-4 h-4 w-4 text-brand-pop transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
