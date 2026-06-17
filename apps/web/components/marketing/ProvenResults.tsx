import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

// "Proven results across the care sector".
// NOTE: the stat tiles use honest, qualitative values for now — swap in the real
// percentages/figures (e.g. '+140%' enquiries) once client campaign data is in.
const STATS = [
  { value: 'More', label: 'qualified enquiries' },
  { value: 'Fewer', label: 'empty beds' },
  { value: 'Page 1', label: 'local search visibility' },
  { value: 'Instant', label: 'leads to your inbox' },
]

type Work = { name: string; blurb: string; image?: string; href?: string; status?: 'In build' | 'Live' }
const WORK: Work[] = [
  { name: 'Crossways Care Home', blurb: 'A new, search-optimised website built to turn local searches into enquiries and visits.', status: 'In build' },
  { name: 'Ferndale Nursing Home', blurb: 'A fresh site and enquiry funnel designed to showcase the home and fill available beds.', status: 'In build' },
  { name: 'CareAssura', blurb: 'A UK care home directory that helps families find, compare and choose the right care.', image: '/mockups/careassura.jpg', href: 'https://careassura.co.uk', status: 'Live' },
  { name: 'CareStream', blurb: 'An AI policy, training and CQC platform used by care teams in 60+ languages.', image: '/mockups/carestream.jpg', href: 'https://carestreamai.com', status: 'Live' },
]

export function ProvenResults() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Results</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Proven results across the care sector
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {STATS.map(({ value, label }) => (
            <div key={label} className="rounded-2xl border border-brand-line bg-brand-bg-warm p-6 text-center">
              <p className="font-display text-3xl font-bold text-brand-pop sm:text-4xl">{value}</p>
              <p className="mt-2 text-sm leading-snug text-brand-ink-soft">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WORK.map(({ name, blurb, image, href, status }) => {
            const card = (
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card">
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-bg-warm">
                  {image ? (
                    <Image src={image} alt={name} fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-xl font-semibold text-brand-ink/30">{name.split(' ')[0]}</span>
                    </div>
                  )}
                  {status && (
                    <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status === 'Live' ? 'bg-brand-accent text-brand-ink' : 'bg-brand-ink/85 text-white'}`}>
                      {status}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-base font-semibold text-brand-ink">{name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-ink-soft">{blurb}</p>
                  {href && (
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-pop">
                      Visit site <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>
              </div>
            )
            return href ? (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="block">{card}</a>
            ) : (
              <div key={name}>{card}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
