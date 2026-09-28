import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, MapPin } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { getCounty, countySlugs, pctNoWebsite, getCountyFigures, hasTowns } from '@/lib/locations'
import { Star, Squiggle } from '@/components/marketing/Decor'
import { countySeo } from '@/lib/county-seo'
import { MarketSnapshotMock } from '@/components/marketing/county/HeroMocks'
import { CountyLeadForm } from '@/components/marketing/county/CountyLeadForm'
import { CouncilLink, LeadSection, ServicePanel, STICKY_COL } from '@/components/marketing/county/CountySections'
import { ExitIntent } from '@/components/marketing/county/ExitIntent'
import { SchemaMock } from '@/components/marketing/county/SchemaMock'
import { SerpMockup } from '@/components/marketing/county/HeroMocks'
import { DesignExamples } from '@/components/marketing/county/Galleries'
import { NearbyCounties } from '@/components/marketing/county/CountyLinks'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

type Props = { params: { county: string } }

// A county the nightly cron publishes renders on its first request rather than waiting
// for a deploy, and the page is revalidated hourly so the figures stay current.
export const dynamicParams = true
export const revalidate = 3600

export async function generateStaticParams() {
  return (await countySlugs()).map((county) => ({ county }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const county = await getCounty(params.county)
  if (!county) return {}
  const { stats } = await getCountyFigures(county)
  const seo = countySeo('hub', county, stats)
  return applyPageSeo(seo.path, {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
  })
}

// The two big services have their own page per county, because the argument for a new
// site and the argument for ranking one are not the same argument. The other two are
// national pages: there is nothing county specific to say about them yet.
function servicesFor(slug: string) {
  return [
    {
      title: 'A new care website',
      href: `/care-website-design/${slug}`,
      body: 'Built from scratch, fast, with the tools families use and an enquiry form that works on a phone. Fixed price, six to eight weeks.',
    },
    {
      title: 'Care SEO, town by town',
      href: `/care-seo/${slug}`,
      body: 'Ranking for your town and your care type, above the directories you currently pay, and reported in enquiries.',
    },
    {
      title: 'Carer recruitment',
      href: '/carer-recruitment',
      body: 'Careers pages with pay up front, listed free in Google for Jobs, so hires cost less than the job boards.',
    },
    {
      title: 'Google Ads',
      href: '/marketing',
      body: 'Switched on when you have beds or hours to fill, paused when you do not.',
    },
  ]
}

export default async function CountyPage({ params }: Props) {
  const county = await getCounty(params.county)
  if (!county) notFound()
  const { stats, asAt } = await getCountyFigures(county)
  const ratedShare = Math.round(((stats.good + stats.outstanding) / stats.services) * 100)
  // The mocks are built on this county's own towns rather than on invented ones.
  const homeCareTown = stats.topTowns[1]?.name ?? stats.topTowns[0]?.name ?? county.name
  // Areas that are one city rather than a county of towns get no "areas we cover" list.
  const areaServedTowns = stats.topTowns.slice(0, 3).map((t) => t.name)
  const areaServed = areaServedTowns.length > 0 ? areaServedTowns : [county.name]

  return (
    <>
      <ExitIntent
        countyName={county.name}
        context={`County hub, ${county.name}`}
        need="Both, and I do not know where to start"
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `Care website design and SEO in ${county.name}`,
            url: `${SITE_URL}/locations/${county.slug}`,
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: { '@type': 'AdministrativeArea', name: county.name },
            description: `Websites, local SEO and enquiry generation for care providers in ${county.name}.`,
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-14 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-pop">
            <MapPin className="h-4 w-4" />
            {county.name}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
            Care websites and search in <span className="text-brand-pop">{county.name}</span>
          </h1>
          <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-ink-soft">
            {county.standing} Whether you want to <Link href="/start-building-your-new-website" className="font-semibold text-brand-pop underline underline-offset-2">start building your new website</Link> or rank the one you have, the figures below are where it
            starts.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/site-audit" className="btn-cta">
              Get an audit of your site
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="#enquire" className="btn-cta-outline">
              Tell us what is not working
            </Link>
          </div>
          </div>
          <MarketSnapshotMock countyName={county.name} stats={stats} asAt={asAt} />
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
            Figures as at {asAt}.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: stats.services.toLocaleString(), l: hasTowns(stats) ? `care services across ${stats.towns} towns` : 'registered care services' },
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
                Most enquiries here start with money, not with care.
              </strong>{' '}
              A family works out whether they are self funding long before they ring anybody, and the page they check
              first is usually{' '}
              {county.council ? (
                <CouncilLink href={county.council.url}>
                  {county.council.name}&apos;s adult social care pages
                </CouncilLink>
              ) : (
                <>the council&apos;s own adult social care pages</>
              )}
              . If your own site cannot answer the question that page leaves open, which is what it costs at your
              service specifically, the enquiry goes to whoever does.
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

      {/* What the work produces: the result, the markup behind it, and the designs */}
      <section className="bg-brand-bg-warm px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            What good looks like in a {county.name} search
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">
            This is the search a family in {homeCareTown} makes when a parent needs help at home, and this is the
            difference between the providers who have done the work and the ones who have not.
          </p>
          <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
            <SerpMockup query={`home care in ${homeCareTown}`} resultCount={stats.homeCare * 900} variant="home-care" />
            <div className={`space-y-4 text-base leading-relaxed text-brand-ink-soft ${STICKY_COL}`}>
              <p>
                Two directories, then a provider. The directories are there because they have thousands of pages and a
                decade of links, and no amount of rewriting your About page changes that.
              </p>
              <p>
                What does change is the third result. Hours, coverage, what you charge and how fast you can start, all
                readable before the click. {stats.homeCare} home care and live in providers are registered in{' '}
                {county.name}, and the number publishing that is close to none.
              </p>
              <p>
                It is not a trick and it is not paid placement. It is the same page, marked up so a search engine can
                read it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            The markup underneath it
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">
            Care providers are the easiest sector in the country to mark up properly, because what a family wants to
            know is exactly what schema.org already has fields for. Almost nobody here does it.
          </p>
          <div className="mt-8">
            <SchemaMock
              schemaType="HomeAndCommunityService"
              townName={homeCareTown}
              countyName={county.name}
              extra={[
                '"areaServed": ["' + areaServed.join('", "') + '"]',
                '"priceRange": "£28 to £34 per hour"',
              ]}
              serviceList={['Hourly home care', 'Live in care', 'Respite and sitting', 'Dementia support at home']}
              rating={{ value: '4.9', reviews: '41' }}
              serp={{
                site: 'Your home care agency',
                url: 'yourcareagency.co.uk › home-care',
                title: `Home care in ${homeCareTown}, from £28 an hour`,
                description:
                  'Hourly and live in care across the area, with a named team, visits from 30 minutes, and a start within 48 hours where we can.',
                sitelinks: ['Our rates', 'Areas we cover', 'Live in care', 'Join our team'],
                faqs: [
                  `How much does home care cost in ${homeCareTown}?`,
                  'Will the council fund care at home?',
                  'How quickly can care start?',
                ],
              }}
              note="An illustration, and a deliberately ordinary one. Nothing here is unusual or clever, which is what makes the fact that almost nobody publishes it worth knowing."
            />
          </div>
        </div>
      </section>

      <DesignExamples
        tone="warm"
        heading="The designs we build from"
        intro="Every build starts from one of these, and any of them can carry any kind of service. They are complete and clickable, and every provider shown in them is fictional."
        slugs={['oakfield-house', 'brightpath-care', 'willow-court']}
      />

      <ServicePanel
        label={`What we do in ${county.name}`}
        items={servicesFor(county.slug)}
        footer={
          <ul className="grid gap-2 sm:grid-cols-2">
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
        }
      />

      <NearbyCounties county={county} kind="locations" />

      <LeadSection
        heading="Talk to someone who only works in care"
        body={
          <>
            <p>
              Tell us where you are and what is not working, and you will get an honest answer about whether the
              problem is your website, your rankings, or neither of them.
            </p>
            <p>
              We work in the care sector and nothing else, so you will not have to explain what the CQC is, what a top
              up fee is, or why a discharge team matters more to you than a search volume. And we already hold the
              figures for your town, so the first conversation starts from something real.
            </p>
          </>
        }
        bullets={[
          'A reply from a person within one working day',
          'No call centre and no automated chasing',
          'An honest verdict first, even if it is that you are fine',
          `Figures for your own town, from our directory of all ${stats.services} services here`,
        ]}
        form={<CountyLeadForm countyName={county.name} context={`County hub, ${county.name}`} />}
      />

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
