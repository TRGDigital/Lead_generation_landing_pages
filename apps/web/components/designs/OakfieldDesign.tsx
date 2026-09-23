import Image from 'next/image'
import type { Design } from '@/lib/designs'
import { OakfieldLogo } from './logos'

// Design 1: traditional and warm. Deep green and cream, serif headings, photography led,
// the look most residential homes are reaching for. Fictional content throughout.

const GREEN = '#2f4a3a'
const CREAM = '#f7f3ea'
const GOLD = '#b8863b'

const SERVICES = [
  { title: 'Residential care', body: 'Help with daily life in a home that still feels like one, with your own room and your own routine.' },
  { title: 'Respite stays', body: 'A short stay from one week, for a break, a recovery after hospital, or a trial of life here.' },
  { title: 'Dementia care', body: 'Familiar faces, calm surroundings and a team trained to support memory loss with patience.' },
  { title: 'Day visits', body: 'Company, activities and a proper lunch, one or two days a week, with transport arranged.' },
]

const TOOLS = [
  { title: 'Care funding calculator', body: 'Who pays for care, and how much: you, the council or the NHS.' },
  { title: 'Is it time for care?', body: 'A gentle, private checklist for families wondering whether now is the time.' },
  { title: 'Attendance Allowance checker', body: 'A benefit many families are entitled to and never claim.' },
]

const POSTS = [
  { title: 'What to look for on your first visit to a care home', date: '15 September 2026', tag: 'Choosing a home', img: '/designs/care-manager.jpg' },
  { title: 'Respite care explained, and when it helps most', date: '2 September 2026', tag: 'Respite', img: '/designs/live-in-care.jpg' },
  { title: 'Our gardening club, one year on', date: '20 August 2026', tag: 'Life at Oakfield', img: '/designs/group-care.jpg' },
]

const DAY = [
  { time: 'Morning', body: 'Breakfast when you wake, not on a schedule. The papers, the garden, or a lie in.' },
  { time: 'Afternoon', body: 'Gardening club, visiting musicians, the hairdresser, or a trip into the village.' },
  { time: 'Evening', body: 'Dinner at seven in the dining room, then cards, television or an early night.' },
]

