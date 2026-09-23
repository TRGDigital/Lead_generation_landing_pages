import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Search, FileText, Settings, MapPin, PenLine, BarChart3, Check } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import { SerpResult, SerpJobs, SchemaCode } from '@/components/marketing/SerpMock'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/seo', META)
}

const META: Metadata = {
  title: 'Care Sector SEO | Get Found First',
  description:
    'Specialist SEO for UK care providers. We grow your organic visibility, local, technical and on-page SEO, so families find your care home first, and enquiries come in month after month.',
  alternates: { canonical: `${SITE_URL}/seo` },
  robots: { index: true, follow: true },
}

const WHAT_WE_OPTIMISE = [
  { Icon: Search, title: 'Keyword strategy', body: 'We target the exact searches families and professionals use to find care near you, not vanity terms.' },
  { Icon: FileText, title: 'On-page SEO', body: 'Titles, structure, internal links and content tuned page-by-page so search engines understand and rank you.' },
  { Icon: Settings, title: 'Technical SEO', body: 'Fast load speed, clean code, indexing and Core Web Vitals, the foundations rankings are built on.' },
  { Icon: MapPin, title: 'Local SEO', body: 'Google Business Profile, local pages and citations so you show up across your catchment area.' },
  { Icon: PenLine, title: 'Content that ranks', body: 'Genuinely useful, care-aware content that answers real questions and earns organic visibility.' },
  { Icon: BarChart3, title: 'Reporting', body: 'Clear, honest reporting on rankings, organic traffic and the enquiries it actually drives.' },
]

const POINTS = [
  'Keyword research for local care searches',
  'On-page SEO & content optimisation',
  'Technical SEO & Core Web Vitals',
  'Local SEO & Google Business Profile',
  'Authoritative, care-aware content',
  'Quality backlinks & local citations',
  'Transparent ranking & traffic reporting',
]

const STEPS = [
  { n: '01', title: 'Audit', body: 'We audit your site, your rankings and your local competitors to find the fastest wins.' },
  { n: '02', title: 'Optimise', body: 'On-page, technical and local SEO, plus content built around exactly what families search for.' },
  { n: '03', title: 'Grow', body: 'We track rankings and enquiries, and keep compounding your organic visibility month after month.' },
]

