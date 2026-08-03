import Link from 'next/link'
import { Check } from 'lucide-react'
import { ToolMock } from '@/components/marketing/ToolMock'
import { Star, Dots } from '@/components/marketing/Decor'

const POINTS = [
  'Funding calculators for all four UK nations',
  'NHS Continuing Healthcare & FNC checkers',
  'A private dementia signs self-check',
  'Branded in your colours, on your site',
]

// Homepage teaser for the embeddable family tools, linking to the /care-tools showcase.
export function CareToolsFeature() {
  return (
    <section className="relative overflow-hidden bg-brand-ink px-6 py-24 text-white">
      <Star className="absolute left-8 top-12 hidden h-14 w-14 -rotate-12 text-brand-accent/70 lg:block" />
      <Dots className="absolute bottom-10 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Proprietary technology</p>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            Tools families come for, <span className="text-brand-pop">enquiries</span> you keep
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
            We build our own family-facing care tools, funding calculators, NHS checkers, a dementia signs
            self-check and more, right into your website. Families are already searching for these answers, so
            when they find them on your site, they use them, and become enquiries.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-white/90">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-3 w-3 text-white" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-9">
            <Link href="/care-tools" className="btn-pop">
              See the care tools
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div
            className="absolute -right-5 -top-5 hidden h-full w-full rotate-6 rounded-2xl border border-white/15 bg-white/5 sm:block"
            aria-hidden
          />
          <div className="relative rotate-[-1deg]">
            <ToolMock toolKey="funding" name="Care funding calculator" />
          </div>
        </div>
      </div>
    </section>
  )
}
