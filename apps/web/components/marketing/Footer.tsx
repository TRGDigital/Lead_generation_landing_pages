import Link from 'next/link'
import Image from 'next/image'

const LINKS = {
  Product: [
    { href: '/how-it-works', label: 'How it works' },
    { href: '/development', label: 'Development' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/blog', label: 'Blog' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy policy' },
    { href: '/terms', label: 'Terms of service' },
    { href: '/cookies', label: 'Cookie policy' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-brand-line/60 bg-brand-bg">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center" aria-label="TRG Digital home">
              <Image src="/trg-digital-logo.png" alt="TRG Digital" width={138} height={32} className="h-7 w-auto" />
            </Link>
            <p className="mt-3 text-sm text-brand-ink-muted leading-relaxed">
              Software and growth for the UK care sector. We build, run and market products that help care providers and the families they serve.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">
                {group}
              </p>
              <ul className="mt-3 space-y-2">
                {items.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-brand-ink-soft hover:text-brand-ink transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-brand-line/60 pt-8 sm:flex-row">
          <p className="text-xs text-brand-ink-muted">
            © {new Date().getFullYear()} TRG Digital. All rights reserved.
          </p>
          <p className="text-xs text-brand-ink-muted">
            Building software and growth for UK care.
          </p>
        </div>
      </div>
    </footer>
  )
}
