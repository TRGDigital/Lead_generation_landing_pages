import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { DESIGNS } from '@/lib/designs'

// Two picture galleries for the county pages: the homepage designs a provider can actually
// choose from, and screenshots of the tools we run. Both point at pages that already exist
// on the site, so nothing here creates a new URL.

/** Three of the design examples, chosen to cover different kinds of service. */
export function DesignExamples({
  heading,
  intro,
  slugs = ['oakfield-house', 'brightpath-care', 'st-aidans'],
  tone = 'light',
}: {
  heading: string
  intro: string
  slugs?: string[]
  tone?: 'light' | 'warm'
}) {
  const picks = slugs.map((s) => DESIGNS.find((d) => d.slug === s)).filter(Boolean) as typeof DESIGNS

  if (picks.length === 0) return null

  return (
    <section className={`px-6 py-14 ${tone === 'warm' ? 'bg-brand-bg-warm' : ''}`}>
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
          {heading}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">{intro}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((d) => (
            <Link
              key={d.slug}
              href={`/designs/${d.slug}`}
              className="group overflow-hidden rounded-2xl border-2 border-brand-ink bg-white shadow-[6px_6px_0_0_#2a2620] transition-transform hover:-translate-y-1"
            >
              <div className="relative h-44 w-full overflow-hidden border-b-2 border-brand-ink">
                <ManagedImage
                  src={`/mockups/designs/${d.slug}.jpg`}
                  alt={`${d.name}, an example ${d.setting.toLowerCase()} website design`}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-pop">{d.setting}</p>
                <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">{d.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">{d.style}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-pop">
                  Open the design
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-7">
          <Link href="/designs" className="btn-cta-outline">
            See every design example
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * Screenshots of the family facing tools we put on care websites.
 *
 * These are the ones a family uses: what care costs, whether the council will pay, what a
 * deferred payment actually means. Our own agency tools, the grader and the like, are
 * deliberately not here. They are useful to a care manager and useless to the person the
 * site is built for, and a tool on a provider's website has to earn its place with the
 * visitor rather than with us.
 */
export type ToolShot = { src: string; name: string; what: string }

export const FAMILY_TOOLS: ToolShot[] = [
  {
    src: '/work/crossways/tool-funding-d.jpg',
    name: 'Funding calculator',
    what: 'Savings, property and income in, a likely funding position out. The question every family wants answered before they ring anybody.',
  },
  {
    src: '/work/crossways/tool-council-d.jpg',
    name: 'Council funding checker',
    what: 'Whether the local authority is likely to contribute, and what happens at the upper and lower thresholds, in plain English.',
  },
  {
    src: '/work/crossways/tool-deferred-d.jpg',
    name: 'Deferred payment explainer',
    what: 'What a deferred payment agreement means for the house, worked through with their own numbers rather than described in a leaflet.',
  },
  {
    src: '/work/crossways/tool-attendance-d.jpg',
    name: 'Attendance Allowance checker',
    what: 'The benefit most families do not know they can claim, checked in a minute, on the page rather than on a government site they never come back from.',
  },
]

export function ToolShots({
  heading,
  intro,
  items = FAMILY_TOOLS.slice(0, 3),
  cta = { label: 'See all the care tools', href: '/care-tools' },
  tone = 'light',
}: {
  heading: string
  intro: string
  items?: ToolShot[]
  cta?: { label: string; href: string }
  tone?: 'light' | 'warm'
}) {
  if (items.length === 0) return null

  return (
    <section className={`px-6 py-14 ${tone === 'warm' ? 'bg-brand-bg-warm' : ''}`}>
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
          {heading}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">{intro}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <figure
              key={t.src}
              className="overflow-hidden rounded-2xl border-2 border-brand-ink bg-white shadow-[6px_6px_0_0_#2a2620]"
            >
              <div className="relative h-40 w-full overflow-hidden border-b-2 border-brand-ink bg-brand-bg-warm">
                <ManagedImage
                  src={t.src}
                  alt={`${t.name}, on a care home website we built`}
                  fill
                  sizes="(min-width:768px) 33vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <figcaption className="p-5">
                <p className="font-display text-base font-bold uppercase tracking-wide text-brand-ink">{t.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">{t.what}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-7">
          <Link href={cta.href} className="btn-cta-outline">
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
