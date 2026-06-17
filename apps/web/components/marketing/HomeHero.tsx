import Link from 'next/link'
import Image from 'next/image'

type Shot = { src: string; alt: string; url?: string }
type Col =
  | { kind: 'desktop'; shot: Shot }
  | { kind: 'phone'; shot: Shot }
  | { kind: 'stack'; shots: [Shot, Shot] }

const COLS: Col[] = [
  { kind: 'desktop', shot: { src: '/mockups/haywards-landing.png', alt: 'A care home website we built', url: 'careassura.com' } },
  { kind: 'phone', shot: { src: '/mockups/haywards-mobile.png', alt: 'The same site on mobile' } },
  { kind: 'stack', shots: [
    { src: '/mockups/careassura.jpg', alt: 'CareAssura', url: 'careassura.co.uk' },
    { src: '/mockups/carestream.jpg', alt: 'CareStream', url: 'carestreamai.com' },
  ] },
  { kind: 'desktop', shot: { src: '/mockups/carestream-desktop.png', alt: 'CareStream platform', url: 'carestreamai.com' } },
  { kind: 'phone', shot: { src: '/mockups/carestream-mobile.png', alt: 'CareStream on mobile' } },
  { kind: 'stack', shots: [
    { src: '/mockups/carestream.jpg', alt: 'CareStream', url: 'carestreamai.com' },
    { src: '/mockups/haywards-landing.png', alt: 'A care home landing page', url: 'careassura.com' },
  ] },
  { kind: 'phone', shot: { src: '/mockups/carestream-pricing-mobile.png', alt: 'CareStream pricing on mobile' } },
]

function Browser({ shot, h, w }: { shot: Shot; h: string; w: string }) {
  return (
    <div className={`${w} flex-shrink-0 overflow-hidden rounded-xl border border-brand-line bg-white shadow-card`}>
      <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
        <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[8px] text-brand-ink-muted">{shot.url}</span>
      </div>
      <div className={`relative ${h} w-full`}>
        <Image src={shot.src} alt={shot.alt} fill sizes="420px" className="object-cover object-top" />
      </div>
    </div>
  )
}

function Phone({ shot }: { shot: Shot }) {
  return (
    <div className="h-[330px] w-[155px] flex-shrink-0 overflow-hidden rounded-[1.6rem] border-4 border-brand-ink bg-brand-ink shadow-card">
      <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-white">
        <Image src={shot.src} alt={shot.alt} fill sizes="155px" className="object-cover object-top" />
      </div>
    </div>
  )
}

function Column({ col }: { col: Col }) {
  if (col.kind === 'phone') return <Phone shot={col.shot} />
  if (col.kind === 'desktop') return <Browser shot={col.shot} w="w-[410px]" h="h-[250px]" />
  return (
    <div className="flex flex-col gap-4">
      <Browser shot={col.shots[0]} w="w-[260px]" h="h-[120px]" />
      <Browser shot={col.shots[1]} w="w-[260px]" h="h-[120px]" />
    </div>
  )
}

function HeroScroller() {
  return (
    <div className="animate-marquee flex w-max items-center gap-6">
      {[...COLS, ...COLS].map((col, i) => (
        <Column key={i} col={col} />
      ))}
    </div>
  )
}

export function HomeHero() {
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
        <div className="pb-16 pt-8 lg:w-1/2 lg:pb-28 lg:pr-12 lg:pt-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">
            Digital marketing agency delivering results for the care sector
          </p>
          <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[1.02] tracking-tight text-brand-ink sm:text-6xl lg:text-7xl">
            More enquiries.<br />
            <span className="text-brand-pop">Fewer empty beds.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
            TRG Digital is a specialist agency for the UK care sector. We grow your enquiries,
            build your website, and develop the software that sets you apart, all under one roof.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="btn-pop">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/about" className="btn-cta-outline">
              What we do
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
            {['Care-sector specialists', 'Found on Google & Bing', 'Enquiries, not clicks'].map((p) => (
              <span key={p} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile visual — a scrolling band under the text */}
      <div className="marquee-mask pb-12 lg:hidden">
        <div className="animate-marquee flex w-max items-center gap-5 px-6">
          {[...COLS, ...COLS].map((col, i) => (
            <Column key={i} col={col} />
          ))}
        </div>
      </div>
    </section>
  )
}
