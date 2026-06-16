import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Check, Sparkles, Home } from 'lucide-react'

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
    Icon: Sparkles,
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
    Icon: Home,
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

export default function DevelopmentPage() {
  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <section className="px-6 pt-20 pb-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
            Development
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-brand-ink sm:text-5xl">
            The software we build for care
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-brand-ink-soft">
            Alongside our occupancy marketing, TRG Digital designs and runs its own products for the
            care sector. Two are live today, each solving a real problem for providers and the
            families they support.
          </p>
        </div>
      </section>

      {/* ── Products ──────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl space-y-8">
          {PRODUCTS.map(({ name, Icon, tagline, body, features, href, cta }) => (
            <div
              key={name}
              className="overflow-hidden rounded-3xl border border-brand-line bg-white shadow-soft"
            >
              <div className="grid gap-0 md:grid-cols-2">
                {/* Left — narrative */}
                <div className="p-8 sm:p-10">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10">
                    <Icon className="h-6 w-6 text-brand-accent" />
                  </div>
                  <h2 className="font-display text-2xl font-semibold text-brand-ink">{name}</h2>
                  <p className="mt-1 text-sm font-medium text-brand-accent">{tagline}</p>
                  <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{body}</p>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex h-11 items-center gap-1.5 rounded-xl bg-brand-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-ink"
                  >
                    {cta} <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>

                {/* Right — feature list panel */}
                <div className="border-t border-brand-line bg-brand-bg p-8 sm:p-10 md:border-l md:border-t-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">
                    What it does
                  </p>
                  <ul className="mt-4 space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-accent" />
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
            className="mt-8 inline-flex h-12 items-center rounded-xl bg-brand-accent px-8 text-base font-semibold text-white transition-colors hover:bg-white hover:text-brand-ink"
          >
            Talk to us
          </Link>
        </div>
      </section>
    </>
  )
}
