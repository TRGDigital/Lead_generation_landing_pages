'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// A distinctive, always-in-view contact "sticker", a rotated coral seal that
// straightens + grows on hover. Hidden only on the contact page.
export function FloatingCta() {
  const pathname = usePathname()
  if (pathname === '/contact') return null

  return (
    <Link
      href="/contact"
      aria-label="Get in touch"
      className="group fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6"
    >
      <span className="relative flex h-[88px] w-[88px] -rotate-[10deg] items-center justify-center rounded-full bg-brand-pop text-center shadow-[4px_4px_0_0_#2a2620] ring-2 ring-brand-ink transition-all duration-300 group-hover:rotate-0 group-hover:scale-105 sm:h-24 sm:w-24">
        {/* dashed seal ring */}
        <span className="absolute inset-1.5 rounded-full border-2 border-dashed border-white/50" />
        <span className="font-display text-[11px] font-bold uppercase leading-tight tracking-wide text-white sm:text-xs">
          Get in
          <br />
          touch
          <br />
          <span className="inline-block text-base transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </span>
    </Link>
  )
}
