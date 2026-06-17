'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const PHRASES = ['win more enquiries.', 'stand out online.', 'build better software.']

function Frame({ src, alt, url, w, h, className = '' }: { src: string; alt: string; url: string; w: number; h: number; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-brand-line bg-white shadow-card ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 hidden truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted sm:block">{url}</span>
      </div>
      <Image src={src} alt={alt} width={w} height={h} className="w-full" />
    </div>
  )
}

function Mockups() {
  return (
    <div className="relative w-full max-w-2xl px-3">
      <Frame src="/mockups/carestream.jpg" alt="The CareStream homepage" url="carestreamai.com" w={1320} h={940} />
      <Frame
        src="/mockups/careassura.jpg"
        alt="The CareAssura homepage"
        url="careassura.co.uk"
        w={1320}
        h={895}
        className="absolute -bottom-10 right-0 w-[72%]"
      />
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

  const software = i === 2

  return (
    <section className="relative overflow-hidden">
      {/* Right visual — resident photo, crossfading to product mockups on "build better software" */}
      <div className="absolute inset-y-0 right-0 hidden w-[49%] lg:block">
        <div className={`absolute inset-0 transition-opacity duration-700 ${software ? 'opacity-0' : 'opacity-100'}`}>
          <Image src="/hero-resident.jpg" alt="A care home resident relaxing in her room" fill priority sizes="46vw" className="object-cover" />
        </div>
        <div className={`absolute inset-0 flex items-center justify-center bg-brand-bg-warm transition-opacity duration-700 ${software ? 'opacity-100' : 'opacity-0'}`}>
          <Mockups />
        </div>
        <div className="absolute inset-y-0 left-0 z-10 w-28 bg-gradient-to-r from-brand-bg to-transparent" />
      </div>

      {/* Text */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="py-16 lg:w-1/2 lg:py-28 lg:pr-12">
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
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-accent px-8 text-base font-semibold text-brand-ink shadow-soft transition-all hover:bg-brand-ink hover:text-white hover:shadow-card"
            >
              Book a free demo
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-brand-line px-8 text-base font-medium text-brand-ink-soft transition-colors hover:border-brand-ink hover:text-brand-ink"
            >
              What we do
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile visual */}
      <div className="px-6 pb-12 lg:hidden">
        {software ? (
          <div className="flex justify-center rounded-2xl bg-brand-bg-warm py-10"><Mockups /></div>
        ) : (
          <div className="relative h-64 w-full overflow-hidden rounded-2xl sm:h-80">
            <Image src="/hero-resident.jpg" alt="A care home resident relaxing in her room" fill priority sizes="100vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  )
}
