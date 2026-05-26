import type { Metadata } from 'next'
import { Mail, Phone } from 'lucide-react'
import ContactForm from '@/components/marketing/ContactForm'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Contact CareBeds — Book a Demo',
  description:
    'Get in touch with CareBeds to book a free demo, ask about pricing, or discuss how we can help fill empty beds in your care home.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact CareBeds — Book a Demo',
    description: 'Book a free demo or ask us anything about performance-based care home occupancy marketing.',
    type: 'website',
    url: `${SITE_URL}/contact`,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function ContactPage() {
  return (
    <>
      {/* JSON-LD — ContactPage */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            name: 'Contact CareBeds',
            url: `${SITE_URL}/contact`,
          }),
        }}
      />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Get in touch</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-brand-ink">
              Let&apos;s talk about your home
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-brand-ink-soft">
              Book a free 20-minute demo or ask us anything. We respond within one business day.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
            {/* Form */}
            <ContactForm />

            {/* Contact details */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
                <h2 className="font-semibold text-brand-ink">Other ways to reach us</h2>
                <div className="mt-4 space-y-3 text-sm text-brand-ink-soft">
                  <a
                    href="mailto:hello@carebeds.co.uk"
                    className="flex items-center gap-3 hover:text-brand-ink transition-colors"
                  >
                    <Mail className="h-4 w-4 text-brand-accent shrink-0" />
                    hello@carebeds.co.uk
                  </a>
                  <a
                    href="tel:+441234567890"
                    className="flex items-center gap-3 hover:text-brand-ink transition-colors"
                  >
                    <Phone className="h-4 w-4 text-brand-accent shrink-0" />
                    01234 567 890
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
                <h2 className="font-semibold text-brand-ink">What happens next?</h2>
                <ol className="mt-4 space-y-3 text-sm text-brand-ink-soft">
                  {[
                    'We\'ll respond within one business day',
                    'A brief call to understand your home and needs',
                    'We prepare a tailored demo for your care type',
                    'You decide if it\'s a fit — no pressure',
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="font-display text-lg font-semibold text-brand-line shrink-0 leading-tight">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-2xl bg-brand-bg-warm p-6 text-sm text-brand-ink-soft">
                <p className="font-semibold text-brand-ink">Care group or multiple homes?</p>
                <p className="mt-2">
                  We offer volume pricing and group agreements for operators running more than
                  3 homes. Mention it in your message and we&apos;ll cover it in the demo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
