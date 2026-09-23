import Image from 'next/image'
import type { Design } from '@/lib/designs'
import { MarchmontLogo } from './logos'

// Design 5: premium and editorial, for retirement living. Charcoal and champagne, a serif
// display face, full width photography and plenty of space. Sells the life first and keeps
// the care quietly in the background, which is how this market actually buys.

const CHAR = '#1f1d1b'
const CHAMPAGNE = '#b39355'
const STONE = '#f4f1ec'
const MUTED = '#6a635b'
const LINE = '#e5ded2'
const SERIF = 'Georgia, "Times New Roman", serif'

const APARTMENTS = [
  { name: 'The Ashcroft', beds: 'One bedroom', size: '64 sq m', price: 'From £315,000', status: '3 available' },
  { name: 'The Bramley', beds: 'Two bedroom', size: '89 sq m', price: 'From £425,000', status: '2 available' },
  { name: 'The Chilton', beds: 'Two bedroom, garden', size: '104 sq m', price: 'From £510,000', status: 'Last one' },
]

const LIFE = [
  { title: 'The restaurant', body: 'A daily changing menu, a chef who knows your table, and a private dining room for family.' },
  { title: 'The wellness suite', body: 'A pool, a gym with instructors who understand older bodies, and a therapy room.' },
  { title: 'Six acres of gardens', body: 'Lawns, a walled kitchen garden and a gardening club that supplies the kitchen.' },
  { title: 'Care, if you need it', body: 'A registered care team on site, available by the hour, so plans never need to change again.' },
]

const TOOLS = [
  { title: 'Downsizing calculator', body: 'What your move could release, once fees and moving costs are counted.' },
  { title: 'Service charge explained', body: 'What the charge covers each month, set out in full.' },
  { title: 'Care funding calculator', body: 'If care is ever needed, who pays, and how much.' },
]

const POSTS = [
  { title: 'Downsizing without losing what matters', date: '18 September 2026', tag: 'Moving', img: '/designs/retirement-living.jpg' },
  { title: 'What a service charge actually pays for', date: '5 September 2026', tag: 'Money', img: '/designs/care-manager.jpg' },
  { title: 'A summer of supper clubs at Marchmont', date: '22 August 2026', tag: 'Community', img: '/designs/group-care.jpg' },
]

