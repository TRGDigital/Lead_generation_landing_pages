import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { SEQUENCE_BY_ID } from '@/lib/tool-nurture/sequence'
import { renderEmailHtml, SITE } from '@/lib/tool-nurture/layout'

export const runtime = 'nodejs'

// Renders one sequence email as HTML so admins can preview exactly what recipients see.
export async function GET(_req: NextRequest, { params }: { params: { emailId: string } }) {
  await requireAdmin()
  const email = SEQUENCE_BY_ID[params.emailId]
  if (!email) return new NextResponse('Not found', { status: 404 })

  const html = renderEmailHtml({
    subject: email.subject,
    preheader: email.preheader,
    bodyHtml: email.body({}),
    unsubscribeUrl: `${SITE}/api/nurture/unsubscribe?t=preview`,
  })
  return new NextResponse(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
}
