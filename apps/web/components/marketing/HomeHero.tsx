'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const PHRASES = ['win more enquiries.', 'stand out online.', 'build better software.']

type Item = { type: 'desktop' | 'phone'; src: string; alt: string; url?: string }

const ITEMS: Item[] = [
  { type: 'desktop', src: '/mockups/haywards-landing.png', alt: 'A care home website we built', url: 'careassura.com' },
  { type: 'phone', src: '/mockups/haywards-mobile.png', alt: 'The same site on mobile' },
  { type: 'desktop', src: '/mockups/careassura.jpg', alt: 'CareAssura', url: 'careassura.co.uk' },
  { type: 'phone', src: '/mockups/carestream-mobile.png', alt: 'CareStream on mobile' },
  { type: 'desktop', src: '/mockups/carestream.jpg', alt: 'CareStream', url: 'carestreamai.com' },
]

function HeroFrame({ item }: { item: Item }) {
  if (item.type === 'phone') {
    return (
      <div className="h-[330px] w-[156px] flex-shrink-0 overflow-hidden rounded-[1.6rem] border-4 border-brand-ink bg-brand-ink shadow-card">
        <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-white">
          <Image src={item.src} alt={item.alt} fill sizes="156px" className="object-cover object-top" />
        </div>
      </div>
    )
  }
  return (
    <div className="w-[420px] flex-shrink-0 overflow-hidden rounded-xl border border-brand-line bg-white shadow-card">
      <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">{item.url}</span>
      </div>
      <div className="relative h-[260px] w-full">
        <Image src={item.src} alt={item.alt} fill sizes="420px" className="object-cover object-top" />
      </div>
    </div>
  )
}

function HeroScroller() {
  return (
    <div className="animate-marquee flex w-max items-center gap-6">
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <HeroFrame key={i} item={item} />
      ))}
    </div>
  )
}

export function HomeHero() {
  const [i, setI] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const hold = 2400, out = 450
    const t1 = setTimeout(() => setShow(false), hold)
    const t2 = setTimeout(() => { setI((p) => (p + 1) % PHRASES.length); setShow(true) }, hold + out)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [i])

  return (
    <section className="relative overflow-hidden">
      {/* Right-to-left scrolling band of real work, behind the text */}
      <div className="pointer-events-none absolute inset-0 hidden items-center lg:flex">
        <HeroScroller />
      </div>
      {/* Fade the frames out as they reach the headline on the left */}
      <div className="absolute inset-y-0 left-0 z-10 hidden w-[58%] bg-gradient-to-r from-brand-bg from-45% via-brand-bg/85 to-transparent lg:block" />

      {/* Text */}
      <div className="relative z-20 mx-auto max-w-6xl px-6">
        <div className="py-16 lg:w-1/2 lg:py-32 lg:pr-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
            Specialist care-sector agency
          </p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-brand-ink sm:text-6xl">
            We help care providers{' '}
            <span className="relative inline-grid align-baseline">
              <span aria-hidden className="invisible col-start-1 row-start-1 italic">build better software.</span>
              <span
                aria-live="polite"
                className={`col-start-1 row-start-1 italic text-brand-accent-soft transition-all duration-[450ms] ease-out ${show ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}
              >
                {PHRASES[i]}
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
            TRG Digital is a specialist agency for the UK care sector. We grow your enquiries,
            build your website, and develop the software that sets you apart, all under one roof.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Book a free demo
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/about" className="btn-cta-outline">
              What we do
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile visual — a scrolling band under the text */}
      <div className="marquee-mask pb-12 lg:hidden">
        <div className="animate-marquee flex w-max items-center gap-5 px-6">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <HeroFrame key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
