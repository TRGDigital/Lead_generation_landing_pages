import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, MessageSquare, ShieldCheck, RefreshCw } from 'lucide-react'
import { Star, Squiggle, Dots } from '@/components/marketing/Decor'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export const metadata: Metadata = {
  title: 'Our Commitment to Customers',
  description:
    'How TRG Digital commits to its customers: clear promises, how we encourage and act on feedback, how we put things right, and how we protect your data.',
  alternates: { canonical: `${SITE_URL}/our-commitment` },
  robots: { index: true, follow: true },
}

const PROMISES = [
  {
    title: 'We measure success the way you do',
    body: 'Every website, campaign and tool we deliver is judged on real outcomes, enquiries, visits and filled beds, not vanity metrics. If it does not grow your business, we change it.',
  },
  {
    title: 'We are clear and honest',
    body: 'Plain English, no jargon, no hidden extras. We explain what we are doing, why, and what it will achieve, so you always know where your money is going.',
  },
  {
    title: 'One team, no hand-offs',
    body: 'You work directly with the people who build and run your marketing. No account managers passing you along, no outsourcing your project to a stranger.',
  },
  {
    title: 'We only work in care',
    body: 'Care is the only sector we serve, so everything we build is shaped around how families actually find, compare and choose care, and around the regulations you work within.',
  },
]

const FEEDBACK = [
  {
    icon: MessageSquare,
    title: 'We make feedback easy to give',
    body: 'Every customer has a direct line to the founder and the team, by phone, email or in a regular review call. You never have to work to be heard.',
  },
  {
    icon: RefreshCw,
    title: 'We check in, we do not wait to be told',
    body: 'We review progress and results with you on a regular basis, and we actively ask what is working and what is not, rather than waiting for a problem to surface.',
  },
  {
    icon: Check,
    title: 'We put things right',
    body: 'If something falls short, we own it, fix it quickly and at our cost where the fault is ours, and we tell you honestly what happened and what we have changed.',
  },
]

const SECURITY = [
  'We register with the Information Commissioner’s Office (ICO) and handle personal data in line with UK GDPR.',
  'Customer and family data is held on secure, reputable cloud infrastructure, encrypted in transit and at rest.',
  'Access to personal data is limited to the people who genuinely need it, protected by strong authentication.',
  'We keep our systems patched and up to date, and we are strengthening our cyber resilience through recognised standards such as Cyber Essentials.',
  'We collect only the data we need, keep it only as long as we need it, and never sell it.',
]

export default function OurCommitmentPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-8 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Our promise to you</p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
            Our commitment to customers
          </h1>
          <Squiggle className="mx-auto mt-5 h-6 w-56 text-brand-pop" />
          <p className="mt-6 text-lg leading-relaxed text-brand-ink-soft">
            TRG Digital exists to help care providers grow. That means being straight with you, doing
            what we say, listening when it matters most, and protecting the information you trust us
            with. Here is what you can expect from us, and how to hold us to it.
          </p>
        </div>
      </section>

      {/* Our commitment */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-20">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
              What we commit to
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              These are the promises we make to every customer, and the standard we expect you to hold
              us to.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PROMISES.map((p) => (
              <div key={p.title} className="rounded-2xl border-2 border-brand-ink bg-white p-6 shadow-[4px_4px_0_0_#2a2620]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pop text-white">
                  <Check className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Listening &amp; putting things right</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
              How we handle your feedback
            </h2>
            <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
              Feedback, good and bad, is how we get better. We actively seek it out, act on it, and
              learn from it, and we would always rather hear about a problem than not.
            </p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {FEEDBACK.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold uppercase tracking-tight text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-brand-bg-warm p-6 text-center">
            <p className="text-base text-brand-ink-soft">
              Have feedback, or something we could do better? We want to hear it.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-brand-ink">
              <a href="mailto:hello@trgdigital.co.uk" className="hover:text-brand-pop">hello@trgdigital.co.uk</a>
              <span className="text-brand-ink-muted">·</span>
              <a href="tel:+442080641596" className="gads-phone hover:text-brand-pop">020 8064 1596</a>
              <span className="text-brand-ink-muted">·</span>
              <Link href="/contact" className="hover:text-brand-pop">Contact us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cyber resilience / data */}
      <section className="relative overflow-hidden bg-brand-ink px-6 py-20 text-white">
        <Dots className="absolute right-10 top-10 hidden h-24 w-24 text-white/10 lg:block" />
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-pop">
              <ShieldCheck className="h-5 w-5 text-white" />
            </span>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Protecting your data</p>
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-tight sm:text-4xl">
            Cyber resilience &amp; your privacy
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            Families share sensitive information with the care providers we work for, and our
            customers trust us with their own. We take that seriously, and we keep strengthening how
            we protect it.
          </p>
          <ul className="mt-8 space-y-3">
            {SECURITY.map((s) => (
              <li key={s} className="flex items-start gap-3 text-base leading-relaxed text-white/85">
                <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-pop" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-white/60">
            For full detail on how we collect, use and protect personal data, see our{' '}
            <Link href="/privacy" className="font-semibold text-brand-accent underline-offset-2 hover:underline">privacy policy</Link>.
          </p>
        </div>
      </section>

    </main>
  )
}
