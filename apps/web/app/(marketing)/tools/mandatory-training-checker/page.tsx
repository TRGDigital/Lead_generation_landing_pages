import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { GraduationCap, Check } from 'lucide-react'
import { TrainingComplianceTool } from '@/components/marketing/TrainingComplianceTool'
import { CareCertificateDemo } from '@/components/marketing/CareCertificateDemo'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/mandatory-training-checker', META)
}

const META: Metadata = {
  title: 'Mandatory Training Compliance Checker | Are Your Care Staff Up To Date?',
  description:
    'Free mandatory training compliance checker for care homes. Enter your staff numbers and how many are up to date on each mandatory topic to see your overall compliance and outstanding training records.',
  alternates: { canonical: `${SITE_URL}/tools/mandatory-training-checker` },
  robots: { index: true, follow: true },
}

const POINTS = [
  'Check compliance across ten mandatory topics',
  'See your overall compliance percentage instantly',
  'Spot which training records are outstanding',
  'Flag any topic below 90% at a glance',
]

const FAQS = [
  { q: 'What training is mandatory in a care home?', a: 'Core mandatory training typically covers safeguarding adults, moving and handling, infection prevention and control, fire safety, basic life support and first aid, the Mental Capacity Act and DoLS, medication, food hygiene, health and safety, and equality and diversity. The exact list depends on your service, the roles you employ and the needs of the people you support, and should map to the Care Certificate and any commissioner requirements.' },
  { q: 'How often must staff refresh mandatory training?', a: 'Refresh periods vary by topic. Many are refreshed annually (for example fire safety, moving and handling, safeguarding and basic life support), while others may run on a longer cycle. Follow your own training matrix, provider policy and any local or national guidance, and always refresh sooner if practice, roles or risks change.' },
  { q: 'What does CQC expect on training?', a: 'CQC expects providers to make sure staff have the skills, competence and up-to-date training to carry out their roles safely, and to be able to evidence this. Inspectors look for a training matrix or system that shows completion and refresher dates, competency checks, and clear action where training is outstanding. This tool is an indicative guide; check your own training matrix and CQC requirements.' },
]

export default function MandatoryTrainingCheckerPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Mandatory Training Compliance Checker',
        url: `${SITE_URL}/tools/mandatory-training-checker`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: 'Free tool that checks how up to date care staff are on mandatory training and highlights outstanding records.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        provider: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
      }) }} />

      <section className="relative px-6 pb-16 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-10 right-8 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-6xl">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-4 grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24 lg:self-start lg:pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                <GraduationCap className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Mandatory training compliance checker
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Are your staff up to date on mandatory training? Enter your headcount and how many are up to date on
                each topic to see your overall compliance and exactly which records are outstanding.
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

            <ToolTracker tool="mandatory-training-checker"><TrainingComplianceTool /></ToolTracker>
          </div>
        </div>
      </section>

      {/* See the training in action — CareStream Care Certificate demo lesson */}
      <section className="relative px-6 py-20">
        <Dots className="absolute left-8 top-12 hidden h-16 w-16 text-brand-pop/25 lg:block" />
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
          <div className="lg:sticky lg:top-24 lg:self-start lg:pt-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Close the gaps</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Found gaps? See how the training actually works
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-brand-ink-soft">
              CareStream turns your policies into role-based training your staff will actually finish, mapped to the
              Care Certificate and mandatory topics, with tracking and evidence built in. Here’s a real lesson to try.
            </p>
            <ul className="mt-6 space-y-2.5">
              {['All 15 Care Certificate standards', 'Available in 60+ languages', 'Adaptive follow-ups for wrong answers', 'Certificates + a live compliance dashboard'].map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-brand-ink">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop/10"><Check className="h-3 w-3 text-brand-pop" /></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <CareCertificateDemo />
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the mandatory training compliance checker
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Keeping every member of staff up to date on mandatory training is one of the hardest things to stay on
              top of, and one of the first things CQC asks to see. This free checker gives you a quick read on where
              you stand: set your care-staff headcount, tell us how many are up to date on each of the ten core
              mandatory topics, and see your overall compliance percentage and the number of outstanding training
              records build up instantly.
            </p>
            <p>
              The detailed report breaks compliance down topic by topic and flags anything below 90%, so you can see
              at a glance where to focus your bookings and refreshers. It is an indicative guide to support planning
              and professional judgement, not a substitute for your own training matrix; always check your own records
              and CQC requirements. When you are ready to make this effortless, CareStream tracks completions, sends
              refresher reminders and delivers the training itself.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Mandatory training, explained
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
            From gaps to fully compliant
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            See how CareStream tracks completions, chases refreshers and delivers mandatory training, so your matrix
            stays green without the spreadsheet chase.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/book-a-demo" className="btn-cta">
              See CareStream training
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
