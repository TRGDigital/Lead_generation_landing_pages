import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import sgMail from '@sendgrid/mail'
import { createServiceClient } from '@/lib/supabase/server'

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  company: z.string().max(255).optional(),
  phone: z.string().max(30).optional(),
  message: z.string().min(10).max(2000),
  website: z.string().max(0, 'Bot detected').optional(),
})

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { name, email, company, phone, message, website } = parsed.data

  // Honeypot
  if (website) {
    return NextResponse.json({ ok: true })
  }

  const ip = getIp(req)
  const db = createServiceClient() as unknown as any

  // Rate limit: max 3 submissions per IP per hour
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await db
    .from('marketing_leads')
    .select('id', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('created_at', hourAgo)

  if ((count ?? 0) >= 3) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Insert lead
  const { error: insertError } = await db.from('marketing_leads').insert({
    name,
    email,
    company: company ?? null,
    phone: phone ?? null,
    message,
    ip_address: ip,
    source: req.headers.get('referer') ?? null,
  })

  if (insertError) {
    console.error('marketing_leads insert error', insertError)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }

  // SendGrid alert
  const apiKey = process.env.SENDGRID_API_KEY
  const templateId = process.env.SENDGRID_TPL_MARKETING_LEAD
  const toEmail = process.env.MARKETING_ALERT_EMAIL ?? 'len@crosswayscarehome.co.uk'

  if (apiKey && templateId) {
    sgMail.setApiKey(apiKey)
    try {
      await sgMail.send({
        to: toEmail,
        from: { email: 'hello@carebeds.co.uk', name: 'CareBeds' },
        templateId,
        dynamicTemplateData: { name, email, company, phone, message },
      })
    } catch (err) {
      console.error('SendGrid error', err)
      // Don't fail the request — lead is already saved
    }
  }

  return NextResponse.json({ ok: true })
}
