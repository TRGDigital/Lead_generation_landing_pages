import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

// One-click unsubscribe from the tool-signup nurture sequence. The token is the
// enrolment's unguessable unsubscribe_token. Preview emails use the token "preview".
function page(title: string, body: string): NextResponse {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{margin:0;background:#f6f4f0;font-family:Arial,Helvetica,sans-serif;color:#2a2620}.card{max-width:520px;margin:12vh auto;background:#fff;border:1px solid #ece8e1;border-radius:16px;padding:40px;text-align:center}.bar{height:4px;background:#F0532B;border-radius:2px;width:56px;margin:0 auto 20px}h1{font-size:22px;margin:0 0 12px}p{font-size:15px;line-height:1.6;color:#5f5a52;margin:0 0 8px}a{color:#F0532B;font-weight:700;text-decoration:none}</style></head>
<body><div class="card"><div class="bar"></div><h1>${title}</h1>${body}<p style="margin-top:20px"><a href="https://www.trgdigital.co.uk/tools">Back to the free tools</a></p></div></body></html>`
  return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('t')?.trim()
  if (!token) return page('Link not recognised', '<p>This unsubscribe link is missing its code.</p>')

  if (token === 'preview') {
    return page('This is a preview', '<p>Preview emails are not tied to a real subscription, so there is nothing to unsubscribe. On a live email this button removes the recipient from the sequence instantly.</p>')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data: en } = await db
    .from('nurture_enrollments')
    .select('id, status')
    .eq('unsubscribe_token', token)
    .maybeSingle()

  if (!en) return page('Link not recognised', '<p>We could not find a subscription for this link. It may already have been removed.</p>')

  if (en.status !== 'unsubscribed') {
    await db.from('nurture_enrollments').update({ status: 'unsubscribed', updated_at: new Date().toISOString() }).eq('id', en.id)
  }
  return page('You are unsubscribed', '<p>You will not receive any more emails from the TRG Digital tool series. No hard feelings, and the free tools are always here when you need them.</p>')
}

// SendGrid one-click unsubscribe (List-Unsubscribe-Post) sends a POST; treat it the same.
export async function POST(req: NextRequest) {
  return GET(req)
}
