'use client'

import { useState, useTransition } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { COPY } from '@/lib/copy/portal'
import { qualifyLead } from '@/app/portal/enquiries/actions'
import { toast } from '@/lib/hooks/use-toast'

type Props = {
  leadId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Step = 'choice' | 'disqualify'

export default function QualifySheet({ leadId, open, onOpenChange }: Props) {
  const [pending, startTransition] = useTransition()
  const [step, setStep] = useState<Step>('choice')
  const [reason, setReason] = useState<string>(COPY.disqualifyReasons[0]?.value ?? '')
  const [notes, setNotes] = useState('')

  function reset() {
    setStep('choice')
    setReason(COPY.disqualifyReasons[0]?.value ?? '')
    setNotes('')
  }

  function handleQualify() {
    startTransition(async () => {
      const result = await qualifyLead(leadId, true)
      if (result?.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error })
      } else {
        toast({ title: COPY.qualified })
        onOpenChange(false)
        reset()
      }
    })
  }

  function handleDisqualify() {
    startTransition(async () => {
      const result = await qualifyLead(leadId, false, reason, notes || undefined)
      if (result?.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error })
      } else {
        toast({ title: COPY.notQualified })
        onOpenChange(false)
        reset()
      }
    })
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        if (!v) reset()
      }}
    >
      <SheetContent side="bottom" className="rounded-t-2xl space-y-4">
        <SheetHeader>
          <SheetTitle>{COPY.qualify}</SheetTitle>
        </SheetHeader>

        {step === 'choice' && (
          <div className="flex flex-col gap-3 pb-4">
            <Button className="h-14 text-base" disabled={pending} onClick={handleQualify}>
              {COPY.qualified}
            </Button>
            <Button
              variant="outline"
              className="h-14 text-base"
              disabled={pending}
              onClick={() => setStep('disqualify')}
            >
              {COPY.notQualified}
            </Button>
          </div>
        )}

        {step === 'disqualify' && (
          <div className="space-y-4 pb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none"
              >
                {COPY.disqualifyReasons.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (optional)</label>
              <Textarea
                placeholder="Any extra detail…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep('choice')}>
                Back
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={pending}
                onClick={handleDisqualify}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
