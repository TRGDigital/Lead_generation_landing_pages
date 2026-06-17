import Link from 'next/link'

// "Our core services" — a bordered card with per-service care-sector copy and a
// 'See service' button each, plus a bold CTA banner (BoxChilli-style).
const SERVICES = [
  {
    title: 'Search Engine Optimisation (SEO)',
    body: 'When a family searches for care in your area, you need to be the home they find first. We build a reliable, long-term SEO presence — local pages, content and technical fixes — so you rank for the searches that actually bring enquiries, not vanity keywords.',
    href: '/marketing',
  },
  {
    title: 'Website Design & Development',
    body: 'We design and build fast, mobile-first care websites that families trust and search engines love. From a full redesign to a brand-new site, every page is built to answer real questions and turn visitors into enquiries.',
    href: '/website-development',
  },
  {
    title: 'Paid Media Advertising & PPC',
    body: 'Wasting budget on clicks that never call? Our Google and Meta campaigns put you in front of families actively looking for care near you — and we measure success on enquiries and filled beds, not impressions.',
    href: '/marketing',
  },
  {
    title: 'Custom Software Development',
    body: 'When off-the-shelf tools don’t fit, we build bespoke platforms for the care sector — the same capability behind our own products, CareStream and CareAssura. Automate the busywork and give your team tools built for care.',
    href: '/development',
  },
]

export function CoreServices() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative rounded-3xl border-2 border-brand-pop/30 p-6 sm:p-10">
          <span className="absolute -top-3.5 left-8 bg-brand-bg px-3 font-display text-sm font-bold uppercase tracking-widest text-brand-pop">
            Our core services
          </span>

          <div className="grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
            {SERVICES.map(({ title, body, href }) => (
              <div key={title} className="border-b border-brand-line pb-10 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight text-brand-ink">{title}</h3>
                  <Link
                    href={href}
                    className="mt-1 shrink-0 rounded-md bg-brand-pop px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand-pop-dark"
                  >
                    See service
                  </Link>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <Link
            href="/contact"
            className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-brand-pop px-6 py-6 text-center font-display text-xl font-bold uppercase tracking-tight text-white transition-colors hover:bg-brand-pop-dark sm:text-2xl"
          >
            Know what you want? Book a free demo
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