export default function OakfieldDesign({ design }: { design: Design }) {
  const p = design.provider
  return (
    <div style={{ background: CREAM, color: '#23201c', fontFamily: 'Georgia, "Times New Roman", serif' }}>
      {/* Accessibility bar, as built into every site we make */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 border-b px-4 py-2 text-[12px]" style={{ borderColor: '#e2dac9', background: '#fffdf8' }}>
        <span className="font-semibold">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Readable font</span>
        <span>Listen to page</span>
      </div>

      <header className="border-b" style={{ borderColor: '#e2dac9', background: '#fffdf8' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <OakfieldLogo primary={GREEN} accent={GOLD} />
          <nav className="hidden items-center gap-6 text-[15px] md:flex">
            {['Our home', 'Our care', 'Life here', 'Fees', 'Blog', 'Contact'].map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-bold" style={{ color: GREEN }}>{p.phone}</span>
            <span className="rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ background: GREEN }}>Book a visit</span>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-bold" style={{ background: '#e7efe7', color: GREEN }}>
            <span className="h-2 w-2 rounded-full" style={{ background: '#3f9a52' }} />
            2 rooms available this month
          </span>
          <h1 className="mt-5 text-[44px] leading-[1.05]" style={{ color: GREEN }}>{p.strapline}</h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: '#4c463d' }}>{p.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full px-7 py-3.5 text-sm font-bold text-white" style={{ background: GREEN }}>Book a visit</span>
            <span className="rounded-full border px-7 py-3.5 text-sm font-bold" style={{ borderColor: GREEN, color: GREEN }}>Call {p.phone}</span>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px]" style={{ color: '#5b5346' }}>
            <span>CQC rating: Good (example)</span>
            <span>Family run since 1998</span>
            <span>32 bedrooms</span>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem]">
            <Image src="/designs/residential-care.jpg" alt="An example photograph of a resident and a carer together" width={1600} height={1247} className="h-full w-full object-cover" priority />
          </div>
          <div className="mt-4 rounded-2xl border p-5" style={{ borderColor: '#e2dac9', background: '#fffdf8' }}>
            <p className="text-[17px] italic leading-relaxed">
              &ldquo;Mum settled in within a fortnight. The staff knew what she liked in her tea before we did.&rdquo;
            </p>
            <p className="mt-2 text-[12px] uppercase tracking-widest" style={{ color: GOLD }}>Example review, a resident&rsquo;s daughter</p>
          </div>
        </div>
      </section>

      <section className="border-y py-14" style={{ borderColor: '#e2dac9', background: '#fffdf8' }}>
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-[30px]" style={{ color: GREEN }}>The care we provide</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="rounded-2xl border p-6" style={{ borderColor: '#e2dac9', background: CREAM }}>
                <h3 className="text-[19px]" style={{ color: GREEN }}>{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: '#4c463d' }}>{s.body}</p>
                <p className="mt-4 text-[13px] font-bold" style={{ color: GOLD }}>Read more →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem]">
            <Image src="/designs/group-care.jpg" alt="An example photograph of an activity in the lounge" width={1600} height={1132} className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-[30px]" style={{ color: GREEN }}>A day at {p.name}</h2>
            <div className="mt-6 space-y-5">
              {DAY.map((d) => (
                <div key={d.time} className="border-l-2 pl-5" style={{ borderColor: GOLD }}>
                  <p className="text-[12px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>{d.time}</p>
                  <p className="mt-1 text-[15.5px] leading-relaxed" style={{ color: '#4c463d' }}>{d.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl p-6" style={{ background: '#e7efe7' }}>
              <h3 className="text-[19px]" style={{ color: GREEN }}>Fees, explained plainly</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: '#4c463d' }}>
                Weekly fees from £1,150, with what is included set out in full, and help understanding what the council
                or the NHS may pay towards it.
              </p>
              <p className="mt-3 text-[13px] font-bold" style={{ color: GOLD }}>See our fees →</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t py-14" style={{ borderColor: '#e2dac9', background: '#fffdf8' }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[30px]" style={{ color: GREEN }}>Work out what care will cost</h2>
              <p className="mt-2 max-w-2xl text-[15.5px] leading-relaxed" style={{ color: '#4c463d' }}>
                Free tools on our website, with no sign up, so you can get an honest answer before you call anyone.
              </p>
            </div>
            <span className="text-[13px] font-bold" style={{ color: GOLD }}>See all tools →</span>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {TOOLS.map((t) => (
              <div key={t.title} className="rounded-2xl border p-6" style={{ borderColor: '#e2dac9', background: CREAM }}>
                <h3 className="text-[18px]" style={{ color: GREEN }}>{t.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: '#4c463d' }}>{t.body}</p>
                <p className="mt-4 text-[13px] font-bold" style={{ color: GOLD }}>Start →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-[30px]" style={{ color: GREEN }}>News and advice</h2>
          <span className="text-[13px] font-bold" style={{ color: GOLD }}>Read the blog →</span>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {POSTS.map((post) => (
            <article key={post.title} className="overflow-hidden rounded-2xl border" style={{ borderColor: '#e2dac9', background: '#fffdf8' }}>
              <div className="relative h-40 w-full">
                <Image src={post.img} alt="" fill className="object-cover" sizes="(min-width:768px) 33vw, 100vw" />
              </div>
              <div className="p-5">
                <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: GOLD }}>{post.tag}</span>
                <h3 className="mt-2 text-[17px] leading-snug" style={{ color: GREEN }}>{post.title}</h3>
                <p className="mt-2 text-[12.5px]" style={{ color: '#6b6355' }}>{post.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="py-14 text-center text-white" style={{ background: GREEN }}>
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-[32px]">Come and see us</h2>
          <p className="mt-4 text-[16.5px] leading-relaxed" style={{ color: '#d9e4d9' }}>
            Visit any day of the week, with no appointment needed. Stay for lunch and meet the people who live here.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-white px-7 py-3.5 text-sm font-bold" style={{ color: GREEN }}>Book a visit</span>
            <span className="rounded-full border border-white/50 px-7 py-3.5 text-sm font-bold">Call {p.phone}</span>
          </div>
        </div>
      </section>

      <footer className="py-10 text-[13px]" style={{ background: '#22352a', color: '#c9d6c9' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6 px-6">
          <div>
            <OakfieldLogo primary="#ffffff" accent="#d8b478" />
            <p className="mt-3">Church Lane, {p.town}, {p.county}</p>
            <p>{p.phone}</p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-2">
            {['Our home', 'Our care', 'Fees', 'Careers', 'Blog', 'Privacy'].map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl px-6 text-[12px]" style={{ color: '#8ea08e' }}>
          Example website design. {p.name} is a fictional care home, and the review, rating, fees and articles shown are examples.
        </p>
      </footer>
    </div>
  )
}
