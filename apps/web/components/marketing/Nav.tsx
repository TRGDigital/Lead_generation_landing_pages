'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-line/60 bg-brand-bg/95 backdrop-blur supports-[backdrop-filter]:bg-brand-bg/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5" onClick={() => setOpen(false)}>
          <span className="font-display text-lg font-semibold tracking-tight text-brand-ink">
            Care<span className="text-brand-accent">Beds</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  active ? 'text-brand-ink' : 'text-brand-ink-soft hover:text-brand-ink'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/contact"
            className="text-sm font-medium text-brand-ink-soft hover:text-brand-ink transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-9 items-center rounded-lg bg-brand-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-ink"
          >
            Book a demo
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-brand-ink-soft"
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
          className="md:hidden border-t border-brand-line/60 bg-brand-bg px-6 py-5 space-y-1"
          aria-label="Mobile navigation"
        >
          {[...LINKS, { href: '/contact', label: 'Contact' }].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-brand-ink-soft hover:bg-brand-line/40 hover:text-brand-ink"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-brand-line/60">
            <Link
              href="/contact"
              className="block w-full rounded-lg bg-brand-accent px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-ink"
              onClick={() => setOpen(false)}
            >
              Book a demo
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
