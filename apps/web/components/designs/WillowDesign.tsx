import Image from 'next/image'
import type { Design } from '@/lib/designs'
import { WillowLogo } from './logos'

// Design 4: supported living. Bright and calm, with short sentences and plain words, because
// the people reading it are often the people who will live there. Indigo and sunshine yellow,
// generous type, an easy read version offered on every page. Fictional content throughout.

const INDIGO = '#4a3d9e'
const SUN = '#f5b301'
const LILAC = '#f2f0fc'
const INK = '#221f33'
const MUTED = '#5c5875'
const LINE = '#e3dff5'

const SUPPORT = [
  { title: 'Your own flat', body: 'You have your own tenancy, your own front door and your own key.' },
  { title: 'Support that fits you', body: 'From a few hours a week to support day and night. It changes when your needs change.' },
  { title: 'Doing things you enjoy', body: 'College, work, sport, seeing friends. We help you get there and back.' },
  { title: 'Health and money', body: 'Help with appointments, medication, bills and benefits, for as long as you want it.' },
]

const WHO = ['A learning disability', 'Autism', 'Mental health needs', 'Acquired brain injury', 'Physical disabilities']

const VACANCIES = [
  { place: 'Tarnside, flat 4', detail: 'One bedroom ground floor flat, wet room, garden.', support: 'Up to 20 hours a week' },
  { place: 'Tarnside, flat 9', detail: 'One bedroom first floor flat, close to the bus stop.', support: 'Up to 35 hours a week' },
  { place: 'Brayford House', detail: 'Room in a shared house with three others.', support: 'Waking night support' },
]

const TOOLS = [
  { title: 'Benefits checker', body: 'See which benefits you may be able to claim.' },
  { title: 'Local council and funding', body: 'What your council may pay towards your support.' },
  { title: 'Is supported living right for me?', body: 'A few simple questions to help you think it through.' },
]

const POSTS = [
  { title: 'What happens when you move into supported living', date: '11 September 2026', tag: 'Easy read', img: '/designs/shared-lives.jpg' },
  { title: 'Tom tells us about his first year at Willow Court', date: '29 August 2026', tag: 'Our stories', img: '/designs/diverse-workforce.jpg' },
  { title: 'A guide for families and social workers', date: '14 August 2026', tag: 'For professionals', img: '/designs/care-manager.jpg' },
]

