import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { applyPageSeo } from '@/lib/page-seo'
import { getCounty, countySlugs, getCountyFigures, mainTown, pct, pctNoWebsite } from '@/lib/locations'
import { countySeo } from '@/lib/county-seo'
import { CountyMap } from '@/components/marketing/CountyMap'
import { CareSiteMock } from '@/components/marketing/county/HeroMocks'
import { CountyLeadForm } from '@/components/marketing/county/CountyLeadForm'
import { ExitIntent } from '@/components/marketing/county/ExitIntent'
import { DesignExamples, ToolShots } from '@/components/marketing/county/Galleries'
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

// A new care website, county by county.
//
// Split out from the county hub so the page can argue one thing properly: that the site
// is the thing families judge you on, and that in this county a large share of providers
// either have no site or have one that cannot answer a family's questions. Every figure
// comes from CareAssura, so the argument is made with the county's own numbers rather
// than with adjectives.

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
  const seo = countySeo('website', county, stats)
  return applyPageSeo(seo.path, {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: seo.canonical },
  })
}

const FAQS: [string, string][] = [
  [
    'How long does a new care website take?',
    'Six to eight weeks for most single services, from the first call to going live. Larger groups with several homes on one site take longer, usually ten to twelve weeks. The part that decides the date is content: photographs, fees and the wording for each care type. We draft it, you approve it, and nothing goes live that you have not read.',
  ],
  [
    'Who owns the site when it is finished?',
    'You do. The domain stays in your name, the content is yours and you get the site itself. There is no licence that switches it off if you leave, and no rebuild fee if you want to move it elsewhere later.',
  ],
  [
    'Do you build on WordPress?',
    'No. We build from scratch, which is why our sites load in well under a second and do not need a monthly round of plugin updates to stay safe. If you are already on WordPress and it works, we will tell you so rather than sell you a rebuild.',
  ],
  [
    'What happens to our current enquiries while the new site is built?',
    'Nothing changes until the day we switch. Your existing site stays up and keeps taking enquiries while we build alongside it, and we move the domain over in one go, with redirects from every old page so nothing that Google already ranks is lost.',
  ],
  [
    'Do you write the content, or do we?',
    'We write the first draft, because most managers do not have a spare afternoon to write nine pages. It is drawn from your CQC report, your brochure and a conversation about what you actually do. You then correct it, which is far quicker than starting from an empty page.',
  ],
  [
    'Do you work with home care as well as care homes?',
    'Yes. Around two in five registered services in the county are home care or live in providers, and the website job is a different one: fewer photographs, far more about coverage, rotas, carer quality and how quickly you can start. We build both.',
  ],
  [
    'What does it cost?',
    'Most new care websites land between £7,000 and £12,000, depending on how many pages and care types you need, how many homes are on the site, and which of the tools you want. You get a fixed price in writing before anything starts, so there is no hourly rate and no drift.',
  ],
]

