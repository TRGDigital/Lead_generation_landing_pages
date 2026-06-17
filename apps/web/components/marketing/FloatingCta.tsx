'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquareText } from 'lucide-react'

// A persistent "Get in touch" CTA that floats with the page (appears after a little
// scroll). Hidden on the contact page itself.
export function FloatingCta() {
  const [show, setShow] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (pathname === '/contact') return null

  return (
    <Link
      href="/contact"
      aria-label="Get in touch"
      className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-brand-ink px-5 py-3 text-sm font-semibold text-white shadow-card transition-all duration-300 hover:bg-brand-accent hover:text-brand-ink ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <MessageSquareText className="h-4 w-4" />
      Get in touch
    </Link>
  )
}
