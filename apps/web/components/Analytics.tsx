'use client'

import Script from 'next/script'
import { useState, useEffect } from 'react'

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
// Google Ads conversion tag — public ID, hardcoded fallback so the tag is always present.
const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID ?? 'AW-18370354696'
// Microsoft Clarity (heatmaps + session recordings) — free; loads after cookie consent.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? 'xx64rq6ur7'

// Google tag with Consent Mode v2: gtag.js loads on EVERY page immediately (so
// Google Ads sees the tag and can model conversions), but ad/analytics storage
// stays denied until the visitor accepts the cookie banner. On accept we flip
// consent to granted, both for this page view and (via localStorage) future ones.
export default function Analytics() {
  const [inFrame, setInFrame] = useState(true)
  const [consented, setConsented] = useState(false)

  useEffect(() => {
    // Don't load analytics inside an embedded iframe (our tool widgets on client sites).
    try {
      if (window.self !== window.top) return
    } catch {
      return
    }
    setInFrame(false)

    function grant() {
      setConsented(true)
      try {
        const w = window as unknown as { gtag?: (...args: unknown[]) => void }
        w.gtag?.('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
        })
      } catch {
        // ignore
      }
    }

    try {
      if (localStorage.getItem('cookie_consent') === 'accepted') grant()
    } catch {
      // ignore
    }
    window.addEventListener('cookieConsentAccepted', grant)
    return () => window.removeEventListener('cookieConsentAccepted', grant)
  }, [])

  const primaryId = GA4_ID || GADS_ID
  if (inFrame || !primaryId) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          wait_for_update: 500
        });
        gtag('js', new Date());
        ${GA4_ID ? `gtag('config', '${GA4_ID}');` : ''}
        gtag('config', '${GADS_ID}');
      `}</Script>
      {consented && CLARITY_ID && (
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `}</Script>
      )}
    </>
  )
}
