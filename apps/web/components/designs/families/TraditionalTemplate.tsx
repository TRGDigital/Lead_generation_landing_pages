import Image from 'next/image'
import { familyImage, type ImagePart } from '@/lib/design-families/modern'
import type { TraditionalContent } from '@/lib/design-families/traditional'

// The Traditional design family: serif type, heritage colours, a full width photograph with a
// panel laid over it, a note from the manager, and services as a classic list rather than
// cards. Every word, colour and photo comes from lib/design-families/traditional.ts.

const SERIF = 'Georgia, "Iowan Old Style", "Times New Roman", serif'
const img = (slug: string, part: ImagePart) => familyImage('traditional', slug, part)

function Wordmark({ name, primary, accent, onDark }: { name: string; primary: string; accent: string; onDark?: boolean }) {
  const words = name.split(' ')
  const main = words.slice(0, 2).join(' ')
  const sub = words.slice(2).join(' ')
  return (
    <span className="block text-center">
      <span className="block text-[26px] leading-none tracking-wide" style={{ fontFamily: SERIF, color: onDark ? '#ffffff' : primary }}>
        {main}
      </span>
      <span className="mx-auto mt-1.5 block h-px w-16" style={{ background: accent }} />
      {sub && (
        <span className="mt-1.5 block text-[10.5px] uppercase tracking-[0.3em]" style={{ color: onDark ? '#ffffffb3' : accent }}>
          {sub}
        </span>
      )}
    </span>
  )
}

