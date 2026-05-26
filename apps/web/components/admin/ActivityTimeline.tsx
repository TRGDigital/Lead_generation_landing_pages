import { responseTimeLabel } from '@lib/response-time'
import type { Tables } from '@db/types'

type ActivityRow = Tables<'lead_activities'>

const TYPE_LABELS: Record<string, string> = {
  status_change: 'Status changed',
  note_added: 'Note added',
  email_sent: 'Email sent',
  sms_sent: 'SMS sent',
  call_logged: 'Call logged',
}

export default function ActivityTimeline({ activities }: { activities: ActivityRow[] }) {
  return (
    <section className="space-y-4">
      <h2 className="font-medium">Activity</h2>
      {activities.length === 0 && (
        <p className="text-sm text-muted-foreground">No activity yet.</p>
      )}
      <ol className="space-y-4">
        {activities.map((a) => (
          <li key={a.id} className="flex gap-3">
            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                {TYPE_LABELS[a.type] ?? a.type}
                {a.type === 'status_change' && a.new_value && (
                  <span className="ml-1 font-normal text-muted-foreground">
                    → {a.new_value.replace(/_/g, ' ')}
                  </span>
                )}
              </p>
              {a.note && <p className="text-sm text-muted-foreground">{a.note}</p>}
              <p className="text-xs text-muted-foreground">
                {responseTimeLabel(a.created_at)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