export default function MarchmontDesign({ design }: { design: Design }) {
  const p = design.provider
  return (
    <div style={{ background: '#ffffff', color: CHAR, fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-[12px]" style={{ background: STONE, color: MUTED }}>
        <span className="font-semibold">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Readable font</span>
        <span>Listen to page</span>
      </div>

      <header className="border-b" style={{ borderColor: LINE }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <MarchmontLogo primary={CHAR} accent={CHAMPAGNE} />
          <nav className="hidden items-center gap-7 text-[14px] uppercase tracking-[0.08em] md:flex" style={{ color: MUTED }}>
            {['The apartments', 'Life here', 'Care', 'Journal', 'Visit us'].map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
          <span className="border px-6 py-3 text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ borderColor: CHAR }}>Request a brochure</span>
        </div>
      </header>

      <section className="relative">
        <div className="relative h-[520px] w-full">
          <Image src="/designs/retirement-living.jpg" alt="An example photograph of a resident in her own apartment" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(31,29,27,0.78) 0%, rgba(31,29,27,0.35) 60%, rgba(31,29,27,0.1) 100%)' }} />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-6xl px-6">
              <p className="text-[12px] uppercase tracking-[0.3em]" style={{ color: CHAMPAGNE }}>{p.town}, {p.county}</p>
              <h1 className="mt-5 max-w-2xl text-[52px] leading-[1.04] text-white" style={{ fontFamily: SERIF }}>{p.strapline}</h1>
              <p className="mt-5 max-w-xl text-[17.5px] leading-relaxed text-white/85">{p.intro}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <span className="bg-white px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: CHAR }}>Request a brochure</span>
                <span className="border border-white/60 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white">Book a private viewing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em]" style={{ color: CHAMPAGNE }}>The apartments</p>
            <h2 className="mt-4 text-[36px] leading-tight" style={{ fontFamily: SERIF }}>Forty two homes, no two alike</h2>
            <p className="mt-5 text-[16.5px] leading-relaxed" style={{ color: MUTED }}>
              Each apartment is sold on a long lease, with underfloor heating, a fitted kitchen and a terrace or
              balcony. Pets are welcome, and so is your own furniture, however much of it there is.
            </p>
            <span className="mt-7 inline-block border px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ borderColor: CHAR }}>See floor plans</span>
          </div>
          <div className="divide-y" style={{ borderColor: LINE }}>
            {APARTMENTS.map((a) => (
              <div key={a.name} className="flex flex-wrap items-center justify-between gap-4 py-5" style={{ borderTop: `1px solid ${LINE}` }}>
                <div>
                  <p className="text-[21px]" style={{ fontFamily: SERIF }}>{a.name}</p>
                  <p className="text-[14px]" style={{ color: MUTED }}>{a.beds} · {a.size}</p>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-semibold">{a.price}</p>
                  <p className="text-[12px] uppercase tracking-[0.14em]" style={{ color: CHAMPAGNE }}>{a.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16" style={{ background: STONE }}>
        <div className="mx-auto max-w-6xl">
          <p className="text-[12px] uppercase tracking-[0.28em]" style={{ color: CHAMPAGNE }}>Life here</p>
          <h2 className="mt-4 max-w-2xl text-[36px] leading-tight" style={{ fontFamily: SERIF }}>
            Everything within a short walk of your own front door
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LIFE.map((l) => (
              <div key={l.title} className="bg-white p-7">
                <h3 className="text-[20px]" style={{ fontFamily: SERIF }}>{l.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed" style={{ color: MUTED }}>{l.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative h-[420px]">
            <Image src="/designs/residential-care.jpg" alt="An example photograph of the on site care team with a resident" fill className="object-cover" sizes="(min-width:1024px) 50vw, 100vw" />
          </div>
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em]" style={{ color: CHAMPAGNE }}>Care, quietly</p>
            <h2 className="mt-4 text-[36px] leading-tight" style={{ fontFamily: SERIF }}>Help on hand, only if you want it</h2>
            <p className="mt-5 text-[16.5px] leading-relaxed" style={{ color: MUTED }}>
              Our registered care team is on site every day. Most residents never use it. Those who do buy it by the
              hour, from help with a shower to nursing support, and nobody has to move out to get it.
            </p>
            <p className="mt-4 text-[16.5px] leading-relaxed" style={{ color: MUTED }}>
              CQC rating: Good (example), for the care service that supports the community.
            </p>
            <span className="mt-7 inline-block border px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ borderColor: CHAR }}>About our care</span>
          </div>
        </div>
      </section>

      <section className="px-6 py-16" style={{ background: STONE }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.28em]" style={{ color: CHAMPAGNE }}>Before you decide</p>
              <h2 className="mt-4 text-[32px] leading-tight" style={{ fontFamily: SERIF }}>Work the numbers through</h2>
            </div>
            <span className="text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: CHAMPAGNE }}>All tools →</span>
          </div>
          <div className="mt-9 grid gap-6 sm:grid-cols-3">
            {TOOLS.map((t) => (
              <div key={t.title} className="bg-white p-7">
                <h3 className="text-[19px]" style={{ fontFamily: SERIF }}>{t.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed" style={{ color: MUTED }}>{t.body}</p>
                <p className="mt-5 text-[12.5px] font-semibold uppercase tracking-[0.12em]" style={{ color: CHAMPAGNE }}>Open →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] uppercase tracking-[0.28em]" style={{ color: CHAMPAGNE }}>The journal</p>
            <h2 className="mt-4 text-[32px] leading-tight" style={{ fontFamily: SERIF }}>Written by the people who live and work here</h2>
          </div>
          <span className="text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: CHAMPAGNE }}>Read the journal →</span>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {POSTS.map((post) => (
            <article key={post.title}>
              <div className="relative h-52 w-full">
                <Image src={post.img} alt="" fill className="object-cover" sizes="(min-width:768px) 33vw, 100vw" />
              </div>
              <p className="mt-4 text-[11.5px] uppercase tracking-[0.2em]" style={{ color: CHAMPAGNE }}>{post.tag}</p>
              <h3 className="mt-2 text-[21px] leading-snug" style={{ fontFamily: SERIF }}>{post.title}</h3>
              <p className="mt-2 text-[13px]" style={{ color: MUTED }}>{post.date}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 text-center" style={{ background: CHAR, color: '#ffffff' }}>
        <div className="mx-auto max-w-2xl">
          <p className="text-[12px] uppercase tracking-[0.3em]" style={{ color: CHAMPAGNE }}>Visit us</p>
          <h2 className="mt-5 text-[38px] leading-tight" style={{ fontFamily: SERIF }}>Lunch is on us</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-white/75">
            Come for a private viewing, have lunch in the restaurant and meet some of the residents. No appointment
            is ever rushed, and nobody will follow up unless you ask us to.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <span className="bg-white px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.1em]" style={{ color: CHAR }}>Book a private viewing</span>
            <span className="border border-white/60 px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.1em]">Call {p.phone}</span>
          </div>
        </div>
      </section>

      <footer className="px-6 py-12 text-[13px]" style={{ background: '#151412', color: '#9c948a' }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <MarchmontLogo primary="#ffffff" accent={CHAMPAGNE} />
              <p className="mt-4">Marchmont Gardens, Bramfield Park, {p.town}, {p.county}</p>
              <p>{p.phone}</p>
            </div>
            <div className="flex flex-wrap gap-x-12 gap-y-2 uppercase tracking-[0.1em]">
              {['The apartments', 'Life here', 'Care', 'Journal', 'Careers', 'Privacy'].map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
          <p className="mt-10 text-[12px]" style={{ color: '#6d665e' }}>
            Example website design. {p.name} is a fictional retirement community, and the apartments, prices, rating and articles shown are examples.
          </p>
        </div>
      </footer>
    </div>
  )
}
