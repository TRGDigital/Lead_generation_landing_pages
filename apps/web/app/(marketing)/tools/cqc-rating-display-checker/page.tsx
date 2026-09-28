import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { BadgeCheck, Check } from 'lucide-react'
import { CqcDisplayChecker } from '@/components/marketing/CqcDisplayChecker'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/cqc-rating-display-checker', META)
}

const META: Metadata = {
  title: 'CQC Rating Display Checker | Is Your Rating on Your Website?',
  description:
    'Free checker for care homes and home care providers. See if your website shows the official CQC widget or your rating, whether it matches your live CQC rating, and how to fix it.',
  alternates: { canonical: `${SITE_URL}/tools/cqc-rating-display-checker` },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'Do care providers have to show their CQC rating on their website?', a: 'Yes. Under Regulation 20A of the Health and Social Care Act 2008 (Regulated Activities) Regulations 2014, providers in England must display their most recent CQC rating conspicuously on their website, if they have one, as well as at the premises where care is delivered. The CQC explains how in its guidance on displaying ratings, and it can take action where a rating is not displayed.' },
  { q: 'What is the CQC widget?', a: 'The CQC widget is a small piece of code the CQC provides for every location it regulates. When you paste it into your website it shows your current overall rating, the date of the report and a link to your full CQC page. Because it reads straight from the CQC, it updates itself when a new rating is published.' },
  { q: 'Where do I find my CQC widget code?', a: 'Go to your service page on cqc.org.uk and look for the widget or resources section. The code includes your location ID, which looks like 1-000000000, and should end with type=location. Your web developer or website editor can paste it into your homepage.' },
  { q: 'Can I show my rating as text or an image instead of the widget?', a: 'The widget is the simplest way, but the CQC also accepts other methods as long as they are equally effective: your current rating, shown clearly where people will see it, with a link to your CQC report. The risk with text and images is that they go out of date when your rating changes, which this checker helps you spot.' },
  { q: 'Why does the checker say it could not find my widget when I can see it?', a: 'We read your pages the way a search engine does. If the widget is added through a tag manager, a cookie banner or a script that loads after the page opens, it may not appear in what we can see. It is worth checking with your web developer that the widget code sits in the page itself.' },
]

const POINTS = [
  'Finds the official CQC widget on your site',
  'Spots written ratings and rating badges',
  'Compares with your live CQC rating',
  'Plain-English fixes, free, no sign-up',
]

export default function CqcRatingDisplayCheckerPage() {
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
            name: 'CQC Rating Display Checker',
            url: `${SITE_URL}/tools/cqc-rating-display-checker`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Free tool that checks whether a care provider website displays its current CQC rating or the official CQC widget.',
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
                <BadgeCheck className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                CQC Rating Display Checker
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Care providers in England must show their current CQC rating on their website. Enter your web address and
                we will check whether yours is on show, whether it is up to date, and what to change if it is not.
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

            <ToolTracker tool="cqc-rating-display-checker"><CqcDisplayChecker /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the CQC rating display checker
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Regulation 20A of the Health and Social Care Act 2008 (Regulated Activities) Regulations 2014 requires
              registered providers in England to display their most recent CQC rating on their website, if they have one,
              in a place where people will see it. The CQC gives every location a free widget that does this for you, and
              it keeps itself up to date whenever a new report is published.
            </p>
            <p>
              In practice, many care websites miss something. The widget was never added, it sits on an inner page no one
              visits, it points at the wrong service, or an old rating is still written into the homepage or footer after a
              new inspection. This checker reads your homepage and up to four likely pages, looks for the official widget
              and for your rating written in text or badge images, and, when you pick your service, compares what it finds
              with your live rating on the CQC register.
            </p>
            <p>
              You get a simple pass, needs attention or fail result, with a plain-English list of what to change. This is
              an automated check, not legal advice, so if you are unsure about your own position, the CQC guidance on
              displaying ratings is the place to confirm it.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Displaying your CQC rating, explained
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
            Put your rating front and centre
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Families look for your CQC rating before they pick up the phone. We build care websites that show it clearly,
            keep it current and turn visits into enquiries.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/site-audit" className="btn-cta">
              Get a free site audit
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/tools" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              More free tools →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
