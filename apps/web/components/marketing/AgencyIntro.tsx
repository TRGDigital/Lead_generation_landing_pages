import Link from 'next/link'
import { Star, Burst, Squiggle, Dots } from './Decor'

// "A leading digital marketing agency with a creative kick", a rich, SEO-friendly
// intro: bold headline, coloured sub-head, multi-paragraph care-sector copy with
// internal links, and a panel of honest credentials.
const CREDENTIALS = [
  { value: 'Care-only', label: 'It’s the only sector we work in' },
  { value: '2 products', label: 'Built & shipped in-house' },
  { value: 'One team', label: 'Marketing, web & software' },
  { value: 'Enquiries', label: 'The metric we’re measured on' },
]

export function AgencyIntro() {
  return (
    <section className="relative overflow-hidden bg-brand-ink px-6 py-24 text-white">
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-brand-pop/20 blur-3xl" />
      <Star className="absolute left-6 top-8 h-20 w-20 text-brand-accent" />
      <Burst className="absolute -bottom-12 -right-10 h-56 w-56 text-brand-pop/40" />
      <Squiggle className="absolute bottom-10 left-6 hidden h-8 w-64 text-brand-accent/80 lg:block" />
      <Dots className="absolute right-1/3 top-10 hidden h-16 w-16 text-white/20 lg:block" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <h2 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl">
            A leading digital marketing agency with a creative kick
          </h2>
          <p className="mt-5 font-display text-lg font-semibold text-brand-pop">
            Websites, SEO, paid media, AI and software, built for care.
          </p>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-white/75">
            <p>
              At TRG Digital we build lead-generating websites and run digital marketing campaigns with one
              job: turning online visibility into real enquiries, visits and move-ins. We work{' '}
              <span className="font-semibold text-white">only with the care sector</span>, care homes, nursing
              homes and domiciliary care, so everything we do is shaped around how families actually search for,
              compare and choose care.
            </p>
            <p>
              From{' '}
              <Link href="/website-development" className="font-semibold text-brand-accent underline-offset-2 hover:underline">search-optimised websites</Link>{' '}
              and{' '}
              <Link href="/marketing" className="font-semibold text-brand-accent underline-offset-2 hover:underline">Google &amp; Meta advertising</Link>{' '}
              to organic SEO and{' '}
              <Link href="/development" className="font-semibold text-brand-accent underline-offset-2 hover:underline">custom software</Link>, we bring
              every channel together into one joined-up strategy. The aim never changes: more qualified
              enquiries, fewer empty beds, and a digital presence families trust at the moment they need it most.
            </p>
          </div>
          <Link href="#start" className="btn-cta btn-on-dark mt-8">
            Start your project
            <span className="btn-arrow" aria-hidden>→</span>
          </Link>
        </div>

        {/* Credentials */}
        <div className="grid grid-cols-2 gap-4">
          {CREDENTIALS.map(({ value, label }) => (
            <div key={value} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-display text-2xl font-bold text-brand-accent">{value}</p>
              <p className="mt-2 text-sm leading-snug text-white/70">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
