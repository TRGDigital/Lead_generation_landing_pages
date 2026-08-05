import Link from 'next/link'
import { ManagedImage } from './ManagedImage'
import { Squiggle, Dots } from './Decor'
import { CASE_STUDIES } from '@/lib/case-studies'

// Homepage "Our work" section: the WordPress-to-enquiry-engine story with a live
// Crossways screenshot, linking to the case studies.

function Browser({ src, alt, domain, priority }: { src: string; alt: string; domain: string; priority?: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
      <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">{domain}</span>
      </div>
      <div className="relative aspect-[16/10] w-full bg-brand-bg-warm">
        <ManagedImage src={src} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" priority={priority} className="object-cover object-top" />
      </div>
    </div>
  )
}

export function WorkFeature() {
  const cw = CASE_STUDIES[0]!
  return (
    <section className="relative overflow-hidden bg-brand-ink px-6 py-24 text-white">
      <Dots className="absolute right-10 top-10 hidden h-24 w-24 text-white/10 lg:block" />
      <Squiggle className="absolute bottom-10 left-8 hidden h-7 w-44 text-brand-pop lg:block" />
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Our work</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
            From WordPress to <span className="text-brand-pop">enquiry engine</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            We rebuilt Crossways Care Home and Ferndale Nursing Home end to end: fast new websites,
            a local page for every search, family tools, AI chat and live room availability, all of
            it live on their domains today, and documented step by step.
          </p>
          <ul className="mt-6 space-y-2.5">
            {['67 local landing pages across the two homes', '19 family tools, from funding calculators to AI chat', 'Live room availability the managers update in one tap'].map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm leading-relaxed text-white/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pop" />
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/work" className="btn-pop">
              See the case studies
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link
              href={`/work/${cw.slug}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-white/40 px-7 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              Start with Crossways
            </Link>
          </div>
        </div>
        <div className="relative">
          <span className="absolute -right-4 -top-4 hidden h-full w-full rotate-3 rounded-2xl border border-white/15 bg-white/5 sm:block" aria-hidden />
          <div className="relative">
            <Browser src={cw.mockup} alt={`The ${cw.name} website`} domain={cw.liveLabel} />
          </div>
          <p className="mt-3 text-center text-xs text-white/50">crosswayscarehome.co.uk, live now</p>
        </div>
      </div>
    </section>
  )
}
