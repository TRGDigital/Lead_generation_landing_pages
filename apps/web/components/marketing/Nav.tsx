'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Mail, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES } from '@/lib/services'

const LINKS = [
  { href: '/about', label: 'About us' },
  { href: '/blog', label: 'Blog' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServices, setMobileServices] = useState(false)
  const pathname = usePathname()

  const servicesActive = SERVICES.some((s) => pathname === s.href || pathname.startsWith(s.href + '/'))

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-line/60 bg-brand-bg/95 backdrop-blur supports-[backdrop-filter]:bg-brand-bg/80">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)} aria-label="TRG Digital home">
          <Image
            src="/trg-digital-2025.png"
            alt="TRG Digital"
            width={4167}
            height={967}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">
          {/* Services mega-menu */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className={cn(
                'relative flex items-center gap-1 text-base font-bold uppercase tracking-wide transition-colors after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-brand-pop after:transition-opacity',
                servicesActive ? 'text-brand-ink after:opacity-100' : 'text-brand-ink-soft hover:text-brand-ink after:opacity-0',
              )}
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
            >
              Services
              <ChevronDown className={cn('h-4 w-4 transition-transform', servicesOpen && 'rotate-180')} />
            </button>

            {servicesOpen && (
              <div className="absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
                  <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2">
                    {SERVICES.map(({ icon: Icon, title, short, href }) => (
                      <Link
                        key={title}
                        href={href}
                        onClick={() => setServicesOpen(false)}
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-brand-bg-warm"
                      >
                        <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-bg-warm text-brand-accent transition-colors group-hover:bg-brand-accent group-hover:text-brand-ink">
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-bold uppercase tracking-wide text-brand-ink">{title}</span>
                          <span className="mt-0.5 block text-xs leading-snug text-brand-ink-soft">{short}</span>
                        </span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/about"
                    onClick={() => setServicesOpen(false)}
                    className="flex items-center justify-between border-t border-brand-line bg-brand-bg-warm/50 px-5 py-3 text-sm font-semibold text-brand-ink hover:bg-brand-bg-warm"
                  >
                    See how it all fits together
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative text-base font-bold uppercase tracking-wide transition-colors after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-brand-pop after:transition-opacity',
                  active ? 'text-brand-ink after:opacity-100' : 'text-brand-ink-soft hover:text-brand-ink after:opacity-0',
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop contact + CTA */}
        <div className="hidden items-center gap-5 md:flex">
          <a href="mailto:hello@trgdigital.com" className="hidden items-center gap-2 text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-pop xl:flex">
            <Mail className="h-4 w-4 text-brand-pop" /> hello@trgdigital.com
          </a>
          <a href="tel:+442070000000" className="flex items-center gap-2 text-sm font-semibold text-brand-ink-soft transition-colors hover:text-brand-pop">
            <Phone className="h-4 w-4 text-brand-pop" /> 0207 000 0000
          </a>
          <Link href="/contact" className="btn-pop h-10 px-5 text-xs">
            Contact us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="-mr-2 p-2 text-brand-ink-soft md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          className="space-y-1 border-t border-brand-line/60 bg-brand-bg px-6 py-5 md:hidden"
          aria-label="Mobile navigation"
        >
          {/* Services group */}
          <button
            type="button"
            onClick={() => setMobileServices((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-bold uppercase tracking-wide text-brand-ink-soft hover:bg-brand-line/40 hover:text-brand-ink"
            aria-expanded={mobileServices}
          >
            Services
            <ChevronDown className={cn('h-4 w-4 transition-transform', mobileServices && 'rotate-180')} />
          </button>
          {mobileServices && (
            <div className="space-y-0.5 pb-1 pl-3">
              {SERVICES.map(({ icon: Icon, title, href }) => (
                <Link
                  key={title}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-brand-ink-soft hover:bg-brand-line/40 hover:text-brand-ink"
                >
                  <Icon className="h-4 w-4 text-brand-accent" />
                  {title}
                </Link>
              ))}
            </div>
          )}

          {[...LINKS, { href: '/contact', label: 'Contact' }].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block rounded-lg px-3 py-2.5 text-base font-bold uppercase tracking-wide text-brand-ink-soft hover:bg-brand-line/40 hover:text-brand-ink"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="space-y-3 border-t border-brand-line/60 pt-3">
            <a href="mailto:hello@trgdigital.com" className="flex items-center gap-2 px-3 text-sm font-medium text-brand-ink-soft">
              <Mail className="h-4 w-4 text-brand-pop" /> hello@trgdigital.com
            </a>
            <a href="tel:+442070000000" className="flex items-center gap-2 px-3 text-sm font-medium text-brand-ink-soft">
              <Phone className="h-4 w-4 text-brand-pop" /> 0207 000 0000
            </a>
            <Link
              href="/contact"
              className="block w-full rounded-lg bg-brand-accent px-4 py-2.5 text-center text-sm font-semibold text-brand-ink hover:bg-brand-ink hover:text-white"
              onClick={() => setOpen(false)}
            >
              Contact us
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
