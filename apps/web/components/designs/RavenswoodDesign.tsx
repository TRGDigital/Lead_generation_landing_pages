import Image from 'next/image'
import type { Design } from '@/lib/designs'
import { RavenswoodLogo } from './logos'

// Design 6: a care group with several homes. The job here is different from a single home:
// a visitor arrives looking for one town, so the site leads with a find a home search, then
// proves the group standard behind every home. Navy and sage, confident and organised.

const NAVY = '#1b3350'
const SAGE = '#5f8f77'
const MIST = '#f2f6f4'
const INK = '#1c2530'
const MUTED = '#5b6b7a'
const LINE = '#e0e8e5'

const HOMES = [
  { name: 'Ravenswood House', town: 'Exeter, Devon', care: 'Residential · Dementia', beds: '4 rooms available', img: '/designs/residential-care.jpg' },
  { name: 'Aller Brook', town: 'Newton Abbot, Devon', care: 'Nursing · Residential', beds: '2 rooms available', img: '/designs/nursing-home.jpg' },
  { name: 'The Old Vicarage', town: 'Taunton, Somerset', care: 'Residential · Respite', beds: 'Waiting list', img: '/designs/group-care.jpg' },
]

const STANDARD = [
  { title: 'One standard everywhere', body: 'The same training, the same care planning and the same checks in every home we run.' },
  { title: 'Owned, not managed', body: 'We own every home. No changing brands, no absent landlord, and decisions made locally.' },
  { title: 'Chefs in every kitchen', body: 'Real cooking on site, with menus built around what residents actually ask for.' },
  { title: 'Families kept informed', body: 'A named contact in each home, and an update whenever anything changes.' },
]

const TOOLS = [
  { title: 'Care funding calculator', body: 'Who pays for care: you, the council or the NHS.' },
  { title: 'Cost of care estimator', body: 'What care in the South West costs, with your own quote included.' },
  { title: 'CQC rating checker', body: "Look up any provider's latest rating, including ours." },
]

const POSTS = [
  { title: 'Choosing between residential and nursing care', date: '16 September 2026', tag: 'Choosing care', img: '/designs/care-manager.jpg' },
  { title: 'How we recruit and keep good carers', date: '3 September 2026', tag: 'Our team', img: '/designs/diverse-workforce.jpg' },
  { title: 'Ravenswood House rated Good at inspection', date: '19 August 2026', tag: 'News', img: '/designs/complex-care.jpg' },
]

