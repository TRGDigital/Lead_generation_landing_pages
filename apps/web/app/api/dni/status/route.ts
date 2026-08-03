import { type NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { publicWebhookUrl, validateTwilioSignature } from '@/lib/dni'

// <Dial action> callback: fires when the forwarded leg ends. Records whether the
// home answered (answered/missed) and the talk time against the tracked call.
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const params: Record<string, string> = {}
  form.forEach((v, k) => {
    params[k] = String(v)
  })

  const signature = req.headers.get('x-twilio-signature') ?? ''
  if (!validateTwilioSignature(publicWebhookUrl('/api/dni/status'), params, signature)) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const callSid = params.CallSid ?? ''
  if (callSid) {
    // DialCallStatus: completed = the home picked up; busy/no-answer/failed/canceled = missed.
    const dialStatus = params.DialCallStatus ?? ''
    const duration = Number(params.DialCallDuration ?? '')
    const db = createServiceClient() as unknown as any
    await db
      .from('tracked_calls')
      .update({
        status: dialStatus || 'completed',
        outcome: dialStatus === 'completed' ? 'answered' : 'missed',
        duration_secs: Number.isFinite(duration) ? duration : null,
        ended_at: new Date().toISOString(),
      })
      .eq('twilio_call_sid', callSid)
  }

  // Nothing more to do on the call — hang up cleanly.
  return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>', {
    headers: { 'Content-Type': 'text/xml; charset=utf-8' },
  })
}
