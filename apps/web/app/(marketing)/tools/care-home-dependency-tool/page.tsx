import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { ClipboardList, Check } from 'lucide-react'
import { DependencyTool } from '@/components/marketing/DependencyTool'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/care-home-dependency-tool', META)
}

const META: Metadata = {
  title: 'Care Home Dependency Tool | Measure Resident Dependency & Care Hours',
  description:
    'Free care home dependency tool. Assess your residents across six care domains, see the dependency mix of your home and the care hours it requires, to support safe-staffing planning.',
  alternates: { canonical: `${SITE_URL}/tools/care-home-dependency-tool` },
  robots: { index: true, follow: true },
}

const POINTS = [
  'Assess residents across six care domains',
  'See your home’s dependency mix instantly',
  'Get the care hours per day and per week',
  'Feeds straight into our staffing calculator',
]

const FAQS = [
  { q: 'What is a care home dependency tool?', a: 'A dependency tool measures how much support your residents need and converts that into the care hours your home requires. It gives managers an evidence base for safe-staffing decisions, alongside professional judgement.' },
  { q: 'How does this tool work out dependency?', a: 'Each resident profile is rated across six care domains, mobility, washing and dressing, continence, eating and nutrition, cognition and behaviour, and night-time needs. The combined score places them in a dependency band (self-caring, low, medium or high), each with an indicative number of care hours per day.' },
  { q: 'How many care hours does each dependency level need?', a: 'As an indicative guide we use one hour per day for self-caring residents, two for low, three for medium and four for high dependency. You should always adjust for your own home, care model and professional judgement.' },
  { q: 'Is this a compliant staffing assessment?', a: 'No. It is a free planning guide, not a substitute for a full, evidence-based dependency assessment or professional judgement. CQC expects providers to use a recognised tool and a multi-professional approach to determine safe staffing.' },
]

export default function DependencyToolPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      }) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Care Home Dependency Tool',
        url: `${SITE_URL}/tools/care-home-dependency-tool`, applicationCategory: 'BusinessApplication', operatingSystem: 'Web',
        description: 'Free tool that assesses care home resident dependency and the care hours required.',
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
                <ClipboardList className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                Care home dependency tool
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Measure how dependent your residents are across six care domains, see the dependency mix of your
                home and the care hours it really needs, the foundation of a safe-staffing case.
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

            <ToolTracker tool="care-home-dependency-tool"><DependencyTool /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the care home dependency tool
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Getting staffing right starts with understanding how dependent your residents are. A dependency tool
              turns that need into numbers, how many care hours your home requires each day and week, so you can
              plan rotas, evidence safe staffing and have a credible conversation with commissioners and inspectors.
              Our free tool makes that assessment quick: rate each type of resident across six everyday care domains,
              tell us how many match, and see your home’s dependency mix and total care hours build up instantly.
            </p>
            <p>
              It is deliberately simple and transparent, the care-hours figures are shown so you can see and adjust
              the logic, and it works alongside your own professional judgement rather than replacing it. Once you
              have your care hours, our staffing calculator turns them into the number of care staff, seniors and
              nurses you need per shift. Care home, nursing home and specialist providers use both to plan
              confidently and keep agency reliance down.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Dependency, explained
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
            From dependency to safe staffing
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Turn your care hours into the staff you need per shift, and see where technology can lighten the load.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/tools/staffing-calculator" className="btn-cta">
              Try the staffing calculator
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
