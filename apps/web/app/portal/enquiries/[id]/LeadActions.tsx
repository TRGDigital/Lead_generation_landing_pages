'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import QualifySheet from '@/components/portal/QualifySheet'
import { COPY } from '@/lib/copy/portal'
import { updateLeadStatus } from '@/app/portal/enquiries/actions'
import { toast } from '@/lib/hooks/use-toast'
import type { LeadStatus } from '@db/types'

type NextAction = { label: string; status: LeadStatus; variant?: 'default' | 'destructive' | 'outline' }

const NEXT_ACTIONS: Partial<Record<LeadStatus, NextAction[]>> = {
  new: [
    { label: COPY.markContacted, status: 'contacted' },
  ],
  contacted: [
    { label: COPY.bookTour, status: 'tour_booked' },
    { label: COPY.markLost, status: 'lost', variant: 'outline' },
  ],
  qualified: [
    { label: COPY.bookTour, status: 'tour_booked' },
    { label: COPY.markLost, status: 'lost', variant: 'outline' },
  ],
  tour_booked: [
    { label: COPY.completeTour, status: 'tour_completed' },
    { label: COPY.markLost, status: 'lost', variant: 'outline' },
  ],
  tour_completed: [
    { label: COPY.markAssessed, status: 'assessed' },
    { label: COPY.markLost, status: 'lost', variant: 'outline' },
  ],
  assessed: [
    { label: COPY.moveIn, status: 'moved_in' },
    { label: COPY.markLost, status: 'lost', variant: 'outline' },
  ],
}

const QUALIFY_STATUSES: LeadStatus[] = ['new', 'contacted']

type Props = { leadId: string; currentStatus: LeadStatus }

export default function LeadActions({ leadId, currentStatus }: Props) {
  const [pending, startTransition] = useTransition()
  const [qualifyOpen, setQualifyOpen] = useState(false)

  function handleStatus(status: LeadStatus) {
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, status)
      if (result?.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error })
      } else {
        toast({ title: `Marked as ${COPY.status[status]}` })
      }
    })
  }

  const nextActions = NEXT_ACTIONS[currentStatus] ?? []
  const showQualify = QUALIFY_STATUSES.includes(currentStatus)

  if (nextActions.length === 0 && !showQualify) return null

  return (
    <>
      <div className="space-y-2 pt-4 border-t">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Actions</p>
        <div className="flex flex-wrap gap-2">
          {showQualify && (
            <Button variant="outline" size="sm" onClick={() => setQualifyOpen(true)}>
              {COPY.qualify}
            </Button>
          )}
          {nextActions.map((action) => (
            <Button
              key={action.status}
              size="sm"
              variant={action.variant ?? 'default'}
              disabled={pending}
              onClick={() => handleStatus(action.status)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <QualifySheet leadId={leadId} open={qualifyOpen} onOpenChange={setQualifyOpen} />
    </>
  )
}
