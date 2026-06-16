'use client'

import { useEffect, useState } from 'react'

/**
 * Cycles through a list of phrases, flying each one out (up + fade) and the next
 * one in. The longest phrase reserves the width so the line never jumps.
 */
export function RotatingHeadline({
  phrases,
  className = '',
  hold = 2200,
  out = 450,
}: {
  phrases: string[]
  className?: string
  hold?: number
  out?: number
}) {
  const [i, setI] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const t1 = setTimeout(() => setShow(false), hold)
    const t2 = setTimeout(() => {
      setI((p) => (p + 1) % phrases.length)
      setShow(true)
    }, hold + out)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [i, phrases.length, hold, out])

  return (
    <span className="relative inline-grid">
      {/* Invisible sizer holds the widest phrase so the layout never shifts */}
      <span aria-hidden className={`col-start-1 row-start-1 invisible ${className}`}>
        {phrases.reduce((a, b) => (b.length > a.length ? b : a), '')}
      </span>
      <span
        aria-live="polite"
        className={`col-start-1 row-start-1 transition-all duration-[450ms] ease-out ${
          show ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        } ${className}`}
      >
        {phrases[i]}
      </span>
    </span>
  )
}