export default function TraditionalTemplate({ c }: { c: TraditionalContent }) {
  const { primary, soft, ink, accent } = c.palette
  const p = c.provider
  const muted = '#5b554d'
  return (
    <div className="traditional-family" style={{ background: soft, color: ink, fontFamily: SERIF }}>
      {/* The site stylesheet gives headings its own display face; this family is serif throughout. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `.traditional-family h1, .traditional-family h2, .traditional-family h3 { font-family: ${SERIF}; font-weight: 400; letter-spacing: 0; text-transform: none; }`,
        }}
      />
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-[12px]" style={{ background: primary, color: '#ffffffd9' }}>
        <span className="font-semibold">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Readable font</span>
        <span>Listen to page</span>
      </div>

      <header className="border-b px-6 pb-4 pt-7" style={{ borderColor: `${accent}55` }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            <span className="hidden text-[13px] sm:block" style={{ color: muted }}>{p.town}, {p.county}</span>
            <Wordmark name={p.name} primary={primary} accent={accent} />
            <span className="hidden text-[15px] sm:block" style={{ color: primary }}>{p.phone}</span>
          </div>
          <nav className="mt-5 hidden justify-center gap-8 text-[15px] md:flex" style={{ color: ink }}>
            {c.nav.map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
        </div>
      </header>

      <section className="relative">
        <div className="relative h-[460px] w-full sm:h-[560px]">
          <Image src={img(c.slug, 'hero')} alt={c.alts.hero} fill priority className="object-cover" sizes="100vw" />
        </div>
        <div className="px-6">
          <div
            className="relative mx-auto -mt-40 max-w-3xl px-8 py-10 text-center shadow-xl sm:-mt-48 sm:px-14"
            style={{ background: soft, borderTop: `3px solid ${accent}` }}
          >
            <p className="text-[12px] uppercase tracking-[0.28em]" style={{ color: accent }}>{c.eyebrow}</p>
            <h1 className="mt-4 text-[34px] leading-[1.15] sm:text-[44px]" style={{ color: primary }}>{p.strapline}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed" style={{ color: muted }}>{p.intro}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="px-7 py-3.5 text-[15px] text-white" style={{ background: primary }}>{c.ctas[0]}</span>
              <span className="border px-7 py-3.5 text-[15px]" style={{ borderColor: primary, color: primary }}>{c.ctas[1]}</span>
            </div>
            <p className="mt-6 text-[13.5px] italic" style={{ color: muted }}>{c.chips.join('  ·  ')}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid items-start gap-10 md:grid-cols-[1fr_1.4fr]">
          <div className="border-l-2 pl-6" style={{ borderColor: accent }}>
            <p className="text-[12px] uppercase tracking-[0.24em]" style={{ color: accent }}>{c.floatCard.label}</p>
            <p className="mt-2 text-[30px] leading-tight" style={{ color: primary }}>{c.floatCard.value}</p>
            <p className="mt-2 text-[15px] italic" style={{ color: muted }}>{c.floatCard.note}</p>
          </div>
          <figure>
            <blockquote className="text-[21px] leading-relaxed" style={{ color: ink }}>“{c.manager.note}”</blockquote>
            <figcaption className="mt-4 text-[14px] uppercase tracking-[0.18em]" style={{ color: accent }}>
              {c.manager.name}, {c.manager.role}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="px-6 py-16" style={{ background: '#ffffff' }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-[34px]" style={{ color: primary }}>{c.services.title}</h2>
          <span className="mx-auto mt-3 block h-px w-20" style={{ background: accent }} />
          <ol className="mt-10 divide-y" style={{ borderColor: `${accent}40` }}>
            {c.services.items.map((s, i) => (
              <li key={s.title} className="grid gap-2 py-6 sm:grid-cols-[80px_1fr_1.4fr] sm:items-baseline" style={{ borderColor: `${accent}40` }}>
                <span className="text-[26px]" style={{ color: accent }}>{['I', 'II', 'III', 'IV', 'V'][i]}</span>
                <h3 className="text-[21px]" style={{ color: ink }}>{s.title}</h3>
                <p className="text-[16px] leading-relaxed" style={{ color: muted }}>{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <div className="relative min-h-[360px]">
          <Image src={img(c.slug, 'life')} alt={c.alts.life} fill className="object-cover" sizes="(min-width:768px) 50vw, 100vw" />
        </div>
        <div className="px-8 py-14 sm:px-14" style={{ background: primary, color: '#ffffff' }}>
          <p className="text-[12px] uppercase tracking-[0.26em]" style={{ color: `${soft}cc` }}>{p.name}</p>
          <h2 className="mt-3 text-[32px] leading-tight">{c.feature.title}</h2>
          <div className="mt-8 space-y-6">
            {c.feature.items.map((f) => (
              <div key={f.title} className="border-t pt-4" style={{ borderColor: '#ffffff33' }}>
                <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: `${soft}b3` }}>{f.label}</p>
                <h3 className="mt-1 text-[19px]">{f.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed" style={{ color: '#ffffffcc' }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {c.audiences.map((a) => (
            <div key={a.title} className="border p-8" style={{ borderColor: `${accent}66`, background: '#ffffff' }}>
              <p className="text-[12px] uppercase tracking-[0.24em]" style={{ color: accent }}>{a.label}</p>
              <h2 className="mt-2 text-[25px]" style={{ color: primary }}>{a.title}</h2>
              <p className="mt-3 text-[16px] leading-relaxed" style={{ color: muted }}>{a.body}</p>
              <p className="mt-5 text-[15px] underline underline-offset-4" style={{ color: primary }}>{a.cta}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl border-y py-10" style={{ borderColor: `${accent}55` }}>
          <h2 className="text-center text-[28px]" style={{ color: primary }}>Helpful guides for families</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {c.tools.map((t) => (
              <div key={t.title} className="text-center">
                <h3 className="text-[19px]" style={{ color: ink }}>{t.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: muted }}>{t.body}</p>
                <p className="mt-3 text-[14px] italic" style={{ color: accent }}>Begin</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-[34px]" style={{ color: primary }}>News and advice</h2>
          <span className="mx-auto mt-3 block h-px w-20" style={{ background: accent }} />
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {c.posts.map((post, i) => (
              <article key={post.title}>
                <div className="relative h-48 w-full">
                  <Image
                    src={img(c.slug, `post-${i + 1}` as ImagePart)}
                    alt={`Example photo for the article: ${post.title}`}
                    fill
                    className="object-cover"
                    sizes="(min-width:768px) 33vw, 100vw"
                  />
                </div>
                <p className="mt-4 text-[12px] uppercase tracking-[0.2em]" style={{ color: accent }}>{post.tag}</p>
                <h3 className="mt-2 text-[19px] leading-snug" style={{ color: ink }}>{post.title}</h3>
                <p className="mt-2 text-[13.5px] italic" style={{ color: muted }}>{post.date}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 text-center" style={{ background: ink, color: '#ffffff' }}>
        <h2 className="text-[34px]">{c.finalCta.title}</h2>
        <span className="mx-auto mt-3 block h-px w-20" style={{ background: accent }} />
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: '#ffffffcc' }}>{c.finalCta.body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="px-7 py-3.5 text-[15px]" style={{ background: accent, color: ink }}>{c.finalCta.primary}</span>
          <span className="border px-7 py-3.5 text-[15px]" style={{ borderColor: '#ffffff66' }}>Telephone {p.phone}</span>
        </div>
      </section>

      <footer className="px-6 py-10 text-[13.5px]" style={{ background: primary, color: '#ffffffb3' }}>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 text-center">
          <Wordmark name={p.name} primary={primary} accent={accent} onDark />
          <p>{p.address}, {p.county}  ·  {p.phone}</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {[...c.nav, 'Privacy'].map((l) => <span key={l}>{l}</span>)}
          </div>
          <p className="max-w-3xl text-[12px]" style={{ color: '#ffffff80' }}>
            Example website design. {p.name} is a fictional care provider, and the rating, details, people and articles
            shown are examples. Photographs are AI generated illustrations.
          </p>
        </div>
      </footer>
    </div>
  )
}
