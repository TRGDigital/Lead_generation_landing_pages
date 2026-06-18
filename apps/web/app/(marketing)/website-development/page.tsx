import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Smartphone, Gauge, ShieldCheck, MousePointerClick, Wrench, Check, ArrowRight } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

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
      {/* JSON-LD, Service */}
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

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-10 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Website build</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Websites that turn searches into <span className="text-brand-pop">enquiries</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              Your website is often the first impression a family gets of your care. We design and build modern,
              fast, search-optimised sites that grow your exposure and turn quiet visits into real enquiries.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Start your project
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/marketing" className="btn-cta-outline">
                See our marketing
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['SEO-built', 'Mobile-first', 'Fast & secure'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Visual, a real care website we built */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
              <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">careassura.com</span>
              </div>
              <div className="relative aspect-[16/11] w-full">
                <Image src="/mockups/haywards-landing.png" alt="A care home website we built" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-top" priority />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden h-44 w-[88px] overflow-hidden rounded-[1.4rem] border-4 border-brand-ink bg-brand-ink shadow-card sm:block">
              <div className="relative h-full w-full overflow-hidden rounded-[1.05rem] bg-white">
                <Image src="/mockups/haywards-mobile.png" alt="The same site on mobile" fill sizes="88px" className="object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rich intro (SEO), copy left, key points right ────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Your hardest-working salesperson
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Care websites designed to fill beds.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                For most families, choosing care starts with a search and ends on a website. If your site is slow,
                hard to use on a phone, or doesn&apos;t answer the questions they&apos;re really asking, they move
                on to a competitor, often without ever picking up the phone. We build sites that do the opposite:
                load fast, look trustworthy, and make enquiring effortless.
              </p>
              <p>
                Every TRG website is built for the care sector specifically. We structure pages around real search
                behaviour for{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">local care searches</Link>,
                write content that speaks to CQC ratings, funding routes and care types, and design enquiry
                journeys that turn quiet visits into booked tours. When you&apos;re ready to scale, the site plugs
                straight into our{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">paid and organic marketing</Link>{' '}
                and, where you need something bespoke, our{' '}
                <Link href="/development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">custom software</Link>.
              </p>
            </div>
          </div>

          {/* Key points + CTA */}
          <div className="space-y-3">
            {[
              'Fully responsive, flawless on mobile, tablet & desktop',
              'Search-engine optimised (SEO) from day one',
              'Compressed, next-gen images for fast loading',
              'Lightning-fast page-load speed & Core Web Vitals',
              'Secure HTTPS, accessible & WCAG-friendly',
              'Conversion-focused enquiry forms & clear CTAs',
              'Hosted, maintained & analytics built in',
            ].map((point) => (
              <div key={point} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{point}</span>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-accent p-7">
              <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink">
                Want a website that does all this?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Submit a project enquiry
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What&apos;s included</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Every site we build, built right
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, body }) => (
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

      {/* ── Why it matters (dark) ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-ink px-6 py-24 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-pop/20 blur-3xl" />
        <Star className="absolute left-8 top-12 hidden h-16 w-16 text-brand-accent lg:block" />
        <Burst className="absolute -bottom-12 -right-10 h-52 w-52 text-brand-pop/30" />
        <div className="relative mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
                A better website means more of the right enquiries
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
                It&apos;s not about a prettier site, it&apos;s about more families finding you, trusting you and
                getting in touch.
              </p>
              <Link href="/contact" className="btn-cta btn-on-dark mt-8">
                Start your project
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
            <ul className="space-y-3">
              {[
                'Rank for the care searches happening in your area',
                'Build trust the moment a family lands on your page',
                'Make it effortless to enquire, on any device',
                'Show off your homes, your team and your CQC ratings',
                'Plug straight into our marketing when you want to grow faster',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="text-sm leading-relaxed text-white/85">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we work</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              From first call to fully booked
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map(({ n, title, body }) => (
              <div key={n} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                <p className="font-display text-5xl font-bold text-brand-pop">{n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Star className="absolute bottom-8 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Ready for a website that works as hard as you do?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Tell us about your service and we&apos;ll show you what a care-sector site built to convert could do for
            your enquiries.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/marketing" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See our marketing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
