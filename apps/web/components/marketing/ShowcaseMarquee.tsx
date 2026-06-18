import Image from 'next/image'
import { Squiggle, Star } from './Decor'

// An auto-scrolling showcase that tells the whole enquiry journey we build for a
// client: a desktop site → a mobile site → how it appears on Google → on Bing →
// the enquiry landing in your inbox. Mix of real screenshots and on-brand UI mockups.

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white">
      {children}
    </span>
  )
}

function BrowserCard({ src, alt, url, caption, w = 'w-[360px]' }: { src: string; alt: string; url: string; caption: string; w?: string }) {
  return (
    <div className={`relative ${w} h-full overflow-hidden rounded-xl border border-brand-line bg-white shadow-card`}>
      <Caption>{caption}</Caption>
      <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400" />
        <span className="h-2 w-2 rounded-full bg-amber-300" />
        <span className="h-2 w-2 rounded-full bg-green-400" />
        <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">{url}</span>
      </div>
      <div className="relative h-[calc(100%-2rem)] w-full">
        <Image src={src} alt={alt} fill sizes="360px" className="object-cover object-top" />
      </div>
    </div>
  )
}

function PhoneCard({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <div className="relative h-full w-[148px] overflow-hidden rounded-[1.6rem] border-4 border-brand-ink bg-brand-ink shadow-card">
      <Caption>{caption}</Caption>
      <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] bg-white">
        <Image src={src} alt={alt} fill sizes="148px" className="object-cover object-top" />
      </div>
    </div>
  )
}

function GoogleCard() {
  return (
    <div className="relative flex h-full w-[320px] flex-col rounded-xl border border-brand-line bg-white p-5 shadow-card">
      <Caption>On Google</Caption>
      <div className="mt-6 flex items-center gap-2 rounded-full border border-brand-line px-3 py-2 text-xs text-brand-ink-muted">
        <span className="text-base font-semibold">
          <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
        </span>
        <span className="truncate">care homes in haywards heath</span>
      </div>
      <div className="mt-4">
        <p className="text-[11px] text-[#202124]">careassura.com › haywards-heath</p>
        <p className="mt-0.5 text-base font-medium leading-snug text-[#1a0dab]">Care Homes in Haywards Heath | Free, Impartial Help</p>
        <p className="mt-1 text-xs leading-relaxed text-[#4d5156]">
          Find and compare brilliant care homes in Haywards Heath. Free, impartial help, covering residential, nursing and dementia care…
        </p>
      </div>
      <p className="mt-auto text-[11px] font-semibold text-brand-accent">Ranking on page one</p>
    </div>
  )
}

function BingCard() {
  return (
    <div className="relative flex h-full w-[320px] flex-col rounded-xl border border-brand-line bg-white p-5 shadow-card">
      <Caption>On Bing</Caption>
      <div className="mt-6 flex items-center gap-2 rounded-full border border-brand-line px-3 py-2 text-xs text-brand-ink-muted">
        <span className="text-base font-semibold text-[#008373]">Bing</span>
        <span className="truncate">care home haywards heath</span>
      </div>
      <div className="mt-4">
        <p className="text-[11px] text-[#4d5156]">careassura.com</p>
        <p className="mt-0.5 text-base font-medium leading-snug text-[#1a0dab]">Haywards Heath Care Homes, Genuine Availability</p>
        <p className="mt-1 text-xs leading-relaxed text-[#4d5156]">
          Tell us what you need and local care homes with availability come to you. Free for families, no obligation…
        </p>
      </div>
      <p className="mt-auto text-[11px] font-semibold text-brand-accent">Found across every search engine</p>
    </div>
  )
}

function LeadCard() {
  return (
    <div className="relative flex h-full w-[300px] flex-col overflow-hidden rounded-xl border border-brand-line bg-white shadow-card">
      <Caption>Enquiry delivered</Caption>
      <div className="flex items-center justify-between bg-brand-ink px-4 pb-3 pt-9 text-white">
        <span className="text-sm font-semibold">New enquiry</span>
        <span className="rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-semibold text-brand-ink">Just now</span>
      </div>
      <div className="flex-1 space-y-2 p-4 text-xs">
        {[
          ['Name', 'Margaret W.'],
          ['Area', 'Haywards Heath'],
          ['Care type', 'Residential care'],
          ['Move-in', 'Within the next month'],
          ['Phone', '07700 900•••'],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3">
            <span className="text-brand-ink-muted">{k}</span>
            <span className="font-medium text-brand-ink">{v}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 border-t border-brand-line bg-brand-bg-warm px-4 py-2.5 text-[11px] font-semibold text-brand-ink">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-green-500" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Sent to your inbox instantly
      </div>
    </div>
  )
}

export function ShowcaseMarquee() {
  // One pass of the journey; rendered twice in the track for a seamless loop.
  const cards = [
    <BrowserCard key="d1" src="/mockups/haywards-landing.png" alt="A care home website we built" url="careassura.com" caption="Desktop site" />,
    <PhoneCard key="m1" src="/mockups/haywards-mobile.png" alt="The same site on mobile" caption="Mobile site" />,
    <GoogleCard key="g" />,
    <BingCard key="b" />,
    <LeadCard key="l" />,
    <BrowserCard key="ca" src="/mockups/careassura.jpg" alt="CareAssura" url="careassura.co.uk" caption="CareAssura" />,
    <BrowserCard key="cs" src="/mockups/carestream.jpg" alt="CareStream" url="carestreamai.com" caption="CareStream" />,
  ]

  return (
    <section className="relative overflow-hidden pb-20 pt-8">
      <Star className="absolute right-12 top-10 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
      <div className="relative mx-auto mb-10 max-w-6xl px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent">Our work in action</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
          From search to enquiry, we build the whole journey
        </h2>
        <p className="mt-4 max-w-2xl text-brand-ink-soft">
          A fast site on every device, found across Google and Bing, turning searches into enquiries delivered
          straight to you. Here&apos;s what that looks like.
        </p>
        <Squiggle className="mt-6 h-7 w-72 text-brand-pop" />
      </div>

      <div className="marquee-mask">
        <div className="animate-marquee flex w-max gap-5 px-2.5">
          {[...cards, ...cards].map((card, i) => (
            <div key={i} className="h-72 shrink-0">
              {card}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
