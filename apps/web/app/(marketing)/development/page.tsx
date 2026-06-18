import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check, Code2, Sparkles, LayoutDashboard, Plug, Workflow, Smartphone } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Custom Software Development for Care | TRG Digital',
  description:
    'TRG Digital designs, builds and runs custom software for the UK care sector, the same capability behind our own products, CareStream and CareAssura.',
  alternates: { canonical: `${SITE_URL}/development` },
  robots: { index: true, follow: true },
}

const PRODUCTS = [
  {
    name: 'CareStreamAI',
    logo: '/products/carestream-logo.png', logoW: 700, logoH: 210, logoClass: 'h-12',
    tagline: 'Policies, training and CQC tools, in every language',
    body:
      "CareStream gives every member of a care team instant, cited answers from their own policies, training, audits and CQC tools, around the clock and in over 60 languages. Every answer is grounded in the provider's own documents, never the open internet, so staff always act on the right guidance.",
    features: [
      'Multilingual policy access for overseas and night-shift staff',
      'AI training modules built from your own policies, with renewal tracking',
      'CQC readiness evidence that builds itself from everyday use',
      'Audits, staff handbook and CQC report chat in one hub',
    ],
    href: 'https://carestreamai.com',
    cta: 'Visit CareStream',
  },
  {
    name: 'CareAssura',
    logo: '/products/careassura-logo.webp', logoW: 364, logoH: 91, logoClass: 'h-12',
    tagline: 'Helping families find the right care home',
    body:
      'CareAssura is a UK care home directory built for families. It brings together detailed listings, honest guidance and simple comparison tools, so people can make confident, informed decisions about care for someone they love.',
    features: [
      'Nationwide directory of UK care homes',
      'Clear guidance on care types, funding and what to ask',
      'Tools to shortlist and compare homes with confidence',
      'Built to connect families with the right providers',
    ],
    href: 'https://careassura.co.uk',
    cta: 'Visit CareAssura',
  },
]

const WHAT_WE_BUILD = [
  { Icon: Code2, title: 'Web platforms & portals', body: 'Bespoke applications and customer portals, built for your exact workflow.' },
  { Icon: Sparkles, title: 'AI assistants', body: 'Grounded, useful AI tools, the kind that power CareStream, built on your data.' },
  { Icon: LayoutDashboard, title: 'Dashboards & reporting', body: 'Turn scattered data into clear, real-time dashboards your team will actually use.' },
  { Icon: Plug, title: 'Integrations & APIs', body: 'Connect the tools you already run so everything talks to everything else.' },
  { Icon: Workflow, title: 'Workflow automation', body: 'Automate the repetitive admin that eats your team’s time, safely and reliably.' },
  { Icon: Smartphone, title: 'Mobile & web apps', body: 'Fast, installable apps that work beautifully on every device.' },
]

const POINTS = [
  'Bespoke platforms built around your workflow',
  'AI assistants & automation',
  'Integrations with your existing systems',
  'Secure, GDPR-compliant & robust',
  'Built to scale as you grow',
  'Designed, built & run by one team',
  'The same stack behind CareStream & CareAssura',
]

const STEPS = [
  { n: '01', title: 'Discover', body: 'We learn the problem, the users and the workflow, then scope the smallest thing that moves the needle.' },
  { n: '02', title: 'Design & build', body: 'Bespoke, on-brand and built on a fast, secure modern stack, shipped in iterations you can see.' },
  { n: '03', title: 'Launch & run', body: 'We host, monitor, support and keep improving it, so it stays fast, secure and genuinely useful.' },
]

function BrowserMock({ src, alt, url, w, h }: { src: string; alt: string; url: string; w: number; h: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-brand-line bg-white shadow-card">
      <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 hidden truncate rounded bg-white px-2 py-0.5 text-[10px] text-brand-ink-muted sm:block">{url}</span>
      </div>
      <Image src={src} alt={alt} width={w} height={h} className="w-full" />
    </div>
  )
}

