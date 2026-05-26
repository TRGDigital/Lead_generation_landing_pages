import type { Testimonial } from '@/lib/types/care-home'

interface TestimonialsProps {
  testimonials: Testimonial[]
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-brand-bg-warm py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl text-brand-ink text-center mb-12">What families say</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <figure
              key={i}
              className="bg-white rounded-xl p-6 shadow-soft flex flex-col"
            >
              <div className="flex gap-0.5 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-brand-accent text-lg" aria-hidden="true">
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="text-brand-ink-soft text-sm leading-relaxed flex-1 mb-4">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="text-sm">
                <span className="font-medium text-brand-ink">{t.name}</span>
                {t.relation && (
                  <span className="text-brand-ink-muted"> &mdash; {t.relation}</span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
