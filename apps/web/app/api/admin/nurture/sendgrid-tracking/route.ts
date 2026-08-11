import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { verifyCronSecret } from '@/lib/cron'

export const runtime = 'nodejs'

// Diagnose and (optionally) fix SendGrid tracking so click events are generated and
// posted to our Event Webhook. GET reports current settings; POST?enable=1 turns on
// click + open tracking and makes sure the Event Webhook subscribes to click/open.
// Auth: admin session, cron secret, or the fixed preview token (?token=).
async function authorize(req: NextRequest): Promise<boolean> {
  if (verifyCronSecret(req)) return true
  const token = process.env.NURTURE_PREVIEW_TOKEN
  if (token && req.nextUrl.searchParams.get('token') === token) return true
  try {
    await requireAdmin()
    return true
  } catch {
    return false
  }
}

function sg(path: string, init?: RequestInit) {
  return fetch(`https://api.sendgrid.com/v3${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
}

async function readSettings() {
  const [clickRes, webhookRes] = await Promise.all([
    sg('/tracking_settings/click'),
    sg('/user/webhooks/event/settings'),
  ])
  const click = clickRes.ok ? await clickRes.json() : { error: clickRes.status }
  const webhook = webhookRes.ok ? await webhookRes.json() : { error: webhookRes.status }
  return { click, webhook }
}

export async function GET(req: NextRequest) {
  if (!(await authorize(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!process.env.SENDGRID_API_KEY) return NextResponse.json({ error: 'no SENDGRID_API_KEY' }, { status: 500 })
  return NextResponse.json(await readSettings())
}

export async function POST(req: NextRequest) {
  if (!(await authorize(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!process.env.SENDGRID_API_KEY) return NextResponse.json({ error: 'no SENDGRID_API_KEY' }, { status: 500 })

  const before = await readSettings()

  // 1) Enable click + open tracking.
  const clickPatch = await sg('/tracking_settings/click', { method: 'PATCH', body: JSON.stringify({ enabled: true }) })
  const openPatch = await sg('/tracking_settings/open', { method: 'PATCH', body: JSON.stringify({ enabled: true }) })

  // 2) Make sure the Event Webhook subscribes to click + open (keep its url + other flags).
  let webhookPatch: unknown = 'skipped'
  const wh = (before.webhook ?? {}) as Record<string, unknown>
  if (wh && typeof wh.url === 'string' && wh.url) {
    const body = {
      enabled: true,
      url: wh.url,
      click: true,
      open: true,
      delivered: wh.delivered ?? true,
      bounce: wh.bounce ?? true,
      dropped: wh.dropped ?? true,
      spam_report: wh.spam_report ?? true,
      unsubscribe: wh.unsubscribe ?? true,
      group_unsubscribe: wh.group_unsubscribe ?? true,
    }
    const res = await sg('/user/webhooks/event/settings', { method: 'PATCH', body: JSON.stringify(body) })
    webhookPatch = res.ok ? await res.json() : { error: res.status, detail: await res.text() }
  }

  const after = await readSettings()
  return NextResponse.json({
    ok: clickPatch.ok && openPatch.ok,
    clickPatch: clickPatch.status,
    openPatch: openPatch.status,
    webhookPatch,
    before,
    after,
  })
}
