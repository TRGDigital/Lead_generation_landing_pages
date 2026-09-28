import Image from 'next/image'
import { familyImage, type ImagePart } from '@/lib/design-families/modern'
import type { ClinicalContent } from '@/lib/design-families/clinical'

// The Clinical design family: crisp, trust first and fact led. A utility bar with the main
// phone line, facts in the hero, a band of key figures, services set out like a table, a
// numbered timeline, short questions and news as a list. Every word, colour and photo comes
// from lib/design-families/clinical.ts.

const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
const img = (slug: string, part: ImagePart) => familyImage('clinical', slug, part)

function Badge({ name, primary, accent, onDark }: { name: string; primary: string; accent: string; onDark?: boolean }) {
  const words = name.split(' ')
  return (
    <span className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-md" style={{ background: onDark ? '#ffffff' : primary }} aria-hidden>
        <span className="block h-4 w-4 rotate-45 rounded-[3px]" style={{ background: accent }} />
      </span>
      <span className="leading-tight">
        <span className="block text-[16px] font-bold" style={{ color: onDark ? '#ffffff' : primary }}>{words.slice(0, 2).join(' ')}</span>
        {words.length > 2 && (
          <span className="block text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: onDark ? '#ffffffb3' : '#5b6b78' }}>
            {words.slice(2).join(' ')}
          </span>
        )}
      </span>
    </span>
  )
}

