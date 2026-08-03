'use client'

import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Star } from './Decor'

// 5 FAQs about TRG, shown on the home page below the "Specialists in your kind of care"
// band, with matching FAQPage schema. Lives in the layout (after WhoWeServe) but renders
// only on the home page.
const FAQS = [
  {
    q: 'What does TRG Digital do?',
    a: 'We are a specialist digital agency for the UK care sector. We help care providers fill beds and grow enquiries through websites, SEO, local SEO and paid advertising, plus our own proprietary care tools, all built specifically for care.',
  },
  {
    q: 'Who do you work with?',
    a: 'We work exclusively with UK care providers: residential and nursing homes, dementia care, home care, supported living and retirement living. Because care is all we do, everything we build is shaped around how families actually choose care.',
  },
  {
    q: 'How do you help us get more enquiries?',
    a: 'We make you easy to find with SEO, local SEO and Google Business Profile, turn your website into an enquiry engine, and add our proprietary tools, live room availability, family care calculators, a pop-up, click-to-call and an AI chat assistant, that capture more visitors as quality enquiries.',
  },
  {
    q: 'What makes you different from a general marketing agency?',
    a: 'Two things. We only work in care, so we understand families, CQC and the realities of the sector. And we have built our own technology you will not find elsewhere, including live availability, family tools and an AI care assistant, exclusive to our clients.',
  },
  {
    q: 'How do we get started?',
    a: 'Start with a free website grade or a no-obligation review. We will show you exactly where you are losing enquiries and how we would fix it, then agree a plan that fits your home. Just get in touch.',
  },
]

export function HomeFaqs() {
  const pathname = usePathname()
  if (pathname !== '/') return null

  return (
    <section className="relative overflow-hidden border-t border-brand-line bg-white px-6 py-20">
      <Star className="absolute right-8 top-12 hidden h-12 w-12 rotate-12 text-brand-accent lg:block" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">FAQs</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-brand-line bg-white shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
                <span className="font-display text-base font-semibold text-brand-ink sm:text-lg">{f.q}</span>
                <ChevronDown className="h-5 w-5 flex-shrink-0 text-brand-pop transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 text-sm leading-relaxed text-brand-ink-soft sm:text-base">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
