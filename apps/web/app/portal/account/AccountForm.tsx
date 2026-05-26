'use client'

import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { COPY } from '@/lib/copy/portal'
import { saveProfile, saveNotificationPrefs } from './actions'
import { toast } from '@/lib/hooks/use-toast'
import type { PortalHome } from '@/lib/portal'

type NotifPrefs = { email_new_lead: boolean; sms_new_lead: boolean }

type Props = {
  fullName: string | null
  phone: string | null
  email: string
  prefs: NotifPrefs
  home: PortalHome
}

export default function AccountForm({ fullName, phone, email, prefs, home }: Props) {
  const [pending, startTransition] = useTransition()
  const [name, setName] = useState(fullName ?? '')
  const [phoneVal, setPhone] = useState(phone ?? '')
  const [emailNewLead, setEmailNewLead] = useState(prefs.email_new_lead)
  const [smsNewLead, setSmsNewLead] = useState(prefs.sms_new_lead)

  function handleSaveProfile() {
    startTransition(async () => {
      const result = await saveProfile(name, phoneVal)
      if (result?.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error })
      } else {
        toast({ title: 'Profile saved' })
      }
    })
  }

  function handlePrefChange(key: keyof NotifPrefs, value: boolean) {
    const next = { email_new_lead: emailNewLead, sms_new_lead: smsNewLead, [key]: value }
    if (key === 'email_new_lead') setEmailNewLead(value)
    if (key === 'sms_new_lead') setSmsNewLead(value)
    startTransition(async () => {
      const result = await saveNotificationPrefs(next)
      if (result?.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error })
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <section className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold">{COPY.profileLabel}</h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phoneVal}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+44"
            />
          </div>
          <Button disabled={pending} onClick={handleSaveProfile}>
            Save
          </Button>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border bg-card p-5 space-y-4">
        <h2 className="font-semibold">{COPY.notificationsLabel}</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="email-notif" className="text-sm">
              {COPY.emailNewEnquiry}
            </label>
            <Switch
              id="email-notif"
              checked={emailNewLead}
              disabled={pending}
              onCheckedChange={(v) => handlePrefChange('email_new_lead', v)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="sms-notif" className="text-sm">
              {COPY.smsNewEnquiry}
            </label>
            <Switch
              id="sms-notif"
              checked={smsNewLead}
              disabled={pending}
              onCheckedChange={(v) => handlePrefChange('sms_new_lead', v)}
            />
          </div>
        </div>
      </section>

      {/* Care home (read-only) */}
      <section className="rounded-xl border bg-card p-5 space-y-3">
        <h2 className="font-semibold">{COPY.careHomeLabel}</h2>
        <dl className="space-y-2 text-sm">
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{home.name}</dd>
          </div>
          <div className="grid grid-cols-[120px_1fr] gap-2">
            <dt className="text-muted-foreground">Location</dt>
            <dd className="font-medium">{home.location}</dd>
          </div>
          {home.phone_display && (
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium">{home.phone_display}</dd>
            </div>
          )}
          {home.cqc_rating && (
            <div className="grid grid-cols-[120px_1fr] gap-2">
              <dt className="text-muted-foreground">CQC rating</dt>
              <dd className="font-medium">{home.cqc_rating}</dd>
            </div>
          )}
        </dl>
        <p className="text-xs text-muted-foreground">{COPY.adminChangeNote}</p>
      </section>
    </div>
  )
}
