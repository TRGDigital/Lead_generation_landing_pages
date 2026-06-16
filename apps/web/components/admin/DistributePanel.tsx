'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { distributeLeadAction } from '@/app/admin/leads/actions'

export type MatchBuyer = {
  id: string
  name: string
  areas: string[]
  care_types: string[]
  notify_email: boolean
  notify_sms: boolean
  contact_email: string | null
  contact_phone: string | null
}

export type ExistingDistribution = {
  buyer_id: string
  buyer_name: string
  status: string
  channel: string
  sent_at: string
}

export default function DistributePanel({
  leadId,
  area,
  matches,
  existing,
}: {
  leadId: string
  area: string | null
  matches: MatchBuyer[]
  existing: ExistingDistribution[]
}) {
  const distributedIds = new Set(existing.map((e) => e.buyer_id))
  const selectable = matches.filter((m) => !distributedIds.has(m.id))
  const [selected, setSelected] = useState<Set<string>>(new Set(selectable.map((m) => m.id)))
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  function toggle(id: string) {
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  function distribute() {
    const ids = [...selected].filter((id) => !distributedIds.has(id))
    if (!ids.length) return
    setMsg(null)
    startTransition(async () => {
      const res = await distributeLeadAction(leadId, ids)
      if (res?.error) {
        setMsg(res.error)
      } else if (res?.results) {
        const sent = res.results.filter((r) => r.status === 'sent' && !r.skipped).length
        const failed = res.results.filter((r) => r.status === 'failed').length
        setMsg(`Distributed to ${sent} buyer${sent === 1 ? '' : 's'}${failed ? ` — ${failed} failed (check buyer contact details)` : ''}.`)
      }
    })
  }

  if (!area) {
    return (
      <section className="space-y-2">
        <h2 className="font-medium">Distribute</h2>
        <p className="text-sm text-muted-foreground">
          This lead isn’t a location lead, so there’s no area to match buyers against.
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium">Distribute to buyers</h2>
        <span className="text-xs text-muted-foreground">Area: {area}</span>
      </div>

      {existing.length > 0 && (
        <div className="rounded-md border bg-muted/30 p-3 text-sm">
          <p className="mb-2 font-medium text-muted-foreground">Already distributed</p>
          <ul className="space-y-1">
            {existing.map((e) => (
              <li key={e.buyer_id} className="flex items-center justify-between gap-3">
                <span>{e.buyer_name}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant={e.status === 'failed' ? 'destructive' : 'secondary'}>{e.status}</Badge>
                  {new Date(e.sent_at).toLocaleDateString('en-GB')} · {e.channel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectable.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {matches.length === 0
            ? `No active buyers cover “${area}” for this care type. Add or adjust buyers in the Buyers section.`
            : 'All matching buyers have already received this lead.'}
        </p>
      ) : (
        <>
          <ul className="divide-y rounded-md border">
            {selectable.map((b) => (
              <li key={b.id} className="flex items-start gap-3 p-3">
                <Checkbox id={`b-${b.id}`} checked={selected.has(b.id)} onCheckedChange={() => toggle(b.id)} className="mt-0.5" />
                <label htmlFor={`b-${b.id}`} className="flex-1 cursor-pointer">
                  <span className="block text-sm font-medium">{b.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {b.care_types.length ? b.care_types.join(', ') : 'All care types'}
                    {' · '}
                    {[b.notify_email && b.contact_email ? 'email' : null, b.notify_sms && b.contact_phone ? 'SMS' : null]
                      .filter(Boolean)
                      .join(' + ') || 'no contact set'}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Button onClick={distribute} disabled={pending || selected.size === 0}>
              {pending ? 'Sending…' : `Distribute to ${[...selected].filter((id) => !distributedIds.has(id)).length}`}
            </Button>
            {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
          </div>
        </>
      )}
    </section>
  )
}
