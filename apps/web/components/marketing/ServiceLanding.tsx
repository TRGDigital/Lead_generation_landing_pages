import Link from 'next/link'
import { Check, type LucideIcon } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

// Shared layout for service pages (same sections and styling as /local-seo), so new
// service pages are content only. Used by /carer-recruitment, /accessible-websites and
// /website-build.

export type ServiceLandingProps = {
  path: string
  schemaName: string
  schemaDescription: string
  eyebrow: string
  title: [string, string, string?] // before, highlighted, after
  intro: string
  heroPoints: string[]
  primaryCta: { label: string; href: string }
  secondaryCta: { label: string; href: string }
  mock: { url: string; heading: string; rows: [string, string][]; badge: string }
  why: { title: string; tagline: string; paragraphs: React.ReactNode[] }
  points: string[]
  pointsCta: string
  cards: { title: string; subtitle: string; items: { Icon: LucideIcon; title: string; body: string }[] }
  steps: { title: string; items: { n: string; title: string; body: string }[] }
  extra?: React.ReactNode
  cta: { title: string; body: string }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export function ServiceLanding(p: ServiceLandingProps) {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: p.schemaName,
            url: `${SITE_URL}${p.path}`,
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: p.schemaDescription,
          }),
        }}
      />

      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">{p.eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              {p.title[0]} <span className="text-brand-pop">{p.title[1]}</span>
              {p.title[2] ? ` ${p.title[2]}` : ''}
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">{p.intro}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={p.primaryCta.href} className="btn-pop">
                {p.primaryCta.label}
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href={p.secondaryCta.href} className="btn-cta-outline">
                {p.secondaryCta.label}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {p.heroPoints.map((pt) => (
                <span key={pt} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {pt}
                </span>
              ))}
            </div>
          </div>

          <div className="relative" aria-hidden data-nosnippet>
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
              <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">{p.mock.url}</span>
              </div>
              <div className="p-6">
                <p className="font-display text-lg font-bold text-brand-ink">{p.mock.heading}</p>
                <div className="mt-4 space-y-2.5">
                  {p.mock.rows.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-3 rounded-xl border border-brand-line px-4 py-3">
                      <span className="text-sm text-brand-ink-soft">{label}</span>
                      <span className="text-sm font-semibold text-brand-ink">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">{p.mock.badge}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">{p.why.title}</h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">{p.why.tagline}</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              {p.why.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {p.points.map((point) => (
              <div key={point} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{point}</span>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-accent p-7">
              <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink">{p.pointsCta}</p>
              <Link href={p.primaryCta.href} className="btn-pop mt-5">
                {p.primaryCta.label}
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">{p.cards.subtitle}</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">{p.cards.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {p.cards.items.map(({ Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border border-brand-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 transition-colors group-hover:bg-brand-pop">
                  <Icon className="h-6 w-6 text-brand-pop transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {p.extra}

      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we work</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">{p.steps.title}</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {p.steps.items.map(({ n, title, body }) => (
              <div key={n} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                <p className="font-display text-5xl font-bold text-brand-pop">{n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">{p.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">{p.cta.body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={p.primaryCta.href} className="btn-cta">
              {p.primaryCta.label}
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href={p.secondaryCta.href} className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              {p.secondaryCta.label} →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
