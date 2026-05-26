'use client'

import { useTransition } from 'react'
import { ChevronDown } from 'lucide-react'
import { setPortalHome } from '@/app/portal/actions'
import type { PortalHome } from '@/lib/portal'

type Props = {
  homes: PortalHome[]
  selectedHome: PortalHome
}

export default function CareHomeSelector({ homes, selectedHome }: Props) {
  const [pending, startTransition] = useTransition()

  if (homes.length <= 1) {
    return <span className="text-sm font-medium truncate max-w-[160px]">{selectedHome.name}</span>
  }

  return (
    <div className="relative">
      <select
        value={selectedHome.id}
        disabled={pending}
        onChange={(e) => {
          const id = e.target.value
          startTransition(async () => { await setPortalHome(id) })
        }}
        className="appearance-none bg-transparent pr-6 text-sm font-medium cursor-pointer focus:outline-none max-w-[200px] truncate"
      >
        {homes.map((h) => (
          <option key={h.id} value={h.id}>{h.name}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  )
}
