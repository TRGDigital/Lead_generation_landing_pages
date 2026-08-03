import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { MonitorSmartphone, Check } from 'lucide-react'
import { GooglePreview } from '@/components/marketing/GooglePreview'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import ToolTracker from '@/components/marketing/ToolTracker'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/tools/google-preview', META)
}

const META: Metadata = {
  title: 'How You Look on Google | Care Website Search Preview | TRG Digital',
  description:
    'Free tool to see how your care home appears in Google search and when shared on social media, then write a better title and description with a live preview. Built for care homes, nursing homes and home care.',
  alternates: { canonical: `${SITE_URL}/tools/google-preview` },
  robots: { index: true, follow: true },
}

const FAQS = [
  { q: 'What does this tool show me?', a: 'It fetches your homepage and shows exactly how your care home appears in a Google search result, your blue title, your web address and the grey description, plus how a link to your site looks when shared on Facebook or WhatsApp. Then it lets you write a better version and see it update live.' },
  { q: 'Why does my Google title and description matter?', a: 'Your title and description are your advert in Google. They are often the first impression a family gets, before they ever click. A clear title with your care types and town, and a warm description with a reason to visit, wins far more clicks than a generic homepage tag.' },
  { q: 'How long should my title and description be?', a: 'Aim for a page title of 50 to 60 characters and a meta description of 140 to 160 characters. Any longer and Google cuts them off. The tool counts your characters live and tells you when you are in the ideal range.' },
  { q: 'How do I actually change these on my site?', a: 'Your title and meta description are set in your website pages, usually in the page settings or an SEO plugin like Yoast on WordPress. Copy the improved versions from this tool and paste them in, or ask us and we will sort it for you.' },
]

const POINTS = [
  'See your live Google search result',
  'See your social share preview',
  'Write a better title and description',
  'Live preview updates as you type',
]

export default function GooglePreviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Google Preview Tool',
            url: `${SITE_URL}/tools/google-preview`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: 'Free tool to preview how a page title and meta description will appear in Google search results.',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
            provider: { '@type': 'Organization', name: 'TRG Digital', '@id': `${SITE_URL}/#organization` },
          }),
        }}
      />

      <section className="relative overflow-x-clip px-6 pb-16 pt-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-10 right-8 hidden h-16 w-16 text-brand-pop/30 lg:block" />
        <div className="mx-auto max-w-6xl">
          <Link href="/tools" className="text-sm font-semibold text-brand-pop hover:underline">← The Care Toolkit</Link>
          <div className="mt-4 grid items-start gap-12 lg:grid-cols-2">
            <div className="lg:sticky lg:top-24 lg:self-start lg:pt-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                <MonitorSmartphone className="h-6 w-6" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-brand-pop">Free tool</p>
              <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
                How You Look on Google
              </h1>
              <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
              <p className="mt-6 max-w-md text-lg leading-relaxed text-brand-ink-soft">
                Your Google listing is your advert, and most families judge it before they click. See exactly how your
                care home appears in search and when shared, then write a better version in seconds.
              </p>
              <ul className="mt-6 space-y-2.5">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-center gap-2.5 text-sm font-medium text-brand-ink">
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop/10"><Check className="h-3 w-3 text-brand-pop" /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <ToolTracker tool="google-preview"><GooglePreview /></ToolTracker>
          </div>
        </div>
      </section>

      <section className="bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-3xl">
          {/* About / how-to (SEO) */}
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
            About the Google preview tool
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-brand-ink-soft">
            <p>
              When a family searches for care, the first thing they see is your listing in Google, a blue title, your
              web address and a short description. That little block of text is your advert, and it decides whether they
              click on you or on a competitor. Yet most care homes never look at it, and leave Google to show a generic
              homepage title and a description it has guessed from the page. Our free tool shows you exactly how your
              care home appears in search today, and how a link to your site looks when it is shared on Facebook or
              WhatsApp, so you can see the impression you are really making.
            </p>
            <p>
              Using it is simple. Enter your web address and the tool fetches your homepage and builds your live Google
              and social previews, along with plain-English tips on what is working and what is not. Then comes the
              useful part: you can write a better title and description right there, with a live preview that updates as
              you type and a character counter that keeps you in the ideal length. A strong title names your care types
              and your town, and a warm description gives families a reason to visit. Copy your improved versions into
              your site, or ask us to do it for you, and you turn more of those Google searches into real enquiries.
            </p>
          </div>

          <h2 className="mb-10 mt-16 text-center font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Your Google listing, explained
          </h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }) => (
              <details key={q} className="group rounded-xl border border-brand-line bg-white px-6 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-brand-ink">
                  {q}
                  <span className="shrink-0 text-lg leading-none text-brand-pop transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Win the click, win the enquiry
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We write and build care websites that stand out in search and turn visits into real enquiries.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Get a free action plan
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/tools" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              More free tools →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
