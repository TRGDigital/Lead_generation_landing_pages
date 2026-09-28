import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Accessibility, Check } from 'lucide-react'
import { AccessibilityChecker } from '@/components/marketing/AccessibilityChecker'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'
import { STUDY } from '@/lib/accessibility-check'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/care-website-accessibility-check', META)
}

const META: Metadata = {
  title: 'Care Website Accessibility Check | Free Tool for Care Providers',
  description:
    'Free accessibility check for care home and home care websites. See how your site works for older visitors and families, get a score out of 100 and your top three fixes.',
  alternates: { canonical: `${SITE_URL}/tools/care-website-accessibility-check` },
  robots: { index: true, follow: true },
}

const pct = (n: number, d: number) => Math.round((n / d) * 100)

const FAQS = [
  {
    q: 'Why does accessibility matter so much for a care provider website?',
    a: 'The people reading your website are often older, arranging care for themselves or a husband or wife, or they are adult children reading on a phone late at night. Failing eyesight, arthritis, a tremor or simply stress all make a hard to use website harder. If they cannot read your fees or find your phone number, they will call someone else.',
  },
  {
    q: 'Is this a full accessibility audit?',
    a: 'No. An automated scan catches only part of the Web Content Accessibility Guidelines (WCAG). We read the code of your homepage and two key pages and check the things that can be measured reliably that way. Colour contrast, keyboard use, focus order, captions and plain language all need a person and a real browser to judge properly.',
  },
  {
    q: 'Do care providers have a legal duty to make their website accessible?',
    a: 'The Equality Act 2010 requires service providers to make reasonable adjustments so disabled people are not put at a disadvantage, and that is widely understood to include websites. The specific public sector accessibility regulations apply to public bodies rather than most independent care providers, but WCAG 2.2 level AA is the standard everyone is measured against.',
  },
  {
    q: 'Will an accessibility toolbar or overlay fix these problems?',
    a: `A toolbar that enlarges text or reads the page aloud can help some visitors, but it does not change the page underneath. In our study of ${STUDY.measured} care provider websites, all ${STUDY.toolSitesStillFailing} of the ${STUDY.toolSites} sites running a toolbar or listen tool still failed at least one basic check. Fixing the page itself is what makes the difference.`,
  },
  {
    q: 'How is the score worked out?',
    a: 'Each check carries a weight based on how much it affects older visitors and families, with image descriptions, form labels and zoom weighted most. A pass earns the full weight, a warning earns half and a fail earns nothing. Checks we could not run, such as form labels on a site with no form, are left out rather than counted against you.',
  },
]

const POINTS = [
  'Image descriptions, headings and page language',
  'Enquiry form labels and button names',
  'Zoom, phone layout and tap to call',
  'A score out of 100 and your top three fixes',
]

export default function CareWebsiteAccessibilityCheckPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Care Website Accessibility Check',
            url: `${SITE_URL}/tools/care-website-accessibility-check`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Free tool that checks a care provider website for common accessibility problems affecting older visitors and families, with a score and plain English fixes.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
            provider: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
          }),
        }}
      />

      <section className="relative overflow-x-clip px-6 pb-16 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-10 right-8 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-6xl">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-4 grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24 lg:self-start lg:pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                <Accessibility className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Care Website Accessibility Check
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Many of the people looking at your website are older, or worried and reading on a phone. Enter your web
                address and we will check how well your site works for them, with a score out of 100 and the three
                fixes that will make the biggest difference.
              </p>
              <ul className="mt-6 space-y-2.5">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-brand-ink">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop/10"><Check className="h-3 w-3 text-brand-pop" /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <ToolTracker tool="care-website-accessibility-check"><AccessibilityChecker /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the accessibility check
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              In September 2026 we measured {STUDY.measured} UK care provider websites the way a family with failing
              eyesight would meet them. Only {STUDY.cleanSites} passed all of our automated checks. {pct(STUDY.contrastSites, STUDY.measured)}% had
              text that failed the contrast standard, {pct(STUDY.noSkipLinkSites, STUDY.measured)}% had no skip to content
              link, and {pct(STUDY.unlabelledSites, STUDY.sitesWithForms)}% of the sites with an enquiry form had at least
              one field with no label.
            </p>
            <p>
              This tool is the self serve version of that study. It reads your homepage, your contact page and one other
              key page, and checks for missing image descriptions, page language, heading structure, form labels, links
              and buttons a screen reader cannot name, blocked zoom, small text, a skip link, untitled maps and videos, and
              whether your phone number is tap to call. Each result explains, in plain English, why it matters to older
              visitors and the families helping them.
            </p>
            <p>
              It is an automated check, not a full audit. It reads the page code rather than opening your site in a
              browser, so it cannot judge colour contrast, keyboard use or whether your wording is easy to follow. For
              that, <Link href="/site-audit" className="font-semibold text-brand-pop hover:underline">ask us for a free site audit</Link>.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Accessible care websites, explained
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-brand-line bg-white px-6 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-ink">
                  {q}
                  <span className="shrink-0 text-lg leading-none text-brand-pop transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            A website every family can use
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We build care websites that are accessible from the ground up: readable text, clear forms, keyboard friendly
            and easy on a phone, so no family is turned away by the website before they ever reach you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/accessible-websites" className="btn-cta">
              See accessible websites
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/site-audit" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              Get a free site audit →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
