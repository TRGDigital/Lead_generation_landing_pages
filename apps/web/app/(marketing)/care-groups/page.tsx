import type { Metadata } from 'next'
import { Building2 } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { CountyLeadForm } from '@/components/marketing/county/CountyLeadForm'
import {
  CountyHero,
  EndCta,
  FaqJsonLd,
  Faqs,
  LeadSection,
  Prose,
  ServicePanel,
  Steps,
} from '@/components/marketing/county/CountySections'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'
import { SettingDesigns } from '@/components/marketing/SettingDesigns'

// For operators running several services. Every other page on the site speaks to a single
// home, and a group is a different buyer: one decision maker, many managers, many local
// markets, and a need to see every home side by side. Claims here are limited to what the
// platform does today; call tracking, for one, is not on the list until it is live.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/care-groups'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, {
    title: 'Websites and Marketing for Care Groups and Multi Site Operators',
    description:
      'One website system for every home in your group: a local page for each service, shared tools, enquiries reported home by home, and one team that only works in care.',
    alternates: { canonical: `${SITE_URL}${PATH}` },
  })
}

const FAQS: [string, string][] = [
  [
    'Should each home have its own website, or one group site?',
    'It depends on how families know you. If your homes trade under their own names, each needs its own site or at least its own full page with its own address, reviews and CQC rating. If the group name is the brand, one site with a strong page per home usually ranks better and costs less to run. We will tell you which fits after looking at how families already search for you.',
  ],
  [
    'Can our home managers update their own pages?',
    'Yes. Each manager gets their own login for their own home: its enquiries, and a simple way to keep its availability up to date. Head office can switch between every home in the group from one login.',
  ],
  [
    'We already have several sites built by different people. Do we have to start again?',
    'No. We can bring existing sites onto one system over time, one home at a time, keeping the pages that already rank and redirecting the ones that move. Nothing has to change on the same day.',
  ],
  [
    'How do we see which homes are getting enquiries?',
    'Every enquiry is tagged with the home it came in for, and followed through to a visit and a move in, so you can see each home on its own rather than one total for the group.',
  ],
  [
    'Do you work with groups outside the south east?',
    'Yes. Everything we do is online, and our clients do not need us down the road. What matters is that we understand care, not that we share a postcode.',
  ],
]

export default function CareGroupsPage() {
  return (
    <main>
      <Breadcrumbs trail={[['For care groups', '/care-groups']]} />
      <FaqJsonLd faqs={FAQS} />

      <CountyHero
        eyebrow="For care groups"
        before="One system for"
        highlight="every home"
        after="in your group"
        intro={
          <>
            <p>
              Running several services changes what you need from a website. Each home has its own town, its own
              vacancies and its own CQC rating. Head office needs to see all of them at once.
            </p>
            <p>
              We build and run group websites for care operators, with a proper local page for every home and one place
              to see how each one is doing.
            </p>
          </>
        }
        points={['A page per home', 'Enquiries by home', 'Manager access per home', 'Only care']}
        primary={{ label: 'Talk about your group', href: '#enquire' }}
        secondary={{ label: 'Free audit of one home', href: '/site-audit' }}
        mock={
          <div className="rounded-3xl border-2 border-brand-ink bg-white p-6 shadow-[6px_6px_0_0_#2a2620]">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">
              <Building2 className="h-4 w-4" />
              Group view, last 30 days
            </p>
            <div className="mt-4 divide-y divide-brand-line text-sm">
              {[
                ['The Willows', 'Horsham', 14, 'Good'],
                ['Oak Lodge', 'Crawley', 9, 'Good'],
                ['Beech House', 'Worthing', 3, 'Requires improvement'],
                ['Elm Court', 'Chichester', 11, 'Outstanding'],
              ].map(([home, town, n, rating]) => (
                <div key={home as string} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold text-brand-ink">{home}</p>
                    <p className="text-xs text-brand-ink-muted">
                      {town} · CQC {rating}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-2xl font-bold text-brand-pop">{n}</p>
                    <p className="text-[11px] uppercase tracking-wide text-brand-ink-muted">enquiries</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-brand-ink-muted">Illustration. Homes and figures are examples.</p>
          </div>
        }
      />

      <Prose
        sections={[
          {
            heading: 'Why groups are different',
            paragraphs: [
              'A single home competes in one town. A group competes in every town it has a home in, often against a different set of providers in each. A family in Worthing does not care that your Horsham home has a vacancy. They want to know about the home near them.',
              'Most group websites are built the other way round: a big page about the group, and a thin list of homes underneath. That reads well to the board and poorly to families, and it gives Google very little to rank in each town.',
              'The other problem is visibility inside the business. If enquiries arrive as one total for the group, you cannot tell which home is struggling to be found and which is losing families at the enquiry form.',
            ],
          },
          {
            heading: 'What we build for a group',
            paragraphs: [
              'A local page for every home that stands on its own: its town, the care it offers, its current CQC rating, real photographs, fees or a fee range, and how to arrange a visit. Each one is written for its own town, not copied with the name swapped.',
              'The same family tools on every home: funding calculators, availability, and an enquiry form built for a phone. Built once and switched on per home, so a new home joins the group site in days.',
              'Access by home. A manager sees their own home’s enquiries and keeps its availability current. Head office sees every home, and keeps the brand and the structure in one place.',
              'Reporting by home: enquiries, visits booked and move ins for each home, so you can see which one needs help first.',
            ],
          },
        ]}
      />

      <Steps
        heading="How it works"
        intro="Groups rarely start from nothing, so we plan the move around the homes that most need help."
        items={[
          { title: 'Audit', body: 'We look at how families find each home today, what ranks, and where enquiries are lost. You get it home by home.' },
          { title: 'Plan', body: 'One group site or a site per home, which pages to keep, and which homes go first. Usually the ones with vacancies.' },
          { title: 'Build and move', body: 'Home by home, keeping what already ranks and redirecting what moves, so no home drops out of search on launch day.' },
          { title: 'Run and report', body: 'Monthly reporting by home, and ongoing local work where a home needs more enquiries.' },
        ]}
      />

      <ServicePanel
        label="What groups ask us for"
        items={[
          { title: 'Group websites', body: 'One system, a proper page per home, tools shared across the group.', href: '/website-development' },
          { title: 'Local SEO per home', body: 'Ranking each home in its own town, above the directories.', href: '/local-seo' },
          { title: 'Carer recruitment', body: 'Careers pages for every home, listed free in Google for Jobs.', href: '/carer-recruitment' },
          { title: 'Care tools', body: 'Funding and availability tools families use, on every home.', href: '/care-tools' },
        ]}
      />

      <Faqs heading="Questions groups ask" faqs={FAQS} />

      <LeadSection
        heading="Talk about your group"
        body={
          <p>
            Tell us how many services you run and where. We will come back with how we would approach it, and which homes
            we would start with.
          </p>
        }
        bullets={[
          'A reply from someone who only works in care',
          'No obligation, no hard sell',
          'An honest view on one site or several',
        ]}
        form={<CountyLeadForm mode="group" context="Care groups page" defaultNeed="Both, and I do not know where to start" />}
      />

      <SettingDesigns path="/care-groups" />

      <EndCta
        title="Not sure where to start?"
        body="Start with one home. We will audit it for free and show you what the rest of the group probably looks like too."
        primary={{ label: 'Free audit', href: '/site-audit' }}
        secondary={{ label: 'Why a care specialist', href: '/why-a-care-specialist' }}
      />
    </main>
  )
}
