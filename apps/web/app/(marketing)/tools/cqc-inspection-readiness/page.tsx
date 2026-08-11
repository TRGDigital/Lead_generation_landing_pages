import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { ShieldCheck, Check } from 'lucide-react'
import { CqcReadinessTool } from '@/components/marketing/CqcReadinessTool'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/cqc-inspection-readiness', META)
}

const META: Metadata = {
  title: 'CQC Inspection Readiness Self-Assessment | Free Care Home Tool',
  description:
    'Free CQC inspection readiness self-assessment. Rate your care home across the five CQC key questions, Safe, Effective, Caring, Responsive and Well-led, and see how ready you are for your next inspection.',
  alternates: { canonical: `${SITE_URL}/tools/cqc-inspection-readiness` },
  robots: { index: true, follow: true },
}

const POINTS = [
  'Rate all five CQC key questions in minutes',
  'Get an instant readiness band and score',
  'See exactly which areas to address first',
  'Turn the result into a clear action plan',
]

const FAQS = [
  { q: 'What does CQC look at in an inspection?', a: 'The Care Quality Commission assesses services against five key questions, whether they are Safe, Effective, Caring, Responsive and Well-led. Each is now underpinned by a set of quality statements that describe what good looks like, and inspectors gather evidence against them to reach a rating.' },
  { q: 'How do I prepare for a CQC inspection?', a: 'Know your service against the five key questions, keep your evidence, audits and care records current, and be able to tell a clear story about how you keep people safe and improve. Rehearse how staff, residents and families would answer, close any gaps you find early, and make sure your governance and action plans are visible and dated.' },
  { q: 'Is this an official CQC assessment?', a: 'No. This is an indicative self-check, not an official CQC assessment. It helps you focus your own preparation across the five key questions, but only the Care Quality Commission can inspect and rate your service.' },
]

export default function CqcReadinessPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'CQC Inspection Readiness Self-Assessment',
        url: `${SITE_URL}/tools/cqc-inspection-readiness`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: 'Free self-assessment that scores how ready a care home is for its next CQC inspection across the five key questions.',
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
                <ShieldCheck className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                CQC inspection readiness self-assessment
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                How ready are you for your next CQC inspection? Rate your home across the five CQC key questions
                and get an honest readiness score, plus the areas to focus on first.
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

            <ToolTracker tool="cqc-inspection-readiness"><CqcReadinessTool /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the CQC inspection readiness self-assessment
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              A CQC inspection can come at short notice, so the best-prepared homes treat readiness as an everyday
              habit, not a last-minute scramble. This free self-assessment gives you a quick, honest read on where
              you stand. Rate your home across the five CQC key questions, Safe, Effective, Caring, Responsive and
              Well-led, and see your readiness band and score build up instantly, along with the specific areas that
              need attention before an inspector walks through the door.
            </p>
            <p>
              It is deliberately simple and transparent, and it is an indicative self-check, not an official CQC
              assessment. Use it to focus your preparation, prompt a management conversation and shape a dated action
              plan, alongside your own evidence, audits and professional judgement. Care home, nursing home and
              specialist providers use it as a regular pulse-check between inspections to keep quality and governance
              on track.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            CQC readiness, explained
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
            Stay inspection-ready all year round
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            See how CareStream keeps your evidence, training and governance in one place, so you are ready whenever CQC arrives.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/book-a-demo" className="btn-cta">
              See CareStream in action
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
