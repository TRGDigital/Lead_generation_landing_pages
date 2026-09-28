import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { applyPageSeo } from '@/lib/page-seo'
import { getCounty, countySlugs, getCountyFigures, hasTowns, mainTown, pct, pctNoWebsite } from '@/lib/locations'
import { countySeo } from '@/lib/county-seo'
import { CountyMap } from '@/components/marketing/CountyMap'
import { SerpMockup } from '@/components/marketing/county/HeroMocks'
import { CountyLeadForm } from '@/components/marketing/county/CountyLeadForm'
import { ExitIntent } from '@/components/marketing/county/ExitIntent'
import { SchemaMock } from '@/components/marketing/county/SchemaMock'
import {
  AlsoInCounty,
  CouncilLink,
  CountyHero,
  DarkStats,
  EndCta,
  FaqJsonLd,
  Faqs,
  Included,
  LeadSection,
  Prose,
  ServiceJsonLd,
  Steps,
} from '@/components/marketing/county/CountySections'
import { NearbyCounties } from '@/components/marketing/county/CountyLinks'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'

// Care SEO, county by county.
//
// The other half of the county hub. This page argues the search side: who you are
// actually competing with in your town, why the directories sit above you, and what can
// and cannot be changed. The competition figures are real counts from CareAssura, which
// is also why the page can be specific about which towns are contested.

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
  const seo = countySeo('seo', county, stats)
  return applyPageSeo(seo.path, {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
  })
}

const FAQS: [string, string][] = [
  [
    'How long before we see anything?',
    'Technical fixes show up in weeks. Rankings for your own town and care type usually move over three to six months, and the enquiries follow the rankings rather than arriving with them. Anyone promising page one in thirty days is either talking about a keyword nobody searches or is about to do something that gets you a penalty.',
  ],
  [
    'Do you guarantee rankings?',
    'No, and nobody honest does. We guarantee the work, we report what moved and what did not, and you can stop at the end of any month. What we will tell you at the start is which searches we think you can realistically win and which ones we cannot, which is a more useful promise than a guarantee.',
  ],
  [
    'We pay a directory for leads. Should we stop?',
    'Not on day one. Keep paying while your own pages are earning nothing, then compare cost per enquiry once they are. We own a care directory ourselves, so we know exactly what those listings are worth and what they cost, and the goal is to make the paid listings optional rather than to make a point.',
  ],
  [
    'Do we need a new website first?',
    'Sometimes, and we will say so plainly. If the site is slow, unreadable on a phone or invisible to a crawler, SEO on top of it is money into a bucket with a hole in it. If it is sound, we would rather spend your budget on content and local pages than on a rebuild you do not need.',
  ],
  [
    'Who writes the content?',
    'We do, and the first draft comes from your CQC report, your fee structure and a conversation with whoever handles enquiries. You correct the details. It is written for a family deciding at eleven at night, not for a search engine, which is also what happens to rank.',
  ],
  [
    'What do you actually report each month?',
    'Enquiries and calls first, then the rankings that produced them, then what we did and what we are doing next. One page, in plain English. No 40 page PDF of graphs that nobody reads and that cannot be tied to a single phone call.',
  ],
  [
    'What does it cost?',
    'It starts with the audit, £750 plus VAT, which is credited in full against your first payment if you go ahead. The monthly figure depends on how many towns and care types you are going after, and we quote it after the audit, when we know what the work actually is rather than guessing.',
  ],
]

