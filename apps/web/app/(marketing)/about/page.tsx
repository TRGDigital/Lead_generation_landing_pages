import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'About TRG Digital | A Specialist Care-Sector Agency',
  description:
    'TRG Digital is a digital agency built only for the UK care sector. We grow enquiries, build websites and develop custom software, including our own products CareStream and CareAssura.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About TRG Digital',
    description: 'A specialist digital agency for the UK care sector.',
    type: 'website',
    url: `${SITE_URL}/about`,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function AboutPage() {
  return (
    <>
      {/* JSON-LD — AboutPage */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About TRG Digital',
            url: `${SITE_URL}/about`,
            description: 'A specialist digital agency for the UK care sector.',
            publisher: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">About us</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-brand-ink">
            A digital agency built only for care
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-brand-ink-soft">
            TRG Digital helps UK care providers grow. We bring modern marketing, websites and
            software to a sector that has long been underserved by generic agencies, and we do it
            with a deep understanding of how care really works.
          </p>
        </div>
      </section>

      {/* ── Story ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-bg-warm px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-6 text-brand-ink-soft leading-relaxed">
          <h2 className="font-display text-2xl font-semibold text-brand-ink">Why we exist</h2>
          <p>
            Most agencies treat care like any other industry. We do the opposite. Everything we
            build, market and develop is for the UK care sector, so we already understand your
            families, your regulators, your funding routes and the way people choose care.
          </p>
          <p>
            That focus changes the work. Our campaigns speak to real families, our websites are
            built around the questions people actually ask, and our software solves problems we have
            seen on the ground in care.
          </p>

          <h2 className="font-display text-2xl font-semibold text-brand-ink pt-4">What we do</h2>
          <p>
            We work across three areas, all under one roof. Our{' '}
            <Link href="/marketing" className="font-medium text-brand-accent hover:text-brand-ink transition-colors">marketing</Link>{' '}
            fills empty beds with targeted advertising and high-converting landing pages. Our{' '}
            <Link href="/website-development" className="font-medium text-brand-accent hover:text-brand-ink transition-colors">website development</Link>{' '}
            builds fast, search-optimised sites that grow your exposure. And our{' '}
            <Link href="/development" className="font-medium text-brand-accent hover:text-brand-ink transition-colors">custom development</Link>{' '}
            creates bespoke tools and platforms for the sector.
          </p>

          <h2 className="font-display text-2xl font-semibold text-brand-ink pt-4">We build our own products</h2>
          <p>
            We do not just advise, we ship. Two of our own products are live and used across the
            sector today:{' '}
            <a href="https://carestreamai.com" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-accent hover:text-brand-ink transition-colors">CareStreamAI</a>,
            an AI policy, training and CQC platform for care teams, and{' '}
            <a href="https://careassura.co.uk" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-accent hover:text-brand-ink transition-colors">CareAssura</a>,
            a care home directory that helps families find the right care. Building our own software
            keeps us close to the problems our clients face every day.
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
                title: 'Sector specialists',
                body: 'Care is all we do. We know CQC, care types, funding routes and the families behind every enquiry.',
              },
              {
                title: 'Outcome-focused',
                body: 'We measure success the way you do: more enquiries, more residents and more value from every visitor.',
              },
              {
                title: 'End-to-end partner',
                body: 'Marketing, websites and software from one team, so nothing falls between agencies and everything works together.',
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
            Whether you&apos;re a single home, a care group, or a potential partner, we&apos;d love to
            hear what you&apos;re trying to grow.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-xl bg-brand-accent px-8 text-sm font-semibold text-brand-ink shadow-soft transition-all hover:bg-brand-ink hover:text-white"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
