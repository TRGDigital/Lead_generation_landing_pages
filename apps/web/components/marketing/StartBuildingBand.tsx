import Link from 'next/link'
import { Check } from 'lucide-react'
import { Star, Dots } from './Decor'

// Home page band pointing to /start-building-your-new-website, the main page for new
// website enquiries. Deliberately static: no motion on care sites.

const POINTS = ['Built from scratch for care providers', 'Approved by you before launch', 'Yours to own']

export function StartBuildingBand() {
  return (
    <section className="relative overflow-hidden bg-brand-ink px-6 py-16 text-white">
      <Star className="absolute left-8 top-8 hidden h-14 w-14 text-brand-accent lg:block" />
      <Dots className="absolute bottom-8 right-10 hidden h-20 w-20 text-white/20 lg:block" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Need a new website?</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.08] tracking-tight sm:text-4xl">
            A new website that families trust and carers apply through
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-white/75">
            Tell us about your care service and we will come back with ideas for your new site and a fixed price in
            writing, with a reply from a person within one working day.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-white">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-accent" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:justify-self-end">
          <Link href="/start-building-your-new-website" className="btn-cta btn-on-dark w-full sm:w-auto">
            Start building your new website
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
