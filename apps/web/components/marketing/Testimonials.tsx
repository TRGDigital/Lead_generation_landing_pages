// Client testimonials. Intentionally EMPTY until we have real, attributable quotes, 
// the section renders nothing while empty so the site never ships fabricated reviews.
// Add real entries (quote + name + role/home) and it appears automatically.
//
// Example shape:
//   { quote: 'They filled three beds in our first month.', name: 'Jane Smith', role: 'Manager, Sunrise Care' }
type Testimonial = { quote: string; name: string; role: string }

const TESTIMONIALS: Testimonial[] = []

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null

  return (
    <section className="bg-brand-ink px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-accent-soft">
          What care providers say
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(({ quote, name, role }) => (
            <figure key={name} className="flex flex-col rounded-2xl bg-white/5 p-7">
              <blockquote className="flex-1 text-lg leading-relaxed text-white/90">“{quote}”</blockquote>
              <figcaption className="mt-5">
                <p className="font-semibold text-white">{name}</p>
                <p className="text-sm text-white/60">{role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
