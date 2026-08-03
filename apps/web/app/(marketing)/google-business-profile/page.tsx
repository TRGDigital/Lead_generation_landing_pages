import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { MapPin, Star, MessageSquareText, Camera, BellRing, BarChart3, Check } from 'lucide-react'
import { Star as StarDecor, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/google-business-profile', META)
}

const META: Metadata = {
  title: 'Google Business Profile & Reviews Management | TRG Digital',
  description:
    'Done-for-you Google Business Profile and reviews management for UK care homes. We keep your listing accurate and active, grow genuine reviews and respond professionally, so you win the local map and the trust of families.',
  alternates: { canonical: `${SITE_URL}/google-business-profile` },
  robots: { index: true, follow: true },
}

const WHAT_WE_DO = [
  { Icon: MapPin, title: 'Profile optimisation', body: 'Accurate, complete and keyword-rich, opening hours, services, areas served and categories tuned so you rank in the local map.' },
  { Icon: Camera, title: 'Posts & photos', body: 'Regular Google posts and fresh, warm photos that keep your profile active, a signal Google rewards and families notice.' },
  { Icon: Star, title: 'Review generation', body: 'Simple, ethical ways to ask happy families for reviews, so your star rating climbs steadily over time.' },
  { Icon: MessageSquareText, title: 'Review responses', body: 'Prompt, professional replies to every review, good and bad, that show families you care and protect your reputation.' },
  { Icon: BellRing, title: 'Monitoring & alerts', body: 'We watch your profile and reviews so nothing is missed, and flag anything that needs your attention quickly.' },
  { Icon: BarChart3, title: 'Reporting', body: 'Clear monthly reporting on your rating, review growth, profile views, calls and direction requests.' },
]

const POINTS = [
  'Fully managed Google Business Profile',
  'Regular posts, photos & updates',
  'Ethical review generation',
  'Professional responses to every review',
  'Q&A and accuracy monitoring',
  'Local map ranking improvements',
  'Clear monthly reporting',
]

const STEPS = [
  { n: '01', title: 'Audit & claim', body: 'We audit and fully claim your profile, fix inaccuracies and set the foundations for local ranking.' },
  { n: '02', title: 'Optimise & activate', body: 'We optimise every field, start posting, and put a steady, ethical review process in place.' },
  { n: '03', title: 'Grow & report', body: 'Your rating and visibility climb month after month, and we report on the calls and enquiries it drives.' },
]

export default function GbpPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Google Business Profile & Reviews Management',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Done-for-you Google Business Profile and reviews management for UK care providers, to grow local visibility, trust and enquiries.',
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <StarDecor className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <StarDecor className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Google Profile & Reviews</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Win the <span className="text-brand-pop">local map</span> and the reviews families trust
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              Before a family ever visits your website, they have judged you on Google, your star rating, your photos
              and what other families say. We manage your Google Business Profile and your reviews for you, so you
              show up first on the map and look like the home families can trust.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Get a free profile review
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/local-seo" className="btn-cta-outline">
                See local SEO
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['Fully managed', 'Ethical reviews', 'More calls & enquiries'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Visual, a Google profile card with rating + map pin */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
              <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">google.com · maps</span>
              </div>
              <div className="p-6">
                <p className="font-display text-base font-bold text-brand-ink">Your Care Home</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-brand-ink">4.9</span>
                  <span className="flex">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</span>
                  <span className="text-xs text-brand-ink-muted">(86 reviews)</span>
                </div>
                <p className="mt-1 text-xs text-brand-ink-muted">Care home · Open · Lindfield</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-brand-bg-warm p-2"><p className="font-display text-sm font-bold text-brand-ink">Call</p></div>
                  <div className="rounded-lg bg-brand-bg-warm p-2"><p className="font-display text-sm font-bold text-brand-ink">Directions</p></div>
                  <div className="rounded-lg bg-brand-bg-warm p-2"><p className="font-display text-sm font-bold text-brand-ink">Website</p></div>
                </div>
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">
                  <MapPin className="h-3 w-3" /> Ranking in the local 3-pack
                </p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-52 rounded-xl border border-brand-line bg-white p-4 shadow-card sm:block">
              <p className="text-[11px] font-medium text-brand-ink-muted">Reviews · 90 days</p>
              <p className="mt-1 font-display text-2xl font-bold text-brand-ink">+21 new</p>
              <div className="mt-2 flex gap-0.5">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two-column benefit ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              The first impression that happens before your website
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Top of the map, trusted on sight.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                Most families searching for care never scroll past Google&apos;s local map. The homes in that top
                three get the calls, the direction requests and the visits. We make sure that is you, with a
                profile that is complete, active and ranking.
              </p>
              <p>
                And when they find you, your reviews decide whether they enquire. We grow a steady stream of
                genuine reviews and respond to every one, so your rating keeps climbing and families feel safe
                choosing you. It pairs perfectly with our{' '}
                <Link href="/local-seo" className="font-semibold text-brand-pop underline-offset-2 hover:underline">local SEO</Link>.
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
                Want to know how your profile looks today?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Get a free profile review
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we do ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <StarDecor className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What we manage</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Your profile and reviews, fully handled
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_DO.map(({ Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border border-brand-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 transition-colors group-hover:bg-brand-pop">
                  <Icon className="h-6 w-6 text-brand-pop transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
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
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we work</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              From claimed to climbing
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
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <StarDecor className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <StarDecor className="absolute bottom-8 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Be the home families find and trust
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We will review your Google profile for free and show you exactly how to climb the local map and grow the
            reviews that win enquiries.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get a free profile review
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/local-seo" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See local SEO →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
