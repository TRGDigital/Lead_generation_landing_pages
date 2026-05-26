import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'About CareBeds — Occupancy Marketing for UK Care Homes',
  description:
    'CareBeds is a performance-based occupancy marketing platform built for UK care home operators. Learn about our founding thesis and the team behind the product.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About CareBeds',
    description: 'Performance-based occupancy marketing for UK care homes.',
    type: 'website',
    url: `${SITE_URL}/about`,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD — Organization + AboutPage */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About CareBeds',
            url: `${SITE_URL}/about`,
            description: 'Performance-based occupancy marketing for UK care homes.',
            publisher: {
              '@type': 'Organization',
              name: 'CareBeds',
              url: SITE_URL,
            },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">About us</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-brand-ink">
            Built by people who understand care
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-brand-ink-soft">
            CareBeds was founded on a simple observation: UK care homes are consistently
            undermarketed. Families searching for care struggle to find the right home; care
            homes struggle to fill beds. The mismatch is a marketing problem, not a care problem.
          </p>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-brand-ink-soft leading-relaxed">
          <h2 className="font-display text-2xl font-semibold text-brand-ink">Our founding thesis</h2>
          <p>
            Most care homes have no dedicated marketing function. They rely on word of mouth,
            aging referral agency contracts, and occasional local advertising — none of which
            scales, and none of which can be turned on and off in response to occupancy.
          </p>
          <p>
            Meanwhile, the tools that work in performance marketing — PPC, conversion-optimised
            landing pages, data-driven optimisation — are well understood in other sectors but
            have barely touched the care market.
          </p>
          <p>
            CareBeds closes that gap. We bring modern performance marketing to UK care homes,
            wrapped in a model that aligns our incentives with yours: we only earn when you fill
            a bed.
          </p>

          <h2 className="font-display text-2xl font-semibold text-brand-ink pt-4">The CareAssura family</h2>
          <p>
            CareBeds is part of the{' '}
            <a
              href="https://careassura.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-accent hover:text-brand-ink transition-colors"
            >
              CareAssura
            </a>{' '}
            group — a family of products and services built to help the UK care sector operate
            more effectively. CareAssura provides care home directories, review aggregation, and
            family-facing content to help families find the right care setting.
          </p>
          <p>
            CareBeds is the operator-facing complement: where CareAssura helps families find
            homes, CareBeds helps homes find families.
          </p>

          <h2 className="font-display text-2xl font-semibold text-brand-ink pt-4">The team</h2>
          <p>
            We&apos;re a small, focused team with backgrounds in performance marketing, SaaS
            product development, and the care sector. Our advisors include registered care home
            managers and former CQC inspectors.
          </p>
          <p className="italic text-brand-ink-muted">
            [Team profiles coming soon]
          </p>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center font-display text-3xl font-semibold text-brand-ink">
            How we operate
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Aligned incentives',
                body: 'We earn when you fill a bed. That alignment shapes every decision we make — from ad targeting to enquiry qualification.',
              },
              {
                title: 'Transparent reporting',
                body: 'You see every enquiry, every conversion, every move-in. No black boxes, no opaque metrics.',
              },
              {
                title: 'Care-first compliance',
                body: "We know advertising in the care sector carries regulatory obligations. Every campaign and landing page is CQC-compliant by design.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
                <h3 className="font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl font-semibold text-brand-ink">
            Interested in working with us?
          </h2>
          <p className="mt-4 text-brand-ink-soft">
            Whether you&apos;re a care home operator, group, or potential partner, we&apos;d
            love to hear from you.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-xl bg-brand-accent px-8 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-ink"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
