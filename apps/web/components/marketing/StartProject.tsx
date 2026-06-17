import { Check } from 'lucide-react'
import ContactForm from '@/components/marketing/ContactForm'

const PROMISES = [
  'A reply within one business day',
  'A free, no-obligation plan for your growth',
  'Specialists who already know the care sector',
  'One team for marketing, websites & software',
]

// "Start your project" — the primary contact section. Bold copy + promises on the
// left, the working form on the right.
export function StartProject() {
  return (
    <section id="start" className="bg-brand-ink px-6 py-24 text-white">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Start your project</p>
          <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl">
            Let&apos;s fill your beds
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
            Tell us where you want to grow — more enquiries, a new website, or custom software — and we&apos;ll come
            back with a clear plan to get you there.
          </p>
          <ul className="mt-8 space-y-3">
            {PROMISES.map((p) => (
              <li key={p} className="flex items-start gap-3 text-white/85">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-3.5 w-3.5 text-white" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-white/50">
            Prefer to talk? Call us or{' '}
            <a href="/contact" className="font-semibold text-brand-accent hover:underline">book a free demo</a>.
          </p>
        </div>

        <div>
          <ContactForm onDark />
        </div>
      </div>
    </section>
  )
}
