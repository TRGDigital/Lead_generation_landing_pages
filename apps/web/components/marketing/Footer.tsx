import Link from 'next/link'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { SERVICES } from '@/lib/services'

const COMPANY = [
  { href: '/about', label: 'About us' },
  { href: '/tools', label: 'Free tools' },
  { href: '/blog', label: 'Knowledge Hub' },
  { href: '/contact', label: 'Contact' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/how-it-works', label: 'How it works' },
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
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center" aria-label="TRG Digital home">
              <Image src="/trg-digital-2025.png" alt="TRG Digital" width={4167} height={967} className="h-9 w-auto brightness-0 invert" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              A specialist digital marketing agency for the UK care sector, more enquiries, fewer empty beds.
            </p>
            <p className="mt-4 flex items-start gap-2 text-sm text-white/60">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-accent" />
              Suite Ra01, 195-197 Wood Street, London, E17 3NU
            </p>
            <Link href="/contact" className="btn-pop btn-on-dark mt-6">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          </div>

          <Col title="Services">
            {SERVICES.map((s) => <FLink key={s.title} href={s.href} label={s.title} />)}
          </Col>
          <Col title="Company">{COMPANY.map((l) => <FLink key={l.href} {...l} />)}</Col>
          <Col title="Products">{PRODUCTS.map((l) => <FLink key={l.href} {...l} />)}</Col>
          <Col title="Legal">{LEGAL.map((l) => <FLink key={l.href} {...l} />)}</Col>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} TRG Digital. All rights reserved.</p>
          <p className="text-xs text-white/50">Marketing, websites &amp; software, built only for UK care.</p>
        </div>
      </div>
    </footer>
  )
}
