import type { Metadata } from 'next'
import Link from 'next/link'
import { Type, Contrast, BookOpen, Volume2, Keyboard, ImageIcon } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { ServiceLanding } from '@/components/marketing/ServiceLanding'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

const META: Metadata = {
  title: 'Accessible Websites for Care Providers | WCAG 2.2 AA',
  description:
    'Accessible websites for UK care providers, built to WCAG 2.2 AA with an accessibility bar for larger text, high contrast, a readable font and listen to page. Easier for older visitors, better for search.',
  alternates: { canonical: `${SITE_URL}/accessible-websites` },
  robots: { index: true, follow: true },
}

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/accessible-websites', META)
}

const linkClass = 'font-semibold text-brand-pop underline-offset-2 hover:underline'

export default function AccessibleWebsitesPage() {
  return (
    <ServiceLanding
      path="/accessible-websites"
      schemaName="Accessible websites for care providers"
      schemaDescription="Care provider websites built to WCAG 2.2 AA, with a built-in accessibility bar for larger text, high contrast, a readable font and listen to page."
      eyebrow="Accessible websites"
      title={['Websites that', 'every family', 'can use']}
      intro="Many of the people reading a care provider's website are older, or have poor sight, hearing or dexterity. We build every website to the WCAG 2.2 AA standard, with an accessibility bar on every page so each visitor can adjust the site to suit them."
      heroPoints={['Built to WCAG 2.2 AA', 'Accessibility bar on every page', 'Better for search too']}
      primaryCta={{ label: 'Check your website', href: '/tools/website-grader' }}
      secondaryCta={{ label: 'Talk to us', href: '/contact' }}
      mock={{
        url: 'yourcarehome.co.uk',
        heading: 'Accessibility bar',
        rows: [
          ['Text size', 'A  A+  A++'],
          ['High contrast', 'On'],
          ['Readable font', 'On'],
          ['Listen to page', 'Play'],
        ],
        badge: 'WCAG 2.2 AA',
      }}
      why={{
        title: 'Accessibility decides whether people can use your site at all',
        tagline: 'For older visitors, readable text is not a nice extra.',
        paragraphs: [
          'Your visitors include people arranging care for themselves and husbands or wives arranging care for a partner. For them, being able to enlarge text or have a page read aloud can decide whether they can use your website. Many carers applying for jobs speak English as a second language, and a clear layout with listen to page helps them too.',
          <>
            Under the Equality Act 2010, anyone providing a service to the public must make reasonable adjustments so
            that disabled people are not put at a substantial disadvantage (
            <a href="https://www.legislation.gov.uk/ukpga/2010/15/section/20" className={linkClass} target="_blank" rel="noopener noreferrer">section 20</a>
            ), and must not discriminate in the way the service is provided (
            <a href="https://www.legislation.gov.uk/ukpga/2010/15/section/29" className={linkClass} target="_blank" rel="noopener noreferrer">section 29</a>
            ). Your website is one of the ways you provide your service. Building to WCAG 2.2 AA is the clearest way
            to show you have taken this seriously, and Google rewards the same things: clear headings, described
            images and fast pages. See how your current site scores with our free{' '}
            <Link href="/tools/website-grader" className={linkClass}>website grader</Link>.
          </>,
        ],
      }}
      points={[
        'Built to the WCAG 2.2 AA standard',
        'Larger text in one tap',
        'High contrast mode',
        'A more readable font',
        'Listen to page, with nothing to install',
        'Keyboard friendly, with skip to content',
      ]}
      pointsCta="How accessible is your website today?"
      cards={{
        subtitle: 'What is built in',
        title: 'Accessible on every page',
        items: [
          { Icon: Type, title: 'Text size', body: 'Visitors can increase the text size across the whole site in one tap, without the layout breaking.' },
          { Icon: Contrast, title: 'High contrast', body: 'A high contrast mode makes text and buttons easier to see for people with low vision.' },
          { Icon: BookOpen, title: 'Readable font', body: 'Switches the site to a plainer font that many people with dyslexia find easier to read.' },
          { Icon: Volume2, title: 'Listen to page', body: 'Reads the page aloud using the voice already built into the visitor’s phone or computer.' },
          { Icon: Keyboard, title: 'Keyboard and screen readers', body: 'A skip to content link, full keyboard navigation and properly marked up headings, lists and forms.' },
          { Icon: ImageIcon, title: 'Described images and contrast', body: 'Alt text on every image and text colours that meet the AA contrast standard throughout.' },
        ],
      }}
      steps={{
        title: 'Accessible from the foundations up',
        items: [
          { n: '01', title: 'Designed for older visitors', body: 'Readable type sizes, generous spacing, clear buttons and colours that meet AA contrast from the first design.' },
          { n: '02', title: 'Built and tested', body: 'We test with the keyboard, screen readers and contrast checks, on phones, tablets and computers.' },
          { n: '03', title: 'Kept accessible', body: 'Your content management system asks for alt text on every image, so the site stays accessible as your team adds to it.' },
        ],
      }}
      cta={{
        title: 'A website every family can use',
        body: 'Grade your current website for free, or talk to us about building an accessible website for your care service.',
      }}
    />
  )
}
