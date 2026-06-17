import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getLocationPage, getAllLocationSlugs } from '@/lib/location-page'
import { getQuestionSet } from '@/lib/care-finder'
import { CareFinderQuiz } from '@/components/careassura/CareFinderQuiz'
import { GetMatchedModal } from '@/components/careassura/GetMatchedModal'
import { LegalLinks } from '@/components/careassura/LegalLinks'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllLocationSlugs()
  return slugs.map((location) => ({ location }))
}

export async function generateMetadata({ params }: { params: { location: string } }): Promise<Metadata> {
  const page = await getLocationPage(params.location)
  if (!page) return { title: 'Care homes near you | CareAssura' }
  return {
    title: page.meta_title ?? `Care homes in ${page.area_name} | CareAssura`,
    description: page.meta_description ?? `Find and compare brilliant care homes in ${page.area_name}. Free, impartial help from CareAssura.`,
    robots: { index: true, follow: true },
  }
}

// Our own rating labels in the CQC rating colours (Good = green, Outstanding =
// blue/teal). These are deliberately NOT the official CQC roundel graphics:
// those may only be used by the rated care home itself, on its own page, linked
// to its CQC profile. Here we simply reference the ratings in words, attributed
// to the CQC, which is permitted.
function RatingLabel({ word, tone }: { word: string; tone: 'good' | 'outstanding' }) {
  const cls = tone === 'good' ? 'bg-[#1a7f4b]' : 'bg-[#0e7490]'
  return (
    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-sm font-semibold text-white ${cls}`}>
      {word}
    </span>
  )
}

export default async function LocationLandingPage({ params }: { params: { location: string } }) {
  const page = await getLocationPage(params.location)
  if (!page) notFound()

  const area = page.area_name
  const c = page.content ?? {}
  const hero = c.hero ?? {}
  const stats = c.stats ?? []
  const steps = c.howItWorks?.steps ?? []
  const points = c.whyUs?.points ?? []
  const faqs = c.faq ?? []

  // The gamified care-finder quiz (template chosen per page: residential | nursing).
  const qset = await getQuestionSet(page.question_set || 'residential')
  const questions = qset?.questions ?? []

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Image src="/products/careassura-logo.webp" alt="CareAssura" width={364} height={91} className="h-16 w-auto sm:h-20" priority />
          <a href="#enquire" className="rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white">
            Get free help
          </a>
        </div>
      </header>

      {/* Hero + form (a care photo bled in behind the form) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
          <Image src="/careassura/respite.jpg" alt="" fill sizes="50vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-violet-900/10" />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(124,58,237,0.10), transparent 55%), radial-gradient(ellipse at bottom left, rgba(147,51,234,0.08), transparent 50%)' }}
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            {hero.eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">{hero.eyebrow}</p>}
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
              {hero.headline ?? (
                <>Find a brilliant care home in{' '}
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{area}</span>.</>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-relaxed text-slate-600">
              {hero.subheadline ?? `Finding the right care home should not mean ringing round for hours. Tell us what you need and we will pass your details to care homes in the ${area} area that have genuine availability. The right homes then get in touch with you directly to arrange a visit. It is free, with no obligation.`}
            </p>
            {(hero.bullets?.length ?? 0) > 0 && (
              <ul className="mt-7 space-y-2.5">
                {hero.bullets!.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-base text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-100">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-violet-600" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {/* CQC ratings — referenced in words, attributed to CQC (not the official roundel) */}
            <div className="mt-7 flex items-start gap-4 overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-5 shadow-sm">
              <span className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600 shadow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-base font-semibold leading-relaxed text-slate-900">
                  We only ever suggest care homes rated{' '}
                  <RatingLabel word="Good" tone="good" /> or{' '}
                  <RatingLabel word="Outstanding" tone="outstanding" /> by the Care Quality Commission.
                </p>
                <p className="mt-2 text-xs text-slate-500">Ratings are published by the CQC and can change. Always check a home&apos;s current rating at cqc.org.uk.</p>
              </div>
            </div>
          </div>
          <div className="lg:pl-4">
            <CareFinderQuiz locationSlug={page.slug} questions={questions} questionSetKey={page.question_set} anchorId="enquire" />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      {stats.length > 0 && (
        <section className="bg-slate-900 py-10 text-white">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      {steps.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">{c.howItWorks?.eyebrow ?? 'How it works'}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">{c.howItWorks?.heading ?? 'Finding care, made simple'}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <div key={s.title} className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 text-sm font-bold text-white">{i + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <GetMatchedModal locationSlug={page.slug} questions={questions} questionSetKey={page.question_set} areaName={area} timeframes={c.timeframes} />
            </div>
          </div>
        </section>
      )}

      {/* Care in action — image features */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl space-y-12 px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">Real care, real homes</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">The kind of care you would want for your own family</h2>
          </div>
          {/* Physio */}
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image src="/careassura/physio.jpg" alt="A physiotherapist helping a care home resident with gentle exercises" width={1400} height={853} className="aspect-[16/10] w-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">Keeping people active and well</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                The best homes in {area} go beyond day-to-day care, with physiotherapy, gentle exercise and activities that
                help residents stay strong, mobile and independent for longer.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                We only suggest homes with engaging daily activities and the right support on hand, so you can be confident
                your loved one is helped to live as fully and comfortably as possible.
              </p>
            </div>
          </div>
          {/* Respite */}
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <h3 className="text-2xl font-semibold text-slate-900">Warmth, company and dignity</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                Choosing a care home is about people as much as place. We match you to homes where residents are known,
                listened to and treated with real kindness, every single day.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                From a favourite armchair to a familiar face at breakfast, the small things matter. We take the time to
                understand what makes your family member feel at home, and find the places that get those details right.
              </p>
            </div>
            <div className="order-1 overflow-hidden rounded-2xl shadow-lg lg:order-2">
              <Image src="/careassura/respite.jpg" alt="A care worker chatting warmly with a resident over a cup of tea" width={1232} height={832} className="aspect-[16/10] w-full object-cover" />
            </div>
          </div>
          {/* Companionship */}
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image src="/careassura/companionship.jpg" alt="A nurse sharing a warm conversation with a smiling resident in a care home lounge" width={1400} height={830} className="aspect-[16/10] w-full object-cover" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-900">People who genuinely care</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                Great care comes down to great people. The homes we recommend in {area} are led by teams who treat residents
                like family, with patience, good humour and real affection.
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
                A friendly chat, a shared cup of tea, a hand to hold. These moments are what turn a care home into a real
                home, and they are exactly what we look for on your behalf.
              </p>
            </div>
          </div>
          <div className="flex justify-center pt-2">
            <GetMatchedModal locationSlug={page.slug} questions={questions} questionSetKey={page.question_set} areaName={area} timeframes={c.timeframes} label="Get matched to local homes" />
          </div>
        </div>
      </section>

      {/* Why CareAssura */}
      {points.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="mb-10 text-3xl font-bold text-slate-900 md:text-4xl">{c.whyUs?.heading ?? 'Why families choose CareAssura'}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {points.map((p) => (
                <div key={p.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
                  <h3 className="font-semibold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <GetMatchedModal locationSlug={page.slug} questions={questions} questionSetKey={page.question_set} areaName={area} timeframes={c.timeframes} />
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-8 text-3xl font-bold text-slate-900 md:text-4xl">Common questions</h2>
            <div className="divide-y divide-slate-200">
              {faqs.map((f, i) => (
                <details key={i} className="group py-5" {...(i === 0 ? { open: true } : {})}>
                  <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium text-slate-900">
                    {f.question}
                    <span className="ml-4 text-2xl font-light text-violet-600 group-open:hidden">+</span>
                    <span className="ml-4 hidden text-2xl font-light text-violet-600 group-open:inline">−</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">{f.answer}</p>
                </details>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <GetMatchedModal locationSlug={page.slug} questions={questions} questionSetKey={page.question_set} areaName={area} timeframes={c.timeframes} />
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-violet-600 to-purple-600 py-16 text-center text-white">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold md:text-4xl">Let us help you find the right care in {area}</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">It is free, impartial, and there is never any pressure. Tell us what you need and we will do the rest.</p>
          <a href="#enquire" className="mt-7 inline-block rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50">
            Get matched to local homes
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
          <div className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row sm:text-left">
            <Image src="/products/careassura-logo.webp" alt="CareAssura" width={364} height={91} className="h-10 w-auto" />
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} CareAssura. Free, impartial help finding care across the UK.</p>
          </div>
          <div className="flex w-full justify-center border-t border-slate-50 pt-4 sm:justify-end">
            <LegalLinks />
          </div>
        </div>
      </footer>
    </div>
  )
}
