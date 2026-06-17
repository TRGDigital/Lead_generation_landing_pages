'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const PHRASES = ['win more enquiries.', 'stand out online.', 'build better software.']

// A single browser-framed screenshot of real work.
function Frame({
  src,
  alt,
  url,
  w,
  h,
  className = '',
  style,
}: {
  src: string
  alt: string
  url: string
  w: number
  h: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-brand-line bg-white shadow-card ${className}`}
      style={style}
    >
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

// "Show your work" — a floating collage of the real sites + products TRG builds.
function WorkShowcase() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-xl">
      {/* Back: CareStream product */}
      <Frame
        src="/mockups/carestream.jpg"
        alt="CareStream — software we build for care"
        url="carestreamai.com"
        w={1320}
        h={940}
        className="absolute left-0 top-2 w-[58%] -rotate-3"
        style={{ animation: 'floaty 7s ease-in-out infinite' }}
      />
      {/* Front-right: a live lead-gen landing page we run */}
      <Frame
        src="/mockups/haywards-landing.png"
        alt="A care home landing page we run to generate enquiries"
        url="careassura.com"
        w={1280}
        h={1066}
        className="absolute right-0 top-0 w-[52%] rotate-2"
        style={{ animation: 'floaty 6s ease-in-out infinite', animationDelay: '0.6s' }}
      />
      {/* Front-centre: CareAssura directory */}
      <Frame
        src="/mockups/careassura.jpg"
        alt="CareAssura — a care home directory we built"
        url="careassura.co.uk"
        w={1320}
        h={895}
        className="absolute bottom-0 left-1/2 w-[60%] -translate-x-1/2 rotate-1"
        style={{ animation: 'floaty 8s ease-in-out infinite', animationDelay: '1.1s' }}
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

  return (
    <section className="relative overflow-hidden">
      {/* Right visual — a floating showcase of the real work we ship */}
      <div className="absolute inset-y-0 right-0 hidden w-[52%] items-center bg-brand-bg-warm lg:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.04), transparent 70%)' }}
        />
        <div className="w-full px-8">
          <WorkShowcase />
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
        <div className="rounded-2xl bg-brand-bg-warm py-10">
          <WorkShowcase />
        </div>
      </div>
    </section>
  )
}
