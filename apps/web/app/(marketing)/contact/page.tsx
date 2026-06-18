import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import ContactForm from '@/components/marketing/ContactForm'
import { Star, Squiggle, Dots } from '@/components/marketing/Decor'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Contact TRG Digital, Start Your Project',
  description:
    'Get in touch with TRG Digital to start your project, ask about pricing, or discuss how we can fill empty beds in your care home.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact TRG Digital',
    description: 'Start your project or ask us anything about care-sector marketing, websites and software.',
    type: 'website',
    url: `${SITE_URL}/contact`,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

const NEXT_STEPS = [
  'We respond within one business day',
  'A brief call to understand your home and needs',
  'We prepare a tailored plan for your care type',
  "You decide if it's a fit, no pressure",
]

export default function ContactPage() {
  return (
    <>
      {/* JSON-LD, ContactPage */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact TRG Digital',
            url: `${SITE_URL}/contact`,
          }),
        }}
      />

      <section className="relative overflow-hidden px-6 py-16">
        <Star className="absolute left-6 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 top-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <Dots className="absolute bottom-10 right-1/4 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Get in touch</p>
            <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Let&apos;s talk about your home
            </h1>
            <div className="mt-5 flex justify-center">
              <Squiggle className="h-6 w-56 text-brand-pop" />
            </div>
            <p className="mx-auto mt-5 max-w-xl text-lg text-brand-ink-soft">
              Start your project or ask us anything. We respond within one business day.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            {/* Form */}
            <ContactForm />

            {/* Contact details */}
            <div className="space-y-6">
              <div className="rounded-2xl bg-brand-ink p-7 text-white">
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-brand-accent">Other ways to reach us</h2>
                <div className="mt-5 space-y-4 text-sm">
                  <a href="mailto:hello@trgdigital.com" className="flex items-center gap-3 text-white/85 transition-colors hover:text-white">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-pop"><Mail className="h-4 w-4 text-white" /></span>
                    hello@trgdigital.com
                  </a>
                  <a href="tel:+442070000000" className="flex items-center gap-3 text-white/85 transition-colors hover:text-white">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-pop"><Phone className="h-4 w-4 text-white" /></span>
                    0207 000 0000
                  </a>
                  <p className="flex items-start gap-3 text-white/70">
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/10"><MapPin className="h-4 w-4 text-brand-accent" /></span>
                    Suite Ra01, 195-197 Wood Street, London, E17 3NU
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-brand-ink">What happens next?</h2>
                <ol className="mt-5 space-y-4 text-sm text-brand-ink-soft">
                  {NEXT_STEPS.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop text-xs font-bold text-white">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl border-2 border-brand-pop/30 bg-white p-7 text-sm text-brand-ink-soft">
                <p className="font-display font-bold uppercase tracking-tight text-brand-pop">Care group or multiple homes?</p>
                <p className="mt-2">
                  We offer volume pricing and group agreements for operators running more than three homes. Mention
                  it in your message and we&apos;ll cover it in the call.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
