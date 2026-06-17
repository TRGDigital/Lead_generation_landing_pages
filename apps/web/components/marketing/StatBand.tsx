// Honest, non-fabricated credibility numbers. Update as real results come in
// (e.g. enquiries generated, beds filled) once client campaigns are live.
const STATS = [
  { value: '100%', label: 'Focused on the UK care sector' },
  { value: '2', label: 'Live products built in-house' },
  { value: '60+', label: 'Languages CareStream supports' },
  { value: 'End-to-end', label: 'Marketing, web & software — one team' },
]

export function StatBand() {
  return (
    <section className="bg-brand-bg-warm px-6 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 lg:grid-cols-4">
        {STATS.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="font-display text-3xl font-semibold text-brand-ink sm:text-4xl">{value}</p>
            <p className="mt-2 text-sm leading-snug text-brand-ink-soft">{label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
