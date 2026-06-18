import type { Metadata } from 'next'

export const dynamic = 'force-static'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export const metadata: Metadata = {
  title: 'Privacy Policy | CareBeds',
  description: 'CareBeds privacy policy, how we collect, use, and protect your data.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-4xl font-semibold text-brand-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-brand-ink-muted">Last updated: January 2025</p>

        <div className="mt-10 prose prose-sm max-w-none text-brand-ink-soft [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-brand-ink [&_h2]:mt-8 [&_h2]:mb-3">
          <h2>1. Who we are</h2>
          <p>
            CareBeds (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a trading name operated by [Company Ltd], registered in England and Wales
            (Company No. [XXXXXX]). Our registered address is [Address]. We are the data controller
            for information submitted through this website.
          </p>

          <h2>2. Information we collect</h2>
          <p>We collect information when you:</p>
          <ul>
            <li>Submit an enquiry through our contact form (name, email, company, phone, message)</li>
            <li>Sign up for an operator portal account (email, full name, phone)</li>
            <li>Use the CareBeds operator portal (usage data, care home information)</li>
          </ul>
          <p>We also collect automatically: IP address, browser type, pages visited, referring URL, and device type.</p>

          <h2>3. How we use your information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to enquiries and provide the services you have requested</li>
            <li>Send transactional emails related to your account or service</li>
            <li>Analyse how the website is used and improve our service</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Legal basis for processing</h2>
          <p>We process your personal data under the following lawful bases (UK GDPR Article 6):</p>
          <ul>
            <li><strong>Contract:</strong> where processing is necessary to fulfil our service agreement with you</li>
            <li><strong>Legitimate interests:</strong> to operate and improve our service, prevent fraud, and communicate with prospects</li>
            <li><strong>Consent:</strong> where we have obtained your explicit consent (e.g. marketing emails)</li>
          </ul>

          <h2>5. Data retention</h2>
          <p>
            We retain contact form enquiries for 2 years. Account data is retained for the duration of your
            account plus 1 year. You may request deletion of your data at any time (see Section 7).
          </p>

          <h2>6. Third parties</h2>
          <p>We share data with the following third parties:</p>
          <ul>
            <li>Supabase (database and authentication hosting, EU servers)</li>
            <li>Vercel (website hosting, EU/US servers)</li>
            <li>SendGrid (transactional email, US servers, EU Standard Contractual Clauses apply)</li>
            <li>Google Analytics (website analytics, anonymised IP)</li>
          </ul>

          <h2>7. Your rights</h2>
          <p>Under UK GDPR you have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Rectify inaccurate data</li>
            <li>Request erasure of your data (&ldquo;right to be forgotten&rdquo;)</li>
            <li>Object to or restrict processing</li>
            <li>Data portability</li>
            <li>Lodge a complaint with the ICO (ico.org.uk)</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:privacy@carebeds.co.uk" className="text-brand-accent hover:text-brand-ink">
              privacy@carebeds.co.uk
            </a>
            .
          </p>

          <h2>8. Cookies</h2>
          <p>
            We use essential cookies for site functionality and analytics cookies (with your consent) to
            understand how the site is used. See our{' '}
            <a href="/cookies" className="text-brand-accent hover:text-brand-ink">Cookie Policy</a>.
          </p>

          <h2>9. Changes</h2>
          <p>
            We may update this policy from time to time. Material changes will be communicated via email
            or a prominent notice on this page.
          </p>
        </div>
      </div>
    </section>
  )
}
