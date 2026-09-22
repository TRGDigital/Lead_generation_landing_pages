import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { Search, Smartphone, Gauge, ShieldCheck, MousePointerClick, Wrench, Check, ArrowRight, Bot, Sparkles, Code2, FileText, ListChecks } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import { EnquiryButton } from '@/components/marketing/EnquiryOverlay'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/website-development', META)
}

const META: Metadata = {
  title: 'Care Sector Website Development',
  description:
    'TRG Digital builds modern, fast, search-optimised websites for UK care providers, designed to increase your exposure and turn visitors into enquiries.',
  alternates: { canonical: `${SITE_URL}/website-development` },
  robots: { index: true, follow: true },
}

const FEATURES = [
  { Icon: Search, title: 'Built to be found', body: 'Search-optimised from the ground up, structured for the terms families and professionals actually use to find care.' },
  { Icon: MousePointerClick, title: 'Built to convert', body: 'Clear journeys, strong calls to action and enquiry forms that turn visitors into real conversations.' },
  { Icon: Smartphone, title: 'Mobile-first', body: 'Most care searches happen on a phone. Your site looks and works beautifully on every screen.' },
  { Icon: Gauge, title: 'Fast and reliable', body: 'Lightweight, modern builds that load quickly, rank better and never keep a worried family waiting.' },
  { Icon: ShieldCheck, title: 'Care-aware content', body: 'Written for the sector: care types, CQC ratings, funding and the questions people really ask.' },
  { Icon: Wrench, title: 'Managed for you', body: 'We host, maintain and update your site, so it stays fast, secure and current without taking up your time.' },
]

const STEPS = [
  { n: '01', title: 'Discovery', body: 'We learn your services, your settings and the families you want to reach, then map the site around them.' },
  { n: '02', title: 'Design & build', body: 'A bespoke, on-brand site designed to convert, built on a fast and secure modern stack.' },
  { n: '03', title: 'Launch & grow', body: 'We launch, measure and keep improving, so your site works harder for you over time.' },
]

// The SEO-safe migration checklist — grouped so it scans as reassurance, not jargon.
const MIGRATION = [
  {
    phase: 'Before we touch anything',
    items: [
      'A full crawl and inventory of every existing page and URL',
      'A review of your Google Search Console and analytics history',
      'A complete backup and a clear rollback plan',
    ],
  },
  {
    phase: 'We preserve every detail',
    items: [
      'Your existing URLs, or a proper 301 redirect for any that must change',
      'Page titles, meta descriptions and heading structure',
      'Image alt text, canonical tags and structured data',
      'Internal links and your indexing rules',
      'Your service, location and blog pages',
    ],
  },
  {
    phase: 'Before it goes live',
    items: [
      'The staging site is locked out of Google, so it never gets indexed by accident',
      'Broken-link and redirect testing across the whole site',
      'Cross-browser and device quality-assurance',
    ],
  },
  {
    phase: 'After launch',
    items: [
      'A post-launch crawl and full SEO validation',
      'Search Console and analytics monitoring',
      'We watch your rankings and traffic, we don’t just hope',
    ],
  },
]

// What we improve once the foundations are protected — the "and then it gets better" story.
const IMPROVEMENTS = [
  { Icon: Code2, title: 'Richer structured data', body: 'We add and expand the schema search engines and AI read, LocalBusiness, FAQs, reviews and more, so your home is understood and shown properly, not just crawled.' },
  { Icon: ListChecks, title: 'Cleaner indexability', body: 'A tidy sitemap, correct canonicals and crawl-friendly structure, so Google finds and ranks every page that should be found, and ignores the ones that should not.' },
  { Icon: FileText, title: 'New, care-aware content', body: 'Fresh service and location pages written for the searches families actually make, expanding your reach well beyond what the old site ever ranked for.' },
  { Icon: Gauge, title: 'Genuinely fast pages', body: 'We rebuild on a modern, lightweight stack and tune Core Web Vitals, so the site loads in a blink, which both families and Google reward.' },
  { Icon: MousePointerClick, title: 'Conversion & form tracking', body: 'Clear booking, referral and contact pathways, with analytics and form-event tracking wired in, so you can see exactly what turns a visitor into an enquiry.' },
  { Icon: ShieldCheck, title: 'Accessible by design', body: 'Better readability, contrast and structure, so the site works for every visitor and meets the standards a modern care website is expected to.' },
]

