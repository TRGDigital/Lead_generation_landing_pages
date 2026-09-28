import Image from 'next/image'
import { modernImage, type ModernContent } from '@/lib/design-families/modern'

// The Modern design family: rounded shapes, one strong colour per provider, a sans face, and
// two clear routes (families and the second audience each setting has). Every word, colour
// and photo comes from lib/design-families/modern.ts, so one template serves every setting.

function Monogram({ name, primary, accent, onDark }: { name: string; primary: string; accent: string; onDark?: boolean }) {
  const words = name.split(' ')
  const initial = words[0]?.[0] ?? 'C'
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-2xl text-lg font-extrabold text-white"
        style={{ background: onDark ? accent : primary }}
        aria-hidden
      >
        {initial}
      </span>
      <span className="leading-tight">
        <span className="block text-[17px] font-extrabold tracking-tight" style={{ color: onDark ? '#ffffff' : primary }}>
          {words.slice(0, 2).join(' ')}
        </span>
        {words.length > 2 && (
          <span className="block text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: onDark ? '#ffffffb3' : accent }}>
            {words.slice(2).join(' ')}
          </span>
        )}
      </span>
    </span>
  )
}

export default function ModernTemplate({ c }: { c: ModernContent }) {
  const { primary, soft, ink, accent } = c.palette
  const p = c.provider
  const muted = '#51605f'
  return (
    <div style={{ background: '#ffffff', color: ink, fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-[12px]" style={{ background: soft, color: primary }}>
        <span className="font-semibold">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Readable font</span>
        <span>Listen to page</span>
      </div>

      <header className="border-b" style={{ borderColor: '#e7ebea' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Monogram name={p.name} primary={primary} accent={accent} />
          <nav className="hidden items-center gap-6 text-[15px] font-medium lg:flex" style={{ color: '#3d4b4a' }}>
            {c.nav.map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
          <span className="rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ background: primary }}>{p.phone}</span>
        </div>
      </header>

      <section className="px-6 py-14" style={{ background: `linear-gradient(180deg, ${soft} 0%, #ffffff 100%)` }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: primary }}>{c.eyebrow}</p>
            <h1 className="mt-4 text-[40px] font-extrabold leading-[1.05] tracking-tight sm:text-[46px]">{p.strapline}</h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: muted }}>{p.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full px-7 py-3.5 text-sm font-bold text-white" style={{ background: primary }}>{c.ctas[0]}</span>
              <span className="rounded-full border-2 px-7 py-3.5 text-sm font-bold" style={{ borderColor: primary, color: primary }}>{c.ctas[1]}</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {c.chips.map((t) => (
                <span key={t} className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold" style={{ border: '1px solid #e0e7e6', color: muted }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem]">
              <Image src={modernImage(c.slug, 'hero')} alt={c.alts.hero} width={1536} height={1024} className="h-full w-full object-cover" priority />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-64 rounded-3xl bg-white p-5 shadow-xl sm:block" style={{ border: '1px solid #e7ebea' }}>
              <p className="text-[13px] font-bold" style={{ color: primary }}>{c.floatCard.label}</p>
              <p className="mt-1 text-[26px] font-extrabold leading-none">{c.floatCard.value}</p>
              <p className="mt-1 text-[12.5px]" style={{ color: '#6b7a79' }}>{c.floatCard.note}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {c.audiences.map((a, i) => (
            <div
              key={a.title}
              className="rounded-3xl p-8"
              style={i === 0 ? { background: soft } : { background: ink, color: '#ffffff' }}
            >
              <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: i === 0 ? primary : accent }}>{a.label}</p>
              <h2 className="mt-2 text-[26px] font-extrabold leading-tight">{a.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed" style={{ color: i === 0 ? muted : '#cdd7d6' }}>{a.body}</p>
              <p className="mt-4 text-[14px] font-bold" style={{ color: i === 0 ? primary : accent }}>{a.cta} →</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: '#f8faf9' }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[30px] font-extrabold tracking-tight">{c.services.title}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.services.items.map((s) => (
              <div key={s.title} className="rounded-3xl bg-white p-6" style={{ border: '1px solid #e7ebea' }}>
                <h3 className="text-[18px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: muted }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="overflow-hidden rounded-[2.5rem]">
            <Image src={modernImage(c.slug, 'life')} alt={c.alts.life} width={1536} height={1024} className="h-full w-full object-cover" sizes="(min-width:1024px) 45vw, 100vw" />
          </div>
          <div>
            <h2 className="text-[30px] font-extrabold tracking-tight">{c.feature.title}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {c.feature.items.map((f) => (
                <div key={f.title} className="rounded-3xl p-5" style={{ background: soft }}>
                  <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>{f.label}</p>
                  <h3 className="mt-1 text-[17px] font-bold">{f.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed" style={{ color: muted }}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: '#f8faf9' }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[30px] font-extrabold tracking-tight">Free tools</h2>
            <span className="text-[14px] font-bold" style={{ color: primary }}>See all tools →</span>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {c.tools.map((t) => (
              <div key={t.title} className="rounded-3xl bg-white p-6" style={{ border: '1px solid #e7ebea' }}>
                <h3 className="text-[17.5px] font-bold">{t.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: muted }}>{t.body}</p>
                <p className="mt-4 text-[14px] font-bold" style={{ color: primary }}>Start →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[30px] font-extrabold tracking-tight">Advice and news</h2>
          <span className="text-[14px] font-bold" style={{ color: primary }}>Read the blog →</span>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {c.posts.map((post, i) => (
            <article key={post.title} className="overflow-hidden rounded-3xl bg-white" style={{ border: '1px solid #e7ebea' }}>
              <div className="relative h-44 w-full">
                <Image
                  src={modernImage(c.slug, `post-${i + 1}` as 'post-1' | 'post-2' | 'post-3')}
                  alt={`Example photo for the article: ${post.title}`}
                  fill
                  className="object-cover"
                  sizes="(min-width:768px) 33vw, 100vw"
                />
              </div>
              <div className="p-5">
                <span className="rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={{ background: soft, color: primary }}>{post.tag}</span>
                <h3 className="mt-3 text-[16.5px] font-bold leading-snug">{post.title}</h3>
                <p className="mt-2 text-[12.5px]" style={{ color: '#6b7a79' }}>{post.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-[2.5rem] p-10 text-center text-white" style={{ background: primary }}>
          <h2 className="text-[32px] font-extrabold leading-tight">{c.finalCta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-[16.5px] leading-relaxed text-white/85">{c.finalCta.body}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-white px-7 py-3.5 text-sm font-bold" style={{ color: primary }}>{c.finalCta.primary}</span>
            <span className="rounded-full border border-white/50 px-7 py-3.5 text-sm font-bold">Call {p.phone}</span>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-[13px]" style={{ background: ink, color: '#aab8b6' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6">
          <div>
            <Monogram name={p.name} primary={primary} accent={accent} onDark />
            <p className="mt-3">{p.address}, {p.county}</p>
            <p>{p.phone}</p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-2">
            {[...c.nav, 'Privacy'].map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-[12px]" style={{ color: '#71817f' }}>
          Example website design. {p.name} is a fictional care provider, and the rating, details and articles shown are
          examples. Photographs are AI generated illustrations.
        </p>
      </footer>
    </div>
  )
}