export default function WillowDesign({ design }: { design: Design }) {
  const p = design.provider
  return (
    <div style={{ background: '#ffffff', color: INK, fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif' }}>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2 text-[12.5px]" style={{ background: LILAC, color: INDIGO }}>
        <span className="font-semibold">Accessibility</span>
        <span>Text size A A+ A++</span>
        <span>High contrast</span>
        <span>Readable font</span>
        <span>Listen to page</span>
        <span className="font-semibold">Easy read version</span>
      </div>

      <header className="border-b" style={{ borderColor: LINE }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <WillowLogo primary={INDIGO} accent={SUN} />
          <nav className="hidden items-center gap-6 text-[16px] font-medium md:flex" style={{ color: MUTED }}>
            {['About us', 'Our support', 'Vacancies', 'For professionals', 'Blog', 'Contact'].map((l) => (
              <span key={l} className="cursor-default">{l}</span>
            ))}
          </nav>
          <span className="rounded-2xl px-5 py-2.5 text-[15px] font-bold text-white" style={{ background: INDIGO }}>{p.phone}</span>
        </div>
      </header>

      <section className="px-6 py-14" style={{ background: LILAC }}>
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-[13px] font-bold" style={{ color: INDIGO }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#2fa360' }} />
              3 vacancies right now
            </span>
            <h1 className="mt-5 text-[44px] font-extrabold leading-[1.08] tracking-tight" style={{ color: INDIGO }}>{p.strapline}</h1>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed" style={{ color: MUTED }}>{p.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-2xl px-7 py-3.5 text-[15px] font-bold text-white" style={{ background: INDIGO }}>See our vacancies</span>
              <span className="rounded-2xl border-2 px-7 py-3.5 text-[15px] font-bold" style={{ borderColor: INDIGO, color: INDIGO }}>Make a referral</span>
            </div>
            <p className="mt-6 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[14px] font-semibold" style={{ background: SUN, color: '#3b2f00' }}>
              This page has an easy read version
            </p>
          </div>
          <div className="overflow-hidden rounded-[2rem]">
            <Image src="/designs/shared-lives.jpg" alt="An example photograph of a support worker and a tenant together" width={1500} height={906} className="h-full w-full object-cover" priority />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-[32px] font-extrabold tracking-tight" style={{ color: INDIGO }}>What we help with</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SUPPORT.map((s) => (
            <div key={s.title} className="rounded-3xl p-6" style={{ border: `2px solid ${LINE}` }}>
              <h3 className="text-[19px] font-bold" style={{ color: INDIGO }}>{s.title}</h3>
              <p className="mt-2 text-[15.5px] leading-relaxed" style={{ color: MUTED }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl p-7" style={{ background: LILAC }}>
          <h3 className="text-[19px] font-bold" style={{ color: INDIGO }}>Who we support</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {WHO.map((w) => (
              <span key={w} className="rounded-2xl bg-white px-4 py-2 text-[15px] font-medium" style={{ color: MUTED }}>{w}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: INK }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[32px] font-extrabold tracking-tight text-white">Vacancies right now</h2>
              <p className="mt-2 text-[16px]" style={{ color: '#b9b4d6' }}>Updated by our team, so what you see is real.</p>
            </div>
            <span className="text-[15px] font-bold" style={{ color: SUN }}>All vacancies →</span>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {VACANCIES.map((v) => (
              <div key={v.place} className="rounded-3xl bg-white p-6">
                <p className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: SUN }}>Available now</p>
                <h3 className="mt-2 text-[19px] font-bold" style={{ color: INDIGO }}>{v.place}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>{v.detail}</p>
                <p className="mt-3 text-[14px] font-semibold" style={{ color: INDIGO }}>{v.support}</p>
                <p className="mt-4 text-[14px] font-bold" style={{ color: SUN }}>Ask about this flat →</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: SUN }}>For professionals</p>
            <h2 className="mt-2 text-[30px] font-extrabold leading-tight tracking-tight" style={{ color: INDIGO }}>Making a referral</h2>
            <p className="mt-4 text-[16px] leading-relaxed" style={{ color: MUTED }}>
              Social workers, commissioners and families can refer someone here. Tell us what support the person needs
              and we will tell you honestly whether we can meet it, usually within two working days.
            </p>
            <div className="mt-6 space-y-3">
              {['What support the person needs', 'Funding route and hours', 'Any risks we should know about', 'Who to contact'].map((f) => (
                <div key={f} className="rounded-2xl px-4 py-3 text-[15px]" style={{ background: LILAC, color: MUTED }}>{f}</div>
              ))}
            </div>
            <span className="mt-6 inline-block rounded-2xl px-6 py-3 text-[15px] font-bold text-white" style={{ background: INDIGO }}>Send a referral</span>
          </div>
          <div className="overflow-hidden rounded-[2rem]">
            <Image src="/designs/diverse-workforce.jpg" alt="An example photograph of the support team" width={1600} height={879} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section className="px-6 py-14" style={{ background: LILAC }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[30px] font-extrabold tracking-tight" style={{ color: INDIGO }}>Tools that help</h2>
            <span className="text-[15px] font-bold" style={{ color: INDIGO }}>See all tools →</span>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {TOOLS.map((t) => (
              <div key={t.title} className="rounded-3xl bg-white p-6">
                <h3 className="text-[18px] font-bold" style={{ color: INDIGO }}>{t.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed" style={{ color: MUTED }}>{t.body}</p>
                <p className="mt-4 text-[14px] font-bold" style={{ color: SUN }}>Start →</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[30px] font-extrabold tracking-tight" style={{ color: INDIGO }}>News and stories</h2>
            <span className="text-[15px] font-bold" style={{ color: INDIGO }}>Read the blog →</span>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {POSTS.map((post) => (
              <article key={post.title} className="overflow-hidden rounded-3xl bg-white">
                <div className="relative h-40 w-full">
                  <Image src={post.img} alt="" fill className="object-cover" sizes="(min-width:768px) 33vw, 100vw" />
                </div>
                <div className="p-5">
                  <span className="rounded-2xl px-3 py-1 text-[12px] font-bold" style={{ background: SUN, color: '#3b2f00' }}>{post.tag}</span>
                  <h3 className="mt-3 text-[17px] font-bold leading-snug" style={{ color: INDIGO }}>{post.title}</h3>
                  <p className="mt-2 text-[13px]" style={{ color: MUTED }}>{post.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-14 text-center text-white" style={{ background: INDIGO }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[32px] font-extrabold leading-tight tracking-tight">Come and have a look round</h2>
          <p className="mt-4 text-[17px] leading-relaxed" style={{ color: '#d3cdf3' }}>
            You can visit, meet the team and see a flat before you decide anything. Bring whoever you like with you.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="rounded-2xl bg-white px-7 py-3.5 text-[15px] font-bold" style={{ color: INDIGO }}>Arrange a visit</span>
            <span className="rounded-2xl border border-white/50 px-7 py-3.5 text-[15px] font-bold">Call {p.phone}</span>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-[14px]" style={{ background: INK, color: '#b9b4d6' }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-between gap-6">
            <div>
              <WillowLogo primary="#ffffff" accent={SUN} />
              <p className="mt-3">Willow Court, Tarn Road, {p.town}, {p.county}</p>
              <p>{p.phone}</p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-2">
              {['About us', 'Our support', 'Vacancies', 'Easy read', 'Careers', 'Blog', 'Privacy'].map((l) => <span key={l}>{l}</span>)}
            </div>
          </div>
          <p className="mt-8 text-[12.5px]" style={{ color: '#7a7599' }}>
            Example website design. {p.name} is a fictional supported living service, and the vacancies, stories and articles shown are examples.
          </p>
        </div>
      </footer>
    </div>
  )
}
