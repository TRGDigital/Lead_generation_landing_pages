// "Making sense of a complicated industry" — the things that make care marketing
// hard, and how TRG removes each one.
const POINTS = [
  {
    problem: 'CQC, funding routes and care types',
    solution: 'We speak care fluently, so every campaign and page is accurate, compliant and credible to families.',
  },
  {
    problem: 'Families choosing in a vulnerable moment',
    solution: 'We build journeys that answer the real questions and earn trust, not generic marketing fluff.',
  },
  {
    problem: 'Generic agencies that don’t get care',
    solution: 'Care is the only sector we work in. Nothing is learned on your budget — we already know it.',
  },
  {
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
          {POINTS.map(({ problem, solution }) => (
            <div key={problem} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
              <p className="flex items-start gap-2 font-display text-lg font-semibold text-brand-ink">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-pop" />
                {problem}
              </p>
              <p className="mt-3 pl-4 text-sm leading-relaxed text-brand-ink-soft">{solution}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
