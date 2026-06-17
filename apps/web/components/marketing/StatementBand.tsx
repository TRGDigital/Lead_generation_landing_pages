import Link from 'next/link'
import { Star, Burst } from './Decor'

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
    <section className={`relative overflow-hidden px-6 py-16 ${bg}`}>
      {/* soft accent glow + decorative accents for energy */}
      {tone !== 'light' && (
        <>
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <Star className="absolute left-8 top-6 hidden h-16 w-16 text-white/50 sm:block" />
          <Star className="absolute bottom-6 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
          <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        </>
      )}
      <div className="relative mx-auto max-w-3xl text-center">
        {eyebrow && <p className={`text-sm font-semibold uppercase tracking-widest ${eyebrowCls}`}>{eyebrow}</p>}
        <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-[1.08] tracking-tight sm:text-4xl">
          {children}
        </h2>
        {sub && <p className={`mx-auto mt-5 max-w-xl leading-relaxed ${subCls}`}>{sub}</p>}
        {cta && (
          <div className="mt-8">
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
