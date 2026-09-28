'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { usePathname } from 'next/navigation'
import {
  Menu, X, ChevronDown, Mail, Phone, Users, Workflow, HeartHandshake, Scale, Building2, BarChart3,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICES } from '@/lib/services'
import { TOOL_GROUPS, toolsInGroup } from '@/lib/tools'

const LINKS = [
  // '/work' is hidden from nav while the case-study section is still in progress
  // (the pages exist but aren't linked publicly yet).
  { href: '/blog', label: 'Blog' },
]

// Who we are and how we work, plus the pages a buyer reads before choosing an agency.
const ABOUT: MegaItem[] = [
  { icon: Users, title: 'About us', short: 'Who we are, and why we only work in care.', href: '/about' },
  { icon: Workflow, title: 'How it works', short: 'From first call to a site that brings enquiries.', href: '/how-it-works' },
  { icon: HeartHandshake, title: 'Our commitment', short: 'What we promise, and how to hold us to it.', href: '/our-commitment' },
  { icon: Scale, title: 'Why a care specialist', short: 'Specialist, generalist, DIY or directory, compared.', href: '/why-a-care-specialist' },
  { icon: Building2, title: 'For care groups', short: 'One system for every home in your group.', href: '/care-groups' },
  { icon: BarChart3, title: 'Research', short: 'The care market in numbers, from our own data.', href: '/research' },
]

type MegaItem = { icon: LucideIcon; title: string; short: string; href: string; highlight?: boolean }

// A headed column in a mega panel. `wide` groups take two of the three columns on desktop.
type MegaGroup = { label: string; items: MegaItem[]; wide?: boolean }

const TOOL_MENU: MegaGroup[] = TOOL_GROUPS.map((g) => ({
  label: g.label,
  items: toolsInGroup(g.key),
  wide: g.key === 'care',
}))

/** `compact` drops the one-liner, for grouped panels where twenty full items ran off a laptop screen. */
function MegaLink({
  item: { icon: Icon, title, short, href, highlight },
  onClick,
  compact,
}: {
  item: MegaItem
  onClick: () => void
  compact?: boolean
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group flex gap-3 rounded-xl border transition-all',
        compact ? 'items-center px-3 py-2' : 'items-start p-3',
        highlight
          ? 'border-brand-accent bg-brand-accent/15 hover:bg-brand-accent/25'
          : 'border-transparent hover:border-brand-pop/30 hover:bg-brand-bg-warm',
      )}
    >
      <span
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded-xl transition-colors',
          compact ? 'h-8 w-8' : 'mt-0.5 h-9 w-9',
          highlight
            ? 'bg-brand-ink text-brand-accent'
            : 'bg-brand-pop/10 text-brand-pop group-hover:bg-brand-pop group-hover:text-white',
        )}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className={cn(
            'text-[13px] font-bold uppercase tracking-wide text-brand-ink transition-colors',
            highlight ? '' : 'group-hover:text-brand-pop',
          )}>
            {title}
          </span>
          {highlight ? (
            <span className="flex-shrink-0 rounded-full bg-brand-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-accent">
              Start here
            </span>
          ) : (
            <span className="flex-shrink-0 text-brand-pop opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden>→</span>
          )}
        </span>
        {!compact && <span className="mt-0.5 block text-xs leading-snug text-brand-ink-soft">{short}</span>}
      </span>
    </Link>
  )
}

