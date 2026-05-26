'use client'

import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent')
      if (!consent) setShow(true)
    } catch {
      // localStorage unavailable (e.g. private browsing strict mode)
    }
  }, [])

  function accept() {
    try {
      localStorage.setItem('cookie_consent', 'accepted')
    } catch {
      // ignore
    }
    setShow(false)
    window.dispatchEvent(new Event('cookieConsentAccepted'))
  }

  function decline() {
    try {
      localStorage.setItem('cookie_consent', 'declined')
    } catch {
      // ignore
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-ink/95 backdrop-blur text-white px-4 py-4 md:py-5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm leading-relaxed flex-1 text-white/80">
          We use cookies to improve your experience and measure the effectiveness of our
          adverts.{' '}
          <a href="/privacy" className="underline text-white hover:text-white/70 transition-colors">
            Privacy Policy
          </a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-sm px-4 py-2 border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-sm px-4 py-2 bg-brand-accent rounded-lg hover:bg-brand-accent-soft transition-colors font-medium"
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  )
}
