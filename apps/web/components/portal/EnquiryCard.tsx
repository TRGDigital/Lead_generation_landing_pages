'use client'

import Link from 'next/link'
import { Phone, ChevronRight } from 'lucide-react'
import { useTransition } from 'react'
import StatusBadge from './StatusBadge'
import { Button } from '@/components/ui/button'
import { COPY } from '@/lib/copy/portal'
import { markContacted } from '@/app/portal/enquiries/actions'
import type { Tables } from '@db/types'

type Lead = Pick<Tables<'leads'>, 'id' | 'full_name' | 'phone' | 'care_type' | 'status' | 'created_at'>

function relativeTime(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  if (diff < 60) return rtf.format(-Math.round(diff), 'second')
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), 'minute')
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), 'hour')
  return rtf.format(-Math.round(diff / 86400), 'day')
}

type Props = { lead: Lead }

export default function EnquiryCard({ lead }: Props) {
  const [pending, startTransition] = useTransition()

  function handleMarkContacted() {
    startTransition(async () => {
      await markContacted(lead.id)
    })
  }

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold truncate">{lead.full_name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{relativeTime(lead.created_at)}</p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      {lead.care_type && (
        <p className="text-sm text-muted-foreground">{lead.care_type}</p>
      )}

      <div className="flex items-center gap-2">
        {lead.status === 'new' && (
          <Button size="sm" disabled={pending} onClick={handleMarkContacted}>
            {COPY.markContacted}
          </Button>
        )}
        <a
          href={`tel:${lead.phone}`}
          className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-muted"
        >
          <Phone className="h-3.5 w-3.5" />
          {COPY.callLabel}
        </a>
        <Link
          href={`/portal/enquiries/${lead.id}`}
          className="ml-auto inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          View <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
