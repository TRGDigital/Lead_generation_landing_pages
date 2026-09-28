import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { Megaphone, Check } from 'lucide-react'
import { JobAdvertChecker } from '@/components/marketing/JobAdvertChecker'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/care-job-advert-checker', META)
}

const META: Metadata = {
  title: 'Care Job Advert Checker | Free Score for Carer Job Adverts',
  description:
    'Paste your care assistant, senior carer, nurse or home care job advert and get an instant free score out of 100, with plain-English fixes that help more carers apply.',
  alternates: { canonical: `${SITE_URL}/tools/care-job-advert-checker` },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'What makes a good care job advert?', a: 'Carers decide in seconds, usually on a phone. The adverts that get the most applications show a real hourly rate, the hours and shift pattern, where the job is, and the benefits carers value most, such as paid training, a paid DBS, mileage, guaranteed hours and weekly pay. They are written to "you", in plain English, with a short opening and an easy way to apply.' },
  { q: 'Should I put the pay rate in my care job advert?', a: 'Yes. Pay is the first thing carers look for, and "competitive salary" is widely read as "below average". Indeed and Google for Jobs also give more visibility to adverts that include pay. If the rate varies, give the range and what it depends on, for example "£12.60 to £13.40 per hour depending on shift".' },
  { q: 'Should I ask for an NVQ or diploma for a care assistant role?', a: 'For entry level roles it usually costs you applicants. Many excellent carers come from retail, hospitality or caring for a relative, and new starters complete the Care Certificate during induction. Saying "no experience needed, full paid training" widens your pool. Senior and nursing roles are different and can reasonably ask for qualifications or an NMC PIN.' },
  { q: 'How long should a care job advert be?', a: 'Around 150 to 600 words works well. Under about 100 words there is not enough to answer a carer\'s basic questions. Over about 700 words it becomes a wall of text on a phone screen. Keep the first paragraph under 60 words, because job sites only show the first few lines before "read more".' },
  { q: 'What does the AI rewrite do with my advert?', a: 'After your free score, you can ask for a rewritten version. We use AI to restructure your advert around what carers look for and suggest a job title for Indeed and Google for Jobs. It only uses facts from your original advert. Anything missing, such as the hourly rate, is marked like [add: hourly rate] for you to fill in, so nothing is made up.' },
]

const POINTS = [
  'Instant score out of 100, free, no sign-up',
  'Checks pay, shifts, benefits and location',
  'Spots jargon and barriers for new starters',
  'Optional rewrite with a job board ready title',
]

export default function CareJobAdvertCheckerPage() {
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
            name: 'Care Job Advert Checker',
            url: `${SITE_URL}/tools/care-job-advert-checker`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Free tool that scores care job adverts against what makes carers apply, with plain-English fixes and an optional AI rewrite.',
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
                <Megaphone className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Care Job Advert Checker
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Paste your care job advert and see how it looks to the carers you want to reach. You get a score out of 100
                and a clear list of what to change, so more of the right people apply.
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

            <ToolTracker tool="care-job-advert-checker"><JobAdvertChecker /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the care job advert checker
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Recruitment is the number one worry for most care managers. Often the advert itself is the problem: it hides the
              pay behind &quot;competitive salary&quot;, leaves out the shifts, asks for qualifications that entry level roles do
              not need, or reads like an HR form. Carers scrolling job sites on their phone simply move on to the next one.
            </p>
            <p>
              This checker reads your advert against the things that make carers apply: a real hourly rate, hours and shift
              pattern, location, driving needs for home care roles, the benefits carers value, plain English, sensible length,
              a clear way to apply, a sense of your team, a welcome for new starters, writing to &quot;you&quot; and a short
              opening that works on a phone. Each point shows what we found and why it matters.
            </p>
            <p>
              The score runs instantly in your browser. If you would like a rewritten version, leave your details and we will
              restructure your advert and suggest a job title for Indeed and Google for Jobs, using only the facts you gave us.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Care job adverts, explained
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
            Fill your rota with the right carers
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            A better advert is the first step. We build careers pages and local recruitment campaigns that bring
            carers to you directly, so you rely less on agencies and job boards.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/carer-recruitment" className="btn-cta">
              See carer recruitment
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
