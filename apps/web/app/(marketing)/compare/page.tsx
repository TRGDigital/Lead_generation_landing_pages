import type { Metadata } from 'next'
import Link from 'next/link'
import { applyPageSeo } from '@/lib/page-seo'
import { COMPARISONS } from '@/lib/comparisons'
import { CountyHero, EndCta, ServicePanel } from '@/components/marketing/county/CountySections'
import { MarkIcon } from '@/components/marketing/Scorecard'

// The hub for the /compare pages. Lists every comparison in lib/comparisons.ts plus the
// all-options page at /why-a-care-specialist.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/compare'

// The hero card: what each option genuinely does best. Every strength is a row where that
// option wins or draws on its own comparison page, so the card says nothing those pages don't.
const STRENGTHS: { option: string; best: string[]; us?: boolean }[] = [
  { option: 'Care specialist', best: ['Knows CQC and what you must show', 'Owns the page and the enquiry'], us: true },
  { option: 'Wix or Squarespace', best: ['Live quickly', 'Lowest first year cost'] },
  { option: 'WordPress freelancer', best: ['Lowest upfront cost', 'Most choice of add ons'] },
  { option: 'General agency', best: ['Design and build quality', 'Wider creative services'] },
  { option: 'Directory listing', best: ['Live today', 'Reviews families already trust'] },
]

function OptionsCard() {
  return (
    <div className="rounded-3xl border-2 border-brand-ink bg-white p-4 shadow-[6px_6px_0_0_#2a2620] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">Five options</p>
      <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">What each one does best</p>
      <ul className="mt-4 divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line">
        {STRENGTHS.map((s) => (
          <li key={s.option} className={`px-3 py-3 sm:px-4 ${s.us ? 'bg-brand-pop/5' : ''}`}>
            <p className={`text-sm font-bold ${s.us ? 'text-brand-pop' : 'text-brand-ink'}`}>{s.option}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {s.best.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-bg-warm px-2.5 py-1 text-xs font-medium text-brand-ink-soft"
                >
                  <MarkIcon m="yes" small />
                  {b}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">
        Every option is good at something. The comparisons below show where each one falls short for care.
      </p>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, {
    title: 'Care Website Comparisons: Specialist, DIY, Agency or Directory',
    description:
      'Fair, side by side comparisons for care providers choosing how to get a website: a care specialist, Wix or Squarespace, a WordPress freelancer, a general agency, or directory listings.',
    alternates: { canonical: `${SITE_URL}${PATH}` },
  })
}

export default function CompareHubPage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Compare', item: `${SITE_URL}${PATH}` },
    ],
  }
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'A care specialist vs the alternatives', url: `${SITE_URL}/why-a-care-specialist` },
      ...COMPARISONS.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.title,
        url: `${SITE_URL}/compare/${c.slug}`,
      })),
    ],
  }

  return (
    <main>
      {[breadcrumb, itemList].map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <CountyHero
        eyebrow="Compare your options"
        before="Choosing how to get"
        highlight="a care website"
        intro={
          <>
            <p>
              Care providers weigh up the same few options: an agency that only works in care, a DIY builder, a WordPress
              freelancer, a general agency, or relying on directory listings.
            </p>
            <p>
              Each comparison below says what the other option does well, where care websites tend to get stuck, and when
              we are not the right choice.
            </p>
          </>
        }
        points={['Fair to every option', 'Care specific criteria', 'When not to use us']}
        primary={{ label: 'All options side by side', href: '/why-a-care-specialist' }}
        secondary={{ label: 'Free audit', href: '/site-audit' }}
        mock={<OptionsCard />}
      />

      <ServicePanel
        label="Comparisons"
        button="Read"
        items={[
          {
            title: 'All the options side by side',
            body: 'A care specialist, a general agency, a DIY builder and directory listings on one scorecard. The best place to start.',
            href: '/why-a-care-specialist',
          },
          ...COMPARISONS.map((c) => ({ title: c.title, body: c.hubSummary, href: `/compare/${c.slug}` })),
        ]}
        footer={
          <p className="text-sm text-brand-ink-soft">
            Want to test your current site first? Try the free{' '}
            <Link href="/tools/website-grader" className="font-semibold text-brand-pop underline underline-offset-2">
              website grader
            </Link>{' '}
            or the{' '}
            <Link href="/tools/cqc-rating-display-checker" className="font-semibold text-brand-pop underline underline-offset-2">
              CQC rating display checker
            </Link>
            .
          </p>
        }
      />

      <section className="px-6 pb-14">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 rounded-3xl border-2 border-brand-ink bg-brand-bg-warm p-6 shadow-[4px_4px_0_0_#2a2620] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-pop">Free buyer&apos;s guide</p>
            <p className="mt-1 font-display text-xl font-bold uppercase tracking-tight text-brand-ink">
              How to choose a website agency for your care service
            </p>
            <p className="mt-1 text-sm text-brand-ink-soft">
              The questions to ask any agency, with a scorecard to compare them side by side.
            </p>
          </div>
          <Link href="/guides/choosing-a-care-website-agency" className="btn-cta flex-shrink-0">
            Get the guide
          </Link>
        </div>
      </section>

      <EndCta
        title="See where you stand first"
        body="A free audit shows what your current site does well and what it is missing, whoever you choose to fix it."
        primary={{ label: 'Get a free audit', href: '/site-audit' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </main>
  )
}
