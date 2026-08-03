'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import ContactForm from '@/components/marketing/ContactForm'

// Two lightly different messages so the CTAs woven through a post don't read identically.
const VARIANTS = [
  {
    eyebrow: 'Work with TRG',
    title: 'Struggling to fill your beds?',
    sub: 'See how we turn local searches into pre-qualified enquiries, delivered straight to your home.',
    button: 'Talk to us',
  },
  {
    eyebrow: 'Work with TRG',
    title: 'Want more private enquiries?',
    sub: 'We put your home in front of the families actively searching for care near you.',
    button: 'Book a chat',
  },
]

export default function BlogCta({ variant = 0 }: { variant?: number }) {
  const v = VARIANTS[variant % VARIANTS.length] ?? VARIANTS[0]!
  return (
    <Dialog>
      <div className="my-10 rounded-2xl border border-brand-line bg-brand-bg-warm px-6 py-8 text-center sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">{v.eyebrow}</p>
        <p className="mt-2 font-display text-2xl font-semibold text-brand-ink">{v.title}</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-brand-ink-soft">{v.sub}</p>
        <DialogTrigger asChild>
          <button type="button" className="btn-pop mt-5">
            {v.button}
            <span className="btn-arrow" aria-hidden>→</span>
          </button>
        </DialogTrigger>
      </div>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-brand-ink">Get in touch</DialogTitle>
          <DialogDescription>
            Tell us about your home and we&apos;ll be in touch within one business day.
          </DialogDescription>
        </DialogHeader>
        <ContactForm bare />
      </DialogContent>
    </Dialog>
  )
}
