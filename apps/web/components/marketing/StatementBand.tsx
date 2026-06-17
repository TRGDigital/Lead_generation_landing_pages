import Link from 'next/link'

// Reusable bold statement band (BoxChilli-style big type). Tones: light / dark / pop.
export function StatementBand({
  eyebrow,
  children,
  cta,
  tone = 'light',
}: {
  eyebrow?: string
  children: React.ReactNode
  cta?: { label: string; href: string }
  tone?: 'light' | 'dark' | 'pop'
}) {
  const bg = tone === 'dark' ? 'bg-brand-ink text-white' : tone === 'pop' ? 'bg-brand-pop text-white' : 'bg-brand-bg text-brand-ink'
  const eyebrowCls = tone === 'light' ? 'text-brand-pop' : 'text-white/80'
  const ctaCls = tone === 'light' ? 'btn-pop' : 'btn-cta'

  return (
    <section className={`px-6 py-24 ${bg}`}>
      <div className="mx-auto max-w-4xl text-center">
        {eyebrow && <p className={`text-sm font-semibold uppercase tracking-widest ${eyebrowCls}`}>{eyebrow}</p>}
        <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl">
          {children}
        </h2>
        {cta && (
          <div className="mt-9">
            <Link href={cta.href} className={ctaCls}>
              {cta.label}
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
