import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Check } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { Star, Squiggle } from '@/components/marketing/Decor'
import { BuyersGuideForm } from '@/components/marketing/BuyersGuideForm'
import { JsonLd } from '@/components/JsonLd'
import { ORG_REF, WEBSITE_REF } from '@/lib/schema'

// Gated lead magnet: a practical, fair checklist for choosing who builds a care website.
// The PDF lives at public/guides/choosing-a-care-website-agency.pdf and is built by
// scripts/build-buyers-guide.mjs (rerun it after changing the guide's copy). The form posts
// to /api/marketing-leads with a message starting "Downloaded the buyer's guide", which
// the route uses to enrol the lead in the email nurture. The hero is static on purpose.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/guides/choosing-a-care-website-agency'
const TITLE = 'How to Choose a Website Agency for Your Care Service'
const DESCRIPTION =
  'A free checklist guide for UK care providers: what to ask any website agency about CQC display, accessibility, enquiries, local SEO, GDPR and ownership.'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}${PATH}` },
    openGraph: { title: `${TITLE} | TRG Digital`, description: DESCRIPTION, url: `${SITE_URL}${PATH}` },
  })
}

const INSIDE: { title: string; body: string }[] = [
  {
    title: 'Your CQC rating',
    body: 'How Regulation 20A applies to your website, and what to ask about the official CQC widget.',
  },
  {
    title: 'Older visitors',
    body: 'WCAG 2.2 AA, readable text, no carousels, and the Equality Act duties that apply to your site.',
  },
  {
    title: 'Enquiries, fees and availability',
    body: 'What families look for first, and how to make sure every enquiry reaches a person quickly.',
  },
  {
    title: 'Local search and schema',
    body: 'Ranking for "care homes in [town]", care specific structured data, and protecting rankings in a move.',
  },
  {
    title: 'Recruitment and care data',
    body: 'Careers pages carers actually use, and handling health details under UK GDPR.',
  },
  {
    title: 'Ownership and after launch',
    body: 'Who holds the domain, hosting and logins, what maintenance covers, and what leaving costs.',
  },
]

/** A static picture of the guide's cover, in the same colours as the PDF. */
function GuideCover() {
  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-brand-accent" aria-hidden />
      <div className="relative aspect-[210/297] overflow-hidden rounded-2xl border-2 border-brand-ink bg-brand-ink p-6 text-white sm:p-7">
        <div className="absolute inset-x-0 top-0 h-2 bg-brand-pop" aria-hidden />
        <p className="font-display text-lg font-bold lowercase tracking-tight">
          trg<span className="text-brand-pop">digital</span>
        </p>
        <p className="mt-8 inline-block rounded bg-brand-accent px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-ink">
          Free buyer&apos;s guide
        </p>
        <p className="mt-4 font-display text-2xl font-bold leading-tight sm:text-[1.7rem]">
          How to choose a website agency <span className="text-brand-pop">for your care service</span>
        </p>
        <ul className="mt-6 space-y-2 text-xs text-white/80">
          {['CQC rating and Regulation 20A', 'Older visitors and accessibility', 'Ownership, hosting and logins', 'Red flags and a scorecard'].map(
            (t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 flex-shrink-0 bg-brand-pop" aria-hidden />
                {t}
              </li>
            ),
          )}
        </ul>
        <p className="absolute bottom-5 left-6 text-[10px] font-semibold text-white/70 sm:left-7">www.trgdigital.co.uk</p>
      </div>
    </div>
  )
}

export default function BuyersGuidePage() {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: "Buyer's guide", item: `${SITE_URL}${PATH}` },
    ],
  }

  return (
    <main>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'DigitalDocument',
          name: TITLE,
          description: DESCRIPTION,
          url: `${SITE_URL}${PATH}`,
          encodingFormat: 'application/pdf',
          numberOfPages: 10,
          inLanguage: 'en-GB',
          isAccessibleForFree: true,
          audience: { '@type': 'Audience', audienceType: 'UK care providers' },
          author: ORG_REF,
          publisher: ORG_REF,
          isPartOf: WEBSITE_REF,
        }}
      />

      <section className="relative overflow-hidden px-6 pb-14 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-pop">
              <BookOpen className="h-4 w-4" aria-hidden />
              Free buyer&apos;s guide
            </p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
              How to choose a website agency <span className="text-brand-pop">for your care service</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <div className="mt-5 max-w-2xl space-y-4 text-lg leading-relaxed text-brand-ink-soft">
              <p>
                A practical checklist of the questions worth asking any agency, freelancer or platform before you sign,
                whoever you choose. Each section explains why it matters for a care service, what a good answer sounds
                like, and a free way to check for yourself.
              </p>
              <p>It finishes with the red flags to watch for and a one page scorecard to compare agencies side by side.</p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#get-the-guide" className="btn-cta">
                Get the free guide
                <span className="btn-arrow" aria-hidden>
                  →
                </span>
              </a>
              <Link href="/compare" className="btn-cta-outline">
                Compare your options
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['10 page PDF', 'Fair to every option', 'Printable scorecard'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>
          <GuideCover />
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            What is inside
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-brand-ink-soft">
            Ten topics a care website has to get right, each with the questions to ask. It is written to be useful whether
            you choose a care specialist, a general agency, a freelancer or a DIY builder.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INSIDE.map((i) => (
              <li key={i.title} className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
                <p className="flex items-start gap-2 font-display text-lg font-semibold text-brand-ink">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-brand-pop" aria-hidden />
                  {i.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{i.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="get-the-guide" className="scroll-mt-24 px-6 py-14">
        <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
              Who it is for
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">
              Registered managers, owners and operations leads at care homes, nursing homes, home care agencies,
              supported living and other care services who expect to replace their website in the coming months, and
              want to go into those conversations knowing what to ask.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                'Questions you can put to any agency, including us',
                'What a good answer sounds like, in plain English',
                'Free tools to check a website yourself',
                'A scorecard to compare up to three agencies',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 text-base text-brand-ink-soft">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-brand-pop" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-brand-ink-soft">
              Prefer to read online first? The{' '}
              <Link href="/why-a-care-specialist" className="font-semibold text-brand-pop underline underline-offset-2">
                four options side by side
              </Link>{' '}
              and the{' '}
              <Link href="/compare" className="font-semibold text-brand-pop underline underline-offset-2">
                one to one comparisons
              </Link>{' '}
              cover the same ground from a different angle.
            </p>
          </div>
          <BuyersGuideForm />
        </div>
      </section>
    </main>
  )
}
