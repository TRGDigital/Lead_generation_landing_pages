import type { Metadata } from 'next'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Cookie Policy | CareBeds',
  description: 'CareBeds cookie policy, what cookies we use and how to manage them.',
  alternates: { canonical: `${SITE_URL}/cookies` },
  robots: { index: true, follow: true },
}

const COOKIES = [
  {
    name: 'sb-*',
    purpose: 'Essential',
    description: 'Supabase authentication session tokens. Required for portal login.',
    duration: 'Session / 1 week',
  },
  {
    name: 'portal_home_id',
    purpose: 'Essential',
    description: 'Remembers your selected care home in the operator portal.',
    duration: '30 days',
  },
  {
    name: 'cookie_consent',
    purpose: 'Essential',
    description: 'Records your cookie consent preference.',
    duration: '1 year',
  },
  {
    name: '_ga, _ga_*',
    purpose: 'Analytics (with consent)',
    description: 'Google Analytics, used to understand how visitors use this site. IP anonymisation is enabled.',
    duration: '2 years',
  },
]

export default function CookiesPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold text-brand-ink">Cookie Policy</h1>
        <p className="mt-2 text-sm text-brand-ink-muted">Last updated: January 2025</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-brand-ink-soft">
          <p>
            This policy explains what cookies CareBeds uses, why we use them, and how you can
            control them.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-ink">What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. They
            help the site remember information about your visit, such as whether you&apos;re
            logged in.
          </p>

          <h2 className="font-display text-xl font-semibold text-brand-ink">Cookies we use</h2>

          <div className="overflow-hidden rounded-xl border border-brand-line">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-brand-line bg-brand-bg-warm">
                  <th className="px-4 py-3 text-left font-semibold text-brand-ink">Cookie</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-ink">Purpose</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-ink hidden sm:table-cell">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-ink">Duration</th>
                </tr>
              </thead>
              <tbody>
                {COOKIES.map((c) => (
                  <tr key={c.name} className="border-b border-brand-line/50 last:border-0">
                    <td className="px-4 py-3 font-mono text-brand-ink">{c.name}</td>
                    <td className="px-4 py-3">{c.purpose}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">{c.description}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="font-display text-xl font-semibold text-brand-ink">Managing cookies</h2>
          <p>
            You can control cookies through the cookie banner that appears when you first visit
            this site. You can also manage cookies through your browser settings, see your
            browser&apos;s help documentation for instructions.
          </p>
          <p>
            Note that disabling essential cookies will prevent you from logging into the CareBeds
            operator portal.
          </p>

          <p>
            Questions?{' '}
            <a href="/contact" className="text-brand-accent hover:text-brand-ink">Contact us</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
