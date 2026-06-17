// Lead distribution engine — matches unassigned location leads to buyers (by area
// + care type) and delivers them via email/SMS. Used by the manual admin action
// and (behind a flag) the auto-route hook on lead capture.
import { createServiceClient } from '@/lib/supabase/server'
import { sendHtmlEmail } from '@lib/sendgrid'
import { sendSms } from '@lib/twilio'
import { getQuestionSet, formatAnswers } from '@/lib/care-finder'

export type DistLead = {
  id: string
  full_name: string
  email: string
  phone: string
  area: string | null
  care_type: string | null
  care_for: string | null
  move_in_timeframe: string | null
  message: string | null
  answers?: Record<string, unknown> | null
}

export type Buyer = {
  id: string
  name: string
  contact_email: string | null
  contact_phone: string | null
  areas: string[]
  care_types: string[]
  price_per_lead_pennies: number | null
  monthly_cap: number | null
  notify_email: boolean
  notify_sms: boolean
  active: boolean
}

export type DistributionResult = {
  buyerId: string
  buyerName: string
  status: 'sent' | 'failed'
  error?: string
  skipped?: boolean
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

async function monthlyCount(db: ReturnType<typeof createServiceClient>, buyerId: string): Promise<number> {
  const start = new Date()
  start.setUTCDate(1)
  start.setUTCHours(0, 0, 0, 0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (db as any)
    .from('lead_distributions')
    .select('id', { count: 'exact', head: true })
    .eq('buyer_id', buyerId)
    .gte('created_at', start.toISOString())
  return count ?? 0
}

// Active buyers that cover the lead's area, accept its care type, and are under cap.
export async function matchBuyersForLead(lead: DistLead): Promise<Buyer[]> {
  if (!lead.area) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any
  const { data } = await db.from('buyers').select('*').eq('active', true)
  const buyers = (data ?? []) as Buyer[]

  const eligible: Buyer[] = []
  for (const b of buyers) {
    const coversArea = (b.areas ?? []).includes(lead.area)
    const acceptsType = !b.care_types?.length || (lead.care_type ? b.care_types.includes(lead.care_type) : true)
    if (!coversArea || !acceptsType) continue
    if (b.monthly_cap != null && (await monthlyCount(db, b.id)) >= b.monthly_cap) continue
    eligible.push(b)
  }
  return eligible
}

function leadEmailHtml(lead: DistLead, buyer: Buyer, finder: Array<{ question: string; answer: string }> = []): string {
  const row = (k: string, v?: string | null) =>
    v
      ? `<tr><td style="padding:4px 14px 4px 0;color:#666;vertical-align:top">${k}</td><td style="padding:4px 0;font-weight:600">${escapeHtml(v)}</td></tr>`
      : ''
  const finderRows = finder.map((f) => row(f.question, f.answer)).join('')
  return `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;color:#1a1a1a">
    <h2 style="margin:0 0 4px">New care enquiry${lead.area ? ` — ${escapeHtml(lead.area)}` : ''}</h2>
    <p style="color:#666;margin:0 0 16px">Hi ${escapeHtml(buyer.name)}, a new enquiry has been matched to your area. Please contact the family promptly.</p>
    <table style="border-collapse:collapse;font-size:14px">
      ${row('Name', lead.full_name)}
      ${row('Phone', lead.phone)}
      ${row('Email', lead.email)}
      ${row('Area', lead.area)}
      ${row('Care type', lead.care_type)}
      ${row('Care for', lead.care_for)}
      ${row('Timeframe', lead.move_in_timeframe)}
      ${row('Message', lead.message)}
    </table>
    ${finderRows ? `<h3 style="margin:20px 0 6px;font-size:14px">What they told us</h3><table style="border-collapse:collapse;font-size:14px">${finderRows}</table>` : ''}
    <p style="color:#999;font-size:12px;margin-top:18px">Sent via CareAssura lead distribution.</p>
  </div>`
}

function leadSmsBody(lead: DistLead): string {
  return `New CareAssura lead${lead.area ? ` (${lead.area})` : ''}: ${lead.full_name}, ${lead.phone}${
    lead.care_type ? `, ${lead.care_type}` : ''
  }. See email for full details.`
}

// Distribute a lead to the given buyers: notify (email/SMS) + record. Idempotent
// per (lead, buyer) — re-running skips buyers that already received it.
export async function distributeLead(
  leadId: string,
  buyerIds: string[],
  performedBy: string | null
): Promise<DistributionResult[]> {
  if (!buyerIds.length) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = createServiceClient() as any

  const { data: leadData } = await db.from('leads').select('*').eq('id', leadId).single()
  const lead = leadData as DistLead | null
  if (!lead) return []

  // Resolve the care-finder answers into labelled Q&A for the buyer email.
  let finder: Array<{ question: string; answer: string }> = []
  try {
    if (lead.answers && Object.keys(lead.answers).length && lead.area) {
      const { data: pg } = await db.from('location_pages').select('question_set').eq('area_name', lead.area).limit(1).maybeSingle()
      const set = await getQuestionSet((pg?.question_set as string) ?? 'residential')
      finder = formatAnswers(set, lead.answers as Record<string, unknown>)
    }
  } catch { /* best-effort — email still sends without the answer detail */ }

  const { data: buyerData } = await db.from('buyers').select('*').in('id', buyerIds)
  const buyers = (buyerData ?? []) as Buyer[]

  const { data: existing } = await db.from('lead_distributions').select('buyer_id').eq('lead_id', leadId)
  const already = new Set((existing ?? []).map((r: { buyer_id: string }) => r.buyer_id))

  const results: DistributionResult[] = []
  for (const buyer of buyers) {
    if (already.has(buyer.id)) {
      results.push({ buyerId: buyer.id, buyerName: buyer.name, status: 'sent', skipped: true })
      continue
    }
    let status: 'sent' | 'failed' = 'sent'
    let error: string | undefined
    const channels: string[] = []
    try {
      if (buyer.notify_email && buyer.contact_email) {
        await sendHtmlEmail({
          to: buyer.contact_email,
          toName: buyer.name,
          subject: `New CareAssura lead${lead.area ? ` — ${lead.area}` : ''}${lead.care_type ? ` (${lead.care_type})` : ''}`,
          html: leadEmailHtml(lead, buyer, finder),
          replyTo: lead.email,
        })
        channels.push('email')
      }
      if (buyer.notify_sms && buyer.contact_phone) {
        await sendSms({ to: buyer.contact_phone, body: leadSmsBody(lead) })
        channels.push('sms')
      }
    } catch (e) {
      status = 'failed'
      error = e instanceof Error ? e.message : String(e)
    }

    await db.from('lead_distributions').upsert(
      {
        lead_id: leadId,
        buyer_id: buyer.id,
        channel: channels.join('+') || 'none',
        price_pennies: buyer.price_per_lead_pennies ?? null,
        status,
        error: error ?? null,
        sent_at: new Date().toISOString(),
      },
      { onConflict: 'lead_id,buyer_id' }
    )
    results.push({ buyerId: buyer.id, buyerName: buyer.name, status, error })
  }

  const sentNames = results.filter((r) => r.status === 'sent' && !r.skipped).map((r) => r.buyerName)
  if (sentNames.length) {
    await db.from('leads').update({ distributed_at: new Date().toISOString() }).eq('id', leadId)
    await db.from('lead_activities').insert({
      lead_id: leadId,
      type: 'distributed',
      note: `Distributed to ${sentNames.join(', ')}`,
      performed_by: performedBy,
    })
  }
  return results
}
