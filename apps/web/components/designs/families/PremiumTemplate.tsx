import Image from 'next/image'
import { familyImage, type ImagePart } from '@/lib/design-families/modern'
import type { PremiumContent } from '@/lib/design-families/premium'

// The Premium design family: editorial and spacious. A transparent header over a full
// screen photograph, a large opening statement, services with generous space, a dark
// experience band, a note from the director, a journal and an enquiry form. Every word,
// colour and photo comes from lib/design-families/premium.ts.

const DISPLAY = 'Didot, "Bodoni 72", "Bodoni MT", "Playfair Display", Georgia, serif'
const SANS = 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
const img = (slug: string, part: ImagePart) => familyImage('premium', slug, part)

function Wordmark({ name, color, accent }: { name: string; color: string; accent: string }) {
  const words = name.split(' ')
  const main = words.slice(0, 2).join(' ')
  const sub = words.slice(2).join(' ')
  return (
    <span className="leading-none">
      <span className="block text-[22px] uppercase tracking-[0.22em]" style={{ fontFamily: DISPLAY, color }}>{main}</span>
      {sub && <span className="mt-1.5 block text-[10px] uppercase tracking-[0.34em]" style={{ color: accent }}>{sub}</span>}
    </span>
  )
}

export default function PremiumTemplate({ c }: { c: PremiumContent }) {
  const { primary, soft, ink, accent } = c.palette
  const p = c.provider
  const muted = '#5d5953'
  return (
    <div className="premium-family" style={{ background: soft, color: ink, fontFamily: SANS }}>
      {/* The site stylesheet gives headings its own display face; this family uses a high contrast serif. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `.premium-family h1, .premium-family h2, .premium-family h3 { font-family: ${DISPLAY}; font-weight: 400; letter-spacing: 0; text-transform: none; }`,
        }}
      />
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-1.5 text-[11.5px] tracking-wide" style={{ background: ink, color: '#ffffffb3' }}>
        <span className="font-semibold text-white">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Listen to page</span>
      </div>

      <section className="relative h-[620px] w-full sm:h-[720px]">
        <Image src={img(c.slug, 'hero')} alt={c.alts.hero} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.6) 100%)' }} />
        <header className="absolute inset-x-0 top-0 px-6 py-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
            <Wordmark name={p.name} color="#ffffff" accent={accent} />
            <nav className="hidden items-center gap-7 text-[12px] uppercase tracking-[0.18em] text-white/85 lg:flex">
              {c.nav.map((l) => (
                <span key={l} className="cursor-default">{l}</span>
              ))}
            </nav>
            <span className="hidden text-[13px] tracking-wide text-white sm:block">{p.phone}</span>
          </div>
        </header>
        <div className="absolute inset-x-0 bottom-0 px-6 pb-14">
          <div className="mx-auto max-w-6xl text-white">
            <p className="text-[12px] uppercase tracking-[0.3em]" style={{ color: accent }}>{c.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-[42px] leading-[1.08] sm:text-[60px]">{p.strapline}</h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <span className="px-7 py-3.5 text-[12.5px] uppercase tracking-[0.2em]" style={{ background: accent, color: ink }}>{c.ctas[0]}</span>
              <span className="border border-white/60 px-7 py-3.5 text-[12.5px] uppercase tracking-[0.2em]">{c.ctas[1]}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="mx-auto block h-10 w-px" style={{ background: accent }} />
          <p className="mt-8 text-[24px] leading-[1.5] sm:text-[30px]" style={{ fontFamily: DISPLAY, color: primary }}>{c.statement}</p>
          <p className="mt-8 text-[16px] leading-relaxed" style={{ color: muted }}>{p.intro}</p>
          <p className="mt-8 text-[11.5px] uppercase tracking-[0.28em]" style={{ color: accent }}>{c.chips.join('   ·   ')}</p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[34px] sm:text-[40px]" style={{ color: primary }}>{c.services.title}</h2>
          <div className="mt-12 grid gap-x-16 gap-y-12 sm:grid-cols-2">
            {c.services.items.map((s, i) => (
              <div key={s.title} className="border-t pt-6" style={{ borderColor: `${accent}66` }}>
                <p className="text-[13px] tracking-[0.2em]" style={{ color: accent }}>0{i + 1}</p>
                <h3 className="mt-3 text-[26px]" style={{ color: ink }}>{s.title}</h3>
                <p className="mt-3 max-w-md text-[15.5px] leading-relaxed" style={{ color: muted }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative aspect-[16/9] w-full sm:aspect-[21/8]">
        <Image src={img(c.slug, 'life')} alt={c.alts.life} fill className="object-cover" sizes="100vw" />
      </section>

      <section className="px-6 py-20" style={{ background: primary, color: '#ffffff' }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[34px] sm:text-[40px]">{c.feature.title}</h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {c.feature.items.map((f) => (
              <div key={f.title}>
                <p className="text-[11.5px] uppercase tracking-[0.28em]" style={{ color: accent }}>{f.label}</p>
                <h3 className="mt-3 text-[23px]">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/75">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-24">
        <figure className="mx-auto max-w-3xl text-center">
          <blockquote className="text-[24px] italic leading-[1.5] sm:text-[28px]" style={{ fontFamily: DISPLAY, color: primary }}>
            “{c.manager.note}”
          </blockquote>
          <figcaption className="mt-6 text-[12px] uppercase tracking-[0.28em]" style={{ color: accent }}>
            {c.manager.name}, {c.manager.role}
          </figcaption>
        </figure>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[34px] sm:text-[40px]" style={{ color: primary }}>The journal</h2>
            <span className="text-[12px] uppercase tracking-[0.22em]" style={{ color: accent }}>All stories</span>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {c.posts.map((post, i) => (
              <article key={post.title}>
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={img(c.slug, `post-${i + 1}` as ImagePart)}
                    alt={`Example photo for the article: ${post.title}`}
                    fill
                    className="object-cover"
                    sizes="(min-width:640px) 33vw, 100vw"
                  />
                </div>
                <p className="mt-5 text-[11px] uppercase tracking-[0.26em]" style={{ color: accent }}>{post.tag}</p>
                <h3 className="mt-2 text-[22px] leading-snug" style={{ color: ink }}>{post.title}</h3>
                <p className="mt-2 text-[13px]" style={{ color: muted }}>{post.date}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20" style={{ background: '#ffffff' }}>
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2">
          <div>
            <h2 className="text-[34px] sm:text-[40px]" style={{ color: primary }}>{c.finalCta.title}</h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed" style={{ color: muted }}>{c.finalCta.body}</p>
            <div className="mt-10 space-y-6">
              {c.audiences.map((a) => (
                <div key={a.title} className="border-l pl-5" style={{ borderColor: accent }}>
                  <p className="text-[11.5px] uppercase tracking-[0.26em]" style={{ color: accent }}>{a.label}</p>
                  <h3 className="mt-1 text-[22px]" style={{ color: ink }}>{a.title}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed" style={{ color: muted }}>{a.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-[12px] uppercase tracking-[0.26em]" style={{ color: accent }}>Telephone</p>
            <p className="mt-1 text-[30px]" style={{ fontFamily: DISPLAY, color: primary }}>{p.phone}</p>
          </div>
          <div className="p-8 sm:p-10" style={{ background: soft }}>
            <p className="text-[11.5px] uppercase tracking-[0.26em]" style={{ color: accent }}>Enquire</p>
            {['Your name', 'Email address', 'Telephone', 'How can we help?'].map((f, i) => (
              <div key={f} className="mt-6">
                <p className="text-[12.5px]" style={{ color: muted }}>{f}</p>
                <div className={`mt-2 border-b ${i === 3 ? 'h-20' : 'h-8'}`} style={{ borderColor: `${ink}40` }} />
              </div>
            ))}
            <span className="mt-8 inline-block px-7 py-3.5 text-[12.5px] uppercase tracking-[0.2em] text-white" style={{ background: primary }}>
              {c.finalCta.primary}
            </span>
          </div>
        </div>
      </section>

      <section className="px-6 py-16" style={{ background: soft }}>
        <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
          {c.tools.map((t) => (
            <div key={t.title}>
              <h3 className="text-[21px]" style={{ color: primary }}>{t.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: muted }}>{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-14 text-[13px]" style={{ background: ink, color: '#ffffff99' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-8">
          <div>
            <Wordmark name={p.name} color="#ffffff" accent={accent} />
            <p className="mt-5">{p.address}, {p.county}</p>
            <p>{p.phone}</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[12px] uppercase tracking-[0.16em]">
            {[...c.nav, 'Privacy'].map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-[12px]" style={{ color: '#ffffff66' }}>
          Example website design. {p.name} is a fictional care provider, and the details, people and articles shown are
          examples. Photographs are AI generated illustrations.
        </p>
      </footer>
    </div>
  )
}
