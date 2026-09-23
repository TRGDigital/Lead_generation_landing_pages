import Image from 'next/image'
import type { Design } from '@/lib/designs'
import { StAidansLogo } from './logos'

// Design 3: warm and reassuring, for a nursing home. Nursing sites often read cold and
// hospital-like, which is exactly what worries a family. This keeps the clinical clarity a
// discharge team needs (services, conditions, how an admission works) but carries it in a
// warm palette with soft shapes and real faces. Fictional content throughout.

const PLUM = '#6b2a3e'
const TERRACOTTA = '#c4643c'
const SAND = '#fbf4ee'
const CREAM = '#fffaf6'
const LINE = '#eddfd4'
const INK = '#3a2a29'
const MUTED = '#6f5b57'

const SERVICES = [
  { title: 'Nursing care', body: 'Registered nurses here day and night, so medical needs are met without anyone leaving home.' },
  { title: 'Dementia nursing', body: 'Familiar faces, calm surroundings and a team who know how to reassure rather than correct.' },
  { title: 'Palliative care', body: 'Comfort, dignity and family welcome at any hour, alongside the district nurses and hospice team.' },
  { title: 'Short stays and recovery', body: 'A few weeks to get strong again after hospital, with a plan for getting home.' },
]

const CONDITIONS = ["Parkinson's", 'Stroke recovery', 'Diabetes', 'PEG feeding', 'Wound care', 'Respiratory conditions']

const DAY = [
  { time: 'Morning', body: 'Breakfast in the conservatory, the papers, and a nurse who already knows how you take your tea.' },
  { time: 'Afternoon', body: 'The garden, music, visiting family, or the hairdresser on a Thursday.' },
  { time: 'Evening', body: 'Dinner together, then quiet, with someone always awake and nearby.' },
]

const STEPS = [
  { n: '1', title: 'Call and speak to a nurse', body: 'Not a call centre. Someone who can answer properly, seven days a week.' },
  { n: '2', title: 'An assessment within 24 hours', body: 'On the ward or at home, at a time that suits the family.' },
  { n: '3', title: 'Move in, gently', body: 'Funding confirmed, transport arranged, the room made up with your own things.' },
]

const TOOLS = [
  { title: 'Care funding calculator', body: 'See who pays for nursing care: you, the council or the NHS.' },
  { title: 'NHS Continuing Healthcare checker', body: 'Find out whether the NHS may cover the full cost of care.' },
  { title: 'Funded Nursing Care checker', body: 'The weekly NHS contribution towards nursing fees, explained.' },
]

const POSTS = [
  { title: 'What is the difference between residential and nursing care?', date: '12 September 2026', tag: 'Choosing care', img: '/designs/care-manager.jpg' },
  { title: 'Moving a parent from hospital into a nursing home', date: '28 August 2026', tag: 'Hospital discharge', img: '/designs/group-care.jpg' },
  { title: "A week in the life at St Aidan's", date: '9 August 2026', tag: 'Life here', img: '/designs/live-in-care.jpg' },
]

