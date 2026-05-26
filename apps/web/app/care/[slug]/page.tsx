import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.slug} — Care Home Vacancies`,
  }
}

export default function CareLandingPage({ params }: Props) {
  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Placeholder — Phase 2 builds the lead capture landing page */}
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-accent">
          Care home
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-brand-ink">
          {params.slug}
        </h1>
        <p className="mt-4 font-body text-lg text-brand-ink-soft">
          Landing page placeholder — Phase 2 builds the lead capture form.
        </p>
      </div>
    </main>
  )
}
