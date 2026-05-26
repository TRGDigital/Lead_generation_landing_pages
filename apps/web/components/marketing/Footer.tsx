import Link from 'next/link'

const LINKS = {
  Product: [
    { href: '/how-it-works', label: 'How it works' },
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
            <Link href="/" className="font-display text-lg font-semibold text-brand-ink">
              Care<span className="text-brand-accent">Beds</span>
            </Link>
            <p className="mt-3 text-sm text-brand-ink-muted leading-relaxed">
              Qualified care home enquiries, on demand. Fill empty beds faster.
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
            © {new Date().getFullYear()} CareBeds. Part of the{' '}
            <a
              href="https://careassura.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-ink transition-colors"
            >
              CareAssura
            </a>{' '}
            family.
          </p>
          <p className="text-xs text-brand-ink-muted">
            Regulated occupancy marketing for UK care homes.
          </p>
        </div>
      </div>
    </footer>
  )
}
