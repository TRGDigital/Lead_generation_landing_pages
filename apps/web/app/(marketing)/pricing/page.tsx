import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, X } from 'lucide-react'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Pricing — Pay Per Move-In | CareBeds',
  description:
    'CareBeds charges a single fixed fee per confirmed move-in. No setup fee, no monthly retainer, no contracts. See what\'s included and how pricing works.',
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    title: 'Pricing — Pay Per Move-In | CareBeds',
    description: 'No setup fee, no retainer. One fixed fee per confirmed move-in.',
    type: 'website',
    url: `${SITE_URL}/pricing`,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

const INCLUDED = [
  'Dedicated landing page — built and hosted by us',
  'Google Search Ads campaigns (managed and funded)',
  'Meta retargeting campaigns',
  'Enquiry qualification and filtering',
  'CareBeds operator portal access',
  'Team members — unlimited seats',
  'Monthly performance reports',
  'Priority support via phone and email',
]

const NOT_INCLUDED = [
  'Ad spend — we cover this',
  'Setup or onboarding fees',
  'Monthly management fees',
  'Fees for enquiries that don\'t convert',
]

const PRICING_FAQS = [
  {
    q: 'How is a confirmed move-in defined?',
    a: 'A move-in is confirmed when a resident physically moves into your care home. We track this via the CareBeds portal — you log the move-in date, which triggers the invoice.',
  },
  {
    q: 'What if an enquiry doesn\'t result in a move-in?',
    a: "You don't pay anything. Enquiries, tours, assessments, and failed placements are all free. You only pay when someone actually moves in.",
  },
  {
    q: 'Is the fee the same for all care types?',
    a: 'Fees are standardised per placement regardless of care type or weekly fee level. Contact us for volume pricing if you have multiple homes.',
  },
  {
    q: 'What\'s the minimum commitment?',
    a: "There's no minimum commitment, no lock-in, and no notice period. You can pause or cancel the service at any time from your portal.",
  },
  {
    q: 'How are invoices raised?',
    a: 'Invoices are raised automatically when a move-in is logged in the portal. Payment is due within 30 days. We accept BACS and direct debit.',
  },
  {
    q: 'Do you offer discounts for multiple homes?',
    a: 'Yes — we offer volume pricing for care groups operating more than 3 homes. Contact us to discuss a group agreement.',
  },
]

export default function PricingPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Pricing</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-brand-ink">
            One price. One trigger.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
            No retainers. No contracts. No fees for enquiries that don&apos;t convert. You
            pay a single fixed fee when a resident moves in — and nothing else.
          </p>
        </div>
      </section>

      {/* ── Pricing card ──────────────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl border-2 border-brand-accent bg-white p-8 shadow-card">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">
                Performance pricing
              </p>
              <p className="mt-3 font-display text-6xl font-semibold text-brand-ink">
                Fixed fee
              </p>
              <p className="mt-2 text-brand-ink-muted">per confirmed move-in</p>
              <p className="mt-1 text-xs text-brand-ink-muted">
                Contact us for your quoted rate
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {INCLUDED.map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-brand-ink-soft">
                  <CheckCircle className="h-4 w-4 shrink-0 text-brand-sage" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/contact"
                className="block w-full rounded-xl bg-brand-accent py-3 text-center text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-ink hover:shadow-card"
              >
                Get your quoted rate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's not included ───────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-semibold text-brand-ink">
            What you will never pay for
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {NOT_INCLUDED.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm text-brand-ink-soft">
                <X className="h-4 w-4 shrink-0 text-destructive" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold text-brand-ink">
            How CareBeds compares
          </h2>
          <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-line">
                  <th className="px-6 py-4 text-left font-semibold text-brand-ink"></th>
                  <th className="px-6 py-4 text-center font-semibold text-brand-accent">CareBeds</th>
                  <th className="px-6 py-4 text-center font-semibold text-brand-ink-soft">Referral agency</th>
                  <th className="px-6 py-4 text-center font-semibold text-brand-ink-soft">In-house PPC</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Setup cost', '£0', '£0', '£2,000–5,000'],
                  ['Monthly fee', '£0', '£0', '£1,000+/mo'],
                  ['Pay per move-in', '✓', '✓ (10–15%)', '—'],
                  ['Exclusive leads', '✓', '✗', '✓'],
                  ['You manage ads', 'No', 'No', 'Yes'],
                  ['Landing page included', '✓', '✗', '✗'],
                  ['On/off control', '✓', '✗', 'Partial'],
                ].map(([label, cb, ref, ih]) => (
                  <tr key={label as string} className="border-b border-brand-line/50 last:border-0">
                    <td className="px-6 py-3.5 text-brand-ink-soft">{label}</td>
                    <td className="px-6 py-3.5 text-center font-medium text-brand-ink">{cb}</td>
                    <td className="px-6 py-3.5 text-center text-brand-ink-soft">{ref}</td>
                    <td className="px-6 py-3.5 text-center text-brand-ink-soft">{ih}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center font-display text-3xl font-semibold text-brand-ink">
            Pricing questions
          </h2>
          <div className="space-y-3">
            {PRICING_FAQS.map(({ q, a }) => (
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

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-accent px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-white">
            Get your quoted rate
          </h2>
          <p className="mt-4 text-white/80">
            Rates vary by location and competition. Book a demo and we&apos;ll give you an
            exact figure for your home.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-sm font-semibold text-brand-accent shadow-soft transition-all hover:bg-brand-bg"
            >
              Book a free demo
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