export default function SeoPage() {
  return (
    <>
      {/* JSON-LD, Service */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Care Sector Search Engine Optimisation (SEO)',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Local, technical and on-page SEO for UK care providers, designed to grow organic visibility and enquiries.',
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Search Engine Optimisation</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Get found <span className="text-brand-pop">first</span> when families search
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              When a family searches for care in your area, you need to be the home they find first. We grow your
              organic visibility, local, technical and on-page SEO, so enquiries come in month after month,
              without paying for every click.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Get a free SEO audit
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/marketing" className="btn-cta-outline">
                See our marketing
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['Found on Google & Bing', 'Local-first', 'Enquiries, not clicks'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Visual, a #1 Google result + organic growth */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
              <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">google.com</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 rounded-full border border-brand-line px-3 py-2.5 text-xs text-brand-ink-muted">
                  <span className="text-base font-semibold">
                    <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
                  </span>
                  <span className="truncate">care homes in haywards heath</span>
                </div>
                <div className="mt-5">
                  <p className="text-[11px] text-[#202124]">careassura.com › haywards-heath</p>
                  <p className="mt-1 text-base font-medium leading-snug text-[#1a0dab]">Care Homes in Haywards Heath | Free, Impartial Help</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#4d5156]">Find and compare brilliant care homes in Haywards Heath. Free, impartial help, covering residential, nursing and dementia care…</p>
                </div>
                <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">Ranking #1 on Google</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden w-52 rounded-xl border border-brand-line bg-white p-4 shadow-card sm:block">
              <p className="text-[11px] font-medium text-brand-ink-muted">Organic traffic · 28 days</p>
              <p className="mt-1 font-display text-2xl font-bold text-brand-ink">+62%</p>
              <svg viewBox="0 0 120 36" className="mt-2 w-full" preserveAspectRatio="none">
                <path d="M0,32 L24,28 L48,22 L72,16 L96,9 L120,3" fill="none" stroke="#34A853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rich two-column ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              The enquiries you don&apos;t pay for every click
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Rank once, get found for years.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                Paid ads stop the moment you stop paying. SEO compounds. By earning page-one rankings for the
                searches families actually use, you turn Google and Bing into a steady source of enquiries that
                keeps working long after the work is done, and costs nothing per click.
              </p>
              <p>
                We approach SEO the way the care sector needs it: local-first, technically sound and genuinely
                helpful. We optimise your{' '}
                <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">website</Link>{' '}
                for speed and structure, build content around real care questions, and strengthen your local
                presence so you show up across your whole catchment. When you want to grow faster, we layer it with{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">paid advertising</Link>.
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
                Want to know where you rank today?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Get a free SEO audit
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we optimise ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What we optimise</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Every lever that moves rankings
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_OPTIMISE.map(({ Icon, title, body }) => (
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

      {/* ── What schema markup actually does ──────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Schema markup</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              The difference structured data makes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">
              Schema markup is information written into a page, in a format called JSON-LD, that tells Google exactly
              what it is looking at. Visitors never see it. Google reads it on every visit, and it decides whether you
              appear as a plain blue link or as a result that answers half the question before anyone clicks.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-3 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700">
                Without schema markup
              </p>
              <SerpResult
                site="Oakfield House"
                url="https://www.oakfieldhouse.co.uk"
                title="Oakfield House | Home"
                description="Welcome to Oakfield House. We are a family run care home providing quality care. Please contact us for more information about our services and availability."
              />
              <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">
                A plain link. No rating, no questions answered, nothing that says where you are or what you offer.
              </p>
            </div>

            <div>
              <p className="mb-3 inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                With schema markup
              </p>
              <SerpResult
                site="Oakfield House"
                url="oakfieldhouse.co.uk › residential-care › alderbury"
                title="Residential Care Home in Alderbury | CQC Good | Oakfield House"
                description="Family run residential and respite care in Alderbury, Wiltshire. 32 bedrooms, rooms available this month, weekly fees from £1,150. Book a visit any day."
                rating={{ stars: 'Rating 4.9', text: '27 reviews' }}
                faqs={[
                  'How much does a room at Oakfield House cost?',
                  'Do you have any rooms available?',
                  'Can we visit before we decide?',
                ]}
              />
              <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">
                The same home, with breadcrumbs, review stars and the questions families actually ask, answered in the
                result itself.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-xl font-semibold text-brand-ink">This is what Google reads</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
                The markup behind the result above. We write it for every page of your site and keep it accurate as
                your rooms, fees and reviews change.
              </p>
              <div className="mt-4">
                <SchemaCode
                  lines={[
                    { text: '<script type="application/ld+json">', tone: 'tag' },
                    { text: '{' },
                    { text: '  "@type": "ResidentialCareFacility",', tone: 'key' },
                    { text: '  "name": "Oakfield House",', tone: 'value' },
                    { text: '  "address": { "addressLocality": "Alderbury", "addressRegion": "Wiltshire" },', tone: 'value' },
                    { text: '  "telephone": "01722 000 000",', tone: 'value' },
                    { text: '  "aggregateRating": { "ratingValue": 4.9, "reviewCount": 27 },', tone: 'value' },
                    { text: '  "makesOffer": { "name": "Residential care", "priceSpecification": "£1,150 per week" }', tone: 'value' },
                    { text: '}' },
                    { text: '</script>', tone: 'tag' },
                    { text: '' },
                    { text: '// plus FAQPage, BreadcrumbList and Review on the same page', tone: 'comment' },
                  ]}
                />
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-brand-ink">Your vacancies, listed free</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
                Job posting markup puts your roles into Google&apos;s own job search, alongside the paid job boards,
                at no cost. Carers see the pay and the location before they click.
              </p>
              <div className="mt-4">
                <SerpJobs
                  heading="Care jobs near Alderbury"
                  jobs={[
                    { title: 'Care Assistant, days', meta: 'Oakfield House · Alderbury, Wiltshire', chips: ['£12.60 an hour', 'Full time', 'Posted 2 days ago'] },
                    { title: 'Live-in Carer', meta: 'Brightpath Care · Melrose Green, Suffolk', chips: ['From £143 a day', 'Live-in'] },
                    { title: 'Registered Nurse, nights', meta: "St Aidan's Nursing Home · Northbrook", chips: ['£21.40 an hour', 'Nights'] },
                  ]}
                />
              </div>
              <div className="mt-4">
                <SchemaCode
                  lines={[
                    { text: '"@type": "JobPosting",', tone: 'key' },
                    { text: '"title": "Care Assistant, days",', tone: 'value' },
                    { text: '"hiringOrganization": { "name": "Oakfield House" },', tone: 'value' },
                    { text: '"jobLocation": { "addressLocality": "Alderbury" },', tone: 'value' },
                    { text: '"baseSalary": { "value": 12.60, "unitText": "HOUR" }', tone: 'value' },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-xl font-semibold text-brand-ink">Home care, by the town you cover</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
                Service and area markup tells Google which services you provide and where, so a town page appears for
                the searches made in that town.
              </p>
              <div className="mt-4">
                <SerpResult
                  site="Brightpath Care"
                  url="brightpathcare.co.uk › home-care › melrose-green"
                  title="Home Care in Melrose Green | Nurse-led | Brightpath Care"
                  description="Hourly home care and live-in care in Melrose Green and the surrounding villages. Visits from 30 minutes, planned by a nurse. Free care assessment."
                  rating={{ stars: 'Rating 4.8', text: '41 reviews' }}
                  sitelinks={['Live-in care', 'Areas we cover', 'Care jobs', 'Fees']}
                />
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold text-brand-ink">A group, with every home found</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
                For a group, each home gets its own organisation and location markup, so all four appear for their own
                towns rather than competing as one entry.
              </p>
              <div className="mt-4">
                <SerpResult
                  site="Ravenswood Care Group"
                  url="ravenswoodcare.co.uk › our-homes › aller-brook"
                  title="Aller Brook Nursing Home, Newton Abbot | Ravenswood Care Group"
                  description="Nursing and residential care in Newton Abbot, Devon. 2 rooms available now. Part of Ravenswood Care Group, four homes across Devon and Somerset."
                  rating={{ stars: 'Rating 4.7', text: '18 reviews' }}
                  faqs={['What care does Aller Brook provide?', 'Do you have availability?']}
                />
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-brand-ink-muted">
            Illustrations of what structured data makes possible. The providers shown are the fictional ones from our{' '}
            <Link href="/designs" className="font-semibold text-brand-pop underline-offset-2 hover:underline">design examples</Link>,
            and Google decides which enhancements to show for each search.
          </p>
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
              From audit to page one
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
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Star className="absolute bottom-8 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Ready to outrank your local competition?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Get a free SEO audit. We&apos;ll show you where you rank today, where your competitors beat you, and the
            fastest wins to climb.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get a free SEO audit
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/marketing" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See our marketing →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