function Tick({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden>
      <circle cx="10" cy="10" r="10" fill={color} />
      <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ClinicalTemplate({ c }: { c: ClinicalContent }) {
  const { primary, soft, ink, accent } = c.palette
  const p = c.provider
  const muted = '#51606d'
  const line = '#dde4ea'
  return (
    <div style={{ background: '#ffffff', color: ink, fontFamily: SANS }}>
      <div className="px-4 py-2 text-[12.5px]" style={{ background: ink, color: '#ffffffcc' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <span className="flex flex-wrap gap-x-5">
            <span className="font-semibold text-white">Accessibility</span>
            <span>Text size A A+ A++</span>
            <span>High contrast</span>
            <span>Listen to page</span>
          </span>
          <span>
            {c.floatCard.label}: <strong className="text-white">{p.phone}</strong>
          </span>
        </div>
      </div>

      <header className="border-b" style={{ borderColor: line }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Badge name={p.name} primary={primary} accent={accent} />
          <nav className="hidden items-center gap-6 text-[14.5px] font-medium lg:flex" style={{ color: '#34424f' }}>
            {c.nav.map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
          <span className="rounded-md px-4 py-2.5 text-[13.5px] font-semibold text-white" style={{ background: primary }}>{c.ctas[0]}</span>
        </div>
      </header>

      <section className="px-6 py-12" style={{ background: soft }}>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em]" style={{ color: accent }}>{c.eyebrow}</p>
            <h1 className="mt-3 text-[36px] font-bold leading-[1.1] tracking-tight sm:text-[42px]" style={{ color: ink }}>{p.strapline}</h1>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed" style={{ color: muted }}>{p.intro}</p>
            <ul className="mt-6 space-y-2.5">
              {c.chips.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[15px] font-medium" style={{ color: ink }}>
                  <Tick color={accent} />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-md px-6 py-3 text-[14px] font-semibold text-white" style={{ background: primary }}>{c.ctas[0]}</span>
              <span className="rounded-md border bg-white px-6 py-3 text-[14px] font-semibold" style={{ borderColor: primary, color: primary }}>{c.ctas[1]}</span>
            </div>
          </div>
          <div>
            <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
              <Image src={img(c.slug, 'hero')} alt={c.alts.hero} fill priority className="object-cover" sizes="(min-width:1024px) 45vw, 100vw" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {c.facts.slice(0, 2).map((f) => (
                <div key={f.label} className="rounded-lg border bg-white px-4 py-3" style={{ borderColor: line }}>
                  <p className="text-[22px] font-bold" style={{ color: primary }}>{f.value}</p>
                  <p className="text-[12.5px]" style={{ color: muted }}>{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b px-6 py-8" style={{ borderColor: line }}>
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
          {c.facts.map((f) => (
            <div key={f.label} className="border-l-4 pl-4" style={{ borderColor: accent }}>
              <dt className="text-[12.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: muted }}>{f.label}</dt>
              <dd className="mt-1 text-[28px] font-bold" style={{ color: ink }}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-[28px] font-bold tracking-tight">{c.services.title}</h2>
        <div className="mt-6 overflow-hidden rounded-lg border" style={{ borderColor: line }}>
          {c.services.items.map((s, i) => (
            <div
              key={s.title}
              className="grid gap-1 px-5 py-4 sm:grid-cols-[260px_1fr] sm:items-center"
              style={{ background: i % 2 ? '#ffffff' : '#f8fafc', borderTop: i ? `1px solid ${line}` : undefined }}
            >
              <h3 className="flex items-center gap-2.5 text-[16.5px] font-semibold">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: accent }} aria-hidden />
                {s.title}
              </h3>
              <p className="text-[15px] leading-relaxed" style={{ color: muted }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: soft }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[28px] font-bold tracking-tight">{c.feature.title}</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {c.feature.items.map((f) => (
              <li key={f.title} className="relative">
                <span className="grid h-10 w-10 place-items-center rounded-full text-[15px] font-bold text-white" style={{ background: primary }}>
                  {f.label}
                </span>
                <h3 className="mt-3 text-[17px] font-semibold">{f.title}</h3>
                <p className="mt-1 text-[14.5px] leading-relaxed" style={{ color: muted }}>{f.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-4 md:grid-cols-2">
          {c.audiences.map((a) => (
            <div key={a.title} className="rounded-lg border p-7" style={{ borderColor: line, borderTop: `4px solid ${primary}` }}>
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: accent }}>{a.label}</p>
              <h2 className="mt-2 text-[22px] font-bold">{a.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: muted }}>{a.body}</p>
              <p className="mt-4 text-[14.5px] font-semibold" style={{ color: primary }}>{a.cta} →</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
            <Image src={img(c.slug, 'life')} alt={c.alts.life} fill className="object-cover" sizes="(min-width:1024px) 45vw, 100vw" />
          </div>
          <div>
            <h2 className="text-[28px] font-bold tracking-tight">Common questions</h2>
            <dl className="mt-6 divide-y" style={{ borderColor: line }}>
              {c.faqs.map(([q, a]) => (
                <div key={q} className="py-4" style={{ borderColor: line }}>
                  <dt className="text-[16.5px] font-semibold">{q}</dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed" style={{ color: muted }}>{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: '#f8fafc' }}>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-[26px] font-bold tracking-tight">Tools and guides</h2>
            <ul className="mt-5 space-y-3">
              {c.tools.map((t) => (
                <li key={t.title} className="rounded-lg border bg-white px-5 py-4" style={{ borderColor: line }}>
                  <p className="text-[15.5px] font-semibold" style={{ color: primary }}>{t.title} →</p>
                  <p className="mt-0.5 text-[14px]" style={{ color: muted }}>{t.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[26px] font-bold tracking-tight">News and guidance</h2>
            <div className="mt-5 space-y-4">
              {c.posts.map((post, i) => (
                <article key={post.title} className="grid grid-cols-[120px_1fr] gap-4 rounded-lg border bg-white p-3 sm:grid-cols-[160px_1fr]" style={{ borderColor: line }}>
                  <div className="relative aspect-[3/2] overflow-hidden rounded-md">
                    <Image
                      src={img(c.slug, `post-${i + 1}` as ImagePart)}
                      alt={`Example photo for the article: ${post.title}`}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                  <div className="py-1">
                    <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: accent }}>{post.tag}</p>
                    <h3 className="mt-1 text-[15.5px] font-semibold leading-snug">{post.title}</h3>
                    <p className="mt-1 text-[12.5px]" style={{ color: muted }}>{post.date}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-12" style={{ background: primary, color: '#ffffff' }}>
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-[28px] font-bold">{c.finalCta.title}</h2>
            <p className="mt-2 max-w-xl text-[15.5px] leading-relaxed" style={{ color: '#ffffffcc' }}>{c.finalCta.body}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[13px] uppercase tracking-[0.14em]" style={{ color: '#ffffffb3' }}>Call us</p>
            <p className="text-[30px] font-bold">{p.phone}</p>
            <span className="mt-2 inline-block rounded-md px-5 py-2.5 text-[14px] font-semibold" style={{ background: accent, color: ink }}>{c.finalCta.primary}</span>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-[13.5px]" style={{ background: ink, color: '#ffffffb3' }}>
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Badge name={p.name} primary={primary} accent={accent} onDark />
            <p className="mt-3">{p.address}, {p.county}</p>
            <p>{p.phone}</p>
          </div>
          <ul className="space-y-1.5">
            {c.nav.slice(0, 3).map((l) => <li key={l}>{l}</li>)}
          </ul>
          <ul className="space-y-1.5">
            {[...c.nav.slice(3), 'Privacy'].map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-[12px]" style={{ color: '#ffffff80' }}>
          Example website design. {p.name} is a fictional care provider, and the ratings, figures, details and articles
          shown are examples. Photographs are AI generated illustrations.
        </p>
      </footer>
    </div>
  )
}
