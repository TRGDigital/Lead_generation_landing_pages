import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Phone, Star } from 'lucide-react'
import { SketchArrow } from '@/components/marketing/Decor'
import { getGoPage } from '@/lib/go-pages'
import { TrgGoQuiz } from '@/components/go/TrgGoQuiz'
import { GoogleCloud, OpenAI, Claude, Supabase, Pinecone, GoogleAds, Aws } from '@/components/marketing/tech-logos'
import { GoExitIntent } from '@/components/go/GoExitIntent'

// TRG Google Ads landing page: /go/<slug>. Conversion-focused — slim header, the
// gamified quiz above the fold over a bled-in care photo, then proof, steps,
// real-work showcase and FAQs, with a CTA at every scroll depth. noindex (ads
// traffic only). Managed in /admin/go-pages.
export const dynamic = 'force-dynamic'

type Props = { params: { slug: string }; searchParams?: { h?: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getGoPage(params.slug)
  if (!page || page.status !== 'published') return { robots: { index: false, follow: false } }
  return {
    title: page.meta_title || `${page.service} for Care Homes | TRG Digital`,
    description: page.meta_description || page.subheadline,
    robots: { index: false, follow: true },
  }
}

// Generic across services — how working with TRG goes.
const STEPS = [
  {
    title: 'Take the 60-second check',
    body: 'Answer a handful of quick questions about your home. No forms to download, no sales call to book.',
  },
  {
    title: 'Get your action plan',
    body: 'A care-sector specialist (a real person) reviews your answers and replies within one working day with what we would fix first, and why.',
  },
  {
    title: 'We build, you fill beds',
    body: 'Like the plan? We implement it end to end and report in enquiries, tours and filled beds, never vanity clicks.',
  },
]

type ShowcaseItem = {
  src: string
  alt: string
  eyebrow: string
  title: string
  body: string
  bullets?: string[]
}

const SHOWCASE: ShowcaseItem[] = [
  {
    src: '/work/crossways/tool-funding-d.jpg',
    alt: 'A care funding calculator TRG built into a care home website',
    eyebrow: 'Tools families actually use',
    title: 'Websites that answer the questions families ask',
    body: 'Every care site we build comes loaded with the tools families search for. They get answers, you get warmer enquiries with contact details attached:',
    bullets: [
      'Care funding calculator',
      'Deferred payment calculator',
      'NHS Continuing Healthcare checker',
      'Funded Nursing Care checker',
      'Local council funding lookup',
      'Dementia signs checklist',
      '“Is it time for care?” checklist',
      'Cost of care estimator',
      'Book-a-visit scheduler',
      'AI chat assistant, answers 24/7',
      'Live room availability',
      'Accessibility toolbar + tap-to-call',
    ],
  },
  {
    src: '/work/ferndale/local-1-d.jpg',
    alt: 'A local area landing page TRG built for a nursing home',
    eyebrow: 'Found first on Google',
    title: 'Local pages that put you above the directories',
    body: 'Purpose-built town and service pages that rank for the searches families in your area actually make, so enquiries come to you directly instead of through a paid middleman.',
  },
  {
    src: '/work/crossways/enquiry-modal-d.jpg',
    alt: 'An enquiry form opening over a care home website TRG built',
    eyebrow: 'Built to generate enquiries',
    title: 'Every page nudges families to get in touch',
    body: 'Book-a-visit buttons, one-tap calling and friendly enquiry forms are never more than a click away, on every page, on every device. More of your visitors become tours, and more tours become residents.',
  },
  {
    src: '/work/pagespeed-green-d.jpg',
    alt: 'A page speed report showing 100 scores across performance, accessibility, best practices and SEO',
    eyebrow: 'Fast on every device',
    title: 'Green across the board, and Google notices',
    body: 'Families leave slow websites, and Google ranks them lower. Our from-scratch builds score green on every page speed check: faster pages, better rankings, more enquiries from the traffic you already have.',
  },
]

function CtaButton({ label = 'Take the 60-second check' }: { label?: string }) {
  return (
    <a
      href="#quiz"
      className="inline-block rounded-2xl bg-brand-pop px-8 py-4 text-center font-display text-lg font-bold uppercase tracking-tight text-white shadow-[4px_4px_0_0_#2a2620] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-brand-pop-dark hover:shadow-[2px_2px_0_0_#2a2620]"
    >
      {label} ↑
    </a>
  )
}

export default async function GoLandingPage({ params, searchParams }: Props) {
  const page = await getGoPage(params.slug)
  if (!page || page.status !== 'published') notFound()

  // Ad-group message match: ?h= overrides the headline per ad without extra
  // pages (plain text, capped; React escaping keeps it safe). Meta/SEO always
  // use the admin headline.
  const headlineOverride = (searchParams?.h ?? '').replace(/<[^>]*>/g, '').trim().slice(0, 90)
  const headline = headlineOverride || page.headline

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Slim header: logo + phone, no nav to leak clicks */}
      <header className="relative z-20 border-b border-brand-line bg-white/90 px-6 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Image src="/trg-digital-2025.png" alt="TRG Digital" width={130} height={36} className="h-8 w-auto" priority />
          <a
            href="tel:+442080641596"
            className="inline-flex items-center gap-2 rounded-full bg-brand-ink px-4 py-2 text-sm font-bold text-white"
          >
            <Phone className="h-4 w-4" /> 020 8064 1596
          </a>
        </div>
      </header>

      {/* Hero: copy left, quiz right, over a care photo bled into the page */}
      <section id="quiz" className="relative scroll-mt-16 overflow-hidden px-6 py-12 sm:py-16">
        <div className="absolute inset-0" aria-hidden>
          <Image
            src="/hero-resident.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Solid behind the copy, softening to a gentle tint over the quiz side */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/95 to-brand-bg/60" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-brand-bg" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-brand-pop px-4 py-1.5 font-display text-xs font-bold uppercase tracking-widest text-white">
              {page.service} · care sector only
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl">
              {headline}
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-brand-ink-soft">{page.subheadline}</p>

            <ul className="mt-7 space-y-3">
              {page.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[15px] leading-relaxed text-brand-ink">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-pop text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <SketchArrow className="pointer-events-none -mt-10 mb-0 hidden h-auto w-[121%] text-brand-pop lg:block" />

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-ink-soft lg:mt-2">
              <span className="flex shrink-0 text-amber-400" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              <span className="whitespace-nowrap text-xs sm:text-sm">Trusted by UK care homes. Care sector only.</span>
            </div>

            {/* The stack we build on */}
            <div className="mt-6 border-t border-brand-ink/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink-muted">
                Specialists in the technology behind it all
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {[
                  { name: 'Google Cloud', Icon: GoogleCloud },
                  { name: 'OpenAI', Icon: OpenAI },
                  { name: 'Claude', Icon: Claude },
                  { name: 'Supabase', Icon: Supabase },
                  { name: 'Pinecone', Icon: Pinecone },
                  { name: 'Google Ads', Icon: GoogleAds },
                  { name: 'AWS', Icon: Aws },
                ].map(({ name, Icon }) => (
                  <span key={name} className="inline-flex items-center gap-1.5 rounded-full border border-brand-line bg-white/80 px-3 py-1.5 text-xs font-semibold text-brand-ink">
                    <span className="h-3.5 w-3.5"><Icon /></span>
                    {name}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 max-w-xl text-xs leading-relaxed text-brand-ink-muted">
                From AI chat and search to rock-solid hosting and ad tracking, we build and run care marketing on the
                same platforms the world&apos;s best products use.
              </p>
            </div>
          </div>

          <div>
            <div className="rounded-3xl border-2 border-brand-ink bg-white shadow-[8px_8px_0_0_#2a2620]">
              <TrgGoQuiz slug={page.slug} intro={page.quiz_intro} questions={page.questions} ctaLabel={page.cta_label} />
            </div>
            {page.risk_reversal && (
              <p className="mt-4 px-2 text-center text-sm leading-relaxed text-brand-ink-soft">{page.risk_reversal}</p>
            )}
            {page.plan_items.length > 0 && (
              <div className="mt-5 rounded-2xl border-2 border-brand-line bg-white p-5 shadow-[4px_4px_0_0_#2a2620]">
                <p className="font-display text-xs font-bold uppercase tracking-widest text-brand-pop">Your action plan includes</p>
                <ul className="mt-2.5 space-y-1.5">
                  {page.plan_items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-snug text-brand-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-pop" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Proof band */}
      {page.proof.length > 0 && (
        <section className="bg-brand-ink px-6 py-12">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {page.proof.map((p) => (
              <div key={p.label}>
                <p className="font-display text-4xl font-bold text-brand-accent">{p.stat}</p>
                <p className="mt-1 text-sm text-white/75">{p.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Client reviews — per-page, edited in /admin/go-pages */}
      {page.reviews.length > 0 && (
        <section className="bg-white px-6 py-14">
          <div className="mx-auto max-w-6xl">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-brand-pop">What care providers say</p>
            <div className={`mt-8 grid grid-cols-1 gap-6 ${page.reviews.length === 2 ? 'mx-auto max-w-4xl sm:grid-cols-2' : page.reviews.length === 1 ? 'mx-auto max-w-xl' : 'md:grid-cols-3'}`}>
              {page.reviews.slice(0, 3).map((t) => (
                <figure key={t.name} className="flex flex-col rounded-2xl border-2 border-brand-line bg-brand-bg p-7">
                  <span className="flex text-amber-400" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </span>
                  <blockquote className="mt-4 flex-1 leading-relaxed text-brand-ink">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5">
                    <p className="font-semibold text-brand-ink">{t.name}</p>
                    <p className="text-sm text-brand-ink-muted">{t.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* The human behind the reply — reviewed by a real person */}
      {page.founder_note && (
        <section className="px-6 pb-2 pt-10">
          <div className="mx-auto flex max-w-3xl items-center gap-5 rounded-3xl border-2 border-brand-line bg-white p-6 shadow-[4px_4px_0_0_#2a2620]">
            <Image
              src="/team/len-burgess.png"
              alt="Len Burgess, founder of TRG Digital"
              width={72}
              height={72}
              className="h-16 w-16 shrink-0 rounded-full border-2 border-brand-ink object-cover"
            />
            <div>
              <p className="leading-relaxed text-brand-ink">{page.founder_note}</p>
              <p className="mt-1.5 text-sm font-semibold text-brand-ink-muted">Len Burgess · Founder, TRG Digital</p>
            </div>
          </div>
        </section>
      )}

      {/* How it works — 3 simple steps */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-brand-pop">How it works</p>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
            Three simple steps to more enquiries
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="rounded-2xl border-2 border-brand-line bg-white p-7 shadow-[4px_4px_0_0_#2a2620]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pop font-display text-lg font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight text-brand-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <CtaButton />
          </div>
        </div>
      </section>

      {/* Real work showcase — alternating image + copy */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-14">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-brand-pop">Built for care, proven in care</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Real work from real care homes
            </h2>
          </div>
          {SHOWCASE.map((f, i) => (
            <div key={f.title} className="grid items-center gap-8 lg:grid-cols-2">
              <div className={`relative aspect-[16/10] overflow-hidden rounded-2xl border-2 border-brand-ink shadow-[6px_6px_0_0_#2a2620] ${i % 2 ? 'lg:order-2' : ''}`}>
                <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 560px, 100vw" className="object-cover object-top" />
              </div>
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-widest text-brand-pop">{f.eyebrow}</p>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase leading-tight tracking-tight text-brand-ink">{f.title}</h3>
                <p className="mt-3 leading-relaxed text-brand-ink-soft">{f.body}</p>
                {f.bullets && (
                  <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-brand-ink">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pop" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
          <div className="text-center">
            <CtaButton label="See what we would fix first" />
          </div>
        </div>
      </section>

      {/* FAQs */}
      {page.faqs.length > 0 && (
        <section className="px-6 py-14">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-brand-ink">
              Common questions
            </h2>
            <div className="mt-6 space-y-3">
              {page.faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border-2 border-brand-line bg-white px-5 py-4">
                  <summary className="cursor-pointer list-none font-semibold text-brand-ink">{f.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{f.a}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 text-center">
              <CtaButton label="Take the 60-second check" />
            </div>
          </div>
        </section>
      )}

      {/* Mobile: persistent action bar once the quiz is out of view */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t-2 border-brand-ink bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <a
          href="#quiz"
          className="flex-1 rounded-xl bg-brand-pop px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-tight text-white"
        >
          {page.sticky_cta || 'Take the 60-second check'}
        </a>
        <a
          href="tel:+442080641596"
          aria-label="Call TRG Digital"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-ink text-white"
        >
          <Phone className="h-5 w-5" />
        </a>
      </div>

      {page.exit_heading && (
        <GoExitIntent heading={page.exit_heading} body={page.exit_body} ctaLabel={page.sticky_cta || 'Take the 60-second check'} />
      )}

      {/* Slim footer */}
      <footer className="border-t border-brand-line bg-white px-6 py-6 pb-24 lg:pb-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs text-brand-ink-muted">
          <p>© {new Date().getFullYear()} TRG Digital Ltd · Registered in England 11731704</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/cookies" className="hover:underline">Cookies</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
