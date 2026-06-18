import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Compass, PenTool, Palette, BookOpen, MessageSquareText, Globe, Printer, Share2, Check } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Care Home Rebranding | Logo, Identity & Website | TRG Digital',
  description:
    'A complete care-sector rebrand from TRG Digital, brand strategy, new logo and concepts, full visual identity, guidelines, tone of voice and a redesigned, rebuilt website.',
  alternates: { canonical: `${SITE_URL}/rebranding` },
  robots: { index: true, follow: true },
}

const INCLUDES = [
  { Icon: Compass, title: 'Brand strategy & positioning', body: 'Who you are, who you serve and the promise you make, the foundation everything is built on.' },
  { Icon: PenTool, title: 'Logo design & concepts', body: 'A distinctive new logo, presented as multiple concepts and refined with you, with full variations and file formats.' },
  { Icon: Palette, title: 'Visual identity', body: 'A complete system, colour palette, typography, iconography and graphic style that feels unmistakably yours.' },
  { Icon: BookOpen, title: 'Brand guidelines', body: 'A clear brand book so anyone, your team or ours, can apply the brand consistently, everywhere.' },
  { Icon: MessageSquareText, title: 'Tone of voice & messaging', body: 'How you sound, your key messages and taglines, language that earns trust with families.' },
  { Icon: Globe, title: 'Website redesign & build', body: 'A brand-new, search-optimised website that brings the identity to life and turns visitors into enquiries.' },
  { Icon: Printer, title: 'Print & signage', body: 'Stationery, brochures, welcome packs, exterior signage and reception materials, the brand in the real world.' },
  { Icon: Share2, title: 'Social & marketing collateral', body: 'Social profiles, templates, ad creative and the assets your team needs to launch and stay on-brand.' },
]

const POINTS = [
  'Brand strategy & positioning',
  'New logo, with multiple concepts',
  'Full visual identity, colour, type, icons',
  'A brand guidelines document',
  'Tone of voice & key messaging',
  'A redesigned, rebuilt website',
  'Stationery, signage & marketing collateral',
]

const STEPS = [
  { n: '01', title: 'Discover', body: 'We get under the skin of your home, your families, your values and where you want to be, to define the strategy.' },
  { n: '02', title: 'Design', body: 'Logo concepts, a full visual identity and the messaging that brings it to life, refined together until it’s right.' },
  { n: '03', title: 'Build & roll out', body: 'We rebuild your website and apply the new brand everywhere, print, signage, social and beyond.' },
]

const SWATCHES = ['#F0532B', '#FBCC33', '#2a2620', '#7a8a6f', '#f4f1e8']

export default function RebrandingPage() {
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
            name: 'Care Home Rebranding',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Full care-sector rebranding: strategy, logo, visual identity, guidelines and a redesigned website.',
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Full Rebranding</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              A brand families instantly <span className="text-brand-pop">trust</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              More than a new logo. We rebuild your brand from the ground up, strategy, identity, messaging and a
              brand-new website, so your home looks the part and wins the trust of every family that finds you.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Start your rebrand
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/website-development" className="btn-cta-outline">
                See website build
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['Logo & identity', 'Brand guidelines', 'New website'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Visual, a brand board */}
          <div className="relative">
            <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Brand board</p>
              <div className="mt-3 flex h-24 items-center justify-center rounded-xl bg-brand-ink">
                <span className="font-display text-2xl font-bold uppercase tracking-tight text-white">
                  Your<span className="text-brand-pop">Home</span>
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                {SWATCHES.map((c) => (
                  <div key={c} className="h-12 flex-1 rounded-lg border border-brand-line" style={{ background: c }} />
                ))}
              </div>
              <div className="mt-4">
                <p className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink">Aa Bb Cc</p>
                <p className="mt-1 text-sm text-brand-ink-soft">Display · Body · Accent type</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden w-44 overflow-hidden rounded-xl border border-brand-line bg-white shadow-card sm:block">
              <div className="flex items-center gap-1 border-b border-brand-line bg-brand-bg-warm px-2 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              </div>
              <div className="relative aspect-[16/12] w-full">
                <Image src="/mockups/haywards-landing.png" alt="The rebuilt website" fill sizes="176px" className="object-cover object-top" />
              </div>
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
              When it&apos;s time for a fresh start
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">A complete rebrand, done properly.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                A tired logo, an outdated website and inconsistent materials quietly cost you enquiries, families
                judge the quality of your care by the way you present it. A full rebrand fixes that from the inside
                out: a clear strategy, a distinctive identity and a consistent presence everywhere a family meets
                your home.
              </p>
              <p>
                We handle the whole thing under one roof, brand strategy, logo and identity, guidelines, tone of
                voice and a redesigned, rebuilt{' '}
                <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">website</Link>{' '}
, then plug straight into your{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">marketing</Link>{' '}
                so the new brand starts winning enquiries from day one.
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
                Time to reintroduce your home?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Start your rebrand
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's included ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What&apos;s included</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Everything a full rebrand needs
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INCLUDES.map(({ Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border border-brand-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 transition-colors group-hover:bg-brand-pop">
                  <Icon className="h-6 w-6 text-brand-pop transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we work</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              From blank page to brand launch
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
            Ready to reintroduce your home?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Book a free consultation and we&apos;ll show you what a complete rebrand could do for the way families
            see, and choose, your care.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Start your rebrand
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/development" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See our work →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
