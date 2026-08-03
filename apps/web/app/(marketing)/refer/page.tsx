import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import { UserPlus, MessageSquareText, Gift } from 'lucide-react'
import { Star, Squiggle, Burst } from '@/components/marketing/Decor'
import { ReferralForm } from '@/components/marketing/ReferralForm'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/refer', META)
}

const META: Metadata = {
  title: 'Refer a Care Home & Get Rewarded | TRG Digital',
  description:
    'Know a care home that could fill more beds? Refer them to TRG Digital. If they become a client, we say thank you with a reward, and give them a warm welcome too.',
  alternates: { canonical: `${SITE_URL}/refer` },
  robots: { index: true, follow: true },
}

const STEPS = [
  { Icon: UserPlus, title: 'Tell us who', body: 'Share the care home’s name and the best person to talk to. That’s all we need to start.' },
  { Icon: MessageSquareText, title: 'We take it from here', body: 'We reach out, with no pressure, and show them how we help homes fill beds with quality enquiries.' },
  { Icon: Gift, title: 'You get rewarded', body: 'If they become a client, we say a proper thank you, and give them a warm welcome offer too.' },
]

export default function ReferPage() {
  return (
    <>
      {/* ── Hero + form ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Referral scheme</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Know a home that needs <span className="text-brand-pop">more enquiries?</span>
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              If you know a care home struggling to fill beds, introduce us. When they become a client, we’ll thank
              you with a reward, and look after them with a warm welcome too. It’s our favourite way to grow,
              through people who know us.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {['No obligation', 'A genuine thank-you', 'They get looked after too'].map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div id="refer">
            <ReferralForm />
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">How it works</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Three easy steps
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map(({ Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-brand-line bg-white p-7 shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10">
                  <Icon className="h-6 w-6 text-brand-pop" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-brand-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reward band ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            A proper thank-you for your introduction
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            Refer a care home today. There’s no obligation, and if they join us, we’ll be in touch to say thank you.
          </p>
          <a href="#refer" className="btn-cta mt-8 inline-flex">
            Refer a home
            <span className="btn-arrow" aria-hidden>→</span>
          </a>
        </div>
      </section>
    </>
  )
}
