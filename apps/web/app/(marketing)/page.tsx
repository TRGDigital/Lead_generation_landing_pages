import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Megaphone, Globe, Code2, ArrowRight, Check } from 'lucide-react'
import { HomeHero } from '@/components/marketing/HomeHero'
import PostCard from '@/components/blog/PostCard'
import { getPublishedPosts } from '@/lib/blog'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
  description:
    'TRG Digital is a specialist agency for the UK care sector. We increase your enquiries, build your website, and develop custom software like CareStream and CareAssura.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
    description: 'Marketing, websites and custom software, built only for the UK care sector.',
    type: 'website',
    url: SITE_URL,
    images: [{ url: `${SITE_URL}/og-home.jpg`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
    description: 'Marketing, websites and custom software, built only for the UK care sector.',
  },
  robots: { index: true, follow: true },
}

const SERVICES = [
  {
    Icon: Megaphone,
    title: 'More enquiries, faster',
    kicker: 'Marketing',
    body: 'Targeted PPC and high-converting landing pages that bring qualified enquiries to your door and fill empty beds on demand.',
    href: '/marketing',
  },
  {
    Icon: Globe,
    title: 'Websites that win business',
    kicker: 'Website Development',
    body: 'Modern, fast, search-optimised websites built specifically for care providers, designed to grow your exposure and turn visitors into enquiries.',
    href: '/website-development',
  },
  {
    Icon: Code2,
    title: 'Software built for care',
    kicker: 'Custom Development',
    body: 'Bespoke tools and platforms for the sector, including our own products CareStream and CareAssura.',
    href: '/development',
  },
]

export default async function HomePage() {
  const { posts } = await getPublishedPosts(1)
  const latest = posts.slice(0, 4)
  return (
    <>
      {/* JSON-LD — Organization */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'TRG Digital',
            url: SITE_URL,
            description: 'A specialist digital agency for the UK care sector: marketing, website development and custom software.',
            contactPoint: { '@type': 'ContactPoint', contactType: 'sales', url: `${SITE_URL}/contact` },
          }),
        }}
      />

      <HomeHero />

      {/* ── Services ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
              Three ways we grow your care business
            </h2>
            <p className="mt-4 text-brand-ink-soft">
              From the first enquiry to the software that runs behind the scenes, we cover the digital
              side of care so you can focus on delivering it.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SERVICES.map(({ Icon, title, kicker, body, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex flex-col rounded-2xl border border-brand-line bg-white p-8 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-accent/40 hover:shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent/10">
                  <Icon className="h-5 w-5 text-brand-accent" />
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-brand-accent">{kicker}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
                  Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Specialists, not generalists ──────────────────────────────── */}
      <section className="bg-brand-ink px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                We only work with care.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/70">
                TRG Digital is a specialist, not a generalist. Everything we market, build and develop
                is for the UK care sector, so we already understand your families, your regulators and
                the way people choose care. That focus is why our work converts.
              </p>
            </div>
            <ul className="space-y-4">
              {[
                ['Sector specialists', 'We speak care: CQC, funding routes, care types and the questions families actually ask.'],
                ['Built to perform', 'Every page, campaign and product is measured on the outcome that matters: more enquiries and more residents.'],
                ['End to end', 'Marketing, websites and software from one team, so nothing falls between agencies.'],
              ].map(([t, b]) => (
                <li key={t} className="flex gap-3 rounded-2xl bg-white/5 p-5">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-accent-soft" />
                  <div>
                    <p className="font-semibold text-white">{t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Our own products ──────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">Built by us</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
              We build our own software for care
            </h2>
            <p className="mt-4 text-brand-ink-soft">
              We do not just talk about custom development, we ship it. Two of our own products are live
              and used across the sector today.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { name: 'CareStreamAI', logo: '/products/carestream-logo.png', body: 'Policies, training, audits and CQC tools, answered for care staff in over 60 languages, grounded in the provider’s own documents.', href: 'https://carestreamai.com' },
              { name: 'CareAssura', logo: '/products/careassura-logo.webp', body: 'A UK care home directory that helps families find, compare and choose the right care with confidence.', href: 'https://careassura.co.uk' },
            ].map(({ name, logo, body, href }) => (
              <div key={name} className="rounded-2xl border border-brand-line bg-white p-8 shadow-soft">
                <Image src={logo} alt={name} width={400} height={237} className="h-12 w-auto" />
                <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-accent hover:text-brand-ink">
                    Visit site <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/development" className="text-brand-ink-soft hover:text-brand-ink">Read more</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="bg-brand-accent px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Let&apos;s grow your care business
          </h2>
          <p className="mt-4 text-brand-ink/75">
            Book a free 20-minute call. Tell us where you want to grow and we&apos;ll show you exactly
            how we can help, whether that&apos;s enquiries, a new website, or custom software.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center rounded-xl bg-brand-ink px-8 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-ink/90"
            >
              Book a free demo
            </Link>
            <Link
              href="/development"
              className="inline-flex h-12 items-center px-8 text-sm font-medium text-brand-ink/70 transition-colors hover:text-brand-ink"
            >
              See our work →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Latest from the blog ──────────────────── */}
      {latest.length > 0 && (
        <section className="bg-brand-bg-warm px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">From the blog</p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">Insight for the care sector</h2>
              </div>
              <Link href="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink hover:text-brand-accent">
                View all posts <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latest.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
