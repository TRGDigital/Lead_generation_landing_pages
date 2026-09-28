import Link from 'next/link'
import { Quote } from 'lucide-react'
import { TESTIMONIALS, type Testimonial } from '@/lib/testimonials'

// Client testimonials, from lib/testimonials.ts. Real, attributable quotes only: the
// section renders nothing while the list is empty, so the site never ships invented reviews.

export function TestimonialCard({ t, dark = false }: { t: Testimonial; dark?: boolean }) {
  return (
    <figure
      className={
        dark
          ? 'flex flex-col rounded-2xl bg-white/5 p-7 ring-1 ring-white/10'
          : 'flex flex-col rounded-2xl border border-brand-line bg-white p-7 shadow-soft'
      }
    >
      <Quote className={dark ? 'h-7 w-7 text-brand-accent' : 'h-7 w-7 text-brand-pop'} aria-hidden />
      <blockquote className={`mt-4 flex-1 text-lg leading-relaxed ${dark ? 'text-white/90' : 'text-brand-ink'}`}>
        “{t.quote}”
      </blockquote>
      <figcaption className={`mt-6 border-t pt-4 ${dark ? 'border-white/10' : 'border-brand-line'}`}>
        <p className={`font-semibold ${dark ? 'text-white' : 'text-brand-ink'}`}>{t.name}</p>
        <p className={`text-sm ${dark ? 'text-white/70' : 'text-brand-ink-soft'}`}>{t.org}</p>
        <p className={`mt-1 text-xs font-semibold uppercase tracking-wide ${dark ? 'text-brand-accent' : 'text-brand-pop'}`}>
          {t.service}
        </p>
        {t.caseStudy && (
          <Link
            href={t.caseStudy}
            className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-2 hover:underline ${dark ? 'text-white' : 'text-brand-pop'}`}
          >
            Read the case study <span aria-hidden>→</span>
          </Link>
        )}
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null

  return (
    <section className="bg-brand-ink px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-brand-accent">
          What care providers say
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          In their own words
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} t={t} dark />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/reviews" className="btn-pop btn-on-dark">
            Read all reviews
            <span className="btn-arrow" aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