export default function RavenswoodDesign({ design }: { design: Design }) {
  const p = design.provider
  return (
    <div style={{ background: '#ffffff', color: INK, fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-[12px]" style={{ background: MIST, color: NAVY }}>
        <span className="font-semibold">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Readable font</span>
        <span>Listen to page</span>
      </div>

      <header className="border-b" style={{ borderColor: LINE }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <RavenswoodLogo primary={NAVY} accent={SAGE} />
          <nav className="hidden items-center gap-6 text-[15px] font-medium md:flex" style={{ color: MUTED }}>
            {['Our homes', 'Types of care', 'Fees', 'Careers', 'News', 'Contact'].map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-bold" style={{ color: NAVY }}>{p.phone}</span>
            <span className="rounded-lg px-5 py-2.5 text-sm font-bold text-white" style={{ background: SAGE }}>Enquire now</span>
          </div>
        </div>
      </header>

      <section className="px-6 py-14" style={{ background: MIST }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: SAGE }}>Devon &amp; Somerset</p>
              <h1 className="mt-4 text-[44px] font-bold leading-[1.06] tracking-tight" style={{ color: NAVY }}>{p.strapline}</h1>
              <p className="mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: MUTED }}>{p.intro}</p>
            </div>
            <div className="rounded-2xl bg-white p-7 shadow-lg" style={{ border: `1px solid ${LINE}` }}>
              <h2 className="text-[20px] font-bold" style={{ color: NAVY }}>Find a home</h2>
              <p className="mt-1 text-[14px]" style={{ color: MUTED }}>Search by town and the care you need.</p>
              <div className="mt-5 space-y-3">
                <div className="rounded-lg px-4 py-3 text-[14.5px]" style={{ background: MIST, color: MUTED }}>Town or postcode</div>
                <div className="rounded-lg px-4 py-3 text-[14.5px]" style={{ background: MIST, color: MUTED }}>Type of care</div>
                <span className="block rounded-lg py-3 text-center text-[15px] font-bold text-white" style={{ background: NAVY }}>Search our homes</span>
              </div>
              <p className="mt-4 text-[13px]" style={{ color: MUTED }}>6 rooms available across the group today</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[30px] font-bold tracking-tight" style={{ color: NAVY }}>Our homes</h2>
          <span className="text-[14px] font-bold" style={{ color: SAGE }}>See all four homes →</span>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {HOMES.map((h) => (
            <article key={h.name} className="overflow-hidden rounded-2xl" style={{ border: `1px solid ${LINE}` }}>
              <div className="relative h-44 w-full">
                <Image src={h.img} alt={`An example photograph of ${h.name}`} fill className="object-cover" sizes="(min-width:768px) 33vw, 100vw" />
              </div>
              <div className="p-6">
                <h3 className="text-[19px] font-bold" style={{ color: NAVY }}>{h.name}</h3>
                <p className="mt-1 text-[14px]" style={{ color: MUTED }}>{h.town}</p>
                <p className="mt-3 text-[13.5px] font-semibold" style={{ color: SAGE }}>{h.care}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-lg px-3 py-1.5 text-[12.5px] font-semibold" style={{ background: MIST, color: NAVY }}>{h.beds}</span>
                  <span className="text-[13.5px] font-bold" style={{ color: SAGE }}>Visit page →</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: NAVY }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[30px] font-bold tracking-tight text-white">What every Ravenswood home shares</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARD.map((s) => (
              <div key={s.title} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <h3 className="text-[18px] font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: '#b8c8d6' }}>{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {['CQC rating: Good in all four homes (example)', 'Family owned since 2004', '210 residents', '380 staff'].map((t) => (
              <span key={t} className="rounded-lg px-4 py-2 text-[13.5px] font-medium text-white" style={{ background: 'rgba(255,255,255,0.1)' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: SAGE }}>Careers</p>
            <h2 className="mt-2 text-[30px] font-bold leading-tight tracking-tight" style={{ color: NAVY }}>Work across the group</h2>
            <p className="mt-4 text-[16px] leading-relaxed" style={{ color: MUTED }}>
              Carers, nurses, chefs and housekeepers, in four homes across Devon and Somerset. Every role shows the pay
              and the shift pattern, and you can apply in about five minutes from your phone.
            </p>
            <div className="mt-6 space-y-3">
              {[['Care Assistant, Exeter', 'Days · £12.60 an hour'], ['Registered Nurse, Newton Abbot', 'Nights · £21.40 an hour'], ['Chef, Taunton', 'Days · £14.00 an hour']].map(([role, pay]) => (
                <div key={role} className="flex items-center justify-between rounded-lg px-4 py-3" style={{ border: `1px solid ${LINE}` }}>
                  <span className="text-[15px] font-semibold" style={{ color: NAVY }}>{role}</span>
                  <span className="text-[13.5px]" style={{ color: MUTED }}>{pay}</span>
                </div>
              ))}
            </div>
            <span className="mt-6 inline-block rounded-lg px-6 py-3 text-[15px] font-bold text-white" style={{ background: SAGE }}>See all vacancies</span>
          </div>
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: SAGE }}>Tools for families</p>
            <h2 className="mt-2 text-[30px] font-bold leading-tight tracking-tight" style={{ color: NAVY }}>Answer the money question first</h2>
            <div className="mt-6 space-y-4">
              {TOOLS.map((t) => (
                <div key={t.title} className="rounded-2xl p-5" style={{ background: MIST }}>
                  <h3 className="text-[17px] font-bold" style={{ color: NAVY }}>{t.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{t.body}</p>
                  <p className="mt-3 text-[13.5px] font-bold" style={{ color: SAGE }}>Start →</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: MIST }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[30px] font-bold tracking-tight" style={{ color: NAVY }}>News and advice</h2>
            <span className="text-[14px] font-bold" style={{ color: SAGE }}>Read more →</span>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {POSTS.map((post) => (
              <article key={post.title} className="overflow-hidden rounded-2xl bg-white" style={{ border: `1px solid ${LINE}` }}>
                <div className="relative h-40 w-full">
                  <Image src={post.img} alt="" fill className="object-cover" sizes="(min-width:768px) 33vw, 100vw" />
                </div>
                <div className="p-5">
                  <span className="rounded-lg px-2.5 py-1 text-[11.5px] font-bold" style={{ background: MIST, color: SAGE }}>{post.tag}</span>
                  <h3 className="mt-3 text-[16.5px] font-bold leading-snug" style={{ color: NAVY }}>{post.title}</h3>
                  <p className="mt-2 text-[12.5px]" style={{ color: MUTED }}>{post.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 text-center text-white" style={{ background: SAGE }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[32px] font-bold leading-tight tracking-tight">One call, four homes</h2>
          <p className="mt-4 text-[16.5px] leading-relaxed text-white/85">
            Tell us the town and the care you need, and our team will tell you which of our homes can help, honestly,
            even when the answer is none of them yet.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="rounded-lg bg-white px-7 py-3.5 text-sm font-bold" style={{ color: SAGE }}>Enquire now</span>
            <span className="rounded-lg border border-white/50 px-7 py-3.5 text-sm font-bold">Call {p.phone}</span>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-[13px]" style={{ background: INK, color: '#9fb0c0' }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-between gap-6">
            <div>
              <RavenswoodLogo primary="#ffffff" accent={SAGE} />
              <p className="mt-3">Group office, Marsh Barton, {p.town}, {p.county}</p>
              <p>{p.phone}</p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-2">
              {['Our homes', 'Types of care', 'Fees', 'Careers', 'News', 'Privacy'].map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
          <p className="mt-8 text-[12px]" style={{ color: '#6d7f90' }}>
            Example website design. {p.name} is a fictional care group, and the homes, ratings, vacancies, pay and articles shown are examples.
          </p>
        </div>
      </footer>
    </div>
  )
}
