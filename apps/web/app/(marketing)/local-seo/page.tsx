import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { MapPin, Star as StarIcon, Building2, Search, MessageSquare, BarChart3, Check } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/local-seo', META)
}

const META: Metadata = {
  title: 'Local SEO for Care Providers | Get Found Locally | TRG Digital',
  description:
    'Local SEO for UK care homes, nursing homes and home care. We get you found by families searching for care in your area, Google Business Profile, local pages, citations and reviews, so the right local audience finds you first.',
  alternates: { canonical: `${SITE_URL}/local-seo` },
  robots: { index: true, follow: true },
}

const WHAT_WE_DO = [
  { Icon: Building2, title: 'Google Business Profile', body: 'We optimise and manage your profile so you show up in the map pack and the local search results when families search for care nearby.' },
  { Icon: MapPin, title: 'Local landing pages', body: 'Dedicated pages for every town and area you serve, built around the exact local searches families use.' },
  { Icon: Search, title: 'Local citations', body: 'Consistent name, address and phone across the directories that matter, so Google trusts your location.' },
  { Icon: StarIcon, title: 'Reviews & reputation', body: 'A simple system to win more reviews and show your star rating where local families will see it.' },
  { Icon: MessageSquare, title: 'Local content', body: 'Genuinely useful, area-specific content that earns visibility for the searches in your catchment.' },
  { Icon: BarChart3, title: 'Local reporting', body: 'Clear reporting on your local search and map-pack rankings, local traffic and the enquiries it brings through your door.' },
]

const POINTS = [
  'Google Business Profile optimisation',
  'Local landing pages per town and area',
  'Consistent local citations (NAP)',
  'Review generation and reputation',
  'Map-pack and local rank tracking',
  'Area-specific, care-aware content',
]

const STEPS = [
  { n: '01', title: 'Map your area', body: 'We map every town and care type you serve and find where local families are already searching.' },
  { n: '02', title: 'Build local presence', body: 'Profile, local pages, citations and reviews, all the signals Google uses to rank you locally.' },
  { n: '03', title: 'Own your catchment', body: 'We track your local search and map-pack rankings and keep growing the local enquiries month after month.' },
]

export default function LocalSeoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Local SEO for Care Providers',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Local SEO for UK care providers, getting found by families searching for care in their area.',
          }),
        }}
      />

      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Local SEO</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Be the home <span className="text-brand-pop">families nearby</span> find first
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              Care is a local decision. When someone searches for care in your town, you need to be at the top of the
              map and the results. We build your local presence so the right families in your area find you, and
              choose you, first.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Get a free local audit
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/seo" className="btn-cta-outline">
                See our SEO
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['Local search rankings', 'Map pack visibility', 'Enquiries, not clicks'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
              <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">google.com/maps</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 rounded-full border border-brand-line px-3 py-2.5 text-xs text-brand-ink-muted">
                  <Search className="h-3.5 w-3.5" />
                  <span className="truncate">care homes near me</span>
                </div>
                <div className="mt-5 space-y-3">
                  {[['Your Care Home', '★ 4.9 · 0.4 mi', true], ['A competitor', '★ 4.2 · 0.9 mi', false], ['Another home', '★ 4.0 · 1.6 mi', false]].map(([name, meta, top]) => (
                    <div key={name as string} className={`flex items-center gap-3 rounded-xl border p-3 ${top ? 'border-brand-pop/40 bg-brand-pop/5' : 'border-brand-line'}`}>
                      <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${top ? 'bg-brand-pop' : 'bg-brand-ink-muted'}`}>
                        <MapPin className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-brand-ink">{name}</p>
                        <p className="text-[11px] text-brand-ink-muted">{meta}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">Top of local search & the map</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Win the searches that happen on your doorstep
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Local intent is the highest intent there is.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                When a family searches for care near them, they are ready to act. They compare the homes Google shows
                at the top, read the reviews, and make a shortlist before they ever call. If you are not showing up in
                local search and the map pack, you are invisible to the people most likely to enquire.
              </p>
              <p>
                We build every local signal Google looks for: a fully optimised{' '}
                <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">website</Link>,
                local pages for each area you serve, consistent listings, and a steady flow of genuine reviews. The
                result is a presence that puts you in front of local families and keeps you there.
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
                Want to see how you rank locally today?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Get a free local audit
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What we do</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Every signal that ranks you locally
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

      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we work</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              From invisible to top of local search
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

      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Own the searches in your area
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Get a free local audit. We will show you where you rank in your town today and the fastest way to climb
            the local search results and the map.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get a free local audit
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/seo" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See our SEO →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
