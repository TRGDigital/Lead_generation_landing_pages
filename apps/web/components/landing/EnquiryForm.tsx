'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EnquiryFormSchema, type EnquiryFormValues } from '@lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { FormConfig } from '@/lib/types/care-home'

interface EnquiryFormProps {
  careHomeId: string
  formConfig: FormConfig
}

const SELECT_CLASS =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'

export default function EnquiryForm({ careHomeId, formConfig }: EnquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [idempotencyKey] = useState<string>(() =>
    typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(EnquiryFormSchema),
    defaultValues: { careHomeId, companyWebsite: '' },
  })

  async function onSubmit(values: EnquiryFormValues) {
    setStatus('submitting')

    const params =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          idempotencyKey,
          utmSource: params.get('utm_source') ?? undefined,
          utmMedium: params.get('utm_medium') ?? undefined,
          utmCampaign: params.get('utm_campaign') ?? undefined,
          utmContent: params.get('utm_content') ?? undefined,
          utmTerm: params.get('utm_term') ?? undefined,
          gclid: params.get('gclid') ?? undefined,
        }),
      })

      if (res.ok) {
        setStatus('success')
        window.gtag?.('event', 'generate_lead', { care_home_id: careHomeId })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-8 animate-fadeUp">
        <div className="w-14 h-14 rounded-full bg-brand-sage/20 text-brand-sage text-3xl flex items-center justify-center mx-auto mb-4">
          ✓
        </div>
        <h3 className="font-display text-xl text-brand-ink mb-2">Enquiry sent!</h3>
        <p className="text-brand-ink-soft text-sm leading-relaxed">
          Thank you. A member of our team will be in touch within 2 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Honeypot — hidden from real users */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
        <input
          {...register('companyWebsite')}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

      <input type="hidden" {...register('careHomeId')} />

      <div>
        <Label htmlFor="fullName">Full name *</Label>
        <Input
          id="fullName"
          {...register('fullName')}
          aria-invalid={!!errors.fullName}
          className="mt-1"
        />
        {errors.fullName && (
          <p className="text-destructive text-xs mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            className="mt-1"
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            aria-invalid={!!errors.phone}
            className="mt-1"
          />
          {errors.phone && (
            <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="residentName">Resident name (optional)</Label>
        <Input id="residentName" {...register('residentName')} className="mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="careType">Care type</Label>
          <select id="careType" {...register('careType')} className={`mt-1 ${SELECT_CLASS}`}>
            <option value="">Select…</option>
            {formConfig.care_type_options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="moveInTimeframe">When needed</Label>
          <select
            id="moveInTimeframe"
            {...register('moveInTimeframe')}
            className={`mt-1 ${SELECT_CLASS}`}
          >
            <option value="">Select…</option>
            {formConfig.timeframe_options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <Textarea
          id="message"
          {...register('message')}
          rows={3}
          className="mt-1 resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="text-destructive text-sm bg-destructive/5 rounded-md px-3 py-2">
          Something went wrong. Please try again or call us directly.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-brand-accent hover:bg-brand-accent-soft text-white h-11 text-base"
      >
        {status === 'submitting' ? 'Sending…' : formConfig.cta_label}
      </Button>

      <p className="text-xs text-brand-ink-muted text-center leading-relaxed">
        By submitting this form you agree to be contacted regarding this enquiry.
        No spam. No obligation.
      </p>
    </form>
  )
}
