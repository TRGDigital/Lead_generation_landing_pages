import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { Check, ArrowRight, ShieldCheck, Users, Target } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import { Faqs, FaqJsonLd } from '@/components/marketing/county/CountySections'
import national from '@/lib/data/national-snapshot.json'
import { FAMILY_TOOLS } from '@/lib/family-tools'
import { TOOLS } from '@/lib/tools'
import { EnquiryButton } from '@/components/marketing/EnquiryOverlay'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/about', META)
}

const META: Metadata = {
  title: 'About TRG Digital | A Specialist Care-Sector Agency',
  description:
    'TRG Digital is a digital agency built only for the UK care sector. We grow enquiries, build websites and develop custom software, including our own products CareStream and CareAssura.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About TRG Digital',
    description: 'A specialist digital agency for the UK care sector.',
    type: 'website',
    url: `${SITE_URL}/about`,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

const VALUE_BADGES = [
  'Care is the only sector we work in',
  'We build & ship our own software',
  'Marketing, websites & software, one team',
  'Measured on enquiries, not vanity metrics',
  'CareStream & CareAssura, live across care',
]

const fmt = (n: number) => n.toLocaleString('en-GB')
const NATIONAL = national as unknown as { services: number; noWebsite: number; areas: unknown[] }
const NO_SITE_PCT = Math.round((NATIONAL.noWebsite / NATIONAL.services) * 100)

// Tools we have built: the family tools that go on care providers' sites, plus the free
// tools for care teams on ours. Counted from the two lists so it never goes stale, and a
// tool in both (the funding calculator) is counted once.
const TOOL_COUNT = new Set([...FAMILY_TOOLS.map((t) => t.name), ...TOOLS.map((t) => t.title)].map((n) => n.toLowerCase())).size

// The hero card. Every line is checkable, which is the point: no stock photo, no logos of
// other companies' tools, just what makes this agency different.
const FACTS = [
  { n: '20+', l: 'years in digital: websites, search and marketing' },
  { n: '10', l: 'years in care, as a digital consultant across multiple care settings' },
  { n: fmt(NATIONAL.services), l: 'CQC registered services in our own data' },
  { n: String(TOOL_COUNT), l: 'care tools built, for families on care websites and for care teams' },
  { n: '2', l: 'products of our own, live in care: CareStream and CareAssura' },
]

// No dates on purpose: the order is true, and a year we cannot stand behind is worse
// than none.
const STORY = [
  {
    title: 'Ten years inside care',
    body: 'Len spent a decade as a digital consultant across multiple care settings, close enough to see how families actually choose care, what CQC expects, and where the websites let everyone down.',
  },
  {
    title: 'The first sites and tools',
    body: 'The first websites, funding calculators and enquiry forms were built for two care services in West Sussex, Crossways Residential Care Home in Lindfield and Ferndale Nursing Home in Crawley, and tested on real families.',
  },
  {
    title: 'Mapping every service',
    body: `CareAssura came next: a directory of every CQC registered service in England, ${fmt(NATIONAL.services)} of them. It is how we know the market in numbers rather than by guesswork.`,
  },
  {
    title: 'Tools for care teams',
    body: 'CareStream followed, a policy, training and CQC platform for the people running care services, built from the same inside view.',
  },
  {
    title: 'Care providers anywhere',
    body: 'Today TRG Digital works with care providers across England. Everything we do is online, and care is still the only sector we work in.',
  },
]

const FAQS: [string, string][] = [
  [
    'Do you only work with care providers?',
    'Yes. Care homes, nursing homes, home care, live in care, supported living and retirement living. Nothing else, which is why we already know your families, your regulator and your funding routes before the first call.',
  ],
  [
    'Do you work with providers outside the south east?',
    'Yes. Everything we do is online, and we work with care providers across England. What matters is that we understand care, not that we share a postcode.',
  ],
  [
    'Who will we actually work with?',
    'Len and the in-house team who build everything. No account managers passing you along, and no outsourcing your project to a stranger.',
  ],
  [
    'What are CareStream and CareAssura?',
    'Our own products. CareStream is a policy, training and CQC platform for care teams. CareAssura is a directory of every CQC registered service in England that helps families find care. Building them keeps us close to the problems our clients deal with every day.',
  ],
  [
    'How do we get started?',
    'Most people start with a free audit of their current website, or a short call about what they are trying to grow. Either way you get an honest view, whether or not we end up working together.',
  ],
]

const OPERATE = [
  { Icon: ShieldCheck, title: 'Sector specialists', body: 'Care is all we do. We know CQC, care types, funding routes and the families behind every enquiry.' },
  { Icon: Target, title: 'Outcome-focused', body: 'We measure success the way you do: more enquiries, more residents and more value from every visitor.' },
  { Icon: Users, title: 'End-to-end partner', body: 'Marketing, websites and software from one team, so nothing falls between agencies and everything works together.' },
]

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs trail={[['About us', '/about']]} />
      {/* JSON-LD, AboutPage */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'AboutPage',
                '@id': `${SITE_URL}/about#webpage`,
                name: 'About TRG Digital',
                url: `${SITE_URL}/about`,
                description: 'A specialist digital agency for the UK care sector.',
                isPartOf: { '@id': `${SITE_URL}/#website` },
                about: { '@id': `${SITE_URL}/#organization` },
                mainEntity: { '@id': `${SITE_URL}/#organization` },
                publisher: { '@id': `${SITE_URL}/#organization` },
              },
              {
                '@type': 'Person',
                '@id': `${SITE_URL}/#len-burgess`,
                name: 'Len Burgess',
                jobTitle: 'Founder',
                description:
                  'Founder of TRG Digital, with more than 20 years in digital and 10 years in the care sector as a digital consultant across multiple care settings.',
                knowsAbout: ['Website development', 'Search engine optimisation', 'Digital marketing', 'UK care sector'],
                worksFor: { '@id': `${SITE_URL}/#organization` },
                sameAs: ['https://www.linkedin.com/in/len-burgess-262b0833'],
              },
            ],
          }),
        }}
      />

      <FaqJsonLd faqs={FAQS} />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">About us</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              A digital agency that grew <span className="text-brand-pop">out of care</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-brand-ink-soft">
              <p>
                TRG Digital was started by someone with more than twenty years in digital, ten of them spent inside
                care as a digital consultant across multiple care settings.
              </p>
              <p>
                We build websites, marketing and software for care providers, and nothing else. That is the whole
                idea.
              </p>
            </div>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <EnquiryButton className="btn-pop">
                Work with us
                <span className="btn-arrow" aria-hidden>→</span>
              </EnquiryButton>
              <Link href="#story" className="btn-cta-outline">
                Our story
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['Care only', 'Built in-house', 'Measured on enquiries'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border-2 border-brand-ink bg-white p-6 shadow-[6px_6px_0_0_#2a2620] sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">TRG Digital, in short</p>
            <div className="mt-2 divide-y divide-brand-line">
              {FACTS.map((f) => (
                <div key={f.l} className="flex items-center gap-5 py-4">
                  <span className="w-28 flex-shrink-0 font-display text-4xl font-bold tabular-nums text-brand-pop">{f.n}</span>
                  <span className="text-sm leading-snug text-brand-ink-soft">{f.l}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 rounded-xl bg-brand-ink px-4 py-3 font-display text-sm font-bold uppercase tracking-wide text-white">
              Only care. <span className="text-brand-accent">Nothing else.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── Why we exist (rich two-column) ────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Why we exist
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Built for care, not adapted to it.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                Most agencies treat care like any other industry. We do the opposite. Everything we build, market
                and develop is for the UK care sector, so we already understand your families, your regulators,
                your funding routes and the way people choose care. That focus changes the work, our{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">campaigns</Link>{' '}
                speak to real families, our{' '}
                <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">websites</Link>{' '}
                are built around the questions people actually ask, and our software solves problems we&apos;ve seen
                on the ground in care.
              </p>
              <p>
                And we don&apos;t just advise, we ship. Two of our own products are live and used across the sector
                today:{' '}
                <a href="https://carestreamai.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-pop underline-offset-2 hover:underline">CareStream</a>, an AI
                policy, training and CQC platform for care teams, and{' '}
                <a href="https://careassura.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-pop underline-offset-2 hover:underline">CareAssura</a>, a care
                home directory that helps families find the right care. Building our own{' '}
                <Link href="/development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">software</Link>{' '}
                keeps us close to the problems our clients face every day.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {VALUE_BADGES.map((b) => (
              <div key={b} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{b}</span>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-accent p-7">
              <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink">
                Want to grow with a specialist?
              </p>
              <EnquiryButton className="btn-pop mt-5">
                Start your project
                <span className="btn-arrow" aria-hidden>→</span>
              </EnquiryButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our story ─────────────────────────────────────────────────── */}
      <section id="story" className="relative scroll-mt-24 overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-14 w-14 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Our story</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
            From inside care to care providers anywhere
          </h2>
          <ol className="mt-10 space-y-0">
            {STORY.map((step, i) => (
              <li key={step.title} className="relative flex gap-6 pb-10 last:pb-0">
                {i < STORY.length - 1 && (
                  <span className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-brand-pop/25" aria-hidden />
                )}
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop font-display text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-brand-ink">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-brand-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── What we know ──────────────────────────────────────────────── */}
      <section className="bg-brand-ink px-6 py-20 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">What we know that others do not</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
              The whole care market, counted
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/75">
              Most agencies guess at the market. Because we run CareAssura, we can count it: every CQC registered
              service in England, what it offers, how it is rated, and whether a family can find a website for it.
              It is how we decide where a provider is hardest to find, and what to fix first.
            </p>
            <Link href="/research" className="btn-cta btn-on-dark mt-7">
              See the research
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { n: fmt(NATIONAL.services), l: 'CQC registered services in England' },
              { n: `${NO_SITE_PCT}%`, l: 'have no website a family can find' },
              { n: String(NATIONAL.areas.length), l: 'local authority areas mapped' },
            ].map((x) => (
              <div key={x.l} className="rounded-2xl border border-white/15 p-5">
                <p className="font-display text-4xl font-bold text-brand-accent">{x.n}</p>
                <p className="mt-2 text-sm leading-snug text-white/70">{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The founder ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Squiggle className="absolute left-1/3 top-10 hidden h-7 w-44 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-[auto_1fr]">
            <div className="relative mx-auto w-56 sm:w-64">
              <span className="absolute -inset-3 rounded-full border-2 border-dashed border-brand-pop/40" aria-hidden />
              <ManagedImage
                src="/team/len-burgess.png"
                alt="Len Burgess, founder of TRG Digital"
                width={300}
                height={300}
                className="w-full rounded-full"
              />
              <ManagedImage
                src="/signature/len-signature.png"
                alt="Len Burgess’s signature"
                width={304}
                height={68}
                className="mx-auto mt-5 h-9 w-auto"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Who you&apos;ll be working with</p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
                Len Burgess, founder
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-brand-ink-soft">
                <p>
                  Len has worked in digital for more than 20 years, across websites, SEO and digital marketing,
                  and spent 10 of them in the care sector as a digital consultant across multiple care settings. He
                  works data-first: read the numbers, apply best practice, test, and repeat until it ranks. TRG
                  Digital is that discipline pointed at one sector, care.
                </p>
                <p>
                  The agency grew out of the care sector itself. Its first websites, tools and campaigns were
                  built for Crossways Residential Care Home in Lindfield and Ferndale Nursing Home in Crawley,
                  and that inside view, of CQC, funding routes, staffing pressures and the families behind every
                  enquiry, still shapes everything we ship. The same team went on to build{' '}
                  <a href="https://carestreamai.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-pop underline-offset-2 hover:underline">CareStream</a>{' '}
                  and{' '}
                  <a href="https://careassura.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-pop underline-offset-2 hover:underline">CareAssura</a>,
                  both live across the sector today.
                </p>
                <p>
                  When you work with TRG you work with Len and the team who build everything in-house, no
                  account managers, no outsourcing, no hand-offs.
                </p>
              </div>
              <a
                href="https://www.linkedin.com/in/len-burgess-262b0833/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-brand-ink px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-brand-ink transition-colors hover:bg-brand-ink hover:text-white"
              >
                Connect on LinkedIn
                <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we do (services) ─────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What we do</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Everything you need to win more enquiries
            </h2>
            <p className="mt-4 leading-relaxed text-brand-ink-soft">
              From a new website to the campaigns that fill it and the software that sets you apart, all under one
              roof, all built for care.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, title, short, href }) => (
              <Link
                key={title}
                href={href}
                className="group flex items-center gap-3 rounded-xl border border-brand-line bg-white p-4 transition-colors hover:border-brand-pop/40"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop transition-colors group-hover:bg-brand-pop group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold uppercase tracking-wide text-brand-ink">{title}</span>
                  <span className="block text-xs text-brand-ink-soft">{short}</span>
                </span>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-brand-pop transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we operate ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we operate</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              A partner, not a vendor
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {OPERATE.map(({ Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border border-brand-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 transition-colors group-hover:bg-brand-pop">
                  <Icon className="h-6 w-6 text-brand-pop transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Faqs heading="Questions people ask before working with us" faqs={FAQS} />

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Star className="absolute bottom-8 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Interested in working with us?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Whether you&apos;re a single home, a care group, or a potential partner, we&apos;d love to hear what
            you&apos;re trying to grow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get in touch
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/marketing" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See what we do →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
