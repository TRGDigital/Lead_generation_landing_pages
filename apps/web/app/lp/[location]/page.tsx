import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getLocationPage, getAllLocationSlugs } from '@/lib/location-page'
import { LocationLeadForm } from '@/components/careassura/LocationLeadForm'

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

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Image src="/products/careassura-logo.webp" alt="CareAssura" width={400} height={237} className="h-9 w-auto" priority />
          <a href="#enquire" className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white">
            Get free help
          </a>
        </div>
      </header>

      {/* Hero + form */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at top right, rgba(124,58,237,0.10), transparent 55%), radial-gradient(ellipse at bottom left, rgba(37,99,235,0.08), transparent 50%)' }} />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            {hero.eyebrow && <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">{hero.eyebrow}</p>}
            <h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 md:text-5xl">
              {hero.headline ?? (
                <>Find a brilliant care home in{' '}
                  <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">{area}</span>.</>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              {hero.subheadline ?? `Comparing care homes is stressful. We make it simple. Tell us what you need and a local care adviser will match you to the right homes in ${area}, free and with no pressure.`}
            </p>
            {(hero.bullets?.length ?? 0) > 0 && (
              <ul className="mt-7 space-y-2.5">
                {hero.bullets!.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[15px] text-slate-700">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-100">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-violet-600" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="lg:pl-4">
            <LocationLeadForm locationSlug={page.slug} careTypes={c.careTypes} timeframes={c.timeframes} />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      {stats.length > 0 && (
        <section className="bg-slate-900 py-10 text-white">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">{s.value}</p>
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
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white">{i + 1}</span>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why CareAssura */}
      {points.length > 0 && (
        <section className="bg-slate-50 py-16">
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
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-16">
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
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-violet-600 to-blue-600 py-16 text-center text-white">
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
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-center sm:flex-row sm:text-left">
          <Image src="/products/careassura-logo.webp" alt="CareAssura" width={400} height={237} className="h-7 w-auto" />
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} CareAssura. Free, impartial help finding care across the UK.</p>
        </div>
      </footer>
    </div>
  )
}
