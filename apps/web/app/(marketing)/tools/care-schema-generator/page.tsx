import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Code2, Check } from 'lucide-react'
import { CareSchemaGenerator } from '@/components/marketing/CareSchemaGenerator'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/care-schema-generator', META)
}

const META: Metadata = {
  title: 'Care Sector Schema Generator | Free JSON-LD Structured Data',
  description:
    'Free schema.org (JSON-LD) generator built for care homes, nursing homes and home care agencies. Add your CQC rating, services, address and areas served, then copy ready-to-paste structured data. Your CQC rating is added correctly as an award, never as fake review stars.',
  alternates: { canonical: `${SITE_URL}/tools/care-schema-generator` },
  robots: { index: true, follow: true },
}

const FAQS = [
  {
    q: 'What is schema markup (JSON-LD) and why does my care website need it?',
    a: 'Schema markup is a small piece of code you add to your website that describes your business to Google in a language it understands: your name, phone, address, services, opening hours and CQC rating. It powers the rich results families see in search, like your map pin, contact details and knowledge panel. Without it, Google has to guess. With it, you are far more likely to show up correctly when a family searches for care in your area.',
  },
  {
    q: 'Why does this tool add my CQC rating as an award and not star ratings?',
    a: 'This is the single most important thing to get right. A CQC rating is a regulatory judgement from the Care Quality Commission, not a collection of customer reviews. Google’s guidelines say review and star-rating schema (aggregateRating) must come from genuine customer reviews you collect. Dressing a CQC rating up as review stars breaks that rule and can trigger a Google manual action that removes your rich results. So we add it the correct way, as an official award and a labelled property, which is honest, compliant and still tells Google about your rating.',
  },
  {
    q: 'Is this really free, and do I need to be technical?',
    a: 'Completely free, no sign-up, and no coding needed. Fill in the form, copy the generated code, and paste it into your website’s header or custom code box. Most website builders (WordPress, Wix, Squarespace, GoDaddy) have one. Then run it through the Google Rich Results Test, which we link to, to confirm it works.',
  },
  {
    q: 'Which type should I choose: care home, nursing home or home care agency?',
    a: 'Choose the one that matches how you are registered with CQC. Care home for residential care in your building, nursing home if you have registered nurses on site around the clock, and home care agency if your carers visit people in their own homes. The tool tailors the services list, the address handling and the areas-served fields to each one.',
  },
  {
    q: 'Where exactly do I paste the code?',
    a: 'Paste the full script tag into the head section of your homepage. In WordPress you can use a header-and-footer plugin or your theme’s custom code area; in Wix, Squarespace and GoDaddy look for the custom-code or header settings. Put it on your homepage at minimum. If you would rather not touch code, that is exactly the kind of thing we handle when we build or look after a care website.',
  },
]

const POINTS = [
  'Built for care homes, nursing homes and home care',
  'Your CQC rating added the correct, compliant way',
  'Services, address, areas served and opening hours',
  'Copy, paste, and validate in one click. Free',
]

export default function CareSchemaGeneratorPage() {
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
            name: 'Care Sector Schema Generator',
            url: `${SITE_URL}/tools/care-schema-generator`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'Free schema.org JSON-LD generator for care homes, nursing homes and home care agencies, with CQC rating added correctly as an award.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
            provider: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
          }),
        }}
      />

      <section className="relative overflow-x-clip px-6 pb-10 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute right-8 top-16 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-3xl text-center">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-5 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
              <Code2 className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
            Care Sector Schema Generator
          </h1>
          <div className="mt-5 flex justify-center">
            <Squiggle className="h-6 w-56 text-brand-pop" />
          </div>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
            Generate the structured data (JSON-LD) that tells Google exactly what your care service is, built for care homes,
            nursing homes and home care agencies. Copy, paste, done. And your CQC rating is added the correct way, as an
            award, never as fake review stars.
          </p>
          <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2.5">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm font-medium text-brand-ink">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop/10">
                  <Check className="h-3 w-3 text-brand-pop" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <ToolTracker tool="care-schema-generator">
            <CareSchemaGenerator />
          </ToolTracker>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the care schema generator
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Structured data, also called schema markup or JSON-LD, is the behind-the-scenes code that tells search engines
              precisely what your business is: your name, phone number, address, opening hours, the services you offer, the
              area you cover and your CQC rating. It is what powers the rich results families see, your map pin, your contact
              details and the trust signals that make someone pick up the phone. Most care websites either have none of it or
              have it done badly, which means Google is left guessing about the single most important choice a family will make.
            </p>
            <p>
              This free generator is built specifically for the care sector. Pick whether you are a care home, a nursing home
              or a home care agency, fill in your details, and it writes clean, valid JSON-LD you can paste straight into your
              website. The one thing generic tools get dangerously wrong is the CQC rating. It is a regulatory rating, not a
              set of customer reviews, so we add it as an official award and a labelled property, never as star-rating schema.
              That keeps you honest, keeps you compliant with Google’s guidelines, and protects you from a manual action that
              could wipe out your search visibility overnight.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Schema for care providers, explained
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
            Rather have it done properly?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We build care websites with all the right schema baked in, so families and Google both see your rating, fees and
            services exactly as they should.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get a website that gets this right
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
