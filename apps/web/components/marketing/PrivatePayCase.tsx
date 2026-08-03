import Link from 'next/link'
import { TrendingUp, ArrowDownRight } from 'lucide-react'
import { Star, Dots, Squiggle, Burst } from './Decor'
import { EnquiryButton } from '@/components/marketing/EnquiryOverlay'

const RISING = ['Daily running costs', 'Staff salaries', 'National Insurance']

export function PrivatePayCase() {
  return (
    <section className="relative overflow-hidden bg-brand-accent px-6 py-24 text-brand-ink">
      <Star className="absolute left-6 top-12 hidden h-16 w-16 -rotate-12 text-brand-pop lg:block" />
      <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-ink/15 lg:block" />
      <Burst className="absolute -left-12 bottom-0 hidden h-48 w-48 text-brand-ink/5 lg:block" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Left, the argument */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">The economics of care</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl lg:text-5xl">
            There has never been a better time to attract{' '}
            <span className="text-brand-pop">private residents and service users</span>
          </h2>
          <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
          <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink/80">
            <p>
              Running a care or nursing home has never cost more. Daily running costs, staff salaries and National
              Insurance climb year after year, and they show no sign of slowing down.
            </p>
            <p>
              Yet the fees local social services pay are not keeping pace. On average, council funding covers only
              around 85% of a typical private weekly fee, so every council funded place widens the gap between what
              it costs to deliver outstanding care and what you actually get paid for it.
            </p>
            <p className="font-semibold text-brand-ink">
              That makes private residents and service users more valuable than ever, and we help care providers
              attract them.
            </p>
          </div>
          <EnquiryButton className="btn-pop mt-8">
            Attract more private residents
            <span className="btn-arrow" aria-hidden>→</span>
          </EnquiryButton>
        </div>

        {/* Right, the visual, the fee gap */}
        <div className="rounded-3xl border border-brand-ink/10 bg-white p-7 shadow-[6px_6px_0_0_#2a2620]">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">The fee gap</p>

          <div className="mt-5 space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-brand-ink">Private room, per week</span>
                <span className="font-display font-bold text-brand-ink">£1,500</span>
              </div>
              <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-brand-line">
                <div className="h-full rounded-full bg-brand-pop" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-brand-ink-soft">Council pays, on average (85%)</span>
                <span className="font-display font-bold text-brand-ink-soft">~£1,275</span>
              </div>
              <div className="mt-2 h-3.5 w-full overflow-hidden rounded-full bg-brand-line">
                <div className="h-full rounded-full bg-brand-ink" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-brand-pop/10 px-4 py-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-brand-pop">
              <ArrowDownRight className="h-5 w-5 text-white" />
            </span>
            <p className="text-sm text-brand-ink-soft">
              That is <span className="font-bold text-brand-ink">£225 a week</span> you are missing, on a single
              council funded place.
            </p>
          </div>

          {/* Missed revenue per room over time */}
          <div className="mt-6 border-t border-brand-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">Missed revenue on just one room</p>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {[['3 months', '£2,925'], ['6 months', '£5,850'], ['12 months', '£11,700']].map(([period, amount]) => (
                <div key={period} className="rounded-xl bg-brand-ink p-3 text-center">
                  <p className="font-display text-lg font-bold leading-none text-white sm:text-xl">{amount}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-brand-accent">{period}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-brand-ink-muted">Based on a £1,500 a week private room at an average 85% council fee.</p>
          </div>

          {/* And costs keep rising */}
          <div className="mt-5 border-t border-brand-line pt-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">And these keep rising</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {RISING.map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-brand-pop/10 px-3 py-1 text-xs font-medium text-brand-ink">
                  <TrendingUp className="h-3 w-3 text-brand-pop" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
