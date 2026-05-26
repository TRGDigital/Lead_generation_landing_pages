import type { Metadata } from 'next'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Terms of Service | CareBeds',
  description: 'CareBeds terms of service — the terms that govern use of our platform and services.',
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold text-brand-ink">Terms of Service</h1>
        <p className="mt-2 text-sm text-brand-ink-muted">Last updated: January 2025</p>

        <div className="mt-10 space-y-6 text-sm leading-relaxed text-brand-ink-soft">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the CareBeds platform and
            services operated by [Company Ltd] (&ldquo;CareBeds&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By accessing or using our
            services you agree to be bound by these Terms.
          </p>

          {[
            {
              title: '1. Service description',
              body: 'CareBeds provides a managed occupancy marketing service for UK care home operators. This includes landing page creation and hosting, advertising campaign management, enquiry qualification, and an operator portal. The specific deliverables for each client are set out in the service agreement.',
            },
            {
              title: '2. Operator responsibilities',
              body: "Operators using CareBeds agree to: (a) provide accurate information about their care home; (b) keep their portal up to date with bed availability and care types; (c) respond to qualified enquiries within one business day; (d) log move-in outcomes accurately in the portal; and (e) comply with all applicable CQC regulations and advertising standards.",
            },
            {
              title: '3. Fees and payment',
              body: "Fees are charged per confirmed move-in as set out in your service agreement. A 'confirmed move-in' occurs when a resident physically moves into your care home following a CareBeds-originated enquiry. Invoices are due within 30 days of issue. Late payment may result in suspension of the service.",
            },
            {
              title: '4. Intellectual property',
              body: 'CareBeds retains ownership of all landing pages, advertising creative, and platform technology. Operators grant CareBeds a licence to use care home information, photography, and branding supplied by the operator for the purpose of operating the service.',
            },
            {
              title: '5. Data and privacy',
              body: 'Each party shall comply with applicable data protection legislation. CareBeds acts as a data processor in respect of resident enquiry data passed to operators. The operator acts as data controller for enquiry data once received. See our Privacy Policy for full details.',
            },
            {
              title: '6. Limitation of liability',
              body: "CareBeds's liability for any claim arising from these Terms shall not exceed the total fees paid by you in the three months preceding the claim. We are not liable for indirect, consequential, or incidental losses. We do not guarantee a minimum number of enquiries or move-ins.",
            },
            {
              title: '7. Termination',
              body: 'Either party may terminate the service agreement with immediate effect by giving written notice. On termination, CareBeds will take down your landing page within 5 business days. Fees for move-ins that occurred prior to termination remain payable.',
            },
            {
              title: '8. Governing law',
              body: 'These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h2 className="font-display text-xl font-semibold text-brand-ink mb-2">{title}</h2>
              <p>{body}</p>
            </div>
          ))}

          <p>
            Questions about these terms?{' '}
            <a href="/contact" className="text-brand-accent hover:text-brand-ink">Contact us</a>.
          </p>
        </div>
      </div>
    </section>
  )
}
