export interface GA4EventParams {
  name: string
  params?: Record<string, string | number | boolean>
}

export async function sendGA4Event(
  measurementId: string,
  apiSecret: string,
  clientId: string,
  event: GA4EventParams
): Promise<void> {
  if (!measurementId || !apiSecret) {
    console.warn('[ga4] Credentials not set — skipping event')
    return
  }

  const res = await fetch(
    `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        events: [{ name: event.name, params: event.params ?? {} }],
      }),
    }
  )

  if (!res.ok) {
    console.error('[ga4] Error:', res.status, await res.text())
  }
}
