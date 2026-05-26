'use client'

import type { PhoneTracking } from '@/lib/types/care-home'

interface PhoneLinkProps {
  phoneDisplay: string
  phoneTracking?: PhoneTracking
  className?: string
}

export default function PhoneLink({ phoneDisplay, phoneTracking, className }: PhoneLinkProps) {
  function handleClick() {
    if (typeof window === 'undefined') return
    if (phoneTracking?.ga4_event) {
      window.gtag?.('event', phoneTracking.ga4_event, {
        event_category: 'engagement',
        event_label: phoneDisplay,
      })
    }
    if (phoneTracking?.gads_label && process.env.NEXT_PUBLIC_GADS_ID) {
      window.gtag?.('event', 'conversion', {
        send_to: `${process.env.NEXT_PUBLIC_GADS_ID}/${phoneTracking.gads_label}`,
      })
    }
  }

  const number = (phoneTracking?.number ?? phoneDisplay).replace(/\s/g, '')

  return (
    <a
      href={`tel:${number}`}
      onClick={handleClick}
      className={
        className ??
        'text-brand-accent font-semibold text-lg hover:text-brand-accent-soft transition-colors'
      }
    >
      {phoneDisplay}
    </a>
  )
}
