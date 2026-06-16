'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'

// The three standard care types buyers can accept. These match the care_type
// values captured on the location landing pages, so matching aligns exactly.
export const CARE_TYPE_OPTIONS = ['Residential care', 'Nursing care', 'Dementia care']

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
  areaOptions,
}: {
  initial?: BuyerInitial
  action: (fd: FormData) => Promise<{ error?: string } | void>
  areaOptions: string[]
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [areaSel, setAreaSel] = useState<Set<string>>(new Set(initial?.areas ?? []))
  const [careSel, setCareSel] = useState<Set<string>>(new Set(initial?.care_types ?? []))
  const [emailOn, setEmailOn] = useState(initial?.notify_email ?? true)
  const [smsOn, setSmsOn] = useState(initial?.notify_sms ?? false)
  const [active, setActive] = useState(initial?.active ?? true)

  function toggle(set: Set<string>, setter: (s: Set<string>) => void, v: string) {
    const n = new Set(set)
    if (n.has(v)) n.delete(v)
    else n.add(v)
    setter(n)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.delete('areas')
    fd.delete('care_types')
    areaSel.forEach((a) => fd.append('areas', a))
    careSel.forEach((c) => fd.append('care_types', c))
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
        <Label>Landing-page areas covered</Label>
        <p className="text-xs text-muted-foreground">Tick the landing pages this buyer should receive leads from. This is what links a landing page to the buyer.</p>
        {areaOptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No published landing pages yet — create one under Care Homes first.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-2">
            {areaOptions.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm">
                <Checkbox checked={areaSel.has(a)} onCheckedChange={() => toggle(areaSel, setAreaSel, a)} />
                {a}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Care types accepted</Label>
        <p className="text-xs text-muted-foreground">Leave all unticked to accept every care type.</p>
        <div className="flex flex-wrap gap-4 rounded-md border p-3">
          {CARE_TYPE_OPTIONS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <Checkbox checked={careSel.has(c)} onCheckedChange={() => toggle(careSel, setCareSel, c)} />
              {c}
            </label>
          ))}
        </div>
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
