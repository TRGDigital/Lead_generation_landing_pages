import Link from 'next/link'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { MapPin } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import { Star } from './Decor'
import { EnquiryButton } from '@/components/marketing/EnquiryOverlay'

const MARQUEE = ['More enquiries', 'Fewer empty beds', 'More carers', 'Built only for care']

// One copy of the scrolling statement; two side by side make a seamless loop.
function MarqueeTrack() {
  return (
    <div className="flex shrink-0 items-center">
      {MARQUEE.concat(MARQUEE).map((t, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 font-display text-4xl font-bold uppercase tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.28)] sm:text-6xl">{t}</span>
          <Star className="h-7 w-7 shrink-0 text-brand-pop sm:h-9 sm:w-9" />
        </span>
      ))}
    </div>
  )
}

const COMPANY = [
  { href: '/about', label: 'About us' },
  { href: '/tools', label: 'Free tools' },
  { href: '/blog', label: 'Knowledge Hub' },
  { href: '/contact', label: 'Contact' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/our-commitment', label: 'Our commitment' },
  { href: '/refer', label: 'Refer a home' },
]
const PRODUCTS = [
  { href: 'https://carestreamai.com', label: 'CareStream' },
  { href: 'https://careassura.co.uk', label: 'CareAssura' },
]
const LEGAL = [
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of service' },
  { href: '/cookies', label: 'Cookie policy' },
]

function Col({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">{title}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  )
}
function FLink({ href, label }: { href: string; label: string }) {
  const external = href.startsWith('http')
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="text-sm text-white/70 transition-colors hover:text-white"
      >
        {label}
      </a>
    </li>
  )
}

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="TRG Digital home">
              <ManagedImage src="/trg-digital-footer.png" alt="TRG Digital" width={4167} height={967} className="h-9 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              A specialist digital marketing agency for the UK care sector: more enquiries from families, fewer empty beds and more carers.
            </p>
            <p className="mt-4 flex items-start gap-2 text-sm text-white/60">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-accent" />
              Suite Ra01, 195-197 Wood Street, London, E17 3NU
            </p>
            <EnquiryButton className="btn-pop btn-on-dark mt-6">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </EnquiryButton>
          </div>

          <Col title="Services">
            {SERVICES.map((s) => <FLink key={s.title} href={s.href} label={s.highlight ? `${s.title} (free)` : s.title} />)}
          </Col>
          <Col title="Company">{COMPANY.map((l) => <FLink key={l.href} {...l} />)}</Col>
          <Col title="Products">{PRODUCTS.map((l) => <FLink key={l.href} {...l} />)}</Col>
          <Col title="Legal">{LEGAL.map((l) => <FLink key={l.href} {...l} />)}</Col>
        </div>
      </div>

      {/* Full-bleed scrolling brand statement, turns the dead space into a bold sign-off */}
      <div className="relative mt-14 flex overflow-hidden border-y border-white/10 py-7" aria-hidden="true">
        <div className="flex w-max animate-marquee">
          <MarqueeTrack />
          <MarqueeTrack />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} TRG Digital Ltd. All rights reserved. Registered in England &amp; Wales, company no. 11731704. Suite Ra01, 195-197 Wood Street, London, E17 3NU.</p>
          <p className="text-xs text-white/50">Marketing, websites &amp; software, built only for UK care.</p>
        </div>
      </div>
    </footer>
  )
}
