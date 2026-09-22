import type { Metadata } from 'next'
import Link from 'next/link'
import { Palette, LayoutTemplate, Search, Accessibility, ShieldCheck, Eye, Check } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { ServiceLanding } from '@/components/marketing/ServiceLanding'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

const META: Metadata = {
  title: "What's Included in a Care Website Build",
  description:
    'Everything included when TRG Digital builds a care provider website: homepage designs to choose from, our own content management system, careers with CV upload, SEO, accessibility, cookie consent, secure hosting, review on a private test link and launch.',
  alternates: { canonical: `${SITE_URL}/website-build` },
  robots: { index: true, follow: true },
}

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/website-build', META)
}

const linkClass = 'font-semibold text-brand-pop underline-offset-2 hover:underline'

const INCLUDED: { title: string; items: string[] }[] = [
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

export default function WebsiteBuildPage() {
  return (
    <ServiceLanding
      path="/website-build"
      schemaName="Care provider website build"
      schemaDescription="A complete website build for UK care providers, including design, a content management system, careers, SEO, accessibility, cookie consent, hosting and launch."
      eyebrow="What's included"
      title={['Everything in a', 'care website build']}
      intro="We do not use WordPress, page builders or off the shelf website builders. Every website is built from scratch on our own technology, with search, accessibility, recruitment and security in the foundations. This is exactly what you get."
      heroPoints={['Built from scratch', 'Approved by you before launch', 'Yours to own']}
      primaryCta={{ label: 'Start your project', href: '/contact' }}
      secondaryCta={{ label: 'See our work', href: '/work' }}
      mock={{
        url: 'preview.yourcareservice.co.uk',
        heading: 'Your new website',
        rows: [
          ['Homepage design', 'Chosen by you'],
          ['Pages', 'Approved one by one'],
          ['SEO and accessibility', 'Built in'],
          ['Go live', 'When you sign off'],
        ],
        badge: 'Private test link, hidden from Google',
      }}
      why={{
        title: 'Built from scratch, not bolted together',
        tagline: 'Most website problems come from the way a site was put together.',
        paragraphs: [
          'A typical care website is a theme, a page builder and a stack of plugins, each adding its own code. That is how sites end up slow, with conflicting SEO settings, missing headings and images Google cannot understand. Building from scratch means every part of the site is there for a reason, with nothing to conflict and no plugins to keep updating.',
          <>
            Your website comes with our own content management system, so your team can change it without a
            developer. It includes <Link href="/carer-recruitment" className={linkClass}>carer recruitment</Link>,{' '}
            <Link href="/accessible-websites" className={linkClass}>accessibility</Link> and{' '}
            <Link href="/seo" className={linkClass}>SEO</Link> as standard, and can include our{' '}
            <Link href="/care-tools" className={linkClass}>family care tools</Link>.
          </>,
        ],
      }}
      points={[
        'A choice of homepage designs',
        'Our own content management system',
        'Careers with CV upload',
        'SEO and structured data built in',
        'WCAG 2.2 AA accessibility',
        'Review and approve before launch',
      ]}
      pointsCta="Want to see what your new website could look like?"
      cards={{
        subtitle: 'How it comes together',
        title: 'Six things every build includes',
        items: [
          { Icon: Palette, title: 'Your choice of design', body: 'We present several homepage designs. You choose the one that feels right, and we refine it with you.' },
          { Icon: LayoutTemplate, title: 'Every page around it', body: 'Service, location, careers, article and contact pages are all built around your chosen design, so the site stays consistent.' },
          { Icon: Search, title: 'SEO in the foundations', body: 'Clean headings, titles and descriptions, structured data, an automatic sitemap and files for AI assistants.' },
          { Icon: Accessibility, title: 'Accessible to every visitor', body: 'Built to WCAG 2.2 AA, with an accessibility bar for larger text, high contrast, a readable font and listen to page.' },
          { Icon: ShieldCheck, title: 'Secure and private', body: 'Private CV storage, cookie consent linked to Google Analytics, a security certificate and daily backups.' },
          { Icon: Eye, title: 'You approve everything', body: 'Every page is delivered on a private test link for your comments and sign off. Nothing goes live until you approve it.' },
        ],
      }}
      extra={
        <section className="relative overflow-hidden px-6 pb-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">The full list</p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">What is included</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {INCLUDED.map((group) => (
                <div key={group.title} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                  <h3 className="font-display text-lg font-semibold text-brand-ink">{group.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-brand-ink-soft">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-brand-bg-warm p-7">
              <h3 className="font-display text-lg font-semibold text-brand-ink">Your accounts, your website</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
                Google Analytics, Google Tag Manager, Google Search Console and your domain all belong to you and sit under
                your own email addresses. If you do not have them yet, we help you create them and you give us access as an
                admin user. The website, its content and your data are yours. Our content management system is our own
                technology, so it cannot be copied or reused for another website.
              </p>
            </div>
          </div>
        </section>
      }
      steps={{
        title: 'From first call to go live',
        items: [
          { n: '01', title: 'Discovery and design', body: 'We agree the page list, gather your content and present your homepage designs to choose from.' },
          { n: '02', title: 'Build and review', body: 'We build every page on a private test link, and you review and approve each one on your own devices.' },
          { n: '03', title: 'Launch', body: 'Once you sign off, we switch your domain over, submit the sitemap to Google and monitor closely after launch.' },
        ],
      }}
      cta={{
        title: 'Start your new website',
        body: 'Tell us about your care service and we will show you what your new website could include, and what it would look like.',
      }}
    />
  )
}
