import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Phone, Mail } from 'lucide-react'
import { requirePortalHome } from '@/lib/portal'
import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/portal/StatusBadge'
import NoteField from './NoteField'
import LeadActions from './LeadActions'
import { COPY } from '@/lib/copy/portal'
import type { Tables, LeadStatus } from '@db/types'

type Lead = Tables<'leads'>
type Activity = Tables<'lead_activities'>

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function activityDescription(a: Activity): string {
  if (a.type === 'status_change') {
    const from = a.old_value ? (COPY.status[a.old_value] ?? a.old_value) : '—'
    const to = a.new_value ? (COPY.status[a.new_value] ?? a.new_value) : '—'
    return `Status changed from ${from} to ${to}`
  }
  if (a.type === 'note') return `Note: ${a.note ?? ''}`
  if (a.type === 'qualified') return a.new_value === 'true' ? 'Marked as qualified' : `Not qualified — ${a.note ?? ''}`
  return a.type
}

type Props = { params: { id: string } }

export const metadata = { title: COPY.Enquiry }

export default async function EnquiryDetailPage({ params }: Props) {
  const { home } = await requirePortalHome()
  // ADR-002: leads/lead_activities select resolves to never in strict mode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createClient() as any

  const [leadRes, activitiesRes] = await Promise.all([
    supabase
      .from('leads')
      .select('*')
      .eq('id', params.id)
      .eq('care_home_id', home.id)
      .single() as Promise<{ data: Lead | null; error: unknown }>,
    supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', params.id)
      .order('created_at', { ascending: true }) as Promise<{ data: Activity[] | null; error: unknown }>,
  ])

  if (!leadRes.data) notFound()

  const lead = leadRes.data
  const activities = activitiesRes.data ?? []

  const fields: { label: string; value: string | null | undefined }[] = [
    { label: COPY.residentLabel, value: lead.resident_name },
    { label: COPY.careTypeLabel, value: lead.care_type },
    { label: COPY.timingLabel, value: lead.move_in_timeframe },
    { label: COPY.messageLabel, value: lead.message },
  ]

  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/portal/enquiries"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        {COPY.Enquiries}
      </Link>

      {/* Header */}
      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">{lead.full_name}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {COPY.receivedLabel} {formatDate(lead.created_at)}
            </p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        {/* Contact */}
        <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${lead.phone}`}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <Phone className="h-3.5 w-3.5" />
            {lead.phone}
          </a>
          <a
            href={`mailto:${lead.email}`}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-muted"
          >
            <Mail className="h-3.5 w-3.5" />
            {lead.email}
          </a>
        </div>

        {/* Enquiry details */}
        <dl className="space-y-2">
          {fields.map(({ label, value }) =>
            value ? (
              <div key={label} className="grid grid-cols-[120px_1fr] gap-2 text-sm">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ) : null
          )}
        </dl>

        {/* Workflow actions */}
        <LeadActions leadId={lead.id} currentStatus={lead.status as LeadStatus} />
      </div>

      {/* Notes */}
      <div className="rounded-xl border bg-card p-5">
        <NoteField leadId={lead.id} initialNote={lead.notes} />
      </div>

      {/* Activity timeline */}
      {activities.length > 0 && (
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <p className="text-sm font-medium">{COPY.activityLabel}</p>
          <ol className="space-y-3">
            {activities.map((a) => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p>{activityDescription(a)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(a.created_at)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
