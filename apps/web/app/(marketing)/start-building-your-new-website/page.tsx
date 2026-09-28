import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Inbox,
  HeartHandshake,
  BadgeCheck,
  Accessibility,
  Briefcase,
  KeyRound,
  Search,
  PencilLine,
  Check,
} from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { Star, Squiggle, Dots } from '@/components/marketing/Decor'
import { Steps, Faqs, FaqJsonLd, EndCta } from '@/components/marketing/county/CountySections'
import { RelatedLinks, toolItems, COMPARE_LINK } from '@/components/marketing/RelatedLinks'
import { StartBuildingForm } from '@/components/marketing/StartBuildingForm'

// The main money page for new website enquiries. County pages link here with the anchor
// "start building your new website", and the home page has a band pointing to it. The
// form sits in the hero where other pages put a mockup, so the first thing a provider who
// has already decided sees is the way to start. Every feature and claim below is one the
// site already makes elsewhere (/website-build, /accessible-websites, /carer-recruitment,
// /care-tools and the county website design pages); nothing new is promised here.

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/start-building-your-new-website'

const TITLE = 'Start Building Your New Care Website'
const DESCRIPTION =
  'Start your new care website with TRG Digital. Built from scratch for care providers, accessible, found in search, with careers built in. Yours to own.'

const META: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    title: `${TITLE} | TRG Digital`,
    description: DESCRIPTION,
    type: 'website',
    url: `${SITE_URL}${PATH}`,
  },
  robots: { index: true, follow: true },
}

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, META)
}

const linkClass = 'font-semibold text-brand-pop underline-offset-2 hover:underline'

const HERO_POINTS = [
  'Built from scratch, no templates or page builders',
  'Every page approved by you on a private test link',
  'A fixed price in writing, and you own the finished site',
]

const BENEFITS: { Icon: typeof Inbox; title: string; body: React.ReactNode }[] = [
  {
    Icon: Inbox,
    title: 'More enquiries that come to you',
    body: 'A directory ranks for you, but the enquiry is theirs to pass on. Your own website is a channel you own, with an enquiry form that works on a phone and lands with your team straight away.',
  },
  {
    Icon: HeartHandshake,
    title: 'A site families trust',
    body: 'Written for the sector: care types, funding, fees and the questions people really ask, in plain language, with your own photographs, team and reviews.',
  },
  {
    Icon: BadgeCheck,
    title: 'Your CQC rating shown properly',
    body: (
      <>
        Your rating is shown clearly on the site, where families and inspectors expect to find it. Not sure your
        current site gets this right? Try the{' '}
        <Link href="/tools/cqc-rating-display-checker" className={linkClass}>
          CQC rating display checker
        </Link>
        .
      </>
    ),
  },
  {
    Icon: Accessibility,
    title: 'Easy for older visitors',
    body: (
      <>
        Built to WCAG 2.2 AA, with an{' '}
        <Link href="/accessible-websites" className={linkClass}>
          accessibility bar
        </Link>{' '}
        on every page for larger text, high contrast, a readable font and listen to page. Nothing slides or auto plays
        while someone is reading.
      </>
    ),
  },
  {
    Icon: Briefcase,
    title: 'Carers applying directly',
    body: (
      <>
        A{' '}
        <Link href="/carer-recruitment" className={linkClass}>
          careers section
        </Link>{' '}
        with pay shown up front, vacancies listed free in Google for Jobs and a short application that works on a
        phone, with or without a CV.
      </>
    ),
  },
  {
    Icon: KeyRound,
    title: 'Your domain, your content',
    body: 'The domain stays in your name, the content is yours, and Google Analytics, Tag Manager and Search Console are set up under your own email addresses.',
  },
  {
    Icon: Search,
    title: 'Found in search and by AI assistants',
    body: 'Clean headings, titles and descriptions, structured data, planned internal links, an automatic sitemap and files written for AI assistants, all built in from the start.',
  },
  {
    Icon: PencilLine,
    title: 'Easy for your team to update',
    body: 'Our own content management system lets your team change pages, jobs, reviews and photos without a developer, with a login for each person and training.',
  },
]

const FEATURES: { title: string; items: string[] }[] = [
  {
    title: 'Design',
    items: [
      'Several homepage designs to choose from',
      'Every other page built around your chosen design',
      'Designed for phones first, then tablets and computers',
      'Your content and photography, loaded for you',
    ],
  },
  {
    title: 'Content management system',
    items: [
      'Edit pages, titles and descriptions yourself',
      'Jobs, reviews, photos, articles and location pages',
      'Every enquiry and application in one place',
      'A login for each member of your team, plus training',
    ],
  },
  {
    title: 'Careers',
    items: [
      'A page for every vacancy with pay up front',
      'A short mobile application with optional CV upload',
      'Secure, private CV storage with automatic deletion',
      'Job postings marked up for Google for Jobs',
    ],
  },
  {
    title: 'SEO built in',
    items: [
      'One main heading and one description per page',
      'Structured data for your organisation, services, reviews, FAQs and jobs',
      'Automatic sitemap, robots.txt, llms.txt and llms-full.txt',
      'Planned internal linking and breadcrumbs',
    ],
  },
  {
    title: 'Accessibility and privacy',
    items: [
      'Built to the WCAG 2.2 AA standard',
      'An accessibility bar on every page',
      'Cookie consent linked to Google Analytics',
      'No tracking unless a visitor accepts',
    ],
  },
  {
    title: 'Launch and hosting',
    items: [
      'Every page reviewed and approved on a private test link',
      'Every old address redirected to protect your rankings',
      'Google Analytics, Tag Manager and Search Console set up in your name',
      'Fast hosting, security certificate and daily backups',
    ],
  },
]

