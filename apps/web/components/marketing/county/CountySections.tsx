import Link from 'next/link'
import { Check, ChevronDown, MapPin } from 'lucide-react'
import { Star, Squiggle, Dots } from '@/components/marketing/Decor'

/**
 * Applied to the text column of a two column block whose other column is a tall
 * illustration, so the explanation stays on screen while the picture scrolls past. Only
 * from lg up, where there are two columns to begin with.
 */
export const STICKY_COL = 'lg:sticky lg:top-24 self-start'

/**
 * A link out to the county's own council, inside the copy rather than in a footer.
 *
 * Each of the three county pages links to it once, with different anchor text, because
 * the same anchor repeated across a set of near-identical pages is exactly the footprint
 * that makes a programmatic page set look programmatic. The anchor is written at the call
 * site for that reason.
 */
export function CouncilLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="font-semibold text-brand-pop underline underline-offset-2"
    >
      {children}
    </a>
  )
}

// The section shells shared by the county service pages, so each page file is content
// rather than markup. Deliberately dumb: every page supplies its own headings, prose,
// figures and questions, because the whole point of a county page is that it says
// something different from the other counties and from the other service.

export function CountyHero({
  eyebrow,
  before,
  highlight,
  after,
  intro,
  points,
  primary,
  secondary,
  mock,
}: {
  eyebrow: string
  before: string
  highlight: string
  after?: string
  intro: React.ReactNode
  points: string[]
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
  /** The illustration beside the words. With one, the hero is two columns. */
  mock?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden px-6 pb-14 pt-16">
      <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
      <div className={mock ? 'mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]' : 'mx-auto max-w-4xl'}>
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-pop">
          <MapPin className="h-4 w-4" />
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
          {before} <span className="text-brand-pop">{highlight}</span>
          {after ? ` ${after}` : ''}
        </h1>
        <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
        <div className="mt-5 max-w-2xl space-y-4 text-lg leading-relaxed text-brand-ink-soft">{intro}</div>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={primary.href} className="btn-cta">
            {primary.label}
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link href={secondary.href} className="btn-cta-outline">
            {secondary.label}
          </Link>
        </div>
        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
          {points.map((p) => (
            <span key={p} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
              {p}
            </span>
          ))}
        </div>
      </div>
      {mock && <div className="relative">{mock}</div>}
      </div>
    </section>
  )
}

export function DarkStats({
  heading,
  note,
  cards,
  children,
}: {
  heading: string
  note: React.ReactNode
  cards: { n: string; l: string }[]
  children?: React.ReactNode
}) {
  return (
    <section className="bg-brand-ink px-6 py-14 text-white">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">{heading}</h2>
        <p className="mt-2 max-w-2xl text-white/70">{note}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((s) => (
            <div key={s.l}>
              <p className="font-display text-4xl font-bold text-brand-accent">{s.n}</p>
              <p className="mt-1 text-sm leading-snug text-white/70">{s.l}</p>
            </div>
          ))}
        </div>
        {children}
      </div>
    </section>
  )
}

