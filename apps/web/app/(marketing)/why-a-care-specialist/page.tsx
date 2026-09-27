import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Minus, X } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { CountyHero, EndCta, FaqJsonLd, Faqs, Prose } from '@/components/marketing/county/CountySections'

// The comparison operators already make in their heads: a care specialist, a general
// agency, a DIY builder, or just paying a directory. Written to be fair to all four,
// including the section on when we are the wrong choice, because a comparison that only
// ever finds for the author is an advert and reads like one.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/why-a-care-specialist'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, {
    title: 'Care Specialist Agency vs General Agency vs DIY Website',
    description:
      'An honest comparison for care providers: a care specialist agency, a general web agency, a DIY website builder, or a directory listing. What each is good at, and when we are not the right choice.',
    alternates: { canonical: `${SITE_URL}${PATH}` },
  })
}

type Mark = 'yes' | 'some' | 'no'
const OPTIONS = ['Care specialist', 'General agency', 'DIY builder', 'Directory only'] as const

const ROWS: { label: string; marks: [Mark, Mark, Mark, Mark]; note: string }[] = [
  {
    label: 'Understands how families choose care',
    marks: ['yes', 'some', 'no', 'some'],
    note: 'Funding worries, the guilt, the 11pm search on a phone. It shapes every page.',
  },
  {
    label: 'Knows CQC and what you must show',
    marks: ['yes', 'no', 'no', 'some'],
    note: 'The rating widget, registered details, how to talk about a report.',
  },
  {
    label: 'Family tools built in',
    marks: ['yes', 'no', 'no', 'no'],
    note: 'Funding calculators, availability, fee explainers.',
  },
  {
    label: 'Ranks for care searches in your town',
    marks: ['yes', 'some', 'no', 'some'],
    note: 'A directory ranks for you, but the enquiry is theirs to pass on.',
  },
  {
    label: 'You own the site and the enquiries',
    marks: ['yes', 'yes', 'yes', 'no'],
    note: 'Check the contract with any agency. Domain, hosting and logins in your name.',
  },
  {
    label: 'Lowest upfront cost',
    marks: ['no', 'some', 'yes', 'yes'],
    note: 'DIY and a free listing cost least on day one. The question is cost per admission.',
  },
  {
    label: 'Fastest to get something live',
    marks: ['some', 'some', 'yes', 'yes'],
    note: 'A listing is live today. A proper site takes weeks.',
  },
]

const FAQS: [string, string][] = [
  [
    'Is a care specialist always more expensive?',
    'Upfront, usually more than a DIY builder and often similar to a good general agency. The difference is what you are not paying to explain: a general agency learns care on your budget, and a DIY site costs your time and tends to miss the things families look for.',
  ],
  [
    'Can a general agency do a good job for a care provider?',
    'Yes, a good one can, particularly if they have built for care before and you give them time to learn. Ask to see care work they have done and how it performs, not just how it looks.',
  ],
  [
    'Should we stop paying for directory listings?',
    'Not straight away. Directories bring reviews and some enquiries. Measure what each one costs per admission, build a channel you own alongside it, then decide with numbers.',
  ],
  [
    'What should we ask any agency before signing?',
    'Who owns the domain, hosting and logins. How they will protect your current rankings if you are moving from an old site. What they will report each month, and whether it is enquiries or just traffic. Whether they have worked in care.',
  ],
]

function MarkIcon({ m, small }: { m: Mark; small?: boolean }) {
  const box = small ? 'h-6 w-6' : 'h-7 w-7'
  const icon = small ? 'h-3.5 w-3.5' : 'h-4 w-4'
  if (m === 'yes')
    return (
      <span className={`inline-flex ${box} items-center justify-center rounded-full bg-brand-pop text-white`} aria-label="Yes">
        <Check className={icon} />
      </span>
    )
  if (m === 'some')
    return (
      <span className={`inline-flex ${box} items-center justify-center rounded-full bg-brand-accent/40 text-brand-ink`} aria-label="Partly">
        <Minus className={icon} />
      </span>
    )
  return (
    <span className={`inline-flex ${box} items-center justify-center rounded-full bg-brand-line text-brand-ink-muted`} aria-label="No">
      <X className={icon} />
    </span>
  )
}