export default function DevelopmentPage() {
  return (
    <>
      {/* JSON-LD, Service */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Custom Software Development for Care',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Custom software, AI tools and platforms for the UK care sector.',
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Custom software</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              We don&apos;t just advise, we <span className="text-brand-pop">ship</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              We design, build and run custom software for the care sector. The proof? Two of our own products are
              live and used across the UK today, and we&apos;ll build the same way for you.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Start your project
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="#products" className="btn-cta-outline">
                See our products
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-8">
              <Image src="/products/carestream-logo.png" alt="CareStreamAI" width={700} height={210} className="h-10 w-auto sm:h-12" />
              <Image src="/products/careassura-logo.webp" alt="CareAssura" width={364} height={91} className="h-10 w-auto sm:h-12" />
            </div>
          </div>

          {/* Layered product mockups */}
          <div className="relative pb-8 lg:pb-16">
            <div className="lg:mr-10">
              <BrowserMock src="/mockups/carestream.jpg" alt="The CareStream homepage" url="carestreamai.com" w={1320} h={940} />
            </div>
            <div className="ml-auto mt-[-2.5rem] w-[82%] lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[72%]">
              <BrowserMock src="/mockups/careassura.jpg" alt="The CareAssura homepage" url="careassura.co.uk" w={1320} h={895} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Rich two-column ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Software built for care, not bolted on
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Off-the-shelf doesn&apos;t fit care. We build what does.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                When the tools you can buy don&apos;t fit the way care actually works, generic software just adds
                friction. We build bespoke platforms, AI assistants and automations around your real workflow, the
                same capability behind our own products,{' '}
                <a href="https://carestreamai.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-pop underline-offset-2 hover:underline">CareStream</a>{' '}
                and{' '}
                <a href="https://careassura.co.uk" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-pop underline-offset-2 hover:underline">CareAssura</a>.
              </p>
              <p>
                Because we design, build and run it ourselves, nothing falls between agencies. We integrate with the
                systems you already use, keep everything secure and compliant, and plug your software straight into
                your{' '}
                <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">website</Link>{' '}
                and{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">marketing</Link>{' '}
                so the whole picture works together.
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
                Have a product in mind?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Submit a project enquiry
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What we build ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What we build</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              From idea to live software
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_BUILD.map(({ Icon, title, body }) => (
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

      {/* ── Our own products ──────────────────────────────────────────── */}
      <section id="products" className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Proof we ship</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Our own products, live across care
            </h2>
          </div>
          <div className="space-y-8">
            {PRODUCTS.map(({ name, logo, logoW, logoH, logoClass, tagline, body, features, href, cta }) => (
              <div key={name} className="overflow-hidden rounded-3xl border border-brand-line bg-white shadow-soft">
                <div className="grid gap-0 md:grid-cols-2">
                  <div className="p-8 sm:p-10">
                    <Image src={logo} alt={name} width={logoW} height={logoH} className={`${logoClass} w-auto`} />
                    <p className="mt-5 text-sm font-semibold text-brand-pop">{tagline}</p>
                    <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{body}</p>
                    <a href={href} target="_blank" rel="noopener noreferrer" className="btn-pop mt-7">
                      {cta} <ArrowUpRight className="btn-arrow h-4 w-4" />
                    </a>
                  </div>
                  <div className="border-t border-brand-line bg-brand-ink p-8 text-white sm:p-10 md:border-l md:border-t-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">What it does</p>
                    <ul className="mt-4 space-y-3">
                      {features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                            <Check className="h-3.5 w-3.5 text-white" />
                          </span>
                          <span className="text-sm leading-relaxed text-white/85">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we work</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              From first call to live software
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

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Star className="absolute bottom-8 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Have a product in mind?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Tell us what you&apos;re trying to solve and we&apos;ll help you shape it, from a single tool to a full
            platform.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/website-development" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See website build →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
