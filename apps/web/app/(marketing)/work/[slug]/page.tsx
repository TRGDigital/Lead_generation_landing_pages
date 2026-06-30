import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, Globe2, Gauge, Search, MousePointerClick, Check } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { StartProject } from '@/components/marketing/StartProject'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import { CASE_STUDIES, getCaseStudy, otherCaseStudy } from '@/lib/case-studies'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

const APPROACH_ICONS = [Globe2, Gauge, Search, MousePointerClick]

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) return {}
  const META: Metadata = {
    title: `${cs.name} — Case Study | TRG Digital`,
    description: `How TRG Digital built a new website for ${cs.name} and used the CQC website grader, local SEO and PPC landing pages to turn online searches into enquiries and fill empty beds faster.`,
    alternates: { canonical: `${SITE_URL}/work/${cs.slug}` },
    robots: { index: true, follow: true },
  }
  return applyPageSeo(`/work/${cs.slug}`, META)
}

function BrowserMock({ src, alt, url }: { src: string; alt: string; url?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-card">
      <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-brand-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-brand-line" />
        {url && (
          <span className="ml-3 truncate rounded-md bg-white px-3 py-1 text-xs text-brand-ink-soft ring-1 ring-brand-line">
            {url}
          </span>
        )}
      </div>
      <ManagedImage src={src} alt={alt} width={1280} height={820} className="h-auto w-full" />
    </div>
  )
}