export default function StAidansDesign({ design }: { design: Design }) {
  const p = design.provider
  return (
    <div style={{ background: CREAM, color: INK, fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-[12px]" style={{ background: SAND, color: PLUM }}>
        <span className="font-semibold">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Readable font</span>
        <span>Listen to page</span>
      </div>

      <header className="border-b" style={{ borderColor: LINE, background: CREAM }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <StAidansLogo primary={PLUM} accent={TERRACOTTA} />
          <nav className="hidden items-center gap-6 text-[15px] font-medium md:flex" style={{ color: MUTED }}>
            {['Our care', 'Life here', 'Fees & funding', 'For professionals', 'Blog', 'Contact'].map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-bold" style={{ color: PLUM }}>{p.phone}</span>
            <span className="rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ background: TERRACOTTA }}>Arrange a visit</span>
          </div>
        </div>
      </header>

      <section className="px-6 py-14" style={{ background: SAND }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold" style={{ color: PLUM, border: `1px solid ${LINE}` }}>
              <span className="h-2 w-2 rounded-full" style={{ background: '#3f9a52' }} />
              3 rooms available, assessments within 24 hours
            </span>
            <h1 className="mt-5 text-[44px] font-bold leading-[1.07] tracking-tight" style={{ color: PLUM }}>
              Nursing care that still feels like home
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: MUTED }}>{p.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full px-7 py-3.5 text-sm font-bold text-white" style={{ background: PLUM }}>Arrange a visit</span>
              <span className="rounded-full border-2 px-7 py-3.5 text-sm font-bold" style={{ borderColor: PLUM, color: PLUM }}>Call {p.phone}</span>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Nurses on site 24 hours', '48 bedrooms with garden views', 'CQC rating: Good (example)'].map((t) => (
                <span key={t} className="rounded-full bg-white px-3.5 py-1.5 text-[13px] font-medium" style={{ border: `1px solid ${LINE}`, color: MUTED }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem]">
              <Image src="/designs/nursing-home.jpg" alt="An example photograph of a nurse and a resident in the garden" width={1600} height={1513} className="h-full w-full object-cover" priority />
            </div>
            <div className="mt-4 rounded-3xl bg-white p-6" style={{ border: `1px solid ${LINE}` }}>
              <p className="text-[16.5px] leading-relaxed" style={{ color: INK }}>
                &ldquo;Dad needed nursing care, and I was dreading somewhere clinical. This felt like a home from the
                first visit, and the nurses knew him within a week.&rdquo;
              </p>
              <p className="mt-2 text-[12px] font-semibold uppercase tracking-widest" style={{ color: TERRACOTTA }}>Example review, a resident&rsquo;s son</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-[30px] font-bold tracking-tight" style={{ color: PLUM }}>The care we provide</h2>
        <p className="mt-2 max-w-2xl text-[16px] leading-relaxed" style={{ color: MUTED }}>
          Every person here has a nurse-led care plan, written with them and their family, and reviewed as things change.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="rounded-3xl p-6" style={{ background: SAND }}>
              <h3 className="text-[18.5px] font-bold" style={{ color: PLUM }}>{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{s.body}</p>
              <p className="mt-4 text-[13px] font-bold" style={{ color: TERRACOTTA }}>Read more →</p>
            </div>
          ))}
        </div>
        <div className="mt-8 rounded-3xl p-7" style={{ border: `1px solid ${LINE}` }}>
          <h3 className="text-[18px] font-bold" style={{ color: PLUM }}>Conditions our nurses support</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <span key={c} className="rounded-full px-3.5 py-1.5 text-[13.5px] font-medium" style={{ background: SAND, color: MUTED }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: SAND }}>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2.5rem]">
            <Image src="/designs/group-care.jpg" alt="An example photograph of residents and staff together" width={1600} height={1132} className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-[30px] font-bold tracking-tight" style={{ color: PLUM }}>A day at {p.name}</h2>
            <div className="mt-6 space-y-5">
              {DAY.map((d) => (
                <div key={d.time} className="border-l-2 pl-5" style={{ borderColor: TERRACOTTA }}>
                  <p className="text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: TERRACOTTA }}>{d.time}</p>
                  <p className="mt-1 text-[15.5px] leading-relaxed" style={{ color: MUTED }}>{d.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl bg-white p-6" style={{ border: `1px solid ${LINE}` }}>
              <h3 className="text-[18px] font-bold" style={{ color: PLUM }}>Fees and funding</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>
                Nursing fees from £1,450 a week, with Funded Nursing Care and Continuing Healthcare explained properly,
                so you know what the NHS may pay before you decide.
              </p>
              <p className="mt-3 text-[13px] font-bold" style={{ color: TERRACOTTA }}>See fees and funding →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Family tools */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[30px] font-bold tracking-tight" style={{ color: PLUM }}>Work out what care will cost</h2>
            <p className="mt-2 max-w-2xl text-[16px] leading-relaxed" style={{ color: MUTED }}>
              Free tools on our site, with no sign up, so you can get an honest answer before you call anyone.
            </p>
          </div>
          <span className="text-[13px] font-bold" style={{ color: TERRACOTTA }}>See all tools →</span>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {TOOLS.map((t) => (
            <div key={t.title} className="rounded-3xl p-6" style={{ border: `1px solid ${LINE}`, background: CREAM }}>
              <span className="grid h-10 w-10 place-items-center rounded-2xl text-[15px] font-bold text-white" style={{ background: TERRACOTTA }}>£</span>
              <h3 className="mt-4 text-[17px] font-bold" style={{ color: PLUM }}>{t.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{t.body}</p>
              <p className="mt-4 text-[13px] font-bold" style={{ color: TERRACOTTA }}>Start →</p>
            </div>
          ))}
        </div>
      </section>

      {/* Blog */}
      <section className="px-6 py-14" style={{ background: SAND }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[30px] font-bold tracking-tight" style={{ color: PLUM }}>Advice for families</h2>
            <span className="text-[13px] font-bold" style={{ color: TERRACOTTA }}>Read the blog →</span>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {POSTS.map((post) => (
              <article key={post.title} className="overflow-hidden rounded-3xl bg-white" style={{ border: `1px solid ${LINE}` }}>
                <div className="relative h-40 w-full">
                  <Image src={post.img} alt="" fill className="object-cover" sizes="(min-width:768px) 33vw, 100vw" />
                </div>
                <div className="p-5">
                  <span className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold" style={{ background: SAND, color: TERRACOTTA }}>{post.tag}</span>
                  <h3 className="mt-3 text-[16.5px] font-bold leading-snug" style={{ color: PLUM }}>{post.title}</h3>
                  <p className="mt-2 text-[12.5px]" style={{ color: MUTED }}>{post.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* For professionals, kept warm but clear */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: TERRACOTTA }}>For discharge teams</p>
            <h2 className="mt-2 text-[30px] font-bold leading-tight tracking-tight" style={{ color: PLUM }}>How an admission works</h2>
            <div className="mt-7 space-y-5">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full text-sm font-bold text-white" style={{ background: PLUM }}>{s.n}</span>
                  <div>
                    <p className="text-[16px] font-bold" style={{ color: PLUM }}>{s.title}</p>
                    <p className="mt-0.5 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl p-7" style={{ background: SAND }}>
            <h3 className="text-[19px] font-bold" style={{ color: PLUM }}>Professional referral</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: MUTED }}>
              A short form for discharge coordinators, social workers and CHC assessors. It reaches the nursing team
              directly, with an answer the same day.
            </p>
            <div className="mt-5 space-y-3">
              {['Patient initials and NHS number', 'Ward and expected discharge date', 'Funding route', 'Contact for the assessment'].map((f) => (
                <div key={f} className="rounded-2xl bg-white px-4 py-3 text-[14px]" style={{ color: MUTED, border: `1px solid ${LINE}` }}>{f}</div>
              ))}
            </div>
            <span className="mt-5 inline-block rounded-full px-6 py-3 text-sm font-bold text-white" style={{ background: TERRACOTTA }}>Send referral</span>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 text-center text-white" style={{ background: PLUM }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[32px] font-bold leading-tight tracking-tight">Come and see us, any day</h2>
          <p className="mt-4 text-[16.5px] leading-relaxed" style={{ color: '#e6cfd6' }}>
            Visit without an appointment, stay for lunch, and talk to the nurses who would be looking after your
            relative. No pressure, and no sales talk.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-white px-7 py-3.5 text-sm font-bold" style={{ color: PLUM }}>Arrange a visit</span>
            <span className="rounded-full border border-white/50 px-7 py-3.5 text-sm font-bold">Call {p.phone}</span>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-[13px]" style={{ background: '#3c1a26', color: '#d6bdc5' }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-between gap-6">
            <div>
              <StAidansLogo primary="#ffffff" accent="#e8a08a" />
              <p className="mt-3">Northbrook Road, {p.town}, {p.county}</p>
              <p>{p.phone}</p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-2">
              {['Our care', 'Life here', 'Fees & funding', 'For professionals', 'Careers', 'Blog', 'Privacy'].map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
          <p className="mt-8 text-[12px]" style={{ color: '#a07f8b' }}>
            Example website design. {p.name} is a fictional nursing home, and the review, rating, fees and articles shown are examples.
          </p>
        </div>
      </footer>
    </div>
  )
}
