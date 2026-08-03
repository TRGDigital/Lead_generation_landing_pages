import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getTrackingNumberByTwilioNumber, publicWebhookUrl, validateTwilioSignature } from '@/lib/dni'

// Twilio Voice webhook for DNI tracking numbers. Logs the inbound call as a
// TRG-generated lead, then forwards it straight to the home's real line
// (no announcement, no recording — Phase 1). Set this URL as the number's
// "A call comes in" webhook (HTTP POST) in the Twilio console.
export const dynamic = 'force-dynamic'

const XML = { 'Content-Type': 'text/xml; charset=utf-8' }

function twiml(inner: string) {
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response>${inner}</Response>`, { headers: XML })
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const params: Record<string, string> = {}
  form.forEach((v, k) => {
    params[k] = String(v)
  })

  const signature = req.headers.get('x-twilio-signature') ?? ''
  if (!validateTwilioSignature(publicWebhookUrl('/api/dni/voice'), params, signature)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const to = params.To ?? ''
  const tn = await getTrackingNumberByTwilioNumber(to)
  if (!tn || !tn.enabled || !tn.forward_to) {
    // Unknown or unconfigured number — reject rather than dead-air.
    return twiml('<Reject reason="rejected"/>')
  }

  const db = createServiceClient() as unknown as any
  await db.from('tracked_calls').upsert(
    {
      twilio_call_sid: params.CallSid ?? null,
      website_id: tn.website_id,
      tracking_number_id: tn.id,
      caller: params.From ?? null,
      to_number: to,
      status: params.CallStatus ?? 'ringing',
    },
    { onConflict: 'twilio_call_sid' },
  )

  // Dial the real line; the action URL fires when the dial ends so we can
  // record answered/missed + duration. Caller ID passes through unchanged.
  const action = publicWebhookUrl('/api/dni/status')
  return twiml(`<Dial timeout="25" action="${action}" method="POST">${tn.forward_to}</Dial>`)
}
