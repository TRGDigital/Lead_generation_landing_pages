'use client'

import { useState, useTransition } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { updateLeadStatus, addLeadNote } from '@/app/admin/leads/actions'
import type { Tables } from '@db/types'
import type { LeadStatus } from '@db/types'

type LeadRow = Tables<'leads'>

const WORKFLOW: LeadStatus[] = [
  'new',
  'contacted',
  'qualified',
  'tour_booked',
  'tour_completed',
  'assessed',
  'moved_in',
]

const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  tour_booked: 'Tour Booked',
  tour_completed: 'Tour Completed',
  assessed: 'Assessed',
  converted: 'Converted',
  moved_in: 'Moved In',
  lost: 'Lost',
}

export default function StatusWorkflow({ lead }: { lead: LeadRow }) {
  const [pending, startTransition] = useTransition()
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState('')
  const [weeklyFee, setWeeklyFee] = useState('')

  const currentIdx = WORKFLOW.indexOf(lead.status as LeadStatus)

  function advance() {
    if (currentIdx >= WORKFLOW.length - 1) return
    const nextStatus = WORKFLOW[currentIdx + 1]
    if (!nextStatus) return
    startTransition(async () => {
      await updateLeadStatus({
        leadId: lead.id,
        status: nextStatus,
        weeklyFeePennies:
          nextStatus === 'moved_in' && weeklyFee ? Number(weeklyFee) * 100 : undefined,
      })
    })
  }

  function markLost() {
    startTransition(async () => {
      await updateLeadStatus({ leadId: lead.id, status: 'lost' })
    })
  }

  function submitNote() {
    if (!note.trim()) {
      setNoteError('Note cannot be empty')
      return
    }
    setNoteError('')
    startTransition(async () => {
      await addLeadNote(lead.id, note)
      setNote('')
    })
  }

  const nextStatus =
    currentIdx >= 0 && currentIdx < WORKFLOW.length - 1
      ? WORKFLOW[currentIdx + 1]
      : null

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Status</h2>
        <Badge>{STATUS_LABELS[lead.status as LeadStatus] ?? lead.status}</Badge>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {WORKFLOW.map((s, i) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${
              i <= currentIdx ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      {nextStatus === 'moved_in' && (
        <div>
          <label className="text-xs text-muted-foreground">Weekly fee (£)</label>
          <input
            type="number"
            value={weeklyFee}
            onChange={(e) => setWeeklyFee(e.target.value)}
            placeholder="e.g. 1200"
            className="mt-1 block h-9 w-40 rounded-md border border-input px-3 text-sm"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {nextStatus && lead.status !== 'lost' && (
          <Button onClick={advance} disabled={pending} size="sm">
            Advance to {STATUS_LABELS[nextStatus]}
          </Button>
        )}
        {lead.status !== 'lost' && lead.status !== 'moved_in' && (
          <Button onClick={markLost} disabled={pending} size="sm" variant="destructive">
            Mark Lost
          </Button>
        )}
      </div>

      {/* Add note */}
      <div className="space-y-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note…"
          rows={3}
          className="w-full rounded-md border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {noteError && <p className="text-xs text-destructive">{noteError}</p>}
        <Button onClick={submitNote} disabled={pending} size="sm" variant="outline">
          Add Note
        </Button>
      </div>
    </section>
  )
}
