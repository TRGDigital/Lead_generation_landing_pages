import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { MousePointerClick, FlaskConical, LayoutPanelTop, Phone, Gauge, BarChart3, Check } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/conversion-rate-optimisation', META)
}

const META: Metadata = {
  title: 'Conversion Rate Optimisation for Care | More Enquiries | TRG Digital',
  description:
    'Conversion rate optimisation for care websites and landing pages. We turn more of your existing visitors into enquiries with clearer journeys, stronger calls to action, faster pages and A/B testing.',
  alternates: { canonical: `${SITE_URL}/conversion-rate-optimisation` },
  robots: { index: true, follow: true },
}

const WHAT_WE_DO = [
  { Icon: LayoutPanelTop, title: 'Clearer journeys', body: 'We remove friction and guide every visitor toward the one thing that matters: making an enquiry.' },
  { Icon: Phone, title: 'Stronger calls to action', body: 'Prominent, persuasive ways to call, enquire or book a visit, on every page and every device.' },
  { Icon: Gauge, title: 'Speed & mobile', body: 'Faster, mobile-first pages, because a worried family will not wait for a slow site to load.' },
  { Icon: FlaskConical, title: 'A/B testing', body: 'We test headlines, layouts and forms against real visitors and keep the version that wins.' },
  { Icon: MousePointerClick, title: 'Forms & lead capture', body: 'Simple, trustworthy forms and capture points that turn interest into a real conversation.' },
  { Icon: BarChart3, title: 'Tracking & insight', body: 'We measure where visitors drop off and exactly which changes lift your enquiry rate.' },
]

const POINTS = [
  'Conversion audit of your site and pages',
  'Clearer journeys and calls to action',
  'Faster, mobile-first pages',
  'A/B and multivariate testing',
  'Optimised forms and lead capture',
  'Reporting on enquiry rate, not just clicks',
]

const STEPS = [
  { n: '01', title: 'Audit', body: 'We analyse how visitors move through your site and pinpoint exactly where enquiries are being lost.' },
  { n: '02', title: 'Test', body: 'We make targeted changes and test them against real traffic, so every improvement is proven, not guessed.' },
  { n: '03', title: 'Lift', body: 'We roll out what works and keep optimising, so the same traffic delivers more and more enquiries.' },
]

export default function CroPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Conversion Rate Optimisation for Care Providers',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Conversion rate optimisation for care websites and landing pages, turning more visitors into enquiries.',
          }),
        }}
      />

      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Conversion rate optimisation</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              More enquiries from the <span className="text-brand-pop">visitors you already have</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              Most care websites lose the majority of their visitors. Conversion rate optimisation fixes that. We make
              it effortless for families to enquire, so the traffic you already pay for and earn turns into far more
              enquiries, without spending a penny more on advertising.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Get a conversion audit
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/website-development" className="btn-cta-outline">
                See our websites
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['Tested, not guessed', 'Mobile-first', 'Measured on enquiries'].map((p) => (
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
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">yourhome.co.uk</span>
              </div>
              <div className="p-6">
                <p className="text-[11px] font-medium text-brand-ink-muted">Enquiry rate</p>
                <div className="mt-2 flex items-end gap-3">
                  <p className="font-display text-3xl font-bold text-brand-ink">2.1%</p>
                  <span className="text-brand-ink-muted">→</span>
                  <p className="font-display text-3xl font-bold text-brand-pop">5.4%</p>
                </div>
                <p className="mt-1 text-sm font-semibold text-green-600">↑ 157% more enquiries, same traffic</p>
                <div className="mt-5 space-y-2">
                  {[['Clearer call to action', true], ['Faster mobile pages', true], ['Simpler enquiry form', true]].map(([t]) => (
                    <div key={t as string} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-500"><Check className="h-3 w-3 text-white" /></span>
                      <span className="text-sm text-brand-ink">{t}</span>
                    </div>
                  ))}
                </div>
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
              The cheapest enquiries you will ever get
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Same traffic. Far more enquiries.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                Driving more traffic is expensive. Converting more of the traffic you already have is not. If your
                site turns 2% of visitors into enquiries, lifting that to 4% doubles your enquiries with no extra
                spend on ads or SEO. That is the power of conversion rate optimisation.
              </p>
              <p>
                We apply it to both your{' '}
                <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">website</Link>{' '}
                and your landing pages: clearer journeys, stronger calls to action, faster pages and rigorous testing.
                Then we pair it with{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">paid media</Link>{' '}
                so every pound you spend works harder.
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
                How many enquiries is your site leaving on the table?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Get a conversion audit
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
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What we optimise</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Every step from visit to enquiry
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
              Audit, test, lift, repeat
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
            Get more from the traffic you already have
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Get a free conversion audit. We will show you exactly where your site is losing enquiries and the fastest
            wins to capture them.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get a conversion audit
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/website-development" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See our websites →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
