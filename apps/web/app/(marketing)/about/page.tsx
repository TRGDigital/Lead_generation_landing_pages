import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Check, ArrowRight, ShieldCheck, Users, Target } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import { FloatingTechIcons } from '@/components/marketing/FloatingTechIcons'

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

const VALUE_BADGES = [
  'Care is the only sector we work in',
  'We build & ship our own software',
  'Marketing, websites & software — one team',
  'Measured on enquiries, not vanity metrics',
  'CareStream & CareAssura, live across care',
]

const OPERATE = [
  { Icon: ShieldCheck, title: 'Sector specialists', body: 'Care is all we do. We know CQC, care types, funding routes and the families behind every enquiry.' },
  { Icon: Target, title: 'Outcome-focused', body: 'We measure success the way you do: more enquiries, more residents and more value from every visitor.' },
  { Icon: Users, title: 'End-to-end partner', body: 'Marketing, websites and software from one team, so nothing falls between agencies and everything works together.' },
]

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
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">About us</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Where care meets <span className="text-brand-pop">development</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              TRG Digital helps UK care providers grow. We bring modern marketing, websites and software to a
              sector long underserved by generic agencies — and we do it with a deep understanding of how care
              really works.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Work with us
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/development" className="btn-cta-outline">
                See our products
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['Care-only specialists', 'Two live products', 'End to end'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Visual — care, paired with the software we build + floating tech logos */}
          <div className="relative">
            <FloatingTechIcons />
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
            <div className="absolute -bottom-6 -left-5 hidden w-2/5 overflow-hidden rounded-lg border border-brand-line bg-white shadow-card sm:block">
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

      {/* ── Why we exist (rich two-column) ────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Why we exist
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Built for care, not adapted to it.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                Most agencies treat care like any other industry. We do the opposite. Everything we build, market
                and develop is for the UK care sector, so we already understand your families, your regulators,
                your funding routes and the way people choose care. That focus changes the work — our{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">campaigns</Link>{' '}
                speak to real families, our{' '}
                <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">websites</Link>{' '}
                are built around the questions people actually ask, and our software solves problems we&apos;ve seen
                on the ground in care.
              </p>
              <p>
                And we don&apos;t just advise — we ship. Two of our own products are live and used across the sector
                today:{' '}
                <a href="https://carestreamai.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-pop underline-offset-2 hover:underline">CareStream</a>, an AI
                policy, training and CQC platform for care teams, and{' '}
                <a href="https://careassura.co.uk" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-pop underline-offset-2 hover:underline">CareAssura</a>, a care
                home directory that helps families find the right care. Building our own{' '}
                <Link href="/development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">software</Link>{' '}
                keeps us close to the problems our clients face every day.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {VALUE_BADGES.map((b) => (
              <div key={b} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{b}</span>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-accent p-7">
              <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink">
                Want to grow with a specialist?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Start your project
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we do (services) ─────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What we do</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Everything you need to win more enquiries
            </h2>
            <p className="mt-4 leading-relaxed text-brand-ink-soft">
              From a new website to the campaigns that fill it and the software that sets you apart — all under one
              roof, all built for the care sector.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, body, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl border border-brand-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop transition-colors group-hover:bg-brand-pop group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-pop">
                  Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we operate ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we operate</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              A partner, not a vendor
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {OPERATE.map(({ Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border border-brand-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card">
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

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Star className="absolute bottom-8 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Interested in working with us?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Whether you&apos;re a single home, a care group, or a potential partner, we&apos;d love to hear what
            you&apos;re trying to grow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get in touch
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/marketing" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See what we do →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
