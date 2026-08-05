import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ManagedImage } from './ManagedImage'
import { Star, Squiggle, Dots } from './Decor'
import { CASE_STUDIES } from '@/lib/case-studies'

// Homepage "Our work" section linking to the case studies. Three variants live
// here while Len picks one (preview at /work-section-preview); the winner gets
// mounted on the homepage and the others deleted.

const BADGE = '/work/cqc-good.png'

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

/* ── Variant A · "Case files" — two big cards, side by side ──────────────── */
export function WorkFeatureCards() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <Star className="absolute right-8 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Our work</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
            Don&rsquo;t take our word for it, walk through the builds
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft sm:text-base">
            Two care homes, rebuilt end to end, live today. Every tool, page and enquiry route on
            show, with the results published as they land.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {CASE_STUDIES.map((cs, i) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border-2 border-brand-ink bg-white shadow-[4px_4px_0_0_#2a2620] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#2a2620]"
            >
              <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-brand-ink bg-brand-bg-warm">
                <ManagedImage
                  src={cs.mockup}
                  alt={`The ${cs.name} website`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={i === 0}
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink">{cs.shortName}</h3>
                    <p className="mt-0.5 text-sm text-brand-ink-muted">{cs.type} · {cs.location}</p>
                  </div>
                  <ManagedImage src={BADGE} alt="CQC rating: Good" width={662} height={377} className="h-auto w-20 shrink-0" />
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-ink-soft">{cs.lede}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-brand-pop">
                  Read the case study
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Variant B · "From WordPress to enquiry engine" — dark band, one hero shot ── */
export function WorkFeatureBand() {
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

/* ── Variant C · "Before you hire us, inspect us" — yellow proof strip ───── */
export function WorkFeatureProof() {
  const STATS = [
    { value: '2', label: 'Care homes rebuilt & live' },
    { value: '67', label: 'Local landing pages' },
    { value: '19', label: 'Family tools built in' },
    { value: '129', label: 'Pages live across the two builds' },
  ]
  return (
    <section className="relative overflow-hidden bg-brand-accent px-6 py-20">
      <Star className="absolute left-6 top-8 hidden h-14 w-14 -rotate-12 text-brand-ink/15 lg:block" />
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-ink/60">Our work</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
              Before you hire us, inspect us
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-brand-ink/75 sm:text-base">
              Crossways and Ferndale are live, working builds you can click through today. The case
              studies walk every decision: the tools, the local pages, the enquiry routes, and the
              numbers as they land.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/work" className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-ink px-7 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0_0_#F0532B] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_#F0532B]">
                Walk through the builds
                <span aria-hidden className="text-brand-accent">→</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border-2 border-brand-ink bg-white p-5 shadow-[4px_4px_0_0_#2a2620]">
                <p className="font-display text-3xl font-bold text-brand-ink">{s.value}</p>
                <p className="mt-1 text-xs font-semibold text-brand-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CASE_STUDIES.map((cs) => (
            <Link
              key={cs.slug}
              href={`/work/${cs.slug}`}
              className="group flex items-center gap-4 rounded-2xl border-2 border-brand-ink bg-white p-4 shadow-[4px_4px_0_0_#2a2620] transition-all hover:-translate-y-0.5"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-brand-line">
                <ManagedImage src={cs.mockup} alt="" fill sizes="96px" className="object-cover object-top" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold uppercase tracking-tight text-brand-ink">{cs.shortName}</p>
                <p className="truncate text-xs text-brand-ink-muted">{cs.type} · {cs.liveLabel}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-brand-pop transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
