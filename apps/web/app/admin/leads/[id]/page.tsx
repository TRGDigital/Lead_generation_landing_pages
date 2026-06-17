import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { Separator } from '@/components/ui/separator'
import StatusWorkflow from '@/components/admin/StatusWorkflow'
import ActivityTimeline from '@/components/admin/ActivityTimeline'
import DistributePanel from '@/components/admin/DistributePanel'
import { matchBuyersForLead } from '@/lib/distribution'
import { getQuestionSet, formatAnswers } from '@/lib/care-finder'
import type { Tables } from '@db/types'

export const dynamic = 'force-dynamic'

type LeadRow = Tables<'leads'>
type ActivityRow = Tables<'lead_activities'>
type HomeRow = Pick<Tables<'care_homes'>, 'id' | 'name'>

async function getLeadDetail(id: string) {
  const supabase = createServiceClient()

  const [leadResult, activitiesResult] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).single(),
    supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false }),
  ])

  const lead = leadResult.data as unknown as LeadRow | null
  if (!lead) return null

  const homesResult = await supabase
    .from('care_homes')
    .select('id, name')
    .eq('id', lead.care_home_id)
    .single()

  const home = homesResult.data as unknown as HomeRow | null
  const activities = (activitiesResult.data ?? []) as unknown as ActivityRow[]

  // Distribution: matched buyers + any already-sent distributions for this lead.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const leadAny = lead as any
  const matches = await matchBuyersForLead({
    id: lead.id,
    full_name: lead.full_name,
    email: lead.email,
    phone: lead.phone,
    area: leadAny.area ?? null,
    care_type: lead.care_type ?? null,
    care_for: leadAny.care_for ?? null,
    move_in_timeframe: lead.move_in_timeframe ?? null,
    message: lead.message ?? null,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const distResult = await (supabase as any)
    .from('lead_distributions')
    .select('buyer_id, status, channel, sent_at, buyers(name)')
    .eq('lead_id', id)
    .order('sent_at', { ascending: false })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existing = ((distResult.data ?? []) as any[]).map((r) => ({
    buyer_id: r.buyer_id as string,
    buyer_name: (r.buyers?.name as string) ?? 'Unknown buyer',
    status: r.status as string,
    channel: r.channel as string,
    sent_at: r.sent_at as string,
  }))

  // Care-finder quiz answers (resolved to labelled Q&A in template order).
  let finder: Array<{ question: string; answer: string }> = []
  if (leadAny.answers && typeof leadAny.answers === 'object' && Object.keys(leadAny.answers).length) {
    const { data: pg } = await (supabase as any).from('location_pages').select('question_set').eq('area_name', leadAny.area).limit(1).maybeSingle()
    const set = await getQuestionSet((pg?.question_set as string) ?? 'residential')
    finder = formatAnswers(set, leadAny.answers as Record<string, unknown>)
  }

  return { lead, home, activities, area: (leadAny.area ?? null) as string | null, matches, existing, finder }
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const result = await getLeadDetail(params.id)
  if (!result) notFound()

  const { lead, home, activities, area, matches, existing, finder } = result

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">
          {home?.name ?? 'Unknown home'}
        </p>
        <h1 className="text-2xl font-semibold">{lead.full_name}</h1>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span>{lead.email}</span>
          <span>·</span>
          <span>{lead.phone}</span>
          {lead.care_type && (
            <>
              <span>·</span>
              <span>{lead.care_type}</span>
            </>
          )}
        </div>
      </div>

      <Separator />

      {/* Care-finder quiz answers */}
      {finder.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-medium">Care Finder Answers</h2>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {finder.map((f) => (
              <div key={f.question} className="flex flex-col">
                <dt className="text-muted-foreground">{f.question}</dt>
                <dd className="font-medium">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Enquiry details */}
      <section className="space-y-3">
        <h2 className="font-medium">Enquiry Details</h2>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {lead.resident_name && (
            <>
              <dt className="text-muted-foreground">Resident name</dt>
              <dd>{lead.resident_name}</dd>
            </>
          )}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(lead as any).care_for && (
            <>
              <dt className="text-muted-foreground">Who is the care for</dt>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <dd>{(lead as any).care_for}</dd>
            </>
          )}
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(lead as any).area && (
            <>
              <dt className="text-muted-foreground">Area</dt>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <dd>{(lead as any).area} (location lead)</dd>
            </>
          )}
          {lead.move_in_timeframe && (
            <>
              <dt className="text-muted-foreground">Move-in timeframe</dt>
              <dd>{lead.move_in_timeframe}</dd>
            </>
          )}
          {lead.message && (
            <>
              <dt className="text-muted-foreground">Message</dt>
              <dd className="col-span-1">{lead.message}</dd>
            </>
          )}
          {lead.utm_source && (
            <>
              <dt className="text-muted-foreground">Source</dt>
              <dd>
                {lead.utm_source}
                {lead.utm_campaign && ` / ${lead.utm_campaign}`}
              </dd>
            </>
          )}
        </dl>
      </section>

      <Separator />

      {/* Lead distribution */}
      <DistributePanel leadId={lead.id} area={area} matches={matches} existing={existing} />

      <Separator />

      {/* Status workflow */}
      <StatusWorkflow lead={lead} />

      <Separator />

      {/* Activity timeline */}
      <ActivityTimeline activities={activities} />
    </div>
  )
}
