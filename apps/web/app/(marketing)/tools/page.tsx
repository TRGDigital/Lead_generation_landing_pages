import type { Metadata } from 'next'
import Link from 'next/link'
import { Calculator, BedDouble, Gauge, Award, FileText, Code2, Zap, Network } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Free Tools for Care Providers | The Care Toolkit | TRG Digital',
  description:
    'Free, care-specific tools for UK care homes, nursing homes and domiciliary care — a care funding calculator, website grader, CQC checker and more.',
  alternates: { canonical: `${SITE_URL}/tools` },
  robots: { index: true, follow: true },
}

const TOOLS = [
  { Icon: Calculator, title: 'Care Funding Calculator', desc: 'Estimate care costs and who pays — your contribution, council support and NHS funding, for all four UK nations.', href: '/tools/funding-calculator', live: true },
  { Icon: BedDouble, title: 'Cost of an Empty Bed', desc: 'See exactly how much each empty bed costs you per week, month and year — and what filling them is worth.', live: false },
  { Icon: Gauge, title: 'Your Care Website Grader', desc: 'Score your care website the way families judge it — CQC rating, fees, enquiry journey, speed and mobile.', live: false },
  { Icon: Award, title: 'CQC Rating Checker', desc: 'Look up a care provider’s latest CQC rating and inspection at a glance.', live: false },
  { Icon: FileText, title: 'Care Heading Checker', desc: 'Check whether your page headings use the words families actually search for — care types, location and more.', live: false },
  { Icon: Code2, title: 'Care Schema Checker', desc: 'See if your site has the structured data that wins rich results for care homes — reviews, FAQs and local business.', live: false },
  { Icon: Zap, title: 'Website Speed Checker', desc: 'A slow site loses worried families. Check your speed on mobile and desktop, with a care-focused verdict.', live: false },
  { Icon: Network, title: 'Sitemap Checker', desc: 'Make sure the pages families need — fees, care types, contact, locations — are actually in your sitemap.', live: false },
]

export default function ToolsPage() {
  return (
    <>
      {/* JSON-LD — CollectionPage */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Free Tools for Care Providers',
            url: `${SITE_URL}/tools`,
            publisher: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-12 pt-16">
        <Star className="absolute left-6 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 top-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <Dots className="absolute bottom-4 right-1/4 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tools</p>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
            The care toolkit
          </h1>
          <div className="mt-5 flex justify-center">
            <Squiggle className="h-6 w-56 text-brand-pop" />
          </div>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
            Free, care-specific tools for care homes, nursing homes and domiciliary care — built by us, no sign-up
            to use. More are landing all the time.
          </p>
        </div>
      </section>

      {/* ── Tools grid ────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(({ Icon, title, desc, href, live }) => (
            <div
              key={title}
              className={`group relative flex flex-col rounded-2xl border bg-white p-7 shadow-soft transition-all ${
                live ? 'border-brand-line hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card' : 'border-brand-line/70'
              }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${live ? 'bg-brand-pop/10 text-brand-pop group-hover:bg-brand-pop group-hover:text-white' : 'bg-brand-bg-warm text-brand-ink-muted'}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">{title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink-soft">{desc}</p>
              {live && href ? (
                <Link href={href} className="btn-pop mt-5 w-fit">
                  Try it now
                  <span className="btn-arrow" aria-hidden>→</span>
                </Link>
              ) : (
                <span className="mt-5 w-fit rounded-full bg-brand-bg-warm px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-ink-muted">Coming soon</span>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="relative mx-auto mt-16 max-w-6xl overflow-hidden rounded-3xl bg-brand-pop px-8 py-10 text-center text-white">
          <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
          <Star className="absolute left-8 top-8 hidden h-12 w-12 text-white/40 sm:block" />
          <h2 className="relative font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            Want the results turned into more enquiries?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/85">
            The tools show you what&apos;s possible — we make it happen. Marketing, websites and software, built for care.
          </p>
          <div className="relative mt-7">
            <Link href="/contact" className="btn-cta">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
