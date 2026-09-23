import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Search,
  FileCode2,
  MapPin,
  Gauge,
  Accessibility,
  MousePointerClick,
  BarChart3,
  Bot,
  Heading1,
  Check,
} from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { ServiceLanding } from '@/components/marketing/ServiceLanding'
import { AuditForm } from '@/components/marketing/AuditForm'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

const META: Metadata = {
  title: 'Free Care Website Audit | Full SEO, Speed & Accessibility Report',
  description:
    'A free, no-obligation audit of your care website: technical SEO, schema, alt text, internal links, page speed, accessibility, local content and more, written in plain English by a care sector specialist.',
  alternates: { canonical: `${SITE_URL}/free-site-audit` },
  robots: { index: true, follow: true },
}

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/free-site-audit', META)
}

// Every group of checks the audit runs. This is the heart of the page: the point
// is the sheer breadth, because most "free audits" are a one-page automated score.
const GROUPS: { Icon: typeof Search; title: string; body: string; items: string[] }[] = [
  {
    Icon: Search,
    title: 'Whether Google can read you at all',
    body: 'The foundations. Get one of these wrong and nothing else on the list matters.',
    items: [
      'sitemap.xml: present, current, and listing the pages you actually want found',
      'robots.txt: what it blocks, and whether it is blocking something it should not',
      'Which pages are indexed, against which pages exist',
      'Canonical tags, and whether they contradict your sitemap',
      'Mixed signals in the code: noindex, canonical and sitemap disagreeing with each other',
      'URL structure, depth and readability',
      'Redirects, redirect chains and broken links',
      'HTTPS on every page and subdomain, including careers and booking subdomains',
      'www against non-www, and whether both resolve to one address',
      'Duplicate or near-duplicate pages competing with each other',
      'Conflicting SEO plugins writing over each other',
    ],
  },
  {
    Icon: Heading1,
    title: 'What Google reads on each page',
    body: 'Page by page, not a site-wide average. You get the actual list.',
    items: [
      'Title tags: length, duplication, and whether they say what the page is',
      'Meta descriptions: missing, truncated, duplicated or auto-generated',
      'H1 on every page, and only one of them',
      'Heading order: H1, H2, H3 used as structure rather than styling',
      'Thin pages with too little content to rank for anything',
      'Image alt text: missing, empty, or stuffed with keywords',
      'Internal linking, and which pages nothing links to',
      'Anchor text: how many links say "click here" or "read more"',
      'Whether your main services each have a page of their own',
    ],
  },
  {
    Icon: FileCode2,
    title: 'Structured data and how you appear in search',
    body: 'The markup that decides whether you show up as a plain blue link or as a rich result.',
    items: [
      'LocalBusiness or NursingHome schema, and whether it validates',
      'Your CQC rating marked up correctly, as an award and never as review stars',
      'Breadcrumb markup',
      'FAQ markup on the pages that answer questions',
      'JobPosting markup, so your vacancies list free in Google for Jobs',
      'Review markup used honestly, since misused review stars get manual penalties',
      'A mock-up of how your result would look in Google once it is right',
    ],
  },
  {
    Icon: MapPin,
    title: 'Local and location content',
    body: 'Families search by place. Most care websites have nothing for the towns they serve.',
    items: [
      'Which towns and areas you serve, and which have a page',
      'Service by area coverage, for example live-in care in a named town',
      'Name, address and phone consistency across the site and your Google profile',
      'Google Business Profile alignment with the website',
      'The location pages your competitors have and you do not',
    ],
  },
  {
    Icon: Gauge,
    title: 'Speed, on a real phone',
    body: 'Most family research happens on a phone, late at night, on a mediocre connection.',
    items: [
      'Core Web Vitals: largest contentful paint, layout shift and interaction delay',
      'PageSpeed scores for mobile and desktop, with the actual report',
      'Image sizes and formats, and how much weight could come off',
      'Images served larger than they are displayed',
      'Render-blocking scripts and stylesheets',
      'Server response time and caching',
      'Third-party scripts slowing the page down',
    ],
  },
  {
    Icon: Accessibility,
    title: 'Accessibility, properly checked',
    body: 'Tested by hand as well as by scanner, because scanners routinely report problems that are not there and miss ones that are.',
    items: [
      'WCAG 2.2 AA checks across the key journeys',
      'Colour contrast on text, buttons and over images',
      'Keyboard-only navigation from the top of the page to the enquiry form',
      'Screen reader labels on links, buttons, images and form fields',
      'Forms that can be completed without a mouse and do not time out',
      'Text resizing to 200 per cent without the layout breaking',
      'Moving carousels and animation, which are a genuine problem for people living with dementia',
      'Whether you have an accessibility statement, and your duty under the Equality Act',
    ],
  },
  {
    Icon: MousePointerClick,
    title: 'Turning visits into enquiries',
    body: 'Traffic you already have, leaking. Usually the fastest thing to fix.',
    items: [
      'How many clicks it takes to make an enquiry from any page',
      'Where your enquiry form actually sends, and who reads it',
      'Tap-to-call on mobile',
      'Whether fees, funding and availability are answered anywhere',
      'Whether your vacancies live on your own site or on somebody else’s job board',
      'Trust signals: real photography, CQC rating, reviews, named people',
      'The out-of-hours and weekend enquiry experience',
    ],
  },
  {
    Icon: BarChart3,
    title: 'Tracking, consent and ownership',
    body: 'The part nobody checks until they need it.',
    items: [
      'Google Analytics 4 installed, and recording something useful',
      'Google Tag Manager, and what is firing through it',
      'Search Console verified, and who has access',
      'Conversion tracking on enquiries and calls',
      'Cookie consent, and whether it genuinely controls your analytics',
      'Who owns the domain, the hosting, the analytics and the Google profile',
    ],
  },
  {
    Icon: Bot,
    title: 'How AI assistants read you',
    body: 'Families are starting to ask an assistant before they open Google. Almost nobody has looked at this yet.',
    items: [
      'Whether your content is readable without JavaScript, which is how most crawlers and assistants see it',
      'llms.txt and a machine-readable summary of your service',
      'The facts an assistant would state about you, and whether they are right',
      'Whether your fees, location and care types can be extracted at all',
    ],
  },
]

