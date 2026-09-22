import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, PhoneCall, Mail } from 'lucide-react'
import { Star, Squiggle } from '@/components/marketing/Decor'

export const metadata: Metadata = {
  title: 'Book a Free Demo',
  description:
    'Pick a time that suits you and we will walk you through exactly what TRG Digital would look like for your care home: websites, SEO, enquiry tools and software.',
  alternates: { canonical: 'https://www.trgdigital.co.uk/book-a-demo' },
}

// Set NEXT_PUBLIC_BOOKING_URL (a Calendly / Google appointment-schedule embed link) in the
// Vercel env to show the live calendar. Until it is set, the page offers call/email/contact
// routes so the demo CTAs always land somewhere useful.
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL ?? ''

const EXPECT = [
  'A 20 to 30 minute video call, no slides for the sake of slides',
  'A live look at the enquiry tools, overlay and CRM on real care websites',
  'An honest read on where your current site is losing enquiries',
  'A clear, no-obligation plan for what we would do first',
]

export default function BookADemoPage() {
  return (
    <main>
      <section className="relative overflow-hidden px-6 pb-20 pt-16">
        <Star className="absolute right-8 top-10 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Book a free demo</p>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
              See it working before you decide
            </h1>
            <Squiggle className="mt-4 h-7 w-56 text-brand-pop" />
            <p className="mt-5 text-lg leading-relaxed text-brand-ink-soft">
              Pick a time that suits you and we will show you, live, what TRG Digital would look like
              for your home: the websites, the enquiry tools and the numbers behind them.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink">
                What to expect
              </h2>
              <ul className="mt-5 space-y-3">
                {EXPECT.map((e) => (
                  <li key={e} className="flex items-start gap-3 text-base leading-relaxed text-brand-ink-soft">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-brand-pop" />
                    {e}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border-2 border-brand-ink bg-brand-accent p-6 shadow-[4px_4px_0_0_#2a2620]">
                <p className="font-display text-lg font-bold uppercase tracking-tight text-brand-ink">
                  Prefer to talk right now?
                </p>
                <div className="mt-4 space-y-2.5 text-sm font-semibold text-brand-ink">
                  <a href="tel:+442080641596" className="flex items-center gap-2.5 hover:underline">
                    <PhoneCall className="h-4 w-4" /> 020 8064 1596
                  </a>
                  <a href="mailto:hello@trgdigital.co.uk" className="flex items-center gap-2.5 hover:underline">
                    <Mail className="h-4 w-4" /> hello@trgdigital.co.uk
                  </a>
                </div>
              </div>
            </div>

            <div>
              {BOOKING_URL ? (
                <div className="overflow-hidden rounded-2xl border-2 border-brand-ink shadow-[4px_4px_0_0_#2a2620]">
                  <iframe
                    src={BOOKING_URL}
                    title="Book a free demo with TRG Digital"
                    className="h-[720px] w-full bg-white"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-brand-ink bg-white p-8 shadow-[4px_4px_0_0_#2a2620]">
                  <h2 className="font-display text-xl font-bold uppercase tracking-tight text-brand-ink">
                    Request your demo
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
                    Tell us a little about your home and the times that suit you, and we will confirm a
                    slot within one business day.
                  </p>
                  <Link href="/contact" className="btn-pop mt-6">
                    Request a demo time
                    <span className="btn-arrow" aria-hidden>→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
