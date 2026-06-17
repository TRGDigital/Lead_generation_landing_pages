import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Zap, Shield, Check } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Care Home Marketing & Enquiry Generation | TRG Digital',
  description:
    "TRG Digital fills empty beds for UK care providers with targeted advertising, high-converting landing pages and pre-qualified enquiries. Activate when beds are empty, pause when you're full.",
  alternates: { canonical: `${SITE_URL}/marketing` },
  openGraph: {
    title: 'Care Home Marketing & Enquiry Generation | TRG Digital',
    description: 'Qualified care home enquiries for UK operators. Activate when beds are empty, pause when full.',
    type: 'website',
    url: `${SITE_URL}/marketing`,
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Care Home Marketing & Enquiry Generation | TRG Digital',
    description: 'Qualified care home enquiries for UK operators.',
  },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'How quickly will I receive enquiries?', a: 'Most homes receive their first qualified enquiry within 5 to 10 business days of going live. The timeline depends on local search demand and the care types you offer.' },
  { q: 'What makes an enquiry "qualified"?', a: 'We verify that the enquirer genuinely needs care, that the care type matches what you offer, and that they can meet your fee level, before the enquiry reaches your inbox.' },
  { q: 'Do I pay for every enquiry?', a: "No. You only pay when a resident actually moves in. No fees for enquiries, consultations, tours, or assessments that don't result in a placement." },
  { q: 'Can I pause the service?', a: 'Yes, instantly. Turn the campaign off when your home is full, turn it back on when you have capacity. No notice periods, no penalties.' },
  { q: 'Do I need to handle the advertising myself?', a: "No. We build, manage, and fund the advertising campaigns. You don't touch Google Ads, Meta, or any ad platform." },
  { q: 'Is there a setup fee or monthly retainer?', a: 'No upfront fee and no monthly retainer. You pay a single fixed fee per confirmed move-in, and nothing else.' },
]

const PILLARS = [
  { Icon: Shield, title: 'Proven landing pages', body: 'We build and host a CQC-compliant landing page for your home, optimised for families searching for care. Updated by us, always converting.' },
  { Icon: CheckCircle, title: 'Qualified enquiries', body: 'Every enquiry is pre-screened before it reaches you: right care type, right geography, right funding level. No time wasted on mismatches.' },
  { Icon: Zap, title: 'On/off control', body: "You're in control. Activate when you have empty beds, pause when full. One click and the change is effective immediately." },
]

const STEPS = [
  { n: '01', title: 'We build your page', body: 'Your dedicated landing page goes live in days, fully managed and optimised for search.' },
  { n: '02', title: 'We run your ads', body: 'Targeted Google and Meta campaigns drive families to your landing page, around the clock.' },
  { n: '03', title: 'You receive enquiries', body: 'Pre-qualified leads land straight in your inbox. Full qualification in under 10 seconds.' },
]

const COSTS = [
  { stat: '£900/week', label: 'average cost of one empty bed' },
  { stat: '8–12 weeks', label: 'typical vacancy without targeted marketing' },
  { stat: '£8,000+', label: 'revenue lost per vacancy at average UK fees' },
]

const POINTS = [
  'Targeted Google & Meta advertising',
  'High-converting, CQC-compliant landing pages',
  'Pre-qualified enquiries — right care type & area',
  'On/off control — pause when you’re full',
  'Pay only when a resident moves in',
  'Real-time enquiry delivery & tracking',
  'Local SEO to win organic enquiries too',
]