export default async function CareSeoCountyPage({ params }: Props) {
  const county = await getCounty(params.county)
  if (!county) notFound()
  const { stats, asAt } = await getCountyFigures(county)

  const busiest = mainTown(stats)
  const byTown = hasTowns(stats)
  const ratedWell = stats.good + stats.outstanding
  const ratedShare = pct(ratedWell, stats.services)
  const unclear = stats.requiresImprovement + stats.notRated
  const top = stats.topTowns
  const townList = top.slice(0, 5).map((t) => `${t.name} ${t.services}`).join(', ')
  // The mock is built around the county's most contested search, so it is the real phrase
  // rather than an invented one.
  const query = `care homes in ${busiest?.name ?? county.name}`

  return (
    <>
      <ExitIntent countyName={county.name} context={`Care SEO, ${county.name}`} need="Better rankings" />
      <Breadcrumbs trail={[['Areas we cover', '/locations'], [county.name, `/locations/${county.slug}`], [`Care SEO in ${county.name}`, `/care-seo/${county.slug}`]]} />
      <ServiceJsonLd
        name={`Care SEO in ${county.name}`}
        url={`${SITE_URL}/care-seo/${county.slug}`}
        description={`Local SEO for care homes, nursing homes and home care providers across ${county.name}, ranked town by town and reported in enquiries.`}
        countyName={county.name}
        siteUrl={SITE_URL}
      />
      <FaqJsonLd faqs={FAQS} />

      <CountyHero
        eyebrow={`${county.name} · Local SEO`}
        before="Care SEO in"
        highlight={county.name}
        intro={
          <>
            <p>
              Ranking a care service is not a county wide job. It is won or lost in one town, for one care type, against
              a specific set of competitors and two or three directories. If your site cannot compete at all, <Link href="/start-building-your-new-website" className="font-semibold text-brand-pop underline underline-offset-2">start building your new website</Link> 
              first. {county.standing}
            </p>
            <p>
              There are {stats.services} registered services
              {byTown ? ` across ${stats.towns} towns here` : ` in ${county.name}`}
              {busiest ? `, and ${busiest.services} of them are in ${busiest.name} alone` : ''}. That is who you are
              actually up against
              {byTown
                ? ', and it is a very different fight depending on which side of the county you are on.'
                : ', all of them competing for the same families in the same search results.'}
            </p>
          </>
        }
        points={['Ranked town by town', 'Reported in enquiries and calls', 'Stop at the end of any month']}
        primary={{ label: 'Start with an audit', href: '/site-audit' }}
        secondary={{ label: 'Check your CQC rating in search', href: '/tools/cqc-rating-checker' }}
        mock={<SerpMockup query={query} resultCount={busiest ? busiest.services * 1000 : 120000} />}
      />

      <DarkStats
        heading={`What you are competing against in ${county.name}`}
        note={
          <>
            Counted from our own directory, CareAssura, which holds every CQC registered service in the country.
            Figures as at {asAt}.
          </>
        }
        cards={[
          busiest
            ? { n: busiest.services.toLocaleString(), l: `services in ${busiest.name}, the most contested town here` }
            : { n: stats.services.toLocaleString(), l: 'registered services in the county' },
          byTown
            ? { n: stats.towns.toLocaleString(), l: 'towns with at least one registered service' }
            : { n: stats.dementia.toLocaleString(), l: 'offer dementia care, the most contested search of all' },
          { n: `${ratedShare}%`, l: `rated Good or Outstanding, that is ${ratedWell} services` },
          { n: `${pctNoWebsite(stats)}%`, l: `have no website, so your real rivals are the other ${stats.services - stats.noWebsite}` },
        ]}
      >
        <div className="mt-10 border-t border-white/15 pt-8">
          <p className="max-w-3xl text-sm leading-relaxed text-white/70">
            {byTown ? (
              <>
                Biggest markets first: {townList}. Search happens at that level, not at county level, which is why a
                single page about {county.name} will never rank for any of them.
              </>
            ) : (
              <>
                Search here happens by neighbourhood and by care type, not for {county.name} as a whole, which is why a
                single page about the area will never rank for the searches families actually make.
              </>
            )}
          </p>
        </div>
      </DarkStats>

      {/* A single city area has two or three towns in it, which is a chart, not a map. */}
      {stats.townPoints.length >= 3 && (
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            The competition map
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">
            Every town in {county.name} with a registered care service, sized by how many are in it. The big circles are
            where the search results are crowded and where a generic page has no chance. The small ones are where being
            the only provider with a decent local page is worth more than any amount of technical work.
          </p>
          <CountyMap
            className="mt-7"
            countyName={county.name}
            points={stats.townPoints}
            mode="competition"
            caption={`Registered care services by town in ${county.name}: ${stats.services} across ${stats.towns} towns, with the ${stats.noWebsite} that have no website at all picked out in orange. Figures as at ${asAt}. Source: CareAssura.`}
          />
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-ink-soft">
            The orange is worth a second look. In a town where half the registered services have no website, the search
            results are not full of your competitors at all. They are full of directories, and the only provider in that
            conversation is whoever bothered to build a page for it.
          </p>
        </div>
      </section>
      )}

      <Prose
        tone="warm"
        sections={[
          {
            heading: 'What families here actually type',
            paragraphs: [
              <>
                Nobody searches for &quot;quality person centred care&quot;. They type a care type and a town, and they
                do it from a phone in a hospital corridor or a kitchen at night. Care homes in{' '}
                {busiest?.name ?? county.name}. Dementia care {top[1]?.name ?? county.name}. Home care near me. Nursing
                home with a bed available. Those four shapes cover most of the enquiries you will ever get.
              </>,
              <>
                {stats.dementia} of the {stats.services} services in {county.name} say they offer dementia care, which
                makes that the most contested search in the county by a distance, and the one where the pages that win
                are the ones that explain the difference between early stage, moderate and advanced rather than listing
                it as a bullet point.
              </>,
              <>
                The practical consequence is that you need a page per care type per town you serve, not a single
                services page with six paragraphs on it. That is the work. It is not glamorous and it is not a trick,
                and it is the reason a small home can outrank a group with a marketing department.
              </>,
            ],
            sub: [
              {
                heading: 'Care type plus town',
                body: 'The highest intent search there is. The person typing it has decided what they need and where. If your page for that combination does not exist, you are not in the running whatever else you do.',
              },
              {
                heading: 'Near me',
                body: 'Answered by your Google Business Profile, your address consistency and your reviews rather than by your website. It is a different job from ranking a page, and it is usually the quicker win.',
              },
              {
                heading: 'Fees and funding questions',
                body: (
                  <>
                    What does a care home cost in {busiest?.name ?? county.name}, will the council pay, what is a top
                    up. The only thorough answer in the area is{' '}
                    {county.council ? (
                      <CouncilLink href={county.council.url}>
                        the guidance {county.council.name} publishes
                      </CouncilLink>
                    ) : (
                      <>the guidance the council publishes</>
                    )}
                    , and it is deliberately general. Nobody local answers it for their own service, which is why
                    these are the cheapest rankings in the sector to take.
                  </>
                ),
              },
            ],
          },
          {
            heading: 'Why the directories are above you, and what to do about it',
            paragraphs: [
              <>
                Search any town in {county.name} with the words care home after it and the top of the page is
                directories. They have tens of thousands of pages, links from everywhere, and a page for your town that
                has existed for a decade. You are not going to outrank them everywhere, and any agency that tells you
                otherwise is selling you a retainer.
              </>,
              <>
                We own a care directory ourselves, CareAssura, which is how we know precisely how they win: scale and
                age, not better writing. What they cannot do is be the actual home. They cannot show your rooms, state
                your fees this week, confirm you have a vacancy on Thursday, or take a visit booking at eleven at night.
              </>,
              <>
                So the strategy is not to fight them on their ground. It is to own the searches where being the provider
                beats being a list: your own name, your town plus your care type, your fees, your availability, and the
                twenty or thirty questions a family asks that a directory listing has no room for. On those, you win, and
                those are the searches that turn into phone calls.
              </>,
            ],
          },
          {
            heading: `Town by town, not county wide`,
            paragraphs: [
              <>
                Most care services take admissions from four or five places, not from a whole county. The job is to work
                out which ones actually produce your enquiries, then build a real page for each: the local hospital and
                discharge team, the roads and bus routes, what families visiting from that direction need to know, and
                the fee position in that specific town.
              </>,
              <>
                We build these pages town by town on the care sites we run, and no two of them read the same, because
                the facts in them are different. That is the test. If you can swap the town name in a local page and it
                still reads correctly, it is not a local page, it is a template, and Google has been ignoring those for
                years.
              </>,
              <>
                {unclear} services in {county.name} are either rated Requires Improvement or have no current rating at
                all, and {ratedShare} in every hundred are Good or Outstanding. Your rating, in other words, is not the
                differentiator you might hope. What separates you in a search result is whether your page answers the
                question in the search.
              </>,
            ],
          },
        ]}
      />

      <Included
        heading="What the monthly work actually is"
        intro="No mystery, no jargon. This is the list, and the report each month says which of it we did and what moved."
        groups={[
          {
            title: 'Every month',
            items: [
              'A new or rewritten page for a town or care type you want enquiries from',
              'Google Business Profile kept current: hours, photographs, questions, posts',
              'Technical fixes as they appear: speed, broken links, crawl errors, schema',
              'Internal linking so your new pages are actually found and ranked',
              'Review prompts for families who have just been through the process with you',
              'One page of reporting: enquiries, calls, rankings, what next',
            ],
            more: true,
          },
          {
            title: 'Set up in the first month',
            items: [
              'A full audit, so we are fixing measured problems rather than guessing',
              'Schema for your fees, rating, care types and location',
              'Call and enquiry tracking, so a ranking can be tied to a phone call',
              'Your CQC rating and report presented properly on the site',
              'A careers page listed free in Google for Jobs if you are recruiting',
              'The list of towns and care types we are going after, agreed with you first',
            ],
            more: true,
          },
        ]}
      />

      <Steps
        heading="How we start"
        intro="The first month is measurement and the obvious fixes. No 12 month contract, and nothing invoiced before it is agreed."
        items={[
          {
            title: 'The audit',
            body: '£750 plus VAT, credited in full against your first monthly payment. Speed, mobile, accessibility, schema, what a crawler can read, and every search you should be ranking for and are not. If the answer is that SEO is not your problem, we say so.',
          },
          {
            title: 'Agree the target list',
            body: 'Which towns, which care types, in which order. Based on where your admissions genuinely come from, not on whatever has the biggest search volume in a tool.',
          },
          {
            title: 'Fix the foundations',
            body: 'Speed, mobile, crawlability, schema, Google Business Profile and tracking. This is the month where a lot of the movement comes from, because most care sites have never had it done.',
          },
          {
            title: 'Build the pages, one at a time',
            body: 'A real page per town and care type, with facts in it that only apply to that town. Published, linked, and left long enough to see what it does.',
          },
          {
            title: 'Report in enquiries',
            body: 'One page a month. What came in, what it came from, what we did, what is next. If a page is not earning after three months we say so and change the approach rather than quietly repeating it.',
          },
        ]}
      />

      <section className="bg-brand-bg-warm px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            The half of it that nobody in {county.name} is doing
          </h2>
          <div className="mt-4 max-w-2xl space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Ranking is only half the job. The other half is what your result looks like once you are there, and that
              is decided by markup rather than by writing. Fees, rating, care types and the questions families ask can
              all be put in a form Google can read, which is how a result stops being a blue line and a sentence.
            </p>
            <p>
              We checked this across the county. Almost no care provider in {county.name} publishes any of it, which
              means the provider who does takes a result two or three times the height of everyone else&apos;s, on the
              same page, for the same search.
            </p>
          </div>
          <div className="mt-8">
            <SchemaMock
              schemaType="NursingHome"
              townName={busiest?.name ?? county.name}
              countyName={county.name}
              extra={['"priceRange": "£1,150 to £1,495 per week"', '"openingHours": "Mo-Su 00:00-23:59"']}
              serviceList={['Residential care', 'Nursing care', 'Dementia care', 'Respite care']}
              rating={{ value: '4.8', reviews: '26' }}
              serp={{
                site: 'Your care home',
                url: 'yourcarehome.co.uk › fees',
                title: `Care home fees and availability, ${busiest?.name ?? county.name}`,
                description:
                  'Weekly fees from £1,150, two rooms available this week, rated Good by the CQC. Residential, nursing, dementia and respite care.',
                sitelinks: ['Our fees', 'Availability', 'Dementia care', 'Book a visit'],
                faqs: [
                  `How much does a care home cost in ${busiest?.name ?? county.name}?`,
                  'Will the council pay towards the fees?',
                  'Can we visit at the weekend?',
                ],
              }}
              note="Same page, same words, far more of the answer visible before anyone clicks. An illustration: Google decides which enhancements it shows for any given search."
            />
          </div>
        </div>
      </section>

      <Faqs heading="Fair questions before you commit to a retainer" faqs={FAQS} />

      <NearbyCounties county={county} kind="seo" />

      <AlsoInCounty
        label={`Also in ${county.name}`}
        links={[
          {
            title: `A new care website in ${county.name}`,
            href: `/care-website-design/${county.slug}`,
            body: `If the site itself is the problem, SEO on top of it is wasted. ${stats.noWebsite} services here have no site at all.`,
          },
          {
            title: `The care market in ${county.name}`,
            href: `/locations/${county.slug}`,
            body: `All ${stats.services} services, the rating split, the type split and every town, counted from our own directory.`,
          },
          {
            title: `Your competitors in ${county.name}`,
            href: '/tools/care-competitor-snapshot',
            body: 'Enter your postcode and see every registered care service near you, with ratings and which ones have a website.',
          },
        ]}
      />

      <LeadSection
        heading="Tell us which town you need to win"
        body={
          <>
            <p>
              Tell us where you are and which care types you want enquiries for, and we will tell you what the search
              results for that combination look like today and what it would take to get you into them.
            </p>
            <p>
              That answer is free and it is specific. If the honest version is that paid advertising would work faster
              for you than SEO, we will say so rather than sell you a retainer.
            </p>
          </>
        }
        bullets={[
          'A reply from a person within one working day',
          'The searches we think you can win, and the ones you cannot',
          'No 12 month contract, stop at the end of any month',
          'Reported in enquiries and calls, not in rankings alone',
        ]}
        form={
          <CountyLeadForm
            countyName={county.name}
            context={`Care SEO, ${county.name}`}
            defaultNeed="Better rankings"
          />
        }
      />

      <EndCta
        title={`Find out where you stand in ${county.name}`}
        body="Start with the audit. You get an honest list of what is holding you back, what it is worth fixing, and what we would do first. Credited in full if you go ahead."
        primary={{ label: 'Request an audit', href: '/site-audit' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </>
  )
}