function DesktopMega({
  label, active, open, setOpen, items = [], groups, eyebrow, tagline, ctaHref, ctaLabel, secondaryCta,
}: {
  label: string
  active: boolean
  open: boolean
  setOpen: (v: boolean) => void
  items?: MegaItem[]
  /** Headed columns instead of one flat grid. */
  groups?: MegaGroup[]
  eyebrow: string
  tagline: string
  ctaHref: string
  ctaLabel: string
  secondaryCta?: { href: string; label: string }
}) {
  return (
    // Not relative: the panel positions against the sticky header, so it is centred on the
    // page rather than under its own label. Centred under "Services", which sits near the
    // left edge, a 54rem panel ran off the left of a laptop screen. The wrapper fills the
    // header's height so the pointer never leaves it on the way down into the panel.
    <div className="flex h-full items-center" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className={cn(
          'relative flex items-center gap-1 text-base font-bold uppercase tracking-wide transition-colors after:absolute after:-bottom-2 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-brand-pop after:transition-opacity',
          active ? 'text-brand-ink after:opacity-100' : 'text-brand-ink-soft hover:text-brand-ink after:opacity-0',
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>

      {/* Always in the HTML, hidden until opened, so crawlers see every link in the menu. */}
      <div
        className={cn(
          'absolute left-1/2 top-full z-50 w-[min(37rem,calc(100vw-2rem))] -translate-x-1/2 pt-2',
          groups ? 'lg:w-[min(64rem,calc(100vw-2rem))]' : 'lg:w-[min(54rem,calc(100vw-2rem))]',
          !open && 'hidden',
        )}
      >
          {/* Capped to the screen so the links at the foot of a long panel stay reachable. */}
          <div className="relative max-h-[calc(100vh-6rem)] overflow-y-auto overflow-x-hidden rounded-2xl border border-brand-line bg-white shadow-card">
            <div className="h-1.5 w-full bg-brand-pop" />
            <div className="flex items-center justify-between px-4 pb-1 pt-4">
              <p className="font-display text-xs font-bold uppercase tracking-widest text-brand-pop">{eyebrow}</p>
              <span className="font-display text-[11px] font-bold uppercase tracking-wide text-brand-ink-muted">{tagline}</span>
            </div>
            {groups ? (
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 p-3 lg:grid-cols-3">
                {groups.map((g) => (
                  <div key={g.label} className={g.wide ? 'lg:col-span-2' : ''}>
                    <p className="border-b border-brand-line px-3 pb-2 font-display text-xs font-bold uppercase tracking-widest text-brand-ink">
                      {g.label}
                    </p>
                    <div className={cn('mt-1 grid grid-cols-1 gap-0.5 sm:grid-cols-2', !g.wide && 'lg:grid-cols-1')}>
                      {g.items.map((item) => (
                        <MegaLink key={item.title} item={item} onClick={() => setOpen(false)} compact />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MegaLink key={item.title} item={item} onClick={() => setOpen(false)} />
                ))}
              </div>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between border-t border-brand-line bg-brand-pop/5 px-5 py-3 text-xs font-bold uppercase tracking-wide text-brand-pop transition-colors hover:bg-brand-pop/10"
              >
                {secondaryCta.label}
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
              </Link>
            )}
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="group flex items-center justify-between bg-brand-ink px-5 py-4 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-pop"
            >
              {ctaLabel}
              <span className="transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
            </Link>
          </div>
        </div>
    </div>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [mobileAbout, setMobileAbout] = useState(false)
  const [mobileServices, setMobileServices] = useState(false)
  const [mobileTools, setMobileTools] = useState(false)
  const pathname = usePathname()

  const servicesActive = SERVICES.some((s) => pathname === s.href || pathname.startsWith(s.href + '/'))
  const toolsActive = pathname === '/tools' || pathname.startsWith('/tools/')
  const aboutActive = ABOUT.some((a) => pathname === a.href)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-line/60 bg-brand-bg/95 backdrop-blur supports-[backdrop-filter]:bg-brand-bg/80">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" onClick={() => setOpen(false)} aria-label="TRG Digital home">
          <ManagedImage
            src="/trg-digital-2025-t.png"
            alt="TRG Digital"
            width={4167}
            height={967}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden h-full flex-1 items-center justify-center gap-8 md:flex" aria-label="Main navigation">
          <DesktopMega
            label="Services"
            active={servicesActive}
            open={servicesOpen}
            setOpen={setServicesOpen}
            items={SERVICES}
            eyebrow="What we do"
            tagline="All under one roof"
            ctaHref="/about"
            ctaLabel="See how it all fits together"
          />
          <DesktopMega
            label="Free tools"
            active={toolsActive}
            open={toolsOpen}
            setOpen={setToolsOpen}
            groups={TOOL_MENU}
            eyebrow="The care toolkit"
            tagline="Free, no sign-up"
            ctaHref="/tools"
            ctaLabel="See all free tools"
            secondaryCta={{ href: '/care-tools', label: 'Want these on your own site? See our care tools' }}
          />
          <DesktopMega
            label="About us"
            active={aboutActive}
            open={aboutOpen}
            setOpen={setAboutOpen}
            items={ABOUT}
            eyebrow="About TRG Digital"
            tagline="Only care, nothing else"
            ctaHref="/contact"
            ctaLabel="Talk to someone who only works in care"
          />

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
        <div className="hidden shrink-0 items-center gap-5 md:flex">
          <a href="mailto:hello@trgdigital.co.uk" className="hidden items-center gap-2 text-base font-bold uppercase tracking-wide text-brand-ink-soft transition-colors hover:text-brand-pop xl:flex">
            <Mail className="h-4 w-4 text-brand-pop" /> hello@trgdigital.co.uk
          </a>
          <a href="tel:+442080641596" className="gads-phone flex items-center gap-2 text-base font-bold uppercase tracking-wide text-brand-ink-soft transition-colors hover:text-brand-pop">
            <Phone className="h-4 w-4 text-brand-pop" /> 020 8064 1596
          </a>
          <Link href="/contact" className="btn-pop h-10 px-5 text-xs">
            Contact us
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="-mr-2 ml-auto p-2 text-brand-ink-soft md:hidden"
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
              {SERVICES.map(({ icon: Icon, title, href, highlight }) => (
                <Link
                  key={title}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-brand-line/40 hover:text-brand-ink',
                    highlight
                      ? 'bg-brand-accent/20 font-bold text-brand-ink'
                      : 'text-brand-ink-soft',
                  )}
                >
                  <Icon className={cn('h-4 w-4', highlight ? 'text-brand-ink' : 'text-brand-accent')} />
                  {title}
                  {highlight && (
                    <span className="ml-auto rounded-full bg-brand-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-accent">
                      Start here
                    </span>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Free tools group */}
          <button
            type="button"
            onClick={() => setMobileTools((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-bold uppercase tracking-wide text-brand-ink-soft hover:bg-brand-line/40 hover:text-brand-ink"
            aria-expanded={mobileTools}
          >
            Free tools
            <ChevronDown className={cn('h-4 w-4 transition-transform', mobileTools && 'rotate-180')} />
          </button>
          {mobileTools && (
            <div className="space-y-0.5 pb-1 pl-3">
              {TOOL_MENU.map((g) => (
                <div key={g.label} className="pb-1">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-widest text-brand-ink">{g.label}</p>
                  {g.items.map(({ icon: Icon, title, href }) => (
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
              ))}
              <Link
                href="/tools"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-pop hover:bg-brand-line/40"
              >
                See all free tools →
              </Link>
              <Link
                href="/care-tools"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold text-brand-pop hover:bg-brand-line/40"
              >
                Want these on your site? See our care tools →
              </Link>
            </div>
          )}

          {/* About group */}
          <button
            type="button"
            onClick={() => setMobileAbout((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-base font-bold uppercase tracking-wide text-brand-ink-soft hover:bg-brand-line/40 hover:text-brand-ink"
            aria-expanded={mobileAbout}
          >
            About us
            <ChevronDown className={cn('h-4 w-4 transition-transform', mobileAbout && 'rotate-180')} />
          </button>
          {mobileAbout && (
            <div className="space-y-0.5 pb-1 pl-3">
              {ABOUT.map(({ icon: Icon, title, href }) => (
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
            <a href="mailto:hello@trgdigital.co.uk" className="flex items-center gap-2 px-3 text-sm font-medium text-brand-ink-soft">
              <Mail className="h-4 w-4 text-brand-pop" /> hello@trgdigital.co.uk
            </a>
            <a href="tel:+442080641596" className="gads-phone flex items-center gap-2 px-3 text-sm font-medium text-brand-ink-soft">
              <Phone className="h-4 w-4 text-brand-pop" /> 020 8064 1596
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