const FAQS: [string, string][] = [
  [
    'Is it really free?',
    'Yes. No card, no trial, no obligation. You get the report whether or not you ever speak to us again, and if the honest answer is that your site is in good shape, that is what it will say.',
  ],
  [
    'What is the catch?',
    'There is not one, but here is the reasoning. Most care websites have several fixable problems, and it is easier to show you than to tell you. Some people fix it themselves with the report, some ask us to do it. Both are fine.',
  ],
  [
    'Is it automated?',
    'No. Automated tools are part of it, for speed and Core Web Vitals, but the report is written by a person who works in the care sector. Scanners cannot tell you that your careers page is on a broken subdomain or that your fees are impossible to find.',
  ],
  [
    'How long does it take?',
    'We aim to have it with you within a few working days. If we are going to be longer than that, we will say so when you ask.',
  ],
  [
    'Do I have to be a customer?',
    'No, and most people who ask for one are not. We audit sites we did not build, on any platform: WordPress, Wix, Squarespace or something custom.',
  ],
  [
    'What do I get?',
    'A written report covering everything on this page, in plain English, with the findings ordered by what would make the biggest difference first, and screenshots of the actual problems on your actual site.',
  ],
]

export default function FreeSiteAuditPage() {
  const totalChecks = GROUPS.reduce((n, g) => n + g.items.length, 0)

  return (
    <>
      <ServiceLanding
        path="/free-site-audit"
        schemaName="Free care website audit"
        schemaDescription="A free, no-obligation technical SEO, speed, accessibility and conversion audit of a care provider's website, written by a care sector specialist."
        eyebrow="No charge, no obligation"
        title={['A free audit of your', 'entire website,', 'written by a human']}
        intro={`We go through your website the way Google, a screen reader and a worried family all see it, then send you a written report: what is wrong, what it is costing you, and what we would fix first. ${totalChecks} checks across ${GROUPS.length} areas, and not a single one of them is a sales pitch.`}
        heroPoints={[
          `${totalChecks} checks, from schema and alt text to speed, accessibility and AI readability`,
          'Written by a care sector specialist, not generated by a scanner',
          'Yours to keep and act on, whether you work with us or not',
        ]}
        primaryCta={{ label: 'Request my free audit', href: '#request' }}
        secondaryCta={{ label: 'Score your site instantly', href: '/tools/website-grader' }}
        mock={{
          url: 'yourcarehome.co.uk',
          heading: 'Audit findings',
          rows: [
            ['Homepage H1', 'Missing'],
            ['Images without alt text', '34'],
            ['Pages nothing links to', '11'],
            ['Mobile speed score', '41 / 100'],
            ['Schema markup', 'Not found'],
            ['Careers page', 'Certificate expired'],
          ],
          badge: 'Real findings, from a real audit',
        }}
        why={{
          title: 'Why we give this away',
          tagline: 'Because showing beats telling',
          paragraphs: [
            <>
              Most care providers have been told their website is fine, usually by whoever built it. Then enquiries
              drift, the phone gets quieter, and nobody can say why. An audit turns that into a list of specific,
              checkable facts: this page has no heading, these 34 images have no alt text, this form sends to an
              inbox nobody reads.
            </>,
            <>
              We are not doing anything clever here. We look properly, we write it down in language you can act on,
              and we hand it over. If you fix it yourself, good. If you want us to, better. Either way you stop
              guessing, which is the expensive part.
            </>,
          ],
        }}
        points={[
          'Every page checked, not a sample',
          'Screenshots of the actual problems on your actual site',
          'Findings ordered by impact, not by how impressive they sound',
          'Plain English, no jargon you have to look up',
          'Works on any platform: WordPress, Wix, Squarespace or custom',
          'No obligation, and no follow-up sales sequence',
        ]}
        pointsCta="Request my free audit"
        cards={{
          title: 'What the audit covers',
          subtitle: `${totalChecks} checks across ${GROUPS.length} areas. The full list is below, so you can see exactly what you are getting.`,
          items: GROUPS.slice(0, 6).map((g) => ({ Icon: g.Icon, title: g.title, body: g.body })),
        }}
        steps={{
          title: 'How it works',
          items: [
            { n: '01', title: 'Send us your website address', body: 'Name, email and your URL. That is the whole form. No call to book, nothing to install, and no access to your site needed.' },
            { n: '02', title: 'We go through it properly', body: 'Tools for the measurable parts, a person for everything else. We look at your site the way Google, a screen reader and a family comparing three homes all see it.' },
            { n: '03', title: 'You get the report', body: 'A written report with the findings ordered by what matters most, and screenshots of each problem. Yours to keep, act on, or hand to whoever built your site.' },
          ],
        }}
        extra={
          <>
            {/* The full checklist. The breadth is the argument. */}
            <section className="bg-brand-bg-warm px-6 py-16">
              <div className="mx-auto max-w-6xl">
                <div className="max-w-2xl">
                  <p className="font-display text-sm font-bold uppercase tracking-widest text-brand-pop">
                    Everything we check
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
                    The full list, nothing held back
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
                    Most free audits are an automated score out of 100 and a call booking link. This is what ours
                    actually covers.
                  </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {GROUPS.map((g) => (
                    <div key={g.title} className="rounded-2xl border-2 border-brand-ink bg-white p-6 shadow-[6px_6px_0_0_#2a2620]">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/25 text-brand-ink">
                        <g.Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight text-brand-ink">
                        {g.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{g.body}</p>
                      <ul className="mt-4 space-y-2">
                        {g.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm leading-snug text-brand-ink-soft">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <p className="mt-8 text-sm text-brand-ink-soft">
                  And whatever else we find. No two care websites are broken in the same way, and the most useful
                  finding is often something not on this list.
                </p>
              </div>
            </section>

            {/* The form */}
            <section id="request" className="scroll-mt-24 px-6 py-16">
              <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr]">
                <div>
                  <p className="font-display text-sm font-bold uppercase tracking-widest text-brand-pop">
                    Request your audit
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
                    Three fields, then we get to work
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">
                    We need your website address and somewhere to send the report. We do not need access to your
                    site, your hosting or your analytics, and nothing changes on your website as a result of asking.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {[
                      'No charge, and no obligation afterwards',
                      'A real person reads your site and writes the report',
                      'Yours to keep, even if you never reply',
                    ].map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-brand-ink-soft">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm text-brand-ink-soft">
                    In a hurry? The{' '}
                    <Link href="/tools/website-grader" className="font-semibold text-brand-pop hover:underline">
                      website grader
                    </Link>{' '}
                    gives you an instant score while you wait for the full report.
                  </p>
                </div>

                <div className="rounded-2xl border-2 border-brand-ink bg-white p-6 shadow-[8px_8px_0_0_#2a2620]">
                  <AuditForm />
                </div>
              </div>
            </section>

            {/* FAQs */}
            <section className="bg-white px-6 py-16">
              <div className="mx-auto max-w-3xl">
                <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
                  Questions people ask first
                </h2>
                <div className="mt-8 divide-y divide-brand-line border-y border-brand-line">
                  {FAQS.map(([q, a]) => (
                    <details key={q} className="group py-4">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-base font-bold uppercase tracking-tight text-brand-ink">
                        {q}
                        <span className="text-brand-pop transition-transform group-open:rotate-45" aria-hidden>
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            <script
              type="application/ld+json"
              suppressHydrationWarning
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'FAQPage',
                  mainEntity: FAQS.map(([q, a]) => ({
                    '@type': 'Question',
                    name: q,
                    acceptedAnswer: { '@type': 'Answer', text: a },
                  })),
                }),
              }}
            />
          </>
        }
        cta={{
          title: 'Find out what your website is really doing',
          body: 'One form, a few working days, and an honest report on every part of your site. No charge, and no obligation at the end of it.',
        }}
      />
    </>
  )
}