const STEPS = [
  {
    title: 'Discovery and design',
    body: 'We agree the page list, gather your content and present your homepage designs to choose from.',
  },
  {
    title: 'Build and review',
    body: 'We build every page on a private test link, and you review and approve each one on your own devices.',
  },
  {
    title: 'Launch',
    body: 'Once you sign off, we switch your domain over, submit the sitemap to Google and monitor closely after launch.',
  },
]

const FAQS: [string, string][] = [
  [
    'How long does a new care website take?',
    'Six to eight weeks for most single services, from the first call to going live. Larger groups with several homes on one site take longer, usually ten to twelve weeks. The part that decides the date is content: photographs, fees and the wording for each care type. We draft it, you approve it, and nothing goes live that you have not read.',
  ],
  [
    'What does it cost?',
    'Most new care websites land between £7,000 and £12,000, depending on how many pages and care types you need, how many homes are on the site, and which of the tools you want. You get a fixed price in writing before anything starts, so there is no hourly rate and no drift.',
  ],
  [
    'Who owns the site when it is finished?',
    'You do. The domain stays in your name, the content is yours and you get the site itself. Google Analytics, Tag Manager and Search Console sit under your own email addresses. There is no licence that switches it off if you leave.',
  ],
  [
    'Do you build on WordPress?',
    'No. We do not use WordPress, page builders or off the shelf website builders. Every website is built from scratch on our own technology, with search, accessibility, recruitment and security in the foundations, and no plugins to keep updating.',
  ],
  [
    'What happens to our current website while the new one is built?',
    'Nothing changes until the day we switch. Your existing site stays up and keeps taking enquiries while we build alongside it on a private test link, and we redirect every old address so nothing Google already ranks is lost.',
  ],
  [
    'Do you work with home care and supported living, not just care homes?',
    'Yes. We work only with care providers, including care homes, nursing homes, home care agencies, live-in care, supported living, retirement and extra care, and groups with several services. The website job is different for each, and we build the pages around the care you actually provide.',
  ],
]

export default function StartBuildingPage() {
  const schemas: Record<string, unknown>[] = [
    {
      '@type': 'Service',
      name: 'New care provider website',
      serviceType: 'Website design and build',
      url: `${SITE_URL}${PATH}`,
      provider: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'TRG Digital', url: SITE_URL },
      areaServed: { '@type': 'Country', name: 'United Kingdom' },
      audience: { '@type': 'BusinessAudience', audienceType: 'UK care providers' },
      description:
        'A new website for a UK care provider, built from scratch, with a choice of homepage designs, our own content management system, careers, SEO, WCAG 2.2 AA accessibility, hosting and launch.',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Start building your new website', item: `${SITE_URL}${PATH}` },
      ],
    },
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...schema }) }}
        />
      ))}
      <FaqJsonLd faqs={FAQS} />

      {/* ── Hero: the words on the left, the form where other pages put a mockup ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="lg:pt-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">New websites for care providers</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
              Start building your <span className="text-brand-pop">new care website</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <div className="mt-5 max-w-xl space-y-4 text-lg leading-relaxed text-brand-ink-soft">
              <p>
                We build websites only for UK care providers, from single homes and home care agencies to groups. Tell
                us about your service and we will come back with ideas for your new site and a fixed price.
              </p>
              <p className="text-base">
                Want to see the finished thing first? Look at{' '}
                <Link href="/work" className={linkClass}>
                  our work
                </Link>{' '}
                or click through our{' '}
                <Link href="/designs" className={linkClass}>
                  example designs
                </Link>
                .
              </p>
            </div>
            <ul className="mt-7 space-y-3">
              {HERO_POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-base font-medium text-brand-ink">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                    <Check className="h-3.5 w-3.5 text-white" aria-hidden />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div id="start" className="relative scroll-mt-24">
            <StartBuildingForm />
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-20">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What you get</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
              A website that works as hard as your team
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Not a prettier brochure. A site that families find, trust and enquire through, that carers apply
              through, and that belongs to you.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border-2 border-brand-ink bg-white p-5 shadow-[4px_4px_0_0_#2a2620]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-pop text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight text-brand-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features: what every build includes ──────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-20">
        <Star className="absolute right-8 top-12 hidden h-14 w-14 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What is included</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
              Everything in every build
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              We do not use WordPress, page builders or off the shelf website builders. Every website is built from
              scratch on our own technology, and this is what comes with it. The full breakdown is on{' '}
              <Link href="/website-build" className={linkClass}>
                what is included in a care website build
              </Link>
              .
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((g) => (
              <div key={g.title} className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight text-brand-ink">{g.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {g.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-ink-soft">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-brand-bg-warm p-6 sm:p-7">
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-brand-ink">
              Optional: family care tools
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
              Your new site can also include our{' '}
              <Link href="/care-tools" className={linkClass}>
                family care tools
              </Link>
              : funding calculators, NHS checkers and a local council guide, plus live room availability, branded as
              yours, to draw families in and turn them into enquiries.
            </p>
          </div>
        </div>
      </section>

      <div className="bg-brand-bg-warm">
        <Steps
          heading="How it works"
          intro="Three stages from first call to go live, and nothing goes live until you sign it off."
          items={STEPS}
        />
      </div>

      <Faqs heading="Questions before you start" faqs={FAQS} />

      <RelatedLinks
        heading="Before you choose who builds it"
        items={[COMPARE_LINK, ...toolItems(['/tools/website-grader', '/tools/cqc-rating-display-checker'])]}
      />

      <EndCta
        title="Ready to start building?"
        body="Tell us about your care service. A reply from a person within one working day, with ideas for your new website and a fixed price."
        primary={{ label: 'Start building your new website', href: '#start' }}
        secondary={{ label: 'See our work', href: '/work' }}
      />
    </>
  )
}
