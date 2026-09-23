import Image from 'next/image'
import type { Design } from '@/lib/designs'

// Design 2: friendly and modern. Teal and white, rounded shapes, a sans face, and a layout
// built around the two jobs a home care site has to do: win clients and recruit carers.

const TEAL = '#0f766e'
const TEAL_SOFT = '#e6f4f2'
const INK = '#14201f'
const SUN = '#f4a524'

const VISITS = [
  { name: 'Morning visit', time: 'About an hour', body: 'Getting up, washed and dressed, medication, and breakfast made the way you like it.' },
  { name: 'Lunch call', time: '30 or 60 minutes', body: 'A hot meal, a check that medication has been taken, and a proper conversation.' },
  { name: 'Tea call', time: '30 minutes', body: 'An evening meal, a tidy round, and help with anything left over from the day.' },
  { name: 'Bedtime call', time: '30 minutes', body: 'Help to settle safely for the night, with everything needed within reach.' },
]

const CARE = [
  { title: 'Hourly home care', body: 'From one visit a day to several, in your own home, from a small team of familiar faces.' },
  { title: 'Live-in care', body: 'A carer who lives with you, so you can stay at home rather than move into a care home.' },
  { title: 'Dementia care at home', body: 'Steady routines and the same faces, which matter more than anything with memory loss.' },
  { title: 'After hospital', body: 'Extra support for a few weeks while you get back on your feet, arranged quickly.' },
]

export default function BrightpathDesign({ design }: { design: Design }) {
  const p = design.provider
  return (
    <div style={{ background: '#ffffff', color: INK, fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-[12px]" style={{ background: TEAL_SOFT, color: TEAL }}>
        <span className="font-semibold">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Readable font</span>
        <span>Listen to page</span>
      </div>

      <header className="border-b" style={{ borderColor: '#e6eceb' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl text-lg font-black text-white" style={{ background: TEAL }}>B</span>
            <span className="text-[19px] font-extrabold tracking-tight">{p.name}</span>
          </div>
          <nav className="hidden items-center gap-6 text-[15px] font-medium md:flex" style={{ color: '#3d4b4a' }}>
            {['Home care', 'Live-in care', 'Areas we cover', 'Careers', 'Contact'].map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
          <span className="rounded-full px-5 py-2.5 text-sm font-bold text-white" style={{ background: TEAL }}>{p.phone}</span>
        </div>
      </header>

      <section className="px-6 py-14" style={{ background: `linear-gradient(180deg, ${TEAL_SOFT} 0%, #ffffff 100%)` }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.18em]" style={{ color: TEAL }}>Home care in {p.county}</p>
            <h1 className="mt-4 text-[46px] font-extrabold leading-[1.05] tracking-tight">{p.strapline}</h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: '#41504f' }}>{p.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full px-7 py-3.5 text-sm font-bold text-white" style={{ background: TEAL }}>Book a care assessment</span>
              <span className="rounded-full border-2 px-7 py-3.5 text-sm font-bold" style={{ borderColor: TEAL, color: TEAL }}>How much care do we need?</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {['Rated Good by CQC (example)', 'Nurse-led care plans', 'Covering 14 villages'].map((t) => (
                <span key={t} className="rounded-full px-3.5 py-1.5 text-[13px] font-semibold" style={{ background: '#ffffff', border: '1px solid #dbe8e6', color: '#41504f' }}>{t}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem]">
              <Image src="/designs/domiciliary-care.jpg" alt="An example photograph of a carer supporting someone at home" width={1600} height={1315} className="h-full w-full object-cover" priority />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-64 rounded-3xl bg-white p-5 shadow-xl sm:block" style={{ border: '1px solid #e6eceb' }}>
              <p className="text-[13px] font-bold" style={{ color: TEAL }}>Visits this week</p>
              <p className="mt-1 text-[28px] font-extrabold leading-none">14 hours</p>
              <p className="mt-1 text-[12.5px]" style={{ color: '#6b7a79' }}>Morning, lunch and bedtime calls, seven days</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl p-8" style={{ background: TEAL_SOFT }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: TEAL }}>For families</p>
            <h2 className="mt-2 text-[26px] font-extrabold leading-tight">I am looking for care at home</h2>
            <p className="mt-2 text-[15px] leading-relaxed" style={{ color: '#41504f' }}>
              Tell us what a normal day looks like and we will plan the visits around it, starting within a week.
            </p>
            <p className="mt-4 text-[14px] font-bold" style={{ color: TEAL }}>Book a care assessment →</p>
          </div>
          <div className="rounded-3xl p-8 text-white" style={{ background: INK }}>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: SUN }}>For carers</p>
            <h2 className="mt-2 text-[26px] font-extrabold leading-tight">I would like to work in care</h2>
            <p className="mt-2 text-[15px] leading-relaxed" style={{ color: '#c8d4d3' }}>
              Paid per shift with travel time and mileage, fixed visit times, and training that takes you further.
            </p>
            <p className="mt-4 text-[14px] font-bold" style={{ color: SUN }}>See our care jobs →</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: '#f7fbfa' }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[30px] font-extrabold tracking-tight">The care we provide</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CARE.map((c) => (
              <div key={c.title} className="rounded-3xl bg-white p-6" style={{ border: '1px solid #e6eceb' }}>
                <h3 className="text-[18px] font-bold">{c.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: '#5a6968' }}>{c.body}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-14 text-[30px] font-extrabold tracking-tight">What a day of visits looks like</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VISITS.map((v) => (
              <div key={v.name} className="rounded-3xl bg-white p-6" style={{ border: '1px solid #e6eceb' }}>
                <p className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: SUN }}>{v.time}</p>
                <h3 className="mt-1 text-[18px] font-bold">{v.name}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: '#5a6968' }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-[2.5rem] p-10 text-center text-white" style={{ background: TEAL }}>
          <h2 className="text-[32px] font-extrabold leading-tight">Care can start this week</h2>
          <p className="mx-auto mt-4 max-w-xl text-[16.5px] leading-relaxed" style={{ color: '#cfe9e5' }}>
            A care assessment is free, takes about an hour and puts you under no obligation at all.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="rounded-full bg-white px-7 py-3.5 text-sm font-bold" style={{ color: TEAL }}>Book a care assessment</span>
            <span className="rounded-full border border-white/50 px-7 py-3.5 text-sm font-bold">Call {p.phone}</span>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-[13px]" style={{ background: INK, color: '#a9bab8' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6">
          <div>
            <p className="text-[17px] font-extrabold text-white">{p.name}</p>
            <p className="mt-1">Unit 4, Green Lane, {p.town}, {p.county}</p>
            <p>{p.phone}</p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-2">
            {['Home care', 'Live-in care', 'Areas we cover', 'Careers', 'Privacy'].map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-[12px]" style={{ color: '#6f8280' }}>
          Example website design. {p.name} is a fictional care provider, and the rating and details shown are examples.
        </p>
      </footer>
    </div>
  )
}
