import Link from 'next/link'
import { TrendingUp, BedDouble, TrendingDown, MapPin } from 'lucide-react'

// "Proven results across the care sector".
// Framed around the OUTCOMES we're built to drive (honest — no fabricated figures).
// When real client numbers are in, swap each `value` for the hard stat
// (e.g. '+140%' enquiries, '92%' occupancy) and drop the "figures coming" note.
const OUTCOMES = [
  { icon: TrendingUp, value: 'More enquiries', detail: 'Campaigns tuned to fill beds, not chase clicks.' },
  { icon: BedDouble, value: 'Higher occupancy', detail: 'Fewer empty rooms, more residents, more revenue.' },
  { icon: TrendingDown, value: 'Lower cost per enquiry', detail: 'More value from every pound of marketing budget.' },
  { icon: MapPin, value: 'Stronger local visibility', detail: 'Found first when families search for care nearby.' },
]

export function ProvenResults() {
  return (
    <section className="relative overflow-hidden bg-brand-ink px-6 py-24 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-pop/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Proven across the care sector</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            We measure success the way you do
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            No vanity metrics. Everything we build, run and optimise is judged on the outcomes that actually grow a
            care business — qualified enquiries in, and empty beds out.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OUTCOMES.map(({ icon: Icon, value, detail }) => (
            <div key={value} className="rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors hover:border-brand-pop/40 hover:bg-white/10">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop">
                <Icon className="h-6 w-6 text-white" />
              </span>
              <p className="mt-5 font-display text-xl font-bold leading-tight text-white">{value}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm text-white/50">
            Live results from our latest care campaigns and websites are landing now — ask us for the most recent
            figures from real client work.
          </p>
          <Link href="#start" className="btn-cta shrink-0">
            Get the numbers
            <span className="btn-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
