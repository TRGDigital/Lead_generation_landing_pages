import Image from 'next/image'
import type { Design } from '@/lib/designs'

// Design 3: clean and clinical. Navy and sky blue on a crisp grid, written for two readers
// at once: a family under pressure, and a discharge team that needs an answer today.

const NAVY = '#13294b'
const SKY = '#2f7fd1'
const SKY_SOFT = '#eaf2fb'
const LINE = '#dfe6ee'

const SERVICES = [
  { title: 'Nursing care', body: 'Registered nurses on site 24 hours a day, for people whose needs go beyond residential care.' },
  { title: 'Dementia nursing', body: 'A dedicated unit for advanced dementia, with staffing and surroundings built around it.' },
  { title: 'Palliative care', body: 'End of life care with dignity, working alongside district nurses and the hospice team.' },
  { title: 'Short term and rehab', body: 'Recovery after a hospital stay, with physiotherapy arranged and a plan for going home.' },
]

const CONDITIONS = ['Parkinson’s disease', 'Stroke recovery', 'Diabetes management', 'PEG feeding', 'Wound care', 'Respiratory conditions']

const STEPS = [
  { n: '1', title: 'Call the clinical team', body: 'Speak to a nurse, not a call centre, seven days a week.' },
  { n: '2', title: 'Assessment within 24 hours', body: 'On the ward or at home, at a time that suits the family.' },
  { n: '3', title: 'Admission arranged', body: 'Funding confirmed, transport booked and the room prepared.' },
]

export default function StAidansDesign({ design }: { design: Design }) {
  const p = design.provider
  return (
    <div style={{ background: '#ffffff', color: '#16202c', fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-[12px]" style={{ background: SKY_SOFT, color: NAVY }}>
        <span className="font-semibold">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Readable font</span>
        <span>Listen to page</span>
      </div>

      <header className="border-b" style={{ borderColor: LINE }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="text-[20px] font-bold tracking-tight" style={{ color: NAVY }}>{p.name}</p>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: SKY }}>{p.town}, {p.county}</p>
          </div>
          <nav className="hidden items-center gap-6 text-[15px] font-medium md:flex" style={{ color: '#41506a' }}>
            {['Nursing care', 'Dementia care', 'Admissions', 'For professionals', 'Contact'].map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-bold" style={{ color: NAVY }}>{p.phone}</span>
            <span className="rounded-md px-5 py-2.5 text-sm font-bold text-white" style={{ background: SKY }}>Admissions enquiry</span>
          </div>
        </div>
      </header>

      <section className="border-b px-6 py-14" style={{ borderColor: LINE, background: SKY_SOFT }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-[12px] font-bold" style={{ color: NAVY, border: `1px solid ${LINE}` }}>
              <span className="h-2 w-2 rounded-full" style={{ background: '#1f9d55' }} />
              Assessments within 24 hours
            </span>
            <h1 className="mt-5 text-[44px] font-bold leading-[1.06] tracking-tight" style={{ color: NAVY }}>{p.strapline}</h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: '#41506a' }}>{p.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-md px-7 py-3.5 text-sm font-bold text-white" style={{ background: NAVY }}>Make an admissions enquiry</span>
              <span className="rounded-md border px-7 py-3.5 text-sm font-bold" style={{ borderColor: NAVY, color: NAVY }}>Refer a patient</span>
            </div>
            <div className="mt-8 grid max-w-md grid-cols-3 gap-4 text-center">
              {[['24/7', 'Registered nurses'], ['48', 'Nursing beds'], ['Good', 'CQC (example)']].map(([a, b]) => (
                <div key={b} className="rounded-md bg-white px-3 py-4" style={{ border: `1px solid ${LINE}` }}>
                  <p className="text-[22px] font-bold" style={{ color: NAVY }}>{a}</p>
                  <p className="text-[12px]" style={{ color: '#5d6b82' }}>{b}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded-lg">
            <Image src="/designs/nursing-home.jpg" alt="An example photograph of a nurse with a resident" width={1600} height={1513} className="h-full w-full object-cover" priority />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-[30px] font-bold tracking-tight" style={{ color: NAVY }}>Clinical services</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.title} className="rounded-lg p-6" style={{ border: `1px solid ${LINE}` }}>
              <h3 className="text-[18px] font-bold" style={{ color: NAVY }}>{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: '#5d6b82' }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg p-7" style={{ background: SKY_SOFT }}>
          <h3 className="text-[18px] font-bold" style={{ color: NAVY }}>Conditions we support</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <span key={c} className="rounded-md bg-white px-3.5 py-1.5 text-[13.5px] font-medium" style={{ border: `1px solid ${LINE}`, color: '#41506a' }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y px-6 py-14" style={{ borderColor: LINE, background: '#f8fafc' }}>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: SKY }}>For discharge teams</p>
            <h2 className="mt-2 text-[30px] font-bold leading-tight tracking-tight" style={{ color: NAVY }}>How an admission works</h2>
            <div className="mt-7 space-y-5">
              {STEPS.map((s) => (
                <div key={s.n} className="flex gap-4">
                  <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-md text-sm font-bold text-white" style={{ background: NAVY }}>{s.n}</span>
                  <div>
                    <p className="text-[16px] font-bold" style={{ color: NAVY }}>{s.title}</p>
                    <p className="mt-0.5 text-[14.5px] leading-relaxed" style={{ color: '#5d6b82' }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-white p-7" style={{ border: `1px solid ${LINE}` }}>
            <h3 className="text-[19px] font-bold" style={{ color: NAVY }}>Professional referral</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: '#5d6b82' }}>
              A short form for discharge coordinators, social workers and CHC assessors. Reaches the clinical team
              directly, with an answer the same day.
            </p>
            <div className="mt-5 space-y-3">
              {['Patient initials and NHS number', 'Ward and expected discharge date', 'Funding route', 'Contact for the assessment'].map((f) => (
                <div key={f} className="rounded-md px-4 py-3 text-[14px]" style={{ background: '#f4f7fb', color: '#41506a' }}>{f}</div>
              ))}
            </div>
            <span className="mt-5 inline-block rounded-md px-6 py-3 text-sm font-bold text-white" style={{ background: SKY }}>Send referral</span>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 text-center text-white" style={{ background: NAVY }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[32px] font-bold leading-tight tracking-tight">Speak to the clinical team today</h2>
          <p className="mt-4 text-[16.5px] leading-relaxed" style={{ color: '#b9c8de' }}>
            Whether you are a family looking at nursing care or a professional arranging a discharge, you will speak to
            a nurse who can answer properly.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="rounded-md bg-white px-7 py-3.5 text-sm font-bold" style={{ color: NAVY }}>Call {p.phone}</span>
            <span className="rounded-md border border-white/40 px-7 py-3.5 text-sm font-bold">Admissions enquiry</span>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-[13px]" style={{ background: '#0d1b30', color: '#93a5bf' }}>
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6">
          <div>
            <p className="text-[17px] font-bold text-white">{p.name}</p>
            <p className="mt-1">Northbrook Road, {p.town}, {p.county}</p>
            <p>{p.phone}</p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-2">
            {['Nursing care', 'Admissions', 'For professionals', 'Careers', 'Privacy'].map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl text-[12px]" style={{ color: '#63758f' }}>
          Example website design. {p.name} is a fictional nursing home, and the rating, bed numbers and details shown are examples.
        </p>
      </footer>
    </div>
  )
}