export default async function NewCareWebsiteCountyPage({ params }: Props) {
  const county = await getCounty(params.county)
  if (!county) notFound()
  const { stats, asAt } = await getCountyFigures(county)

  const noSiteShare = pctNoWebsite(stats)
  const withSite = stats.services - stats.noWebsite
  const busiest = mainTown(stats)
  const homeCareShare = pct(stats.homeCare, stats.services)
  const nurseNoSite = stats.noWebsiteByType.nursing
  const resNoSite = stats.noWebsiteByType.residential
  const homeNoSite = stats.noWebsiteByType.homeCare
  const dementiaNoSite = stats.noWebsiteByType.dementia

  return (
    <>
      <ExitIntent countyName={county.name} context={`New care website, ${county.name}`} need="A new website" />
      <Breadcrumbs trail={[['Areas we cover', '/locations'], [county.name, `/locations/${county.slug}`], [`Care websites in ${county.name}`, `/care-website-design/${county.slug}`]]} />
      <ServiceJsonLd
        name={`Care website design in ${county.name}`}
        url={`${SITE_URL}/care-website-design/${county.slug}`}
        description={`Care home, nursing home and home care websites designed and built from scratch for providers in ${county.name}.`}
        countyName={county.name}
        siteUrl={SITE_URL}
      />
      <FaqJsonLd faqs={FAQS} />

      <CountyHero
        eyebrow={`${county.name} · New websites`}
        before="A new care website in"
        highlight={county.name}
        intro={
          <>
            <p>
              We design and build websites for care homes, nursing homes and home care providers, and we do nothing
              else, so you can <Link href="/start-building-your-new-website" className="font-semibold text-brand-pop underline underline-offset-2">start building your new website</Link> without explaining CQC to anyone. {county.standing}
            </p>
            <p>
              There are {stats.services} registered care services in {county.name}. {stats.noWebsite} of them,{' '}
              {noSiteShare} in every hundred, have no website at all. Of the {withSite} that do, most were built for a
              different internet: slow on a phone, no fees, no availability, and an enquiry form nobody answers at the
              weekend.
            </p>
          </>
        }
        points={['Built from scratch, no templates', 'Live in six to eight weeks', 'Fixed price, you own it']}
        primary={{ label: 'Get an audit of your current site', href: '/site-audit' }}
        secondary={{ label: 'Tell us about your service', href: '#enquire' }}
        mock={<CareSiteMock townName={busiest?.name ?? county.name} countyName={county.name} />}
      />

      <DarkStats
        heading={`Websites across ${county.name}, counted`}
        note={
          <>
            From our own directory, CareAssura, which holds every CQC registered service in the country. Figures as at{' '}
            {asAt}, and we publish them because no agency pitching you has them.
          </>
        }
        cards={[
          { n: stats.noWebsite.toLocaleString(), l: `services with no website at all, out of ${stats.services}` },
          { n: resNoSite.toLocaleString(), l: `residential homes with no website, of ${stats.residential}` },
          { n: nurseNoSite.toLocaleString(), l: `nursing homes with no website, of ${stats.nursing}` },
          { n: homeNoSite.toLocaleString(), l: `home care providers with no website, of ${stats.homeCare}` },
        ]}
      >
        <div className="mt-10 border-t border-white/15 pt-8">
          <p className="max-w-2xl text-sm leading-relaxed text-white/70">
            The gap is not in one corner of the county. It is everywhere: {dementiaNoSite} of the {stats.dementia}{' '}
            services offering dementia care have nothing for a family to read, which is the single most searched care
            type there is.
          </p>
        </div>
      </DarkStats>

      {/* Some areas are a single city rather than a county of towns, and a two dot map is not a map. */}
      {stats.townPoints.length >= 3 && (
      <section className="px-6 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            Where the gap is, town by town
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-brand-ink-soft">
            Every town in {county.name} with a registered care service. The dot is sized by how many services there
            have no website, so the big circles are the places where a family looking for care has almost nothing to
            read.
          </p>
          <CountyMap
            className="mt-7"
            countyName={county.name}
            points={stats.townPoints}
            mode="gap"
            caption={`Registered services with no website of any kind, by town, in ${county.name}: ${stats.noWebsite} of ${stats.services} across ${stats.towns} towns, as at ${asAt}. Source: CareAssura.`}
          />
        </div>
      </section>
      )}

      <Prose
        tone="warm"
        sections={[
          {
            heading: `What a care website in ${county.name} actually has to do`,
            paragraphs: [
              <>
                A family looking for care is not browsing. Somebody has had a fall, or a hospital has said the word
                discharge, and a daughter is on her phone at half past ten at night with three names written down. She
                is not comparing your ethos with anyone else&apos;s. She is trying to find out three things: do you have
                a room or the hours, roughly what does it cost, and can she come and see it.
              </>,
              <>
                Most care sites in the county answer none of those. Fees are &quot;available on request&quot;,
                availability is not mentioned, and the only way to visit is a form that goes to an inbox somebody opens
                on Monday. She rings the next name on the list instead, and you never know the enquiry existed.
              </>,
              <>
                That is the whole job of the site. Not to look modern, though it should. To answer the questions in the
                order they are asked, on a phone, at a time when your office is shut, and to make the next step obvious
                enough that she takes it.
              </>,
            ],
            sub: [
              {
                heading: 'Fees, in writing',
                body: (
                  <>
                    A weekly range by care type, with what is included and what is not, and a funding explainer for
                    people who do not know whether they will be paying at all. Most of them arrive having read{' '}
                    {county.council ? (
                      <CouncilLink href={county.council.url}>
                        what {county.council.name} tells families about paying for care
                      </CouncilLink>
                    ) : (
                      <>what the council tells families about paying for care</>
                    )}
                    , which explains the system but cannot tell them what your service costs. That is your page to
                    write, and it filters out the enquiries you cannot help while warming up the ones you can.
                  </>
                ),
              },
              {
                heading: 'Availability, kept current',
                body: 'Whether you have a room, or hours, this week. It takes a manager ten seconds to update and it is the single most common reason a family picks up the phone.',
              },
              {
                heading: 'A way to visit tonight',
                body: 'A request that reaches a phone rather than an inbox, out of hours, with the times you can actually offer rather than an open ended "we will be in touch".',
              },
            ],
          },
          {
            heading: 'Why the site you were sold in 2019 has stopped working',
            paragraphs: [
              <>
                Almost every care site we audit in {county.name} is a WordPress theme with eight to fifteen plugins on
                it. It was fine on the day it launched. Since then the plugins have been updated by other people, the
                photographs have been loaded at full size straight off a camera, and a slider, a chat widget and two
                tracking scripts have been added by whoever was cheapest at the time.
              </>,
              <>
                The result is a site that takes four or five seconds to become usable on a phone on mobile data, which
                is exactly how that daughter is looking at it. Google measures that, families feel it, and the enquiry
                form is usually the slowest part of the page.
              </>,
              <>
                We are not against WordPress on principle, and if yours is working we will say so and take no money for
                a rebuild. But the honest position after a few hundred of these audits is that the template has usually
                been patched past the point where patching it again is the cheaper option.
              </>,
            ],
          },
        ]}
      />

      <Included
        heading="What we build into a care website"
        intro="Not a feature list for the sake of one. Each of these exists because a family, a commissioner or a carer asked for it and could not find it."
        groups={[
          {
            title: 'The pages families use',
            items: [
              'A page per care type, written properly, not one page listing everything you do',
              'Fees and funding, with a weekly range and what is included',
              'Room or hours availability, updated by your team in seconds',
              'A visit request that reaches a phone out of hours',
              'Your CQC rating and report, stated plainly rather than hidden',
              'Photographs of the real building and real rooms, loaded properly so they are fast',
            ],
            more: true,
          },
          {
            title: 'How the enquiry actually reaches you',
            items: [
              'A form that arrives as a phone notification, not an email nobody opens until Monday',
              'Click to call on every page, because most people would rather ring than type',
              'Enquiry tracking, so you can see which page produced the phone call',
              'Schema markup so Google can read your fees, rating and location',
              'Local pages for the towns you take admissions from',
              'A careers page listed free in Google for Jobs, with pay up front',
            ],
            more: true,
          },
        ]}
      />

      <Prose
        sections={[
          {
            heading: 'Why we put tools on care websites',
            paragraphs: [
              <>
                A care website has a problem that most websites do not. The person reading it is not ready to ring. She
                is working out whether her mother needs care at all, whether the family can afford it, and whether she
                is about to make a decision she will regret. Ringing a home means saying all of that out loud to a
                stranger, so she puts it off, and she reads four more websites instead.
              </>,
              <>
                A tool gives her something to do that is not a phone call. She answers six questions about savings and
                property and finds out whether the council is likely to contribute. She works out a weekly figure. She
                checks whether the needs she is describing sound like residential or nursing. None of that requires her
                to speak to anybody, and all of it moves her closer to the point where she will.
              </>,
              <>
                This is not a theory we are trying out on you. There are fourteen free tools on this website and they
                are where most of our own enquiries begin. People arrive for the calculator, use it, and come back
                later for the thing it was attached to, which is exactly the behaviour you want on a care site.
              </>,
            ],
            sub: [
              {
                heading: 'They turn an anonymous visitor into a name',
                body: 'A tool has a natural reason to ask for an email at the end: to send the result. That is a far easier ask than "contact us", and it means a visitor who was never going to ring is now somebody you can follow up properly.',
              },
              {
                heading: 'They qualify the enquiry before you spend an hour on it',
                body: 'Somebody who has worked out their funding position and then enquires is a different prospect from somebody who has not. You know roughly what they can afford and what they need before the first call, which saves the visits that were never going to go anywhere.',
              },
              {
                heading: 'They are the pages that rank and the pages that get linked to',
                body: 'Nobody links to an About Us page. People do link to a funding calculator, and the searches around cost and funding are the ones no home in the county is answering, which makes them the cheapest rankings available to you.',
              },
              {
                heading: 'They keep people on the site, and bring them back',
                body: 'A family comparing three homes will spend a minute on two of them and ten on the one that helped. Google notices that, but more importantly, so does the family.',
              },
            ],
          },
        ]}
      />

      <Included
        heading="The tools we can build into your site"
        intro="All of these are ours already, so they are configured for your service rather than built from scratch and charged for twice. Which ones you get depends on what you do: a nursing home and a home care agency need a different set."
        groups={[
          {
            title: 'Tools that turn a reader into an enquiry',
            items: [
              'Funding calculator: will the council contribute, and roughly how much',
              'Weekly cost estimator, by care type, with what is and is not included',
              'A care needs checker, so a family can see whether they are describing residential or nursing',
              'Room and hours availability, updated by your team in seconds',
              'Visit booking that offers real times rather than a form that waits until Monday',
              'A dementia self-assessment for families at the very start of the process',
            ],
            more: true,
          },
          {
            title: 'Tools that make the site usable and visible',
            items: [
              'An accessibility toolbar: text size, contrast, readable font, reading aloud',
              'Listen to the page, for the many visitors who are older than the people we design for',
              'A chat that answers from your own pages, your fees and your CQC report, not from the internet',
              'A call bar on mobile, because most care enquiries would rather be a phone call',
              'Video call from the website, so a family two hundred miles away can see the room',
              'Careers tools, so recruitment and enquiries stop competing for the same page',
            ],
            more: true,
          },
        ]}
      />

      <ToolShots
        heading="The tools, as they actually look"
        intro="Running on a care home website we built, answering the money questions a family will not ring and ask. The same set goes on your site with your fees and your care types in it."
      />

      <DesignExamples
        tone="warm"
        heading="What your new site could look like"
        intro="Every build starts from one of our homepage designs, and any design can carry any kind of service. These are complete and clickable, and every provider in them is fictional."
        slugs={['oakfield-house', 'brightpath-care', 'st-aidans']}
      />

      <Steps
        heading="How the build runs"
        intro="Eight weeks, five stages, and you always know which one you are in. Nothing is invoiced before it is agreed."
        items={[
          {
            title: 'Audit first, before you commit to anything',
            body: 'A full audit of your current site: speed, mobile, accessibility, what families cannot find, what Google cannot read. £750 plus VAT, and it is credited in full against the build if you go ahead. If the honest answer is that your site is fine, we say so and that is where it ends.',
          },
          {
            title: 'A day of questions',
            body: 'Care types, fee ranges, who makes the enquiry decisions, which towns your admissions actually come from, and what the current site gets wrong. This is the part most agencies skip, and it is why their care sites read like every other care site.',
          },
          {
            title: 'Design on your content, not on filler',
            body: 'You see the real pages with your own words and photographs in them, not a template with grey boxes. Two rounds of changes, in writing, so nothing is lost in a phone call.',
          },
          {
            title: 'Build, then break it on purpose',
            body: 'Built from scratch, then tested on old phones, on slow connections, with a screen reader and with images turned off. A care site that fails for a partially sighted 78 year old has failed at its actual job.',
          },
          {
            title: 'Switch over and watch it',
            body: 'We move the domain, redirect every old page so your rankings come with you, and watch the first fortnight of enquiries. If something is not converting we change it, and that is included.',
          },
        ]}
      />

      <Prose
        sections={[
          {
            heading: 'What it costs, and what decides the number',
            paragraphs: [
              <>
                Most new care websites land between £7,000 and £12,000. The range is not vagueness, it is genuinely
                what the work varies by: a single residential home with four care types sits near the bottom, a group
                with three homes, separate fee structures and a recruitment section sits near the top.
              </>,
              <>
                You get a fixed price in writing before anything starts. No hourly rate, no change requests that appear
                as invoices, and no monthly licence that holds the site hostage. Hosting and support are quoted
                separately and plainly, so you can see exactly what the ongoing cost is before you decide.
              </>,
              <>
                The audit is £750 plus VAT and comes off the build in full, so if you go ahead the audit costs you
                nothing. If you do not, you keep a report you can hand to whoever you use instead.
              </>,
            ],
          },
          {
            heading: 'Why a care specialist, and not a cheaper generalist',
            paragraphs: [
              <>
                We know what a CQC report looks like, what the difference between residential and nursing does to a
                fee conversation, and why a home in {busiest?.name ?? county.name} competes with a completely
                different set of providers than one twenty miles inland. That is not something an agency picks up from
                a briefing document, and you should not be paying to teach it.
              </>,
              <>
                It matters more than it sounds. You should not have to explain to your web designer what a DoLS is,
                what a top up fee is, or why you cannot put a photograph of a resident on the home page without
                consent. Every hour spent explaining the sector is an hour not spent on the thing you are paying for.
              </>,
              <>
                {homeCareShare} in every hundred services in the county are home care or live in providers, and their
                websites have a different job again: coverage, rotas, how fast you can start, and carer recruitment
                sitting alongside client enquiries without the two getting in each other&apos;s way. We build both, and
                we do not pretend they are the same site with a different photograph.
              </>,
            ],
          },
        ]}
        tone="warm"
      />

      <Faqs heading="Questions we get asked before a build" faqs={FAQS} />

      <NearbyCounties county={county} kind="website" />

      <AlsoInCounty
        label={`Also in ${county.name}`}
        links={[
          {
            title: `Care SEO in ${county.name}`,
            href: `/care-seo/${county.slug}`,
            body: `Already have a site that works? The next question is why the directories are above you in ${busiest?.name ?? county.name}.`,
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
        heading="Tell us about your service"
        body={
          <>
            <p>
              No brief needed and no forms to prepare. Tell us where you are and what is frustrating you about the site
              you have, and you will get a straight answer about whether a rebuild is worth it.
            </p>
            <p>
              If the answer is that your current site is fine and the problem is somewhere else, we will say that
              instead. It happens more often than you would think, and it costs you nothing to find out.
            </p>
          </>
        }
        bullets={[
          'A reply from a person within one working day',
          'No call centre and no sequence of chasing emails',
          'A fixed price in writing before any work starts',
          'We will tell you if you do not need us',
        ]}
        form={
          <CountyLeadForm
            countyName={county.name}
            context={`New care website, ${county.name}`}
            defaultNeed="A new website"
          />
        }
      />

      <EndCta
        title="Find out what your current site is costing you"
        body="One form, a few working days, and an honest report on speed, mobile, accessibility and every question a family cannot currently answer. Credited in full against a build."
        primary={{ label: 'Request an audit', href: '/site-audit' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </>
  )
}
