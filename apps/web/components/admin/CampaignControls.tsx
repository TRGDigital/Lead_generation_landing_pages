'use client'

import { useTransition } from 'react'
import { Switch } from '@/components/ui/switch'
import { toggleCareHomeActive } from '@/app/admin/care-homes/actions'

type Props = {
  homeId: string
  isActive: boolean
  homeName: string
}

export default function CampaignControls({ homeId, isActive, homeName }: Props) {
  const [pending, startTransition] = useTransition()

  function toggle(checked: boolean) {
    startTransition(async () => {
      await toggleCareHomeActive(homeId, checked)
    })
  }

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4">
      <div>
        <p className="font-medium">{homeName}</p>
        <p className="text-sm text-muted-foreground">
          {isActive ? 'Landing page live — accepting enquiries' : 'Paused — landing page hidden'}
        </p>
      </div>
      <Switch
        checked={isActive}
        onCheckedChange={toggle}
        disabled={pending}
        aria-label={`Toggle ${homeName}`}
      />
    </div>
  )
}
