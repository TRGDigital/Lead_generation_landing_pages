'use client'

import { useEffect, useState } from 'react'

// Renders purely decorative UI (the homepage's scrolling dashboard mockups) only in the
// browser, after hydration. Their sample text (example leads, rankings, deploy logs) then
// never appears in the server HTML that search engines and AI assistants read first, and
// it is hidden from screen readers and search snippets. Visitors see exactly the same page.
export function DecorativeClientOnly({ children, className, minHeight }: { children: React.ReactNode; className?: string; minHeight?: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <div className={className} style={minHeight ? { minHeight } : undefined} aria-hidden data-nosnippet>
      {mounted ? children : null}
    </div>
  )
}
