import type { FAQ } from '@/lib/types/care-home'

interface FAQsProps {
  faqs: FAQ[]
}

export default function FAQs({ faqs }: FAQsProps) {
  return (
    <section className="bg-brand-bg py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl text-brand-ink text-center mb-12">
          Frequently asked questions
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white rounded-lg border border-brand-line overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer text-brand-ink font-medium select-none list-none">
                {faq.q}
                <span
                  className="shrink-0 text-brand-accent transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="px-6 pb-5 text-brand-ink-soft text-sm leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
