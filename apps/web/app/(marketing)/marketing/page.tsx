import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, TrendingDown, Zap, Shield } from 'lucide-react'

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
  {
    q: 'How quickly will I receive enquiries?',
    a: 'Most homes receive their first qualified enquiry within 5 to 10 business days of going live. The timeline depends on local search demand and the care types you offer.',
  },
  {
    q: 'What makes an enquiry "qualified"?',
    a: 'We verify that the enquirer genuinely needs care, that the care type matches what you offer, and that they can meet your fee level, before the enquiry reaches your inbox.',
  },
  {
    q: 'Do I pay for every enquiry?',
    a: "No. You only pay when a resident actually moves in. No fees for enquiries, consultations, tours, or assessments that don't result in a placement.",
  },
  {
    q: 'Can I pause the service?',
    a: 'Yes, instantly. Turn the campaign off when your home is full, turn it back on when you have capacity. No notice periods, no penalties.',
  },
  {
    q: 'Do I need to handle the advertising myself?',
    a: "No. We build, manage, and fund the advertising campaigns. You don't touch Google Ads, Meta, or any ad platform.",
  },
  {
    q: 'Is there a setup fee or monthly retainer?',
    a: 'No upfront fee and no monthly retainer. You pay a single fixed fee per confirmed move-in, and nothing else.',
  },
]

const PILLARS = [
  {
    Icon: Shield,
    title: 'Proven landing pages',
    body: 'We build and host a CQC-compliant landing page for your home, optimised for families searching for care. Updated by us, always converting.',
  },
  {
    Icon: CheckCircle,
    title: 'Qualified enquiries',
    body: 'Every enquiry is pre-screened before it reaches you: right care type, right geography, right funding level. No time wasted on mismatches.',
  },
  {
    Icon: Zap,
    title: 'On/off control',
    body: "You're in control. Activate when you have empty beds, pause when full. One click and the change is effective immediately.",
  },
]

const STEPS = [
  { n: '01', title: 'We build your page', body: 'Your dedicated landing page goes live in days, fully managed and optimised for search.' },
  { n: '02', title: 'We run your ads', body: 'Targeted Google and Meta campaigns drive families to your landing page, around the clock.' },
  { n: '03', title: 'You receive enquiries', body: 'Pre-qualified leads land straight in your inbox. Full qualification in under 10 seconds.' },
]

const COSTS = [
  { stat: '£900/week', label: 'average cost of one empty bed' },
  { stat: '8 to 12 weeks', label: 'typical vacancy duration without targeted marketing' },
  { stat: '£8,000+', label: 'revenue lost per vacancy at average UK weekly fees' },
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
      <section className="relative overflow-hidden">
        {/* Image — bleeds to the right edge of the viewport on desktop */}
        <div className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
          <Image
            src="/hero-resident.jpg"
            alt="A care home resident relaxing in her room, looking out over the garden"
            fill
            priority
            sizes="46vw"
            className="object-cover"
          />
          <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-brand-bg to-transparent" />
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <div className="py-16 lg:w-1/2 lg:py-28 lg:pr-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
              Care home occupancy marketing
            </p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-brand-ink sm:text-6xl">
              Fill empty beds,{' '}
              <span className="italic text-brand-accent-soft">on demand.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              We run targeted advertising, build high-converting landing pages, and deliver
              pre-qualified enquiries directly to your care home. Activate when beds are
              empty. Pause when you&apos;re full. Pay only when a resident moves in.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-cta">
                Book a free demo
              </Link>
              <Link href="/how-it-works" className="btn-cta-outline">
                See how it works
              </Link>
            </div>
          </div>
        </div>

        {/* Image — full width below the text on mobile/tablet */}
        <div className="relative h-64 w-full sm:h-80 lg:hidden">
          <Image
            src="/hero-resident.jpg"
            alt="A care home resident relaxing in her room, looking out over the garden"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* ── Problem ───────────────────────────────────────────────────── */}
      <section className="bg-brand-ink px-6 py-16 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <TrendingDown className="mx-auto mb-4 h-10 w-10 text-brand-accent-soft" />
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              Empty beds cost more than you think
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/70">
              Traditional care home marketing is slow, expensive, and unpredictable. Word of
              mouth and referral agencies fill beds eventually, but every week without a
              resident is revenue gone for good.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {COSTS.map(({ stat, label }) => (
              <div key={stat} className="rounded-2xl bg-white/5 p-6 text-center">
                <p className="font-display text-4xl font-semibold text-brand-accent-soft">{stat}</p>
                <p className="mt-2 text-sm text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Solution pillars ──────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
              A smarter way to fill beds
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-ink-soft">
              Everything handled. You focus on care; we fill the pipeline.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-brand-line bg-white p-8 shadow-soft">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10">
                  <Icon className="h-5 w-5 text-brand-accent" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
              Up and running in days
            </h2>
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
          <div className="mt-12 text-center">
            <Link href="/how-it-works" className="text-sm font-medium text-brand-accent hover:text-brand-ink transition-colors">
              Full walkthrough →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing teaser ────────────────────────────────────────────── */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Transparent, performance-based pricing
          </h2>
          <p className="mt-4 text-brand-ink-soft">
            No setup fee. No monthly retainer. A single fixed fee per confirmed move-in.
          </p>
          <div className="mt-10 inline-block rounded-2xl border border-brand-line bg-white p-8 shadow-soft text-left w-full">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
              Per confirmed move-in
            </p>
            <p className="mt-2 font-display text-5xl font-semibold text-brand-ink">Fixed fee</p>
            <ul className="mt-6 space-y-2 text-sm text-brand-ink-soft">
              {[
                'Full landing page, built and managed for you',
                'Google & Meta advertising campaigns',
                'Pre-qualified enquiry delivery',
                'On/off control over your campaigns',
                'No contracts, cancel anytime',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0 text-brand-sage" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <Link href="/pricing" className="text-sm font-medium text-brand-accent hover:text-brand-ink transition-colors">
              Full pricing details →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-brand-line bg-white px-6 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-ink">
                  {q}
                  <span className="shrink-0 text-lg leading-none text-brand-ink-muted transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="bg-brand-accent px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Ready to stop leaving beds empty?
          </h2>
          <p className="mt-4 text-brand-ink/75">
            Book a free 20-minute demo. We&apos;ll show you how our marketing works and what results
            to expect for your specific home.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-pop">
              Book a free demo
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex h-12 items-center px-8 text-sm font-medium text-brand-ink/70 transition-colors hover:text-brand-ink"
            >
              Learn more first →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
