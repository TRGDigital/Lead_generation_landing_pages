import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ArrowRight } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'How TRG Digital Works — Managed Marketing for Care Homes',
  description:
    'See how TRG Digital fills empty care home beds: we build your landing page, run targeted ads, qualify every enquiry, and deliver qualified leads straight to your inbox.',
  alternates: { canonical: `${SITE_URL}/how-it-works` },
  openGraph: {
    title: 'How TRG Digital Works',
    description: 'From empty bed to qualified enquiry — the TRG Digital process explained.',
    type: 'website',
    url: `${SITE_URL}/how-it-works`,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

const PHASES = [
  {
    phase: 'Phase 1',
    title: 'We build your landing page',
    points: [
      "Custom page designed around your home's strengths and specialisms",
      'CQC-compliant copy — no "best in class" superlatives',
      'Optimised for Google search — local + care-type keywords',
      'Uses your photography or our care stock library',
      'Mobile-first — most families research on phones',
      'Live within 3–5 business days of onboarding',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'We run your advertising',
    points: [
      'Google Search Ads targeting high-intent care queries in your area',
      'Meta (Facebook/Instagram) retargeting for researching families',
      'We fund and manage all ad spend — you pay nothing upfront',
      'Campaigns optimised weekly on real enquiry quality',
      'Pause campaigns instantly any time, just let us know',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'We qualify every enquiry',
    points: [
      'Every submission is reviewed before it reaches your inbox',
      'We verify correct care type, right geography and realistic funding',
      'Unqualified submissions are filtered out — no spam, no tyre-kickers',
      'Qualified leads include full context: resident details, timing, needs',
      'Delivered to you in real time, by email and SMS',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'You convert the enquiry',
    points: [
      'Receive qualified leads directly, by email and SMS',
      'One tap to call or email the family from your phone',
      'Track every enquiry from first contact to move-in',
      'Book tours, assessments and outcomes with us',
      'Pay one fixed fee per qualified lead — mismatches are free',
    ],
  },
]

const HANDLES = [
  'Landing page design, development and hosting',
  'Google & Meta advertising campaigns',
  'Ad spend and creative optimisation',
  'Enquiry qualification and filtering',
  'Qualified lead delivery to your team',
  'Reporting on rankings, traffic and enquiries',
]

const HOME_HANDLES = [
  'Respond to qualified leads within a working day',
  'Conduct tours and assessments as normal',
  'Confirm outcomes with us (tour booked, move-in, etc.)',
  'Keep your care home profile and capacity up to date',
]

export default function HowItWorksPage() {
  return (
    <>
      {/* JSON-LD — HowTo */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How TRG Digital fills care home beds',
            step: PHASES.map((p, i) => ({ '@type': 'HowToStep', position: i + 1, name: p.title })),
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How it works</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              From empty bed to <span className="text-brand-pop">qualified enquiry</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              TRG Digital handles everything between your landing page and a qualified family at your door. You
              focus on care; we fill your pipeline — and you only ever pay for qualified leads.
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
              {['Live in days', 'Fully managed', 'Pay per qualified lead'].map((p) => (
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
                <Image src="/mockups/haywards-landing.png" alt="A care landing page we build" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-top" priority />
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-56 rounded-xl border border-brand-line bg-white p-4 shadow-card sm:block">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-ink">Qualified lead</span>
                <span className="rounded-full bg-brand-pop px-2 py-0.5 text-[10px] font-semibold text-white">new</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-brand-ink">Margaret W.</p>
              <p className="text-xs text-brand-ink-muted">Haywards Heath · Residential care</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Phases ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">The process</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Four phases, fully managed
            </h2>
          </div>
          <div className="space-y-6">
            {PHASES.map(({ phase, title, points }, i) => (
              <div key={phase} className="grid gap-6 md:grid-cols-[170px_1fr] md:items-start">
                <div className="md:pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-pop">{phase}</p>
                  <p className="font-display text-6xl font-bold leading-none text-brand-pop">0{i + 1}</p>
                </div>
                <div className="rounded-2xl border border-brand-line bg-white p-8 shadow-soft">
                  <h3 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink sm:text-2xl">{title}</h3>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                    {points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm text-brand-ink-soft">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop/10">
                          <Check className="h-3 w-3 text-brand-pop" />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Responsibilities ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Who does what</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              We handle the hard part
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* We handle — dark */}
            <div className="rounded-2xl bg-brand-ink p-8 text-white">
              <p className="font-display text-lg font-bold uppercase tracking-tight text-brand-accent">TRG Digital handles</p>
              <ul className="mt-5 space-y-3">
                {HANDLES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/85">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* You handle — light */}
            <div className="rounded-2xl border-2 border-brand-pop/30 bg-white p-8">
              <p className="font-display text-lg font-bold uppercase tracking-tight text-brand-pop">You handle</p>
              <ul className="mt-5 space-y-3">
                {HOME_HANDLES.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-brand-ink-soft">
                    <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
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
            Ready to get started?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Book a free demo and we&apos;ll walk you through exactly what TRG Digital would look like for your
            specific home.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/pricing" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See pricing →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
