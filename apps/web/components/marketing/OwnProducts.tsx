import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Star, Dots, Squiggle } from './Decor'

// "We build our own software for care", richer, alternating two-column product
// showcases. Proof that TRG doesn't just advise, it ships.
const PRODUCTS = [
  {
    name: 'CareStream',
    logo: '/products/carestream-logo.png',
    logoW: 700,
    logoH: 210,
    shot: '/mockups/carestream-desktop.png',
    url: 'carestreamai.com',
    href: 'https://carestreamai.com',
    body: 'An AI policy, training and CQC platform built for care teams. CareStream answers staff questions in over 60 languages, grounded in the provider’s own policies and documents, turning compliance from a burden into something your team can actually use day to day.',
    features: ['AI answers in 60+ languages', 'Policies, training & CQC tools', 'Grounded in your own documents'],
  },
  {
    name: 'CareAssura',
    logo: '/products/careassura-logo.webp',
    logoW: 364,
    logoH: 91,
    shot: '/mockups/careassura.jpg',
    url: 'careassura.co.uk',
    href: 'https://careassura.co.uk',
    body: 'A UK care home directory that helps families find, compare and choose the right care with confidence, and connects providers with genuinely interested enquiries. It’s the same lead-generation engine we put to work for our clients.',
    features: ['UK-wide care home directory', 'Compare homes with confidence', 'Connects families to the right care'],
  },
]

export function OwnProducts() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <Star className="absolute left-8 top-10 hidden h-20 w-20 -rotate-12 text-brand-accent lg:block" />
      <Dots className="absolute right-10 top-14 hidden h-20 w-20 text-brand-pop/50 lg:block" />
      <Squiggle className="absolute bottom-10 right-8 hidden h-8 w-64 text-brand-pop/70 lg:block" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-pop">Built by us</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            We build our own software for care
          </h2>
          <p className="mt-4 text-brand-ink-soft">
            We don&apos;t just talk about custom development, we ship it. Two of our own products are live and used
            across the sector today, which keeps us close to the problems our clients face every day.
          </p>
        </div>

        <div className="space-y-12">
          {PRODUCTS.map(({ name, logo, logoW, logoH, shot, url, href, body, features }, i) => (
            <div key={name} className="grid items-center gap-8 lg:grid-cols-2">
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <Image src={logo} alt={name} width={logoW} height={logoH} className="h-12 w-auto" />
                <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">{body}</p>
                <ul className="mt-5 space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm font-medium text-brand-ink">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop/10">
                        <Check className="h-3 w-3 text-brand-pop" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
                  <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-brand-pop hover:text-brand-ink">
                    Visit {name} <ArrowRight className="h-4 w-4" />
                  </a>
                  <Link href="/development" className="text-brand-ink-soft hover:text-brand-ink">Build something like this →</Link>
                </div>
              </div>

              <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
                  <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-red-400" />
                    <span className="h-2 w-2 rounded-full bg-amber-300" />
                    <span className="h-2 w-2 rounded-full bg-green-400" />
                    <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">{url}</span>
                  </div>
                  <div className="relative aspect-[16/10] w-full">
                    <Image src={shot} alt={`${name} screenshot`} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover object-top" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
