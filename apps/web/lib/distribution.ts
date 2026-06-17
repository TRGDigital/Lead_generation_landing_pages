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
  // Brand gradient with a solid fallback (Outlook ignores the image, keeps the colour).
  const grad = 'background-color:#7c3aed;background-image:linear-gradient(135deg,#2B4FE8 0%,#8640D4 52%,#D940D4 100%)'
  const firstName = escapeHtml((lead.full_name || '').split(' ')[0] || 'the family')
  const tel = (lead.phone || '').replace(/[^\d+]/g, '')
  const phone = escapeHtml(lead.phone || '')
  const email = escapeHtml(lead.email || '')

  const detail = (k: string, v?: string | null) =>
    v
      ? `<tr><td style="padding:9px 0;border-bottom:1px solid #f0f0f2;color:#787880;font-size:13px;width:38%;vertical-align:top">${k}</td><td style="padding:9px 0;border-bottom:1px solid #f0f0f2;color:#1a1a1f;font-size:14px;font-weight:600;vertical-align:top">${escapeHtml(v)}</td></tr>`
      : ''
  const finderRows = finder.map((f) => detail(f.question, f.answer)).join('')

  return `<div style="margin:0;padding:24px 12px;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #ececf1">
    <tr><td style="${grad};padding:22px 28px" align="center">
      <img src="https://lead-generation-landing-pages.vercel.app/careassura-logo.png" alt="CareAssura" width="168" style="display:block;margin:0 auto 4px;width:168px;max-width:168px;height:auto" />
      <div style="font-size:12px;color:rgba(255,255,255,0.92);margin-top:2px;letter-spacing:0.02em">New care enquiry for you</div>
    </td></tr>
    <tr><td style="padding:28px">
      <h1 style="margin:0 0 6px;font-size:20px;color:#15151a">New enquiry${lead.area ? ` in ${escapeHtml(lead.area)}` : ''}</h1>
      <p style="margin:0 0 22px;font-size:14px;color:#555;line-height:1.55">Hi ${escapeHtml(buyer.name)}, a family looking for care has been matched to your area. Enquiries convert best within the first hour, so please get in touch with ${firstName} soon.</p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5fc;border:1px solid #ece7f7;border-radius:12px"><tr><td style="padding:18px 20px">
        <div style="font-size:18px;font-weight:700;color:#15151a">${escapeHtml(lead.full_name)}</div>
        <div style="margin-top:10px;font-size:15px"><a href="tel:${tel}" style="color:#2B4FE8;text-decoration:none;font-weight:700">${phone}</a></div>
        <div style="margin-top:5px;font-size:14px"><a href="mailto:${email}" style="color:#2B4FE8;text-decoration:none">${email}</a></div>
      </td></tr></table>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:20px">
        ${detail('Care type', lead.care_type)}
        ${detail('Care for', lead.care_for)}
        ${detail('Timeframe', lead.move_in_timeframe)}
        ${detail('Area', lead.area)}
        ${detail('Message', lead.message)}
      </table>

      ${finderRows ? `<h2 style="margin:24px 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#8a8a93">What they told us</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${finderRows}</table>` : ''}

      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 2px"><tr><td style="${grad};border-radius:9px" align="center">
        <a href="tel:${tel}" style="display:inline-block;padding:13px 30px;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none">Call ${firstName} now</a>
      </td></tr></table>
    </td></tr>
    <tr><td style="padding:18px 28px;background:#fafafa;border-top:1px solid #eee">
      <p style="margin:0;font-size:12px;color:#9a9aa2;line-height:1.55">You're receiving this because ${escapeHtml(buyer.name)} is set up to receive ${lead.area ? escapeHtml(lead.area) + ' ' : ''}enquiries through CareAssura. Reply to this email to contact the enquirer directly.</p>
    </td></tr>
  </table>
  </td></tr></table>
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
          customArgs: { lead_id: leadId, buyer_id: buyer.id },
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
