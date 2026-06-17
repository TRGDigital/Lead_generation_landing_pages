import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SERVICES } from '@/lib/services'

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
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">About us</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">
              Where care meets{' '}
              <span className="italic text-brand-accent-soft">development.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-brand-ink-soft">
              TRG Digital helps UK care providers grow. We bring modern marketing, websites and
              software to a sector that has long been underserved by generic agencies, and we do it
              with a deep understanding of how care really works.
            </p>
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center rounded-xl bg-brand-accent px-8 text-base font-semibold text-brand-ink shadow-soft transition-all hover:bg-brand-ink hover:text-white"
              >
                Work with us
              </Link>
            </div>
          </div>

          {/* Visual — a care setting, paired with the software we build */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-card">
              <Image
                src="/hero-resident.jpg"
                alt="A care home resident relaxing in her room"
                width={1600}
                height={906}
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-2/5 overflow-hidden rounded-lg border border-brand-line bg-white shadow-card sm:block">
              <div className="flex items-center gap-1 border-b border-brand-line bg-brand-bg-warm px-2 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              </div>
              <Image src="/mockups/carestream.jpg" alt="CareStream, software we build for care" width={1320} height={940} className="w-full" />
            </div>
          </div>
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

      {/* ── What we do (services) ─────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">What we do</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-brand-ink">
              Everything you need to win more enquiries
            </h2>
            <p className="mt-4 leading-relaxed text-brand-ink-soft">
              From a new website to the campaigns that fill it and the software that sets you apart — all
              under one roof, all built for the care sector.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, body, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-accent hover:shadow-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-bg-warm text-brand-accent transition-colors group-hover:bg-brand-accent group-hover:text-brand-ink">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-accent">
                  Learn more
                  <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
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
