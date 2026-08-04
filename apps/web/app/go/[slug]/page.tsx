import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Check, Phone, Star } from 'lucide-react'
import { getGoPage } from '@/lib/go-pages'
import { TrgGoQuiz } from '@/components/go/TrgGoQuiz'

// TRG Google Ads landing page: /go/<slug>. Conversion-focused — slim header, the
// gamified quiz above the fold over a bled-in care photo, then proof, steps,
// real-work showcase and FAQs, with a CTA at every scroll depth. noindex (ads
// traffic only). Managed in /admin/go-pages.
export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

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

const SHOWCASE = [
  {
    src: '/work/crossways/tool-funding-d.jpg',
    alt: 'A care funding calculator TRG built into a care home website',
    eyebrow: 'Tools families actually use',
    title: 'Websites that answer the questions families ask',
    body: 'Funding calculators, fees guides, dementia checklists and visit booking, built into the care sites we make. Families get answers, you get warmer enquiries with contact details attached.',
  },
  {
    src: '/work/ferndale/local-1-d.jpg',
    alt: 'A local area landing page TRG built for a nursing home',
    eyebrow: 'Found first on Google',
    title: 'Local pages that put you above the directories',
    body: 'Purpose-built town and service pages that rank for the searches families in your area actually make, so enquiries come to you directly instead of through a paid middleman.',
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

export default async function GoLandingPage({ params }: Props) {
  const page = await getGoPage(params.slug)
  if (!page || page.status !== 'published') notFound()

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
              {page.headline}
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

            <div className="mt-8 flex items-center gap-2 text-sm font-medium text-brand-ink-soft">
              <span className="flex text-amber-400" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </span>
              Trusted by UK care homes. We work with care providers and nobody else.
            </div>
          </div>

          <div className="rounded-3xl border-2 border-brand-ink bg-white shadow-[8px_8px_0_0_#2a2620]">
            <TrgGoQuiz slug={page.slug} intro={page.quiz_intro} questions={page.questions} ctaLabel={page.cta_label} />
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

      {/* Slim footer */}
      <footer className="border-t border-brand-line bg-white px-6 py-6">
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
