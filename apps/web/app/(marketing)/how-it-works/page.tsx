import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'How CareBeds Works — Managed Occupancy Marketing for Care Homes',
  description:
    'See how CareBeds fills empty care home beds: we build your landing page, run targeted ads, qualify every enquiry, and deliver move-in-ready leads to your inbox.',
  alternates: { canonical: `${SITE_URL}/how-it-works` },
  openGraph: {
    title: 'How CareBeds Works',
    description: 'From empty bed to confirmed move-in — the CareBeds process explained.',
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
      'Custom page designed around your home\'s strengths and specialisms',
      'CQC-compliant copy — no "best in class" superlatives',
      'Optimised for Google search — local + care-type keywords',
      'Integrates your existing photography or uses our care stock library',
      'Mobile-first design — most families research on phones',
      'Live within 3–5 business days of onboarding',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'We run your advertising',
    points: [
      'Google Search Ads targeting high-intent care queries in your area',
      'Meta (Facebook/Instagram) retargeting for families researching care',
      'We fund and manage all ad spend — you pay nothing upfront',
      'Campaigns optimised weekly based on actual enquiry quality',
      'You can pause campaigns instantly at any time, just let us know',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'We qualify every enquiry',
    points: [
      'Every submission is reviewed before reaching your inbox',
      'We verify: correct care type, right geography, and realistic funding',
      'Unqualified submissions are filtered out — no spam, no tyre-kickers',
      'Qualified enquiries include full context: resident details, timing, care needs',
      'Average response required: under 10 seconds, from any device',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'You close the placement',
    points: [
      'Receive qualified enquiries directly, by email and SMS',
      'One tap to call or email the family from your phone',
      'Track every enquiry from first contact to move-in',
      'Track tour dates, assessments and outcomes with us',
      'Pay the confirmed move-in fee only when a resident moves in',
    ],
  },
]

const HANDLES = [
  'Landing page design, development, and hosting',
  'Google & Meta advertising campaigns',
  'Ad spend and creative optimisation',
  'Enquiry qualification and filtering',
  'Qualified lead delivery to your team',
  'Monthly performance reporting',
]

const HOME_HANDLES = [
  'Respond to qualified enquiries within a working day',
  'Conduct tours and assessments as normal',
  'Confirm outcomes with us (tour booked, move-in, etc.)',
  'Keep your care home profile and capacity up to date',
]

export default function HowItWorksPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">How it works</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-brand-ink">
            From empty bed to confirmed move-in
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-ink-soft">
            CareBeds handles everything between your landing page and a qualified family at your
            door. You focus on care; we fill your pipeline.
          </p>
        </div>
      </section>

      {/* ── Phase breakdown ───────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-16">
          {PHASES.map(({ phase, title, points }, i) => (
            <div key={phase} className="grid grid-cols-1 gap-8 md:grid-cols-[140px_1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">{phase}</p>
                <p className="mt-1 font-display text-4xl font-semibold text-brand-line">
                  0{i + 1}
                </p>
              </div>
              <div className="rounded-2xl border border-brand-line bg-white p-8 shadow-soft">
                <h2 className="font-display text-2xl font-semibold text-brand-ink">{title}</h2>
                <ul className="mt-5 space-y-3">
                  {points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 text-sm text-brand-ink-soft">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-sage" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Responsibilities ──────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold text-brand-ink">
            What we handle vs what you handle
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-brand-line bg-white p-8">
              <p className="font-semibold text-brand-ink">CareBeds handles</p>
              <ul className="mt-4 space-y-2">
                {HANDLES.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-brand-ink-soft">
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand-sage" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-line bg-white p-8">
              <p className="font-semibold text-brand-ink">You handle</p>
              <ul className="mt-4 space-y-2">
                {HOME_HANDLES.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-brand-ink-soft">
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-brand-accent-soft" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-brand-ink">Ready to get started?</h2>
          <p className="mt-4 text-brand-ink-soft">
            Book a free demo and we&apos;ll walk you through exactly what CareBeds would look
            like for your specific home.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-xl bg-brand-accent px-8 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-ink"
            >
              Book a free demo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
