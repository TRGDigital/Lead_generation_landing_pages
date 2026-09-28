import Link from 'next/link'
import { DESIGNS } from '@/lib/designs'
import { settingForPage } from '@/lib/design-settings'

// "Designs for <setting>" on a setting's own page, linking to its example designs.
// Renders nothing on a page with no setting or no designs yet.
export function SettingDesigns({ path }: { path: string }) {
  const setting = settingForPage(path)
  const designs = setting ? DESIGNS.filter((d) => d.settingKey === setting.key) : []
  if (!setting || designs.length === 0) return null
  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Design examples</p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">
          Website designs for {setting.label.toLowerCase()}
        </h2>
        <p className="mt-2 max-w-2xl text-brand-ink-soft">
          Complete, clickable homepage designs written for {setting.label.toLowerCase()}. Every provider shown is fictional.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {designs.map((d) => (
            <Link
              key={d.slug}
              href={`/designs/${d.slug}`}
              className="group flex flex-col rounded-2xl border border-brand-line bg-white p-5 shadow-soft transition-all hover:border-brand-pop/40 hover:shadow-card"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-pop">{d.family ? `${d.family} family` : 'Signature design'}</span>
              <span className="mt-1 font-display text-lg font-bold text-brand-ink group-hover:text-brand-pop">{d.name}</span>
              <span className="mt-1 flex-1 text-sm leading-snug text-brand-ink-soft">{d.style}</span>
              <span className="mt-3 text-sm font-semibold text-brand-pop">View the design →</span>
            </Link>
          ))}
        </div>
        <Link href={`/designs#${setting.key}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-pop underline-offset-2 hover:underline">
          All design examples <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
