import Link from 'next/link'
import { Check } from 'lucide-react'

// "Making sense of a complicated industry" — rich, SEO-friendly two-column section:
// multi-paragraph care-sector copy with internal links on the left; honest trust
// badges + a CTA box on the right.
const BADGES = [
  'Care sector specialists — it’s all we do',
  'Marketing, websites & software under one roof',
  'Google & Meta advertising specialists',
  'Two live products built in-house',
  'Measured on enquiries, not vanity metrics',
]

export function ComplicatedIndustry() {
  return (
    <section className="bg-brand-bg-warm px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
            Making sense of a complicated industry
          </h2>
          <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Specialist care marketing, from day one.</p>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              Care isn&apos;t like other sectors. Families researching a care home are often doing it in a
              stressful, emotional moment — weighing up CQC ratings, funding routes and care types while trying
              to find somewhere they can trust. Generic agencies treat care like any other industry. We do the
              opposite: everything we market and build is shaped around how care decisions are really made.
            </p>
            <p>
              That focus changes the work. Our{' '}
              <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">care home websites</Link>{' '}
              are built around the questions families actually ask. Our{' '}
              <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">paid campaigns</Link>{' '}
              target the people genuinely searching for care near you. And our SEO and content earn the organic
              visibility that brings enquiries in month after month, without paying for every click.
            </p>
            <p>
              The aim is simple: take the complexity off your plate and turn it into a steady flow of qualified
              enquiries — more families finding you, more visits booked and fewer empty beds — backed by a team
              that understands care, regulation and the families behind every enquiry. When it&apos;s time to
              scale, our{' '}
              <Link href="/development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">custom software</Link>{' '}
              joins it all up.
            </p>
          </div>
        </div>

        {/* Badges + CTA */}
        <div className="space-y-3">
          {BADGES.map((b) => (
            <div key={b} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
              <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                <Check className="h-4 w-4 text-white" />
              </span>
              <span className="font-display text-sm font-semibold uppercase tracking-wide">{b}</span>
            </div>
          ))}
          <div className="rounded-2xl bg-brand-accent p-7">
            <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink">
              Does this sound like the marketing support you&apos;ve been looking for?
            </p>
            <Link href="#start" className="btn-pop mt-5">
              Submit a project enquiry
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
