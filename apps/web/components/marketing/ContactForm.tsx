'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, 'Please tell us a bit more (at least 10 characters)'),
  // honeypot — must stay empty
  website: z.string().max(0, 'Bot detected').optional(),
})

type FormValues = z.infer<typeof schema>

export default function ContactForm() {
  const [pending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function onSubmit(values: FormValues) {
    setServerError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/marketing-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        const json = await res.json()
        if (!res.ok) {
          setServerError(json.error ?? 'Something went wrong. Please try again.')
        } else {
          setSubmitted(true)
        }
      } catch {
        setServerError('Network error. Please check your connection and try again.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-brand-line bg-white p-10 text-center shadow-soft">
        <CheckCircle className="h-12 w-12 text-brand-sage" />
        <h2 className="font-display text-2xl font-semibold text-brand-ink">Thank you!</h2>
        <p className="max-w-sm text-brand-ink-soft">
          We&apos;ve received your message and will be in touch within one business day.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-brand-line bg-white p-8 shadow-soft space-y-5"
    >
      {/* Honeypot — hidden from real users */}
      <input {...register('website')} type="text" className="sr-only" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name *</Label>
          <Input id="name" {...register('name')} placeholder="Jane Smith" />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address *</Label>
          <Input id="email" type="email" {...register('email')} placeholder="jane@carehome.co.uk" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="company">Care home / group name</Label>
          <Input id="company" {...register('company')} placeholder="Sunrise Care Group" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" type="tel" {...register('phone')} placeholder="01234 567890" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">How can we help? *</Label>
        <Textarea
          id="message"
          {...register('message')}
          placeholder="Tell us about your home, how many beds you have, and what you'd like help with..."
          rows={5}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      {serverError && (
        <p className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{serverError}</p>
      )}

      <Button type="submit" className="h-12 w-full bg-brand-pop text-base font-semibold text-white hover:bg-brand-pop-dark" disabled={pending}>
        {pending ? 'Sending…' : 'Send message'}
      </Button>

      <p className="text-xs text-center text-brand-ink-muted">
        We respond within one business day. By submitting, you agree to our{' '}
        <a href="/privacy" className="underline hover:text-brand-ink">privacy policy</a>.
      </p>
    </form>
  )
}
