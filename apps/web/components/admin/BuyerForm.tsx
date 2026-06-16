'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

export type BuyerInitial = {
  name?: string
  contact_email?: string | null
  contact_phone?: string | null
  areas?: string[]
  care_types?: string[]
  price_per_lead_pennies?: number | null
  monthly_cap?: number | null
  notify_email?: boolean
  notify_sms?: boolean
  active?: boolean
  notes?: string | null
}

export default function BuyerForm({
  initial,
  action,
}: {
  initial?: BuyerInitial
  action: (fd: FormData) => Promise<{ error?: string } | void>
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [emailOn, setEmailOn] = useState(initial?.notify_email ?? true)
  const [smsOn, setSmsOn] = useState(initial?.notify_sms ?? false)
  const [active, setActive] = useState(initial?.active ?? true)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('notify_email', String(emailOn))
    fd.set('notify_sms', String(smsOn))
    fd.set('active', String(active))
    setError(null)
    startTransition(async () => {
      const res = await action(fd)
      if (res?.error) setError(res.error)
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Buyer name</Label>
        <Input id="name" name="name" required defaultValue={initial?.name ?? ''} placeholder="e.g. Sunrise Care Group" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact email</Label>
          <Input id="contact_email" name="contact_email" type="email" defaultValue={initial?.contact_email ?? ''} placeholder="leads@buyer.co.uk" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact phone (for SMS)</Label>
          <Input id="contact_phone" name="contact_phone" defaultValue={initial?.contact_phone ?? ''} placeholder="+447…" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="areas">Areas covered (one per line)</Label>
        <Textarea id="areas" name="areas" rows={4} defaultValue={(initial?.areas ?? []).join('\n')} placeholder={'Haywards Heath\nBurgess Hill\nLindfield'} />
        <p className="text-xs text-muted-foreground">Must match the lead’s area name exactly (the landing-page area, e.g. “Haywards Heath”).</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="care_types">Care types accepted (one per line)</Label>
        <Textarea id="care_types" name="care_types" rows={3} defaultValue={(initial?.care_types ?? []).join('\n')} placeholder={'Residential care\nDementia care\nNursing care'} />
        <p className="text-xs text-muted-foreground">Leave blank to accept all care types.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price_per_lead">Price per lead (£, optional)</Label>
          <Input id="price_per_lead" name="price_per_lead" type="number" step="0.01" min="0"
            defaultValue={initial?.price_per_lead_pennies != null ? (initial.price_per_lead_pennies / 100).toString() : ''} placeholder="25.00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_cap">Monthly cap (optional)</Label>
          <Input id="monthly_cap" name="monthly_cap" type="number" min="1" defaultValue={initial?.monthly_cap?.toString() ?? ''} placeholder="No limit" />
        </div>
      </div>

      <div className="space-y-4 rounded-md border p-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notify_email">Notify by email</Label>
            <p className="text-xs text-muted-foreground">Send full lead details by email.</p>
          </div>
          <Switch id="notify_email" checked={emailOn} onCheckedChange={setEmailOn} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="notify_sms">Notify by SMS</Label>
            <p className="text-xs text-muted-foreground">Send a short SMS alert (requires contact phone).</p>
          </div>
          <Switch id="notify_sms" checked={smsOn} onCheckedChange={setSmsOn} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="active">Active</Label>
            <p className="text-xs text-muted-foreground">Inactive buyers are never matched.</p>
          </div>
          <Switch id="active" checked={active} onCheckedChange={setActive} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (internal)</Label>
        <Textarea id="notes" name="notes" rows={2} defaultValue={initial?.notes ?? ''} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>{pending ? 'Saving…' : 'Save buyer'}</Button>
        <Button asChild variant="outline" type="button"><Link href="/admin/buyers">Cancel</Link></Button>
      </div>
    </form>
  )
}
