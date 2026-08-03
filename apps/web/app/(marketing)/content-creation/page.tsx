import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { PenLine, FileText, HelpCircle, MapPin, Repeat, BarChart3, Check } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/content-creation', META)
}

const META: Metadata = {
  title: 'Content Creation for Care Providers | Drive Organic Traffic | TRG Digital',
  description:
    'Ongoing, care-aware content creation for UK care homes, nursing homes and home care. Blogs, guides, FAQs and local content published regularly to grow your organic traffic and enquiries month after month.',
  alternates: { canonical: `${SITE_URL}/content-creation` },
  robots: { index: true, follow: true },
}

const WHAT_WE_DO = [
  { Icon: FileText, title: 'Articles & guides', body: 'In-depth, genuinely useful guides on the topics families research before choosing care.' },
  { Icon: HelpCircle, title: 'FAQs & answers', body: 'Content built around the real questions families type into Google, the kind that wins featured snippets.' },
  { Icon: MapPin, title: 'Local content', body: 'Area and care-type content that helps you rank for the searches happening in your catchment.' },
  { Icon: PenLine, title: 'Care-aware writing', body: 'Warm, accurate, on-brand writing that reflects the quality of your care, never generic filler.' },
  { Icon: Repeat, title: 'A steady schedule', body: 'A consistent publishing rhythm, because Google rewards sites that stay active and useful.' },
  { Icon: BarChart3, title: 'Measured on results', body: 'We track which content earns traffic and enquiries, and double down on what works.' },
]

const POINTS = [
  'A content plan built around real searches',
  'Regular blogs, guides and FAQs',
  'Local and care-type content',
  'Warm, accurate, on-brand writing',
  'Optimised to rank and convert',
  'Reporting on traffic and enquiries',
]

const STEPS = [
  { n: '01', title: 'Plan', body: 'We research what families search for and build a content plan around the topics that bring enquiries.' },
  { n: '02', title: 'Create', body: 'We write and publish care-aware content on a steady schedule, optimised to rank and read beautifully.' },
  { n: '03', title: 'Compound', body: 'Each piece keeps working for years, building authority and a growing stream of organic traffic.' },
]

export default function ContentCreationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Content Creation for Care Providers',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Ongoing, care-aware content creation for UK care providers to grow organic traffic and enquiries.',
          }),
        }}
      />

      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Content creation</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Content that <span className="text-brand-pop">earns</span> enquiries
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              Families research care long before they call. Ongoing, genuinely useful content answers their questions,
              earns Google&apos;s trust, and turns your website into a growing source of organic traffic and
              enquiries, month after month.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Get a content plan
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/seo" className="btn-cta-outline">
                See our SEO
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['Published regularly', 'Care-aware', 'Built to rank'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
              <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">yourhome.co.uk/blog</span>
              </div>
              <div className="p-6">
                <p className="text-[11px] font-medium text-brand-ink-muted">Latest articles</p>
                <div className="mt-3 space-y-3">
                  {['Choosing a care home: a family guide', 'Care home fees explained', 'Questions to ask on a care home visit'].map((t, i) => (
                    <div key={t} className="rounded-xl border border-brand-line p-3">
                      <p className="text-sm font-semibold text-brand-ink">{t}</p>
                      <p className="mt-1 text-[11px] text-brand-ink-muted">{['1,240', '880', '640'][i]} reads · ranking page one</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[11px] font-semibold text-green-700">Organic traffic ↑ month on month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              The traffic that keeps growing while you sleep
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Publish once, get found for years.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                One-off websites go stale. Google rewards sites that keep publishing useful, relevant content, and
                families trust providers who clearly understand their worries. Ongoing content does both: it answers
                real questions, builds your authority, and earns rankings for searches you could never afford to pay
                for.
              </p>
              <p>
                We plan and write content around what families actually search for, published on a steady schedule
                and woven into your{' '}
                <Link href="/seo" className="font-semibold text-brand-pop underline-offset-2 hover:underline">SEO</Link>{' '}
                strategy. Every piece keeps working long after it goes live, compounding into a reliable, growing
                source of enquiries.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {POINTS.map((point) => (
              <div key={point} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{point}</span>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-accent p-7">
              <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink">
                Ready to turn your blog into a lead engine?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Get a content plan
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What we create</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Content built for care, and for Google
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_DO.map(({ Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border border-brand-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 transition-colors group-hover:bg-brand-pop">
                  <Icon className="h-6 w-6 text-brand-pop transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we work</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              A plan, a rhythm, and results
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map(({ n, title, body }) => (
              <div key={n} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                <p className="font-display text-5xl font-bold text-brand-pop">{n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Let&apos;s build content that brings enquiries
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Tell us about your home and we will put together a content plan built around the families you want to
            reach.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get a content plan
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/seo" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See our SEO →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