export default function WebsiteDevelopmentPage() {
  return (
    <>
      {/* JSON-LD, Service */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Care Sector Website Development',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description: 'Modern, search-optimised websites for UK care providers, designed to increase exposure and enquiries.',
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-10 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Website build</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Websites that turn searches into <span className="text-brand-pop">enquiries</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              Your website is often the first impression a family gets of your care. We design and build modern,
              fast, search-optimised sites that grow your exposure and turn quiet visits into real enquiries.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <EnquiryButton className="btn-pop">
                Start your project
                <span className="btn-arrow" aria-hidden>→</span>
              </EnquiryButton>
              <Link href="/website-build" className="btn-cta-outline">
                What&apos;s included
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['SEO-built', 'Mobile-first', 'Fast & secure'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Visual, a real care website we built */}
          <div className="relative">
            {/* Desktop */}
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
              <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">crosswayscarehome.co.uk</span>
              </div>
              <div className="relative aspect-[1522/916] w-full">
                <ManagedImage src="/mockups/crossways.png" alt="The Crossways Care Home website we built, showing live room availability, click-to-call and the AI chat assistant" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" priority />
              </div>
            </div>
            {/* iPhone, full phone screen (matches the screenshot aspect) */}
            <div className="absolute -bottom-7 -left-5 hidden w-[102px] overflow-hidden rounded-[1.5rem] border-[5px] border-brand-ink bg-brand-ink shadow-card sm:block">
              <div className="relative aspect-[390/844] w-full overflow-hidden rounded-[1.05rem] bg-white">
                <ManagedImage src="/mockups/crossways-mobile.png" alt="Crossways on mobile, showing live room availability" fill sizes="102px" className="object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rich intro (SEO), copy left, key points right ────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Your hardest-working salesperson
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Care websites designed to fill beds.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                For most families, choosing care starts with a search and ends on a website. If your site is slow,
                hard to use on a phone, or doesn&apos;t answer the questions they&apos;re really asking, they move
                on to a competitor, often without ever picking up the phone. We build sites that do the opposite:
                load fast, look trustworthy, and make enquiring effortless.
              </p>
              <p>
                Every TRG website is built for the care sector specifically. We structure pages around real search
                behaviour for{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">local care searches</Link>,
                write content that speaks to CQC ratings, funding routes and care types, and design enquiry
                journeys that turn quiet visits into booked tours. When you&apos;re ready to scale, the site plugs
                straight into our{' '}
                <Link href="/marketing" className="font-semibold text-brand-pop underline-offset-2 hover:underline">paid and organic marketing</Link>{' '}
                and, where you need something bespoke, our{' '}
                <Link href="/development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">custom software</Link>.
              </p>
            </div>
          </div>

          {/* Key points + CTA */}
          <div className="space-y-3">
            {[
              'Fully responsive, flawless on mobile, tablet & desktop',
              'Search-engine optimised (SEO) from day one',
              'Compressed, next-gen images for fast loading',
              'Lightning-fast page-load speed & Core Web Vitals',
              'Secure HTTPS, accessible & WCAG-friendly',
              'Conversion-focused enquiry forms & clear CTAs',
              'Hosted, maintained & analytics built in',
            ].map((point) => (
              <div key={point} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{point}</span>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-accent p-7">
              <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink">
                Want a website that does all this?
              </p>
              <EnquiryButton className="btn-pop mt-5">
                Submit a project enquiry
                <span className="btn-arrow" aria-hidden>→</span>
              </EnquiryButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What&apos;s included</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Every site we build, built right
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, body }) => (
              <div key={title} className="group rounded-2xl border border-brand-line bg-white p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-pop/40 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10 transition-colors group-hover:bg-brand-pop">
                  <Icon className="h-6 w-6 text-brand-pop transition-colors group-hover:text-white" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why it matters (dark) ─────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-ink px-6 py-24 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-pop/20 blur-3xl" />
        <Star className="absolute left-8 top-12 hidden h-16 w-16 text-brand-accent lg:block" />
        <Burst className="absolute -bottom-12 -right-10 h-52 w-52 text-brand-pop/30" />
        <div className="relative mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
                A better website means more of the right enquiries
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
                It&apos;s not about a prettier site, it&apos;s about more families finding you, trusting you and
                getting in touch.
              </p>
              <EnquiryButton className="btn-cta btn-on-dark mt-8">
                Start your project
                <span className="btn-arrow" aria-hidden>→</span>
              </EnquiryButton>
            </div>
            <ul className="space-y-3">
              {[
                'Rank for the care searches happening in your area',
                'Build trust the moment a family lands on your page',
                'Make it effortless to enquire, on any device',
                'Show off your homes, your team and your CQC ratings',
                'Plug straight into our marketing when you want to grow faster',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </span>
                  <span className="text-sm leading-relaxed text-white/85">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How we work</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              From first call to fully booked
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map(({ n, title, body }) => (
              <div key={n} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                <p className="font-display text-5xl font-bold text-brand-pop">{n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEO-safe migration ────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute left-8 top-12 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Redesign without the risk</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Move platforms without losing your rankings
            </h2>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 text-base leading-relaxed text-brand-ink-soft">
              The scariest part of a redesign is the fear of losing the Google rankings you have spent years building.
              We migrate you off WordPress, Wix or any other platform the careful way, so nothing that works today is
              lost tomorrow. <strong className="text-brand-ink">Nothing is removed or materially changed without your
              approval.</strong>
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MIGRATION.map(({ phase, items }) => (
              <div key={phase} className="rounded-2xl border border-brand-line bg-white p-6 shadow-soft">
                <h3 className="font-display text-base font-bold uppercase tracking-tight text-brand-ink">{phase}</h3>
                <ul className="mt-4 space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-snug text-brand-ink-soft">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-pop" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-brand-line bg-brand-bg-warm p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-base leading-relaxed text-brand-ink">
              <strong>We have done exactly this, twice.</strong> We moved two live care homes off WordPress onto a faster
              custom platform, preserving every URL and mapping every redirect, with no loss of rankings.
            </p>
            <Link href="/work" className="btn-pop shrink-0">
              See the case studies
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Then we improve everything ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-brand-pop/10 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Then we raise the ceiling</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Protected first, then made far better
            </h2>
            <p className="mt-6 text-base leading-relaxed text-brand-ink-soft">
              Preserving what works is only half the job. Once the foundations are safe, we build on them, so you come
              out of the redesign not just intact, but faster, better found and easier to enquire with than ever.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {IMPROVEMENTS.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Agentic browsing & WebMCP ─────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-8 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 left-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Built for the AI era</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Ready for agentic browsing &amp; WebMCP
            </h2>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                AI assistants like ChatGPT, Claude and Google&apos;s AI are starting to browse the web for people,
                reading websites and even completing tasks on their behalf. The problem is that most websites are
                invisible or unusable to them.
              </p>
              <p>
                Every site we build is made AI ready. We add an <strong className="text-brand-ink">llms.txt</strong>, a
                clear map of your site for AI, and <strong className="text-brand-ink">WebMCP</strong> (the new Web Model
                Context Protocol), which hands AI agents a set of safe, structured tools. Instead of guessing their way
                around your page, an agent can ask your site directly: what services do you offer, what is your CQC
                rating, how do I get in touch. It runs live on this very site.
              </p>
            </div>
            <Link href="/contact" className="btn-pop mt-8">
              Get an AI-ready website
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          </div>

          <div className="space-y-4">
            {[
              { Icon: Bot, title: 'Found and understood by AI', body: 'A clean llms.txt and structure mean AI assistants can read your site accurately and recommend your home with confidence.' },
              { Icon: Sparkles, title: 'Agents can act, not just read', body: 'WebMCP gives agents safe tools to fetch your services, contact details and content directly, the groundwork for AI-driven enquiries.' },
              { Icon: ShieldCheck, title: 'Safe by design', body: 'The tools are read-only and feature-detected. They add zero risk and have no impact at all on your normal visitors.' },
              { Icon: Gauge, title: 'Future-proof and ahead', body: 'As AI-driven traffic grows, your site is already built for it, while most of your competitors are not.' },
            ].map(({ Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl border border-brand-line bg-white p-5 shadow-soft">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-brand-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Star className="absolute bottom-8 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            Ready for a website that works as hard as you do?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Tell us about your service and we&apos;ll show you what a care-sector site built to convert could do for
            your enquiries.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <EnquiryButton className="btn-cta">
              Start your project
              <span className="btn-arrow" aria-hidden>→</span>
            </EnquiryButton>
            <Link href="/marketing" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See our marketing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
