'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID

export default function Analytics() {
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem('cookie_consent') === 'accepted') {
        setConsented(true)
      }
    } catch {
      // ignore
    }

    function handleConsent() {
      setConsented(true)
    }
    window.addEventListener('cookieConsentAccepted', handleConsent)
    return () => window.removeEventListener('cookieConsentAccepted', handleConsent)
  }, [])

  if (!consented || !GA4_ID) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA4_ID}');
        ${GADS_ID ? `gtag('config', '${GADS_ID}');` : ''}
      `}</Script>
    </>
  )
}
