export interface SendSmsOptions {
  to: string
  body: string
}

export async function sendSms(opts: SendSmsOptions): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_FROM_NUMBER

  if (!accountSid || !authToken || !from) {
    console.warn('[twilio] Credentials not set — skipping SMS')
    return
  }

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: opts.to, From: from, Body: opts.body }),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    console.error('[twilio] Error:', res.status, body)
    throw new Error(`Twilio error ${res.status}`)
  }
}
