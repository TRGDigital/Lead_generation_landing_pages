import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check } from 'lucide-react'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Development | TRG Digital',
  description:
    'The software TRG Digital builds for the UK care sector. Meet CareStream, our AI policy, training and CQC platform, and CareAssura, our care home directory for families.',
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
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-12">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Development</p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">
              The software we build for{' '}
              <span className="italic text-brand-accent-soft">care.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              We do not just talk about custom development, we ship it. Two of our own products are
              live and used across the UK care sector today.
            </p>
            <div className="mt-8 flex items-center gap-8">
              <Image src="/products/carestream-logo.png" alt="CareStreamAI" width={700} height={210} className="h-12 w-auto sm:h-14" />
              <Image src="/products/careassura-logo.webp" alt="CareAssura" width={364} height={91} className="h-12 w-auto sm:h-14" />
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

      {/* ── Products ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-24 pt-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {PRODUCTS.map(({ name, logo, logoW, logoH, logoClass, tagline, body, features, href, cta }) => (
            <div
              key={name}
              className="overflow-hidden rounded-3xl border border-brand-line bg-white shadow-soft"
            >
              <div className="grid gap-0 md:grid-cols-2">
                {/* Left — narrative */}
                <div className="p-8 sm:p-10">
                  <Image src={logo} alt={name} width={logoW} height={logoH} className={`${logoClass} w-auto`} />
                  <p className="mt-5 text-sm font-medium text-brand-ink-muted">{tagline}</p>
                  <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{body}</p>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand-accent px-6 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-ink hover:text-white"
                  >
                    {cta} <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                {/* Right — feature list panel */}
                <div className="border-t border-brand-line bg-brand-bg-warm p-8 sm:p-10 md:border-l md:border-t-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">
                    What it does
                  </p>
                  <ul className="mt-4 space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-ink" />
                        <span className="text-sm leading-relaxed text-brand-ink-soft">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-brand-ink px-6 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl font-semibold">Have a product in mind?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            We design, build and run software for the care sector and beyond. Tell us what you are
            trying to solve and we will help you shape it.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex h-12 items-center rounded-xl bg-brand-accent px-8 text-base font-semibold text-brand-ink transition-colors hover:bg-white"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </>
  )
}
