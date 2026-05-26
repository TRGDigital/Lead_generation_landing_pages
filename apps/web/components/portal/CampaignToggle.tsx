'use client'

import { useState, useTransition, useOptimistic } from 'react'
import { COPY } from '@/lib/copy/portal'
import { updateCampaign } from '@/app/portal/actions'
import { toast } from '@/lib/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type Props = {
  homeId: string
  isActive: boolean
  bedTarget: number
}

export default function CampaignToggle({ homeId, isActive, bedTarget }: Props) {
  const [pending, startTransition] = useTransition()
  const [optimisticActive, setOptimistic] = useOptimistic(isActive)
  const [showConfirm, setShowConfirm] = useState(false)
  const [beds, setBeds] = useState(bedTarget)

  function handleToggle(next: boolean) {
    if (!next) {
      setShowConfirm(true)
      return
    }
    commit(true)
  }

  function commit(next: boolean) {
    setShowConfirm(false)
    setOptimistic(next)
    startTransition(async () => {
      const result = await updateCampaign(homeId, next, beds)
      if (result.error) {
        setOptimistic(!next)
        toast({ variant: 'destructive', title: 'Could not update campaign', description: result.error })
      } else {
        toast({ title: next ? 'Campaign turned on' : 'Campaign paused' })
      }
    })
  }

  return (
    <>
      <div className="rounded-2xl border bg-card p-6 space-y-5">
        {/* Big toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-semibold">
              {optimisticActive ? COPY.campaignOn : COPY.campaignOff}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {optimisticActive
                ? 'Your landing page is live and accepting enquiries.'
                : 'Your landing page is hidden. Turn on to start receiving enquiries.'}
            </p>
          </div>
          <button
            role="switch"
            aria-checked={optimisticActive}
            disabled={pending}
            onClick={() => handleToggle(!optimisticActive)}
            className={`relative h-14 w-24 rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
              optimisticActive ? 'bg-green-500' : 'bg-muted'
            }`}
          >
            <span
              className={`absolute top-2 h-10 w-10 rounded-full bg-white shadow-md transition-transform duration-300 ${
                optimisticActive ? 'translate-x-12' : 'translate-x-2'
              }`}
            />
            <span className="sr-only">
              {optimisticActive ? 'Turn off campaign' : 'Turn on campaign'}
            </span>
          </button>
        </div>

        {/* Bed target stepper */}
        <div className="flex items-center gap-4 border-t pt-4">
          <label className="text-sm text-muted-foreground flex-1">Empty beds available</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBeds((b) => Math.max(0, b - 1))}
              className="h-8 w-8 rounded-full border flex items-center justify-center text-lg font-medium hover:bg-muted"
            >
              −
            </button>
            <span className="w-8 text-center font-semibold tabular-nums">{beds}</span>
            <button
              type="button"
              onClick={() => setBeds((b) => b + 1)}
              className="h-8 w-8 rounded-full border flex items-center justify-center text-lg font-medium hover:bg-muted"
            >
              +
            </button>
          </div>
          {beds !== bedTarget && (
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => commit(optimisticActive)}
            >
              Save
            </Button>
          )}
        </div>
      </div>

      {/* Confirm turn-off dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{COPY.turnOffConfirmTitle}</DialogTitle>
            <DialogDescription>{COPY.turnOffConfirmBody}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button variant="destructive" className="flex-1" onClick={() => commit(false)}>
              {COPY.turnOffConfirm}
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
              {COPY.turnOffCancel}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
