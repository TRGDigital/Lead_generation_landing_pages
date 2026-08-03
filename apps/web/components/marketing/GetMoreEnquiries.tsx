import Link from 'next/link'
import {
  Users,
  Mic,
  ClipboardList,
  Filter,
  MessageCircle,
  PhoneCall,
  PhoneMissed,
  Megaphone,
  Layers,
} from 'lucide-react'
import { Star, Dots, Squiggle } from './Decor'

// "Get more enquiries", the growth toolkit we can add on top of marketing:
// each capability with a short, benefit-led explanation of what it does.
const CAPABILITIES = [
  {
    icon: Users,
    title: 'Custom CRM',
    body: 'One place to capture, track and follow up every enquiry, so no lead ever slips through the cracks.',
  },
  {
    icon: Mic,
    title: 'Voice AI',
    body: "An AI receptionist that answers calls day and night, books tours and takes details when your team can't pick up.",
  },
  {
    icon: ClipboardList,
    title: 'Forms, Surveys & Quizzes',
    body: 'Interactive forms and quizzes that qualify families and turn curious visitors into real enquiries.',
  },
  {
    icon: Filter,
    title: 'Websites, Funnels & Landing Pages',
    body: 'High converting sites and campaign funnels built to guide families from first click to booked enquiry.',
  },
  {
    icon: MessageCircle,
    title: 'Chat Widget / Conversation AI',
    body: 'An on-site AI chat that answers questions instantly and captures enquiries around the clock.',
  },
  {
    icon: PhoneCall,
    title: 'Call Tracking',
    body: 'See exactly which ads and pages drive your phone calls, so you spend only on what fills beds.',
  },
  {
    icon: PhoneMissed,
    title: 'Missed Call Text-Back',
    body: 'Automatically texts back any missed call within seconds, recovering enquiries you would otherwise lose.',
  },
  {
    icon: Megaphone,
    title: 'Ad Manager (Google/FB/Insta Ads)',
    body: 'Google, Facebook and Instagram campaigns run in one place and measured on real enquiries, not clicks.',
  },
  {
    icon: Layers,
    title: 'Full SaaS Stack Build',
    body: 'We build the complete platform behind it all, bespoke software made only for the care sector.',
  },
]

export function GetMoreEnquiries() {
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <Star className="absolute right-6 top-10 hidden h-20 w-20 rotate-12 text-brand-pop/70 lg:block" />
      <Star className="absolute bottom-12 left-8 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
      <div className="relative mx-auto max-w-6xl">
        <div className="relative rounded-3xl border-2 border-brand-pop/30 p-6 sm:p-10">
          <span className="absolute -top-3.5 left-8 bg-brand-bg px-3 font-display text-sm font-bold uppercase tracking-widest text-brand-pop">
            Get more enquiries
          </span>
          <Star className="absolute -left-7 -top-8 h-16 w-16 -rotate-12 text-brand-accent" />
          <Dots className="absolute -bottom-7 -right-7 h-20 w-20 text-brand-pop/60" />
          <Squiggle className="absolute -top-4 left-1/4 hidden h-7 w-48 text-brand-pop/70 lg:block" />

          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold uppercase leading-tight tracking-tight text-brand-ink sm:text-4xl">
              Everything you need to turn interest into enquiries
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-ink-soft sm:text-base">
              A complete growth toolkit we can bolt onto your marketing, capturing, answering and
              following up every enquiry automatically, so more of them become filled beds.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="group rounded-2xl border-2 border-brand-line bg-white/50 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-pop/40 hover:shadow-[4px_4px_0_0_#2a2620]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-pop text-white transition-colors group-hover:bg-brand-pop-dark">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase leading-tight tracking-tight text-brand-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <Link
            href="/contact"
            className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-brand-pop px-6 py-6 text-center font-display text-xl font-bold uppercase tracking-tight text-white shadow-[4px_4px_0_0_#2a2620] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-brand-pop-dark hover:shadow-[2px_2px_0_0_#2a2620] sm:text-2xl"
          >
            Want more enquiries? Book a free demo
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