function PhoneMock({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto w-[210px] rounded-[2.2rem] border-[7px] border-brand-ink bg-brand-ink shadow-card">
      <div className="overflow-hidden rounded-[1.7rem] bg-white">
        <ManagedImage src={src} alt={alt} width={780} height={1688} className="h-auto w-full" />
      </div>
    </div>
  )
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cs = getCaseStudy(slug)
  if (!cs) notFound()
  const next = otherCaseStudy(cs.slug)

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${cs.name} — Case Study`,
            about: cs.name,
            author: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            publisher: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <Link
              href="/work"
              className="text-sm font-semibold uppercase tracking-widest text-brand-pop hover:text-brand-ink"
            >
              Case study
            </Link>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              {cs.title} <span className="text-brand-pop">{cs.titleAccent}</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">{cs.lede}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={cs.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-pop">
                Visit the live site
                <span className="btn-arrow" aria-hidden>→</span>
              </a>
              <Link href="/contact" className="btn-cta-outline">
                Start your project
              </Link>
            </div>
            <p className="mt-4 text-sm text-brand-ink-soft">
              {cs.type} · {cs.location}
            </p>
          </div>

          <div className="relative pb-8 lg:pb-0">
            <Dots className="absolute -right-6 -top-6 hidden h-20 w-20 text-brand-pop/40 lg:block" />
            <BrowserMock src={cs.mockup} alt={`The ${cs.name} website`} url={cs.liveLabel} />
          </div>
        </div>
      </section>

      {/* ── Facts strip ───────────────────────────────────────────────── */}
      <section className="border-y border-brand-line bg-brand-bg-warm px-6 py-8">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 lg:grid-cols-4">
          {cs.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-semibold uppercase tracking-wider text-brand-pop">{f.label}</dt>
              <dd className="mt-1 text-sm font-medium text-brand-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── 01 The brief ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-pop">01 — The brief</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Great care, not enough enquiries
            </h2>
          </div>
          <div>
            <div className="space-y-4 text-base leading-relaxed text-brand-ink-soft">
              {cs.briefParas.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <blockquote className="mt-8 border-l-4 border-brand-pop pl-5 font-display text-xl font-semibold leading-snug text-brand-ink">
              {cs.briefPull}
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── 02 The approach ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-pop">02 — Our approach</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              One enquiry engine, four moving parts
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{cs.approachIntro}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {cs.approach.map((step, i) => {
              const Icon = APPROACH_ICONS[i] ?? Globe2
              return (
                <div
                  key={step.title}
                  className="flex flex-col rounded-2xl border border-brand-line bg-white p-7 shadow-soft"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-sm font-semibold text-brand-pop/70">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-brand-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{step.body}</p>
                  <ul className="mt-4 space-y-2 border-t border-brand-line pt-4">
                    {step.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-sm text-brand-ink-soft">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Showcase: helpful tools ───────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-6 top-14 hidden h-12 w-12 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-pop">What we built · Tools</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Tools that turn questions into enquiries
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{cs.tools.intro}</p>
          </div>

          {/* Featured tool: desktop + mobile */}
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
            <BrowserMock src={cs.tools.featured.desktop} alt={`${cs.tools.featured.name} on desktop`} url={`${cs.liveLabel}`} />
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center lg:flex-col">
              <PhoneMock src={cs.tools.featured.mobile} alt={`${cs.tools.featured.name} on mobile`} />
              <div>
                <h3 className="font-display text-xl font-semibold text-brand-ink">{cs.tools.featured.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{cs.tools.featured.desc}</p>
              </div>
            </div>
          </div>

          {/* Other tools */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cs.tools.others.map((t) => (
              <div key={t.name} className="flex flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft">
                <ManagedImage src={t.image} alt={t.name} width={1280} height={820} className="h-auto w-full border-b border-brand-line" />
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold text-brand-ink">{t.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Showcase: local pages ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute left-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-pop">What we built · Local SEO</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              A page for every local search
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{cs.local.intro}</p>
          </div>

          <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
            {cs.local.items.map((item) => (
              <figure key={item.label}>
                <BrowserMock src={item.image} alt={item.label} />
                <figcaption className="mt-3 text-center text-sm font-medium text-brand-ink">{item.label}</figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-6 rounded-2xl border border-brand-line bg-white p-8 sm:flex-row sm:gap-10">
            <PhoneMock src={cs.local.mobile} alt="A local page on mobile" />
            <div>
              <h3 className="font-display text-xl font-semibold text-brand-ink">Built mobile-first</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-ink-soft">
                Most family searches happen on a phone. Every local page is fast and effortless to use on mobile, with the
                phone number and enquiry form always within reach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Showcase: blog ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-pop">What we built · Content</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              A blog that earns its rankings
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{cs.blog.intro}</p>
          </div>
          <BrowserMock src={cs.blog.image} alt={`The ${cs.shortName} blog`} url={`${cs.liveLabel}/blog`} />
        </div>
      </section>

      {/* ── Stats band ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-ink px-6 py-20 text-white">
        <Burst className="absolute -bottom-12 -left-10 h-52 w-52 text-brand-pop/30" />
        <Dots className="absolute right-1/4 top-10 hidden h-16 w-16 text-white/15 lg:block" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">By the numbers</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {cs.stats.map((s) => (
              <div
                key={s.label}
                className={`rounded-2xl p-7 ${s.placeholder ? 'border border-dashed border-white/25 bg-white/[0.03]' : 'bg-white/[0.06]'}`}
              >
                <p className="font-display text-5xl font-bold text-white">{s.value}</p>
                <p className="mt-2 font-semibold text-white">{s.label}</p>
                {s.note && <p className="mt-1 text-xs leading-relaxed text-white/55">{s.note}</p>}
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-white/45">{cs.statsNote}</p>
        </div>
      </section>

      {/* ── 03 The economics + targets ────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute left-6 top-14 hidden h-12 w-12 -rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-pop">03 — Why it pays</p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
                The cost of an empty bed
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{cs.economicsLede}</p>
              <ul className="mt-6 space-y-3">
                {cs.economicsPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-base text-brand-ink-soft">
                    <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                      <Check className="h-3.5 w-3.5 text-white" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-brand-ink p-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">What success looks like</p>
              <div className="mt-6 space-y-5">
                {cs.targets.map((t) => (
                  <div key={t.goal} className="border-b border-white/10 pb-5 last:border-0 last:pb-0">
                    <p className="font-display text-lg font-semibold text-white">{t.goal}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/65">{t.detail}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 rounded-xl bg-white/5 px-4 py-3 text-xs leading-relaxed text-white/55">
                Targets for the campaign. Live figures will be added here as the data comes in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Burst className="absolute -bottom-10 -left-10 h-52 w-52 text-brand-pop/20" />
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="font-display text-2xl font-semibold leading-snug text-brand-ink sm:text-3xl">
            “{cs.testimonialQuote}”
          </blockquote>
          <figcaption className="mt-6 text-sm text-brand-ink-soft">
            <span className="font-semibold text-brand-ink">{cs.testimonialName}</span> · {cs.testimonialRole}
          </figcaption>
        </figure>
      </section>

      {/* ── Next case study ───────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <Link
            href={`/work/${next.slug}`}
            className="group flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-line bg-white p-8 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-pop">Next case study</p>
              <p className="mt-1 font-display text-xl font-semibold text-brand-ink">{next.name}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-ink">
              Read case study <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </div>
      </section>

      <StartProject />
    </>
  )
}
