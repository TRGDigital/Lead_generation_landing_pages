import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Gauge, Check } from 'lucide-react'
import { WebsiteGrader } from '@/components/marketing/WebsiteGrader'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/website-grader', META)
}

const META: Metadata = {
  title: 'Your Care Website Grader | Free Care Home Website Audit | TRG Digital',
  description:
    'Free website grader for care homes, nursing homes and domiciliary care. Get an instant score and a checklist of the things families and Google look for, with clear tips to win more enquiries.',
  alternates: { canonical: `${SITE_URL}/tools/website-grader` },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'What does the care website grader check?', a: 'It looks at your homepage the way a family would. We check the foundations (secure connection, mobile-friendly, page titles and speed), whether you can be found (clear headings and named care types), the trust signals families need (your CQC rating, fees or funding, and reviews), and whether visits turn into enquiries (an easy-to-find phone number and a clear enquiry route).' },
  { q: 'Is the website grader really free?', a: 'Yes. There is no sign-up and no payment. Enter your web address, and you get your score and a full checklist in seconds. It is built for care home, nursing home and domiciliary care operators who want a quick, honest read on their site.' },
  { q: 'Why does my care website score matter?', a: 'Most families now research care online before they ever pick up the phone. If your site is slow, hard to find, or missing the trust signals they look for, they move on to a competitor. A higher score means more of the right families reach you and enquire.' },
  { q: 'What should I do with my results?', a: 'Start with the failed checks, each one comes with a plain-English tip. Quick wins like showing your CQC rating, adding reviews, and making your phone number easy to find can lift enquiries fast. If you would like us to handle it, we can build or fix your site for you.' },
]

const POINTS = [
  'Instant score out of 100, no sign-up',
  'Built around what care families look for',
  'Plain-English tips for every failed check',
  'Works for care homes, nursing homes and home care',
]

export default function WebsiteGraderPage() {
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
            name: 'Care Website Grader',
            url: `${SITE_URL}/tools/website-grader`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Free tool that grades a care home website on SEO, speed, accessibility and enquiry readiness.',
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
                <Gauge className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Your Care Website Grader
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Families judge your care in seconds. Get an instant score for your website, and a clear checklist of
                the things families and Google look for, so you win more enquiries.
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

            <ToolTracker tool="website-grader"><WebsiteGrader /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          {/* About / how-to (SEO) */}
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About Your Care Website Grader
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Choosing care is one of the hardest decisions a family will make, and these days it almost always
              starts online. Before anyone calls or books a visit, they look you up, and they form an opinion in
              seconds. Your Care Website Grader checks your homepage against the signals that matter most to those
              families and to Google, then turns it into a single honest score out of 100. It is built specifically
              for care homes, nursing homes and domiciliary care providers, so it looks for the things that actually
              influence a care enquiry, not generic marketing fluff.
            </p>
            <p>
              Using it could not be simpler. Type in your web address and the grader fetches your homepage, then runs
              a series of checks across six areas: the technical foundations (a secure connection, a mobile-friendly
              layout, page titles and loading speed), whether you are search engine ready (schema, sitemap, indexing
              and analytics), how easily families can find you, the trust signals they look
              for (your CQC rating, fees or funding, and reviews from real families), whether your site is easy for
              older and low-vision visitors to use, and whether a visit turns into
              an enquiry. Every check that fails comes with a plain-English tip you can act on. Work through them, or
              ask us to do it for you, and you give every family who lands on your site a reason to choose you.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Your care website, explained
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
            Want a website families trust?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We design and build care websites that rank, reassure, and turn visits into real enquiries.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get a free action plan
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
