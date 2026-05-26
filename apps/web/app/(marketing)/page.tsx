export const metadata = { title: 'Home' }

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Placeholder — Phase 5 builds the full marketing site */}
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-sans text-sm font-semibold uppercase tracking-widest text-brand-accent">
          Coming soon
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-brand-ink">
          Qualified care home enquiries,{' '}
          <span className="italic text-brand-accent-soft">on demand.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-brand-ink-soft">
          Activate when you have empty beds. Pause when you&apos;re full.
          Only pay for leads that match your criteria.
        </p>
        <div className="mt-4 h-px w-16 bg-brand-line mx-auto" />
        <p className="mt-4 font-sans text-xs text-brand-ink-muted">
          Phase 1 foundation — design system verified ✓
        </p>
      </div>

      {/* Design token smoke test */}
      <div className="mx-auto max-w-4xl px-6 pb-16 grid grid-cols-3 gap-3 text-xs">
        {[
          ['bg-brand-bg', 'bg'],
          ['bg-brand-bg-warm', 'bg-warm'],
          ['bg-brand-ink', 'ink'],
          ['bg-brand-accent', 'accent'],
          ['bg-brand-accent-soft', 'accent-soft'],
          ['bg-brand-sage', 'sage'],
          ['bg-brand-line', 'line'],
          ['bg-brand-ink-soft', 'ink-soft'],
          ['bg-brand-ink-muted', 'ink-muted'],
        ].map(([cls, label]) => (
          <div key={cls} className="flex items-center gap-2">
            <div className={`h-6 w-6 rounded border border-brand-line ${cls}`} />
            <span className="font-sans text-brand-ink-muted">{label}</span>
          </div>
        ))}
      </div>
    </main>
  )
}
