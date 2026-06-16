import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, Smartphone, Gauge, ShieldCheck, MousePointerClick, Wrench, Check, ArrowRight } from 'lucide-react'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Care Sector Website Development | TRG Digital',
  description:
    'TRG Digital builds modern, fast, search-optimised websites for UK care providers, designed to increase your exposure and turn visitors into enquiries.',
  alternates: { canonical: `${SITE_URL}/website-development` },
  robots: { index: true, follow: true },
}

const FEATURES = [
  { Icon: Search, title: 'Built to be found', body: 'Search-optimised from the ground up, structured for the terms families and professionals actually use to find care.' },
  { Icon: MousePointerClick, title: 'Built to convert', body: 'Clear journeys, strong calls to action and enquiry forms that turn visitors into real conversations.' },
  { Icon: Smartphone, title: 'Mobile-first', body: 'Most care searches happen on a phone. Your site looks and works beautifully on every screen.' },
  { Icon: Gauge, title: 'Fast and reliable', body: 'Lightweight, modern builds that load quickly, rank better and never keep a worried family waiting.' },
  { Icon: ShieldCheck, title: 'Care-aware content', body: 'Written for the sector: care types, CQC ratings, funding and the questions people really ask.' },
  { Icon: Wrench, title: 'Managed for you', body: 'We host, maintain and update your site, so it stays fast, secure and current without taking up your time.' },
]

const STEPS = [
  { n: '01', title: 'Discovery', body: 'We learn your services, your settings and the families you want to reach, then map the site around them.' },
  { n: '02', title: 'Design & build', body: 'A bespoke, on-brand site designed to convert, built on a fast and secure modern stack.' },
  { n: '03', title: 'Launch & grow', body: 'We launch, measure and keep improving, so your site works harder for you over time.' },
]

export default function WebsiteDevelopmentPage() {
  return (
    <>
      {/* JSON-LD — Service */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Care Sector Website Development',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Modern, search-optimised websites for UK care providers, designed to increase exposure and enquiries.',
          }),
        }}
      />

      {/* ── Header ────────────────────────────────────────────────────── */}
      <section className="px-6 pt-20 pb-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Website Development</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">
            Websites built for the{' '}
            <span className="italic text-brand-accent-soft">care sector.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-ink-soft">
            Your website is often the first impression a family gets of your care. We design and build
            modern, fast, search-optimised sites that grow your exposure and turn quiet visits into
            real enquiries.
          </p>
          <div className="mt-9">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-xl bg-brand-accent px-8 text-base font-semibold text-white shadow-soft transition-all hover:bg-brand-ink"
            >
              Book a free demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10">
                  <Icon className="h-5 w-5 text-brand-accent" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why it matters ────────────────────────────────────────────── */}
      <section className="bg-brand-ink px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              A better website means more of the right enquiries
            </h2>
            <ul className="space-y-3">
              {[
                'Rank for the care searches happening in your area',
                'Build trust the moment a family lands on your page',
                'Make it effortless to enquire, on any device',
                'Show off your homes, your team and your CQC ratings',
                'Plug straight into our marketing when you want to grow faster',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-white/80">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-accent-soft" />
                  <span className="text-sm leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">How we work</h2>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STEPS.map(({ n, title, body }) => (
              <div key={n}>
                <p className="font-display text-5xl font-semibold text-brand-line">{n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready for a website that works as hard as you do?
          </h2>
          <p className="mt-4 text-white/80">
            Tell us about your service and we&apos;ll show you what a care-sector site built to convert
            could do for your enquiries.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-semibold text-brand-accent shadow-soft transition-all hover:bg-brand-bg">
              Book a free demo
            </Link>
            <Link href="/marketing" className="inline-flex h-12 items-center px-8 text-sm font-medium text-white/80 transition-colors hover:text-white">
              See our marketing <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