/** A run of h2 plus prose blocks. The written content, which is the point of the page. */
export function Prose({
  sections,
  tone = 'light',
}: {
  sections: { heading: string; paragraphs: React.ReactNode[]; sub?: { heading: string; body: React.ReactNode }[] }[]
  tone?: 'light' | 'warm'
}) {
  return (
    <section className={`px-6 py-14 ${tone === 'warm' ? 'bg-brand-bg-warm' : ''}`}>
      <div className="mx-auto max-w-3xl space-y-12">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
              {s.heading}
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {s.sub && (
              <div className="mt-6 space-y-5 border-l-2 border-brand-pop/30 pl-5">
                {s.sub.map((h) => (
                  <div key={h.heading}>
                    <h3 className="font-display text-base font-bold uppercase tracking-wide text-brand-ink">
                      {h.heading}
                    </h3>
                    <p className="mt-1.5 text-base leading-relaxed text-brand-ink-soft">{h.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export function Included({
  heading,
  intro,
  groups,
}: {
  heading: string
  intro: string
  groups: { title: string; items: string[]; more?: boolean }[]
}) {
  return (
    <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-14">
      <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
      <div className="mx-auto max-w-5xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
          {heading}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">{intro}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border-2 border-brand-ink bg-white p-5 shadow-[6px_6px_0_0_#2a2620]">
              <p className="font-display text-base font-bold uppercase tracking-wide text-brand-ink">{g.title}</p>
              <ul className="mt-3 space-y-2">
                {g.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-brand-ink-soft">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                    {i}
                  </li>
                ))}
              </ul>
              {g.more && (
                <p className="mt-3 border-t border-brand-line pt-3 text-sm font-semibold text-brand-pop">
                  + many more items
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Steps({ heading, intro, items }: { heading: string; intro: string; items: { title: string; body: string }[] }) {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">{heading}</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">{intro}</p>
        <ol className="mt-8 space-y-5">
          {items.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-ink font-display text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-display text-base font-bold uppercase tracking-wide text-brand-ink">{s.title}</p>
                <p className="mt-1 text-base leading-relaxed text-brand-ink-soft">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Proof({
  heading,
  intro,
  items,
}: {
  heading: string
  intro?: string
  items: { name: string; where: string; url: string; what: string; tag?: string }[]
}) {
  if (items.length === 0) return null
  return (
    <section className="bg-brand-bg-warm px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">{heading}</h2>
        {intro && <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">{intro}</p>}
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {items.map((p) => (
            <div key={p.name} className="rounded-2xl border-2 border-brand-ink bg-white p-5 shadow-[6px_6px_0_0_#2a2620]">
              {p.tag && (
                <p className="mb-2 inline-block rounded-full bg-brand-bg-warm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-ink-muted">
                  {p.tag}
                </p>
              )}
              <p className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-brand-ink">
                {p.name}
              </p>
              <p className="text-sm text-brand-ink-muted">{p.where}</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{p.what}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noopener"
                className="mt-3 inline-block text-sm font-semibold text-brand-pop underline"
              >
                See the site
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faqs({ heading, faqs }: { heading: string; faqs: [string, string][] }) {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">{heading}</h2>
        <div className="mt-6 space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="group rounded-2xl border border-brand-line bg-white shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
                <span className="font-display text-base font-semibold text-brand-ink sm:text-lg">{q}</span>
                <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-pop transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed text-brand-ink-soft sm:text-base">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EndCta({
  title,
  body,
  primary,
  secondary,
}: {
  title: string
  body: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
}) {
  return (
    <section className="bg-brand-ink px-6 py-14 text-center text-white">
      <div className="mx-auto max-w-2xl">
        <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">{title}</h2>
        <p className="mt-3 text-white/70">{body}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={primary.href} className="btn-cta btn-on-dark">
            {primary.label}
            <span className="btn-arrow" aria-hidden>
              →
            </span>
          </Link>
          <Link href={secondary.href} className="btn-cta-outline btn-on-dark">
            {secondary.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

/**
 * A bordered panel of services, in the same shape as "Our core services" on the home page:
 * a labelled frame, two columns, an uppercase heading per item with a small button beside
 * it. Used for the county service list and for the links between the county pages, so the
 * three of them look like part of the same site rather than a set of one off landers.
 */
export function ServicePanel({
  label,
  items,
  button = 'See service',
  footer,
}: {
  label: string
  items: { title: string; body: string; href: string }[]
  button?: string
  footer?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden px-6 py-14">
      <Star className="absolute left-6 top-10 hidden h-16 w-16 -rotate-12 text-brand-pop/70 lg:block" />
      <div className="relative mx-auto max-w-5xl">
        <div className="relative rounded-3xl border-2 border-brand-pop/30 p-6 sm:p-10">
          <span className="absolute -top-3.5 left-8 bg-brand-bg px-3 font-display text-sm font-bold uppercase tracking-widest text-brand-pop">
            {label}
          </span>
          <Star className="absolute -right-7 -top-8 h-14 w-14 rotate-12 text-brand-accent" />
          <Dots className="absolute -bottom-7 -left-7 h-20 w-20 text-brand-pop/60" />

          <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {items.map((s) => (
              <div
                key={s.title}
                className="border-b border-brand-line pb-8 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-2xl">
                    {s.title}
                  </h3>
                  <Link
                    href={s.href}
                    className="mt-1 shrink-0 rounded-md bg-brand-pop px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-pop-dark"
                  >
                    {button}
                  </Link>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>

          {footer && <div className="mt-8 border-t border-brand-line pt-6">{footer}</div>}
        </div>
      </div>
    </section>
  )
}

/** The other service in this county, and the county hub. Keeps the three pages joined up. */
export function AlsoInCounty({
  label,
  links,
}: {
  label: string
  links: { title: string; href: string; body: string }[]
}) {
  return <ServicePanel label={label} items={links} button="Open" />
}

export function FaqJsonLd({ faqs }: { faqs: [string, string][] }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map(([q, a]) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })),
        }),
      }}
    />
  )
}

export function ServiceJsonLd({
  name,
  url,
  description,
  countyName,
  siteUrl,
}: {
  name: string
  url: string
  description: string
  countyName: string
  siteUrl: string
}) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Service',
          name,
          url,
          provider: { '@type': 'Organization', name: 'TRG Digital', url: siteUrl },
          areaServed: { '@type': 'AdministrativeArea', name: countyName },
          description,
        }),
      }}
    />
  )
}

/**
 * The enquiry block. Two columns: why to bother getting in touch on the left, the form on
 * the right, so the form is never a bare box with no reason attached to it.
 */
export function LeadSection({
  heading,
  body,
  bullets,
  form,
}: {
  heading: string
  body: React.ReactNode
  bullets: string[]
  form: React.ReactNode
}) {
  return (
    <section id="enquire" className="scroll-mt-24 bg-brand-bg-warm px-6 py-14">
      <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={STICKY_COL}>
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            {heading}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">{body}</div>
          <ul className="mt-6 space-y-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-brand-ink-soft">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div>{form}</div>
      </div>
    </section>
  )
}
