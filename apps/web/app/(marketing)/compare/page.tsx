import type { Metadata } from 'next'
import Link from 'next/link'
import { applyPageSeo } from '@/lib/page-seo'
import { COMPARISONS } from '@/lib/comparisons'
import { CountyHero, EndCta, ServicePanel } from '@/components/marketing/county/CountySections'

// The hub for the /compare pages. Lists every comparison in lib/comparisons.ts plus the
// all-options page at /why-a-care-specialist.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/compare'

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

      <EndCta
        title="See where you stand first"
        body="A free audit shows what your current site does well and what it is missing, whoever you choose to fix it."
        primary={{ label: 'Get a free audit', href: '/site-audit' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </main>
  )
}
