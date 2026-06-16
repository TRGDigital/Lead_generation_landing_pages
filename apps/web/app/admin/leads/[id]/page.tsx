import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import { Separator } from '@/components/ui/separator'
import StatusWorkflow from '@/components/admin/StatusWorkflow'
import ActivityTimeline from '@/components/admin/ActivityTimeline'
import type { Tables } from '@db/types'

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

  return { lead, home, activities }
}

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const result = await getLeadDetail(params.id)
  if (!result) notFound()

  const { lead, home, activities } = result

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

      {/* Status workflow */}
      <StatusWorkflow lead={lead} />

      <Separator />

      {/* Activity timeline */}
      <ActivityTimeline activities={activities} />
    </div>
  )
}