export default function MarketingPage() {
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
            name: 'Care Home Marketing & Enquiry Generation',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Qualified care home enquiries for UK care operators, through targeted advertising and high-converting landing pages.',
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-10 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Care home occupancy marketing</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Fill empty beds, <span className="text-brand-pop">on demand</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              We run targeted advertising, build high-converting landing pages, and deliver pre-qualified enquiries
              straight to your care home. Activate when beds are empty. Pause when you&apos;re full. Pay only when a
              resident moves in.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Start your project
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/how-it-works" className="btn-cta-outline">
                See how it works
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['Pay per move-in', 'Pause anytime', 'Enquiries, not clicks'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Visual — a landing page + an incoming enquiry */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
              <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">careassura.com</span>
              </div>
              <div className="relative aspect-[16/11] w-full">
                <Image src="/mockups/haywards-landing.png" alt="A high-converting care landing page we built" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-top" priority />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-xl border border-brand-line bg-white p-4 shadow-card sm:block">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-ink">New enquiry</span>
                <span className="rounded-full bg-brand-pop px-2 py-0.5 text-[10px] font-semibold text-white">new</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-brand-ink">Margaret W.</p>
              <p className="text-xs text-brand-ink-muted">Haywards Heath · Residential care</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem (dark) ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-ink px-6 py-24 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-pop/20 blur-3xl" />
        <Star className="absolute left-8 top-12 hidden h-16 w-16 text-brand-accent lg:block" />
        <Burst className="absolute -bottom-12 -right-10 h-52 w-52 text-brand-pop/30" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">The cost of empty beds</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
              Empty beds cost more than you think
            </h2>
            <p className="mx-auto mt-4 text-lg leading-relaxed text-white/70">
              Word of mouth and referral agencies fill beds eventually — but every week without a resident is
              revenue gone for good.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-3xl bg-brand-pop/20 sm:grid-cols-3">
            {COSTS.map(({ stat, label }) => (
              <div key={stat} className="bg-brand-pop p-7 text-center text-white">
                <p className="font-display text-4xl font-bold leading-none">{stat}</p>
                <p className="mt-3 text-sm leading-snug text-white/85">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rich two-column ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Marketing that fills beds, not just clicks
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Enquiries you can actually convert.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                Most agencies sell you traffic and impressions. We sell you{' '}
                <span className="font-semibold text-brand-ink">enquiries</span>. We run targeted Google and Meta
                campaigns that put your home in front of families actively searching for care nearby, then send
                them to a{' '}
                <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">high-converting landing page</Link>{' '}
                built to turn that visit into a real conversation.
              </p>
              <p>
                Every enquiry is pre-qualified for care type, area and funding before it reaches your inbox, and
                you only pay when a resident actually moves in. Switch it on when you have empty beds, pause it the
                moment you&apos;re full. When you want to compound results, we layer in organic{' '}
                <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">SEO</Link>{' '}
                and bespoke{' '}
                <Link href="/development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">software</Link>.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {POINTS.map((point) => (
              <div key={point} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{point}</span>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-accent p-7">
              <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink">
                Ready to stop leaving beds empty?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Submit a project enquiry
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">A smarter way to fill beds</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Everything handled, end to end
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map(({ Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border border-brand-line bg-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 transition-colors group-hover:bg-brand-pop">
                  <Icon className="h-6 w-6 text-brand-pop transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Up and running in days
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
          <div className="mt-10">
            <Link href="/how-it-works" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-pop hover:text-brand-ink">
              Full walkthrough →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute left-8 top-12 hidden h-14 w-14 -rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Pricing</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Performance-based, no surprises
          </h2>
          <p className="mt-4 text-brand-ink-soft">No setup fee. No monthly retainer. A single fixed fee per confirmed move-in.</p>
          <div className="mt-10 w-full rounded-2xl border-2 border-brand-pop/30 bg-white p-8 text-left shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-pop">Per confirmed move-in</p>
            <p className="mt-2 font-display text-5xl font-bold uppercase text-brand-ink">Fixed fee</p>
            <ul className="mt-6 space-y-2.5 text-sm text-brand-ink-soft">
              {[
                'Full landing page, built and managed for you',
                'Google & Meta advertising campaigns',
                'Pre-qualified enquiry delivery',
                'On/off control over your campaigns',
                'No contracts, cancel anytime',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop/10">
                    <Check className="h-3 w-3 text-brand-pop" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="btn-pop mt-7">
              See full pricing
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-brand-line bg-white px-6 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-ink">
                  {q}
                  <span className="shrink-0 text-lg leading-none text-brand-pop transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Star className="absolute bottom-8 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Ready to stop leaving beds empty?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Book a free 20-minute demo. We&apos;ll show you how our marketing works and what results to expect for
            your specific home.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/how-it-works" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              Learn more first →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