// The hero card: five rows of the comparison table, in short. Read from ROWS so the card
// can never disagree with the table, and it keeps "Lowest upfront cost", where the
// specialist loses, because a scorecard that only has ticks for us is not believable.
const SCORECARD: { short: string; label: string }[] = [
  { short: 'Knows how families choose', label: 'Understands how families choose care' },
  { short: 'Knows CQC', label: 'Knows CQC and what you must show' },
  { short: 'Family tools', label: 'Family tools built in' },
  { short: 'You own the enquiries', label: 'You own the site and the enquiries' },
  { short: 'Lowest upfront cost', label: 'Lowest upfront cost' },
]
// Phone labels are shorter: four full names do not fit beside the row labels at 390px.
const SHORT_OPTIONS = [
  { phone: 'Care', full: 'Specialist' },
  { phone: 'Agency', full: 'Agency' },
  { phone: 'DIY', full: 'DIY' },
  { phone: 'Listing', full: 'Directory' },
]

function ScorecardMock() {
  const rows = SCORECARD.flatMap(({ short, label }) => {
    const row = ROWS.find((r) => r.label === label)
    return row ? [{ short, marks: row.marks }] : []
  })
  return (
    <div className="rounded-3xl border-2 border-brand-ink bg-white p-4 shadow-[6px_6px_0_0_#2a2620] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">Scorecard</p>
      <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">Four ways to get a care website</p>
      <div className="mt-4 overflow-hidden rounded-2xl border border-brand-line">
        <div className="grid grid-cols-[1fr_repeat(4,2.6rem)] items-end gap-x-1 bg-brand-bg-warm px-2.5 py-2 sm:gap-x-0 sm:px-3 sm:grid-cols-[1fr_repeat(4,4rem)]">
          <span />
          {SHORT_OPTIONS.map((o, i) => (
            <span
              key={o.full}
              className={`text-center text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${i === 0 ? 'text-brand-pop' : 'text-brand-ink-muted'}`}
            >
              <span className="sm:hidden">{o.phone}</span>
              <span className="hidden sm:inline">{o.full}</span>
            </span>
          ))}
        </div>
        {rows.map((r) => (
          <div
            key={r.short}
            className="grid grid-cols-[1fr_repeat(4,2.6rem)] items-center gap-x-1 border-t border-brand-line px-2.5 py-2.5 sm:gap-x-0 sm:px-3 sm:grid-cols-[1fr_repeat(4,4rem)]"
          >
            <span className="text-xs font-semibold leading-tight text-brand-ink sm:text-sm">{r.short}</span>
            {r.marks.map((m, i) => (
              <span key={i} className={`flex justify-center ${i === 0 ? 'rounded-md bg-brand-pop/5 py-0.5' : ''}`}>
                <MarkIcon m={m} small />
              </span>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">
        Judged on what brings a family to your door, not on how the site looks in a pitch.
      </p>
    </div>
  )
}

export default function WhyACareSpecialistPage() {
  return (
    <main>
      <FaqJsonLd faqs={FAQS} />

      <CountyHero
        eyebrow="Choosing who builds your site"
        before="A care specialist,"
        highlight="or a cheaper generalist?"
        intro={
          <>
            <p>
              Every care provider looking for a new website weighs up the same four options: an agency that only works in
              care, a general web agency, a DIY builder, or carrying on with directory listings.
            </p>
            <p>
              Each has a place. This page sets them side by side, fairly, including when we are not the right choice.
            </p>
          </>
        }
        points={['An honest comparison', 'What to ask any agency', 'When not to use us']}
        primary={{ label: 'See the comparison', href: '#compare' }}
        secondary={{ label: 'Free audit', href: '/site-audit' }}
        mock={<ScorecardMock />}
      />

      <section id="compare" className="scroll-mt-24 bg-brand-bg-warm px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            The four options side by side
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-brand-ink-soft">
            A tick means it is a strength of that option, a dash means it depends on who you choose, a cross means it is
            usually missing.
          </p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-brand-line bg-white shadow-soft">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-white text-xs uppercase tracking-wider text-brand-ink-muted">
                <tr>
                  <th className="px-4 py-4 font-semibold">&nbsp;</th>
                  {OPTIONS.map((o, i) => (
                    <th key={o} className={`px-4 py-4 text-center font-semibold ${i === 0 ? 'text-brand-pop' : ''}`}>
                      {o}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-line">
                {ROWS.map((r) => (
                  <tr key={r.label}>
                    <td className="px-4 py-4 align-top">
                      <p className="font-semibold text-brand-ink">{r.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-brand-ink-muted">{r.note}</p>
                    </td>
                    {r.marks.map((m, i) => (
                      <td key={i} className={`px-4 py-4 text-center align-middle ${i === 0 ? 'bg-brand-pop/5' : ''}`}>
                        <MarkIcon m={m} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Prose
        sections={[
          {
            heading: 'What each option is good at',
            paragraphs: [],
            sub: [
              {
                heading: 'A care specialist',
                body: 'Knows how families choose care, what CQC expects you to show, and which searches bring enquiries in your town. Arrives with the tools families use already built. Costs more than doing it yourself, and a proper site takes weeks rather than days.',
              },
              {
                heading: 'A general web agency',
                body: 'Often good at design and build, and may be local to you. The gap is usually care knowledge: the funding questions, the CQC details, the way a worried family reads a page. A good one can learn it, but you pay for the learning.',
              },
              {
                heading: 'A DIY website builder',
                body: 'The cheapest way to get something live quickly, and fine for a new service that needs a placeholder. It relies on your time and your knowledge of search, and it rarely has the tools or the structure to rank in a competitive town.',
              },
              {
                heading: 'Directory listings only',
                body: 'Live today, with reviews families trust. The directory owns the page and the enquiry, and the cost carries on as long as you want the enquiries. Useful alongside your own site, risky as the only channel.',
              },
            ],
          },
          {
            heading: 'When we are not the right choice',
            paragraphs: [
              'If you need something live this week for a new service, a directory listing and a simple DIY page will do more for you right now. Come back when you are ready for a site that ranks.',
              'If your budget is very small, spend it on your Google Business Profile and on replying to enquiries quickly. Both are free and both matter more than a new website.',
              'If you are not a care provider, we are the wrong agency. We only work in care, and that is the point.',
            ],
          },
        ]}
      />

      <section className="px-6 pb-14">
        <div className="mx-auto max-w-5xl rounded-3xl border-2 border-brand-ink bg-white p-8 shadow-[4px_4px_0_0_#2a2620]">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink">Before you sign with anyone</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              'Who will own the domain, hosting and every login?',
              'How will you protect our current Google rankings?',
              'What will you report each month: enquiries, or just visits?',
              'Show us care websites you have built, and how they perform.',
              'What happens, and what does it cost, if we leave?',
              'Who will we actually speak to week to week?',
            ].map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-brand-ink-soft">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                {q}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-brand-ink-soft">
            Ask us the same questions, and hold us to the answers. How we work with customers is on{' '}
            <Link href="/our-commitment" className="font-semibold text-brand-pop underline underline-offset-2">
              our commitment page
            </Link>
            .
          </p>
        </div>
      </section>

      <Faqs heading="Common questions" faqs={FAQS} />

      <EndCta
        title="See where you stand first"
        body="A free audit shows what your current site does well and what it is missing, whoever you choose to fix it."
        primary={{ label: 'Get a free audit', href: '/site-audit' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </main>
  )
}
