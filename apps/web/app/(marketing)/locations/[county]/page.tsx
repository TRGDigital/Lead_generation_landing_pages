import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, MapPin } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { getCounty, countySlugs, pctNoWebsite, STATS_AS_AT } from '@/lib/locations'
import { Star, Squiggle } from '@/components/marketing/Decor'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

type Props = { params: { county: string } }

export function generateStaticParams() {
  return countySlugs().map((county) => ({ county }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const county = getCounty(params.county)
  if (!county) return {}
  const { stats } = county
  return applyPageSeo(`/locations/${county.slug}/`, {
    title: `Care Website Design & SEO in ${county.name} | TRG Digital`,
    description: `Websites and search for care providers across ${county.name}. ${stats.services} care services here, ${pctNoWebsite(stats)}% with no website at all. Free 60-second check.`,
    alternates: { canonical: `${SITE_URL}/locations/${county.slug}/` },
  })
}

const SERVICES = [
  { title: 'Care website design and build', href: '/website-development', body: 'Built from scratch, fast, with the tools families use and an enquiry form that works on a phone.' },
  { title: 'Local SEO', href: '/local-seo', body: 'Ranking for your town, not for vanity keywords, and above the directories you currently pay.' },
  { title: 'Carer recruitment', href: '/carer-recruitment', body: 'Careers pages with pay up front, listed free in Google for Jobs, so hires cost less than the job boards.' },
  { title: 'Google Ads', href: '/marketing', body: 'Switched on when you have beds or hours to fill, paused when you do not.' },
]

export default function CountyPage({ params }: Props) {
  const county = getCounty(params.county)
  if (!county) notFound()
  const { stats } = county
  const ratedShare = Math.round(((stats.good + stats.outstanding) / stats.services) * 100)

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `Care website design and SEO in ${county.name}`,
            url: `${SITE_URL}/locations/${county.slug}/`,
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: { '@type': 'AdministrativeArea', name: county.name },
            description: `Websites, local SEO and enquiry generation for care providers in ${county.name}.`,
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-14 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-4xl">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-pop">
            <MapPin className="h-4 w-4" />
            {county.name}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
            Care websites and search in <span className="text-brand-pop">{county.name}</span>
          </h1>
          <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-ink-soft">{county.standing}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/site-audit" className="btn-cta">
              Get an audit of your site
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/tools/website-grader" className="btn-cta-outline">
              Score your site free, in 60 seconds
            </Link>
          </div>
        </div>
      </section>

      {/* The county, in numbers nobody else publishes */}
      <section className="bg-brand-ink px-6 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            The care market in {county.name}
          </h2>
          <p className="mt-2 max-w-2xl text-white/70">
            Taken from our own directory, CareAssura, which lists every CQC registered service in the country.
            Figures as at {STATS_AS_AT}.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: stats.services.toLocaleString(), l: `care services across ${stats.towns} towns` },
              { n: `${pctNoWebsite(stats)}%`, l: `have no website at all, that is ${stats.noWebsite} providers` },
              { n: `${ratedShare}%`, l: 'rated Good or Outstanding by the CQC' },
              { n: stats.dementia.toLocaleString(), l: 'offer dementia care' },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-4xl font-bold text-brand-accent">{s.n}</p>
                <p className="mt-1 text-sm leading-snug text-white/70">{s.l}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-8 border-t border-white/15 pt-8 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">By type</p>
              <ul className="mt-3 space-y-1.5 text-sm text-white/80">
                <li>{stats.residential} residential homes</li>
                <li>{stats.nursing} nursing homes</li>
                <li>{stats.homeCare} home care and live-in providers</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Where they are</p>
              <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-white/80">
                {stats.topTowns.map((t) => (
                  <li key={t.name}>
                    {t.name} <span className="text-white/45">{t.services}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What the numbers mean for the reader */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            What that means if you run a service here
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              <strong className="text-brand-ink">
                {stats.noWebsite} providers in {county.name} have no website at all.
              </strong>{' '}
              If you have one, you are already ahead of two in five of your competitors. The question is whether
              yours answers what families ask before they ring, because most of the ones we review do not.
            </p>
            <p>
              <strong className="text-brand-ink">{ratedShare}% are rated Good or Outstanding</strong>, so a good
              rating does not make you stand out here. It is the baseline. What separates you is whether a family
              comparing three homes at eleven at night can find your fees, your availability and a way to visit.
            </p>
            <p>
              <strong className="text-brand-ink">
                {stats.homeCare} of the {stats.services} are home care or live-in providers
              </strong>
              , which makes recruitment as competitive as enquiries. Every one of them is advertising for the same
              carers in the same towns, and most are paying a job board to do it.
            </p>
          </div>
        </div>
      </section>

      {/* Local proof */}
      {county.proof && county.proof.length > 0 && (
        <section className="bg-brand-bg-warm px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
              Work we have done in {county.name}
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {county.proof.map((p) => (
                <div key={p.name} className="rounded-2xl border-2 border-brand-ink bg-white p-5 shadow-[6px_6px_0_0_#2a2620]">
                  <p className="font-display text-lg font-bold uppercase leading-tight tracking-tight text-brand-ink">
                    {p.name}
                  </p>
                  <p className="text-sm text-brand-ink-muted">{p.where}</p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{p.what}</p>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 inline-block text-sm font-semibold text-brand-pop underline"
                  >
                    See the site
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            What we do for providers in {county.name}
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {SERVICES.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="group rounded-2xl border border-brand-line bg-white p-5 transition-colors hover:border-brand-pop/40"
              >
                <p className="font-display text-base font-bold uppercase tracking-wide text-brand-ink group-hover:text-brand-pop">
                  {s.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">{s.body}</p>
              </Link>
            ))}
          </div>

          <ul className="mt-8 grid gap-2 sm:grid-cols-2">
            {[
              'Care sector only, so you never explain CQC or funding to us',
              'Built from scratch, no WordPress templates',
              'Reported in enquiries and calls, not in rankings',
              'An honest verdict first, even if it is that you are fine',
            ].map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-brand-ink-soft">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-ink px-6 py-14 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            Find out where you stand in {county.name}
          </h2>
          <p className="mt-3 text-white/70">
            A 60-second check, reviewed by a person, with an honest answer about what is costing you enquiries.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/site-audit" className="btn-cta btn-on-dark">
              Request an audit
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/contact" className="btn-cta-outline btn-on-dark">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
