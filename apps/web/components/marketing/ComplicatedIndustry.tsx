import { ShieldCheck, HeartHandshake, Target, BedDouble } from 'lucide-react'

// "Making sense of a complicated industry" — the things that make care marketing
// hard, and how TRG removes each one.
const POINTS = [
  {
    icon: ShieldCheck,
    problem: 'CQC, funding routes and care types',
    solution: 'We speak care fluently, so every campaign and page is accurate, compliant and credible to families.',
  },
  {
    icon: HeartHandshake,
    problem: 'Families choosing in a vulnerable moment',
    solution: 'We build journeys that answer the real questions and earn trust, not generic marketing fluff.',
  },
  {
    icon: Target,
    problem: 'Generic agencies that don’t get care',
    solution: 'Care is the only sector we work in. Nothing is learned on your budget — we already know it.',
  },
  {
    icon: BedDouble,
    problem: 'Empty beds quietly draining revenue',
    solution: 'We focus relentlessly on the one metric that matters: qualified enquiries that fill beds.',
  },
]

export function ComplicatedIndustry() {
  return (
    <section className="bg-brand-bg-warm px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Why TRG</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Making sense of a complicated industry
          </h2>
          <p className="mt-4 text-brand-ink-soft">
            Care isn&apos;t like other sectors, and care marketing shouldn&apos;t be treated like it is. Here&apos;s
            what makes it hard — and how we take it off your plate.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {POINTS.map(({ icon: Icon, problem, solution }) => (
            <div
              key={problem}
              className="group flex gap-5 rounded-2xl border border-brand-line bg-white p-7 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop transition-colors group-hover:bg-brand-pop group-hover:text-white">
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-brand-ink">{problem}</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
