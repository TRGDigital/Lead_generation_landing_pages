import Link from 'next/link'

// Reusable bold statement band (BoxChilli-style big type). Tones: light / dark / pop.
export function StatementBand({
  eyebrow,
  children,
  sub,
  cta,
  tone = 'light',
}: {
  eyebrow?: string
  children: React.ReactNode
  sub?: string
  cta?: { label: string; href: string }
  tone?: 'light' | 'dark' | 'pop'
}) {
  const bg = tone === 'dark' ? 'bg-brand-ink text-white' : tone === 'pop' ? 'bg-brand-pop text-white' : 'bg-brand-bg text-brand-ink'
  const eyebrowCls = tone === 'dark' ? 'text-brand-accent' : tone === 'pop' ? 'text-white' : 'text-brand-pop'
  const subCls = tone === 'light' ? 'text-brand-ink-soft' : 'text-white/75'
  const ctaCls = tone === 'pop' ? 'btn-cta' : 'btn-pop'

  return (
    <section className={`relative overflow-hidden px-6 py-24 ${bg}`}>
      {/* soft accent glow for energy */}
      {tone !== 'light' && (
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      )}
      <div className="relative mx-auto max-w-4xl text-center">
        {eyebrow && <p className={`text-sm font-semibold uppercase tracking-widest ${eyebrowCls}`}>{eyebrow}</p>}
        <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight sm:text-5xl">
          {children}
        </h2>
        {sub && <p className={`mx-auto mt-6 max-w-2xl text-lg leading-relaxed ${subCls}`}>{sub}</p>}
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
