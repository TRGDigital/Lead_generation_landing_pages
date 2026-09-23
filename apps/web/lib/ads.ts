// Google Ads conversion tracking.
//
// Both values are public (they appear in the page source of any site running the tag),
// so they are kept here with sensible defaults rather than depending on an environment
// variable being set correctly in every environment. Override either with an env var if
// the account or the conversion action ever changes.

/** The Google Ads account tag, configured on every page in components/Analytics. */
export const GADS_ID = process.env.NEXT_PUBLIC_GADS_ID ?? 'AW-18370354696'

/** Conversion action "TRG Go page quiz lead": fired when a /go/ page lead is submitted. */
export const GO_LEAD_LABEL = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL ?? 'IHvCCLW18dscEIi81bdE'

/**
 * Report a conversion to Google Ads. Safe to call anywhere: it does nothing when the tag
 * has not loaded, and Consent Mode means nothing is stored until the visitor accepts
 * cookies (Google models the rest).
 */
export function reportAdsConversion(label: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !label) return
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void }
    w.gtag?.('event', 'conversion', { send_to: `${GADS_ID}/${label}`, ...params })
  } catch {
    // Tracking must never break a form.
  }
}
