import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import Link from 'next/link'
import { ManagedImage } from '@/components/marketing/ManagedImage'
import { Calculator, HeartPulse, HandCoins, Landmark, Check, BedDouble, Accessibility, TrendingUp, Sparkles, MousePointerClick, Brain } from 'lucide-react'
import { Star, Squiggle, Dots, Burst } from '@/components/marketing/Decor'
import { FAMILY_TOOLS, type FamilyTool, type FamilyToolKey } from '@/lib/family-tools'
import { ToolShowcase, type ShowcaseItem } from '@/components/marketing/ToolShowcase'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/care-tools', META)
}

const META: Metadata = {
  title: 'Care Tools & Technology | Family Tools, Availability & Accessibility | TRG Digital',
  description:
    'Our proprietary care tools for your website: funding calculators, NHS Continuing Healthcare and Funded Nursing Care checkers, a local-council guide, live room availability and built-in accessibility, gateway tools that grow your traffic and enquiries.',
  alternates: { canonical: `${SITE_URL}/care-tools` },
  robots: { index: true, follow: true },
}

// Category order + an icon for each, used to group the family tools.
const CATEGORIES: { name: FamilyTool['category']; Icon: typeof Calculator; blurb: string }[] = [
  { name: 'Funding', Icon: Calculator, blurb: 'The questions every family asks first about paying for care.' },
  { name: 'NHS & nursing', Icon: HeartPulse, blurb: 'When the NHS may pay towards nursing or the full cost of care.' },
  { name: 'Benefits', Icon: HandCoins, blurb: 'Support families may be entitled to but never claim.' },
  { name: 'Local support', Icon: Landmark, blurb: 'The right council, and what it pays towards care.' },
  { name: 'Health & wellbeing', Icon: Brain, blurb: 'Everyday wellbeing checks that help families notice changes early.' },
]

// Three-step "how it works" for each tool, shown under its screenshot.
const HOW: Record<FamilyToolKey, string[]> = {
  funding: [
    'Pick your UK nation and answer a few short questions',
    'See the weekly split between you, the council and the NHS',
    'Get pointed to Deferred Payment if the home is the main asset',
  ],
  dpa: [
    'Enter the property value, savings and weekly fee',
    'See how much of the cost could be deferred',
    'Watch how the debt grows at the national interest rate',
  ],
  fnc: [
    'Answer a couple of questions about nursing needs',
    'See if FNC is likely and the current weekly NHS rate',
    'Learn the next steps and how it links to a CHC assessment',
  ],
  'chc-checker': [
    'Screen across the NHS Continuing Healthcare care domains',
    'See whether a full CHC assessment is likely to be warranted',
    'Understand where the NHS can fund 100% of care costs',
  ],
  'chc-dst': [
    'Read a plain-English guide to the 12 CHC care domains',
    'See the severity levels used for each one',
    'Know what evidence the assessment team looks for',
  ],
  'attendance-allowance': [
    'Answer five quick eligibility questions',
    'See if a claim is likely, and at which weekly rate',
    'Get the next steps to make a claim',
  ],
  'la-lookup': [
    'The family sees their own local council and its team',
    'Direct links to the council pages families ask about most',
    'The capital thresholds that decide council support',
  ],
  'dementia-signs': [
    'Answer eight questions about changes over recent years',
    'See whether it is worth speaking to a GP',
    'Get Alzheimer’s Society and NHS support links',
  ],
  'care-checklist': [
    'Eight gentle questions about how a loved one is coping',
    'A warm, banded suggestion on whether more support would help',
    'A no-pressure invitation to talk it through with the home',
  ],
  'cost-estimator': [
    'Pick the care type and adjust the guide weekly fee',
    'Add savings, property and Attendance Allowance',
    'See the weekly, monthly and yearly cost, and who is likely to pay',
  ],
  'book-visit': [
    'The family picks a preferred date and time',
    'The request lands in your admin and inbox as an enquiry',
    'You confirm the visit by phone or email',
  ],
  'funding-guide': [
    'The family answers a short needs-and-funding check',
    'They receive a branded “your care options” PDF by email',
    'You capture a warm, high-intent enquiry',
  ],
}

// Why each tool earns its place on a client's site (owner-facing benefit chips).
const POINTS: Record<FamilyToolKey, string[]> = {
  funding: ['Ranks for “who pays for care”', 'All four UK nations', 'Flags Deferred Payment'],
  dpa: ['Answers “must we sell the house?”', 'Shows the real deferred figure', 'Turns worry into an enquiry'],
  fnc: ['Speaks to nursing enquiries', 'Shows the live NHS rate', 'Leads into CHC'],
  'chc-checker': ['Captures families chasing NHS funding', 'Screens the real CHC domains', 'High-intent visitors'],
  'chc-dst': ['Positions you as the expert', 'Demystifies the assessment', 'Adds real SEO depth'],
  'attendance-allowance': ['A benefit most families miss', 'Quick, satisfying result', 'Broad over-66 appeal'],
  'la-lookup': ['Localised to each visitor’s council', 'The links families actually need', 'Keeps them on your site'],
  'dementia-signs': ['Reaches families at the first worry', 'Sensitive and genuinely useful', 'Ideal for dementia care'],
  'care-checklist': ['Meets families at the “is it time?” moment', 'Gentle, private, no pressure', 'Opens the first conversation'],
  'cost-estimator': ['Answers “what will it cost?” honestly', 'Families use their own quote', 'High-intent results capture'],
  'book-visit': ['Turns interest into booked tours', 'Requests land as enquiries', 'No phone tag'],
  'funding-guide': ['Emails a branded options PDF', 'Captures a warm, named lead', 'Makes you the trusted guide'],
}

// Why each tool converts, and what sets it apart (shown per tool in the showcase).
const WHY: Record<FamilyToolKey, string> = {
  funding: 'Funding is the first and biggest question every family has, and most homes never answer it. Being the site that does makes you the one they trust and contact.',
  dpa: '“Do we have to sell the house?” stops many families in their tracks. Answering it head-on removes the single biggest fear that delays a move-in.',
  fnc: 'Nursing families worry most about cost. Showing the NHS contribution up front reassures them and opens the conversation on your terms.',
  'chc-checker': 'CHC can fund 100% of care, so families chasing it are highly motivated. Meeting them at that exact moment captures serious, high-value intent.',
  'chc-dst': 'The assessment is daunting and badly explained everywhere else. Making it clear positions you as the expert adviser families lean on.',
  'attendance-allowance': 'It is money most families are entitled to but never claim. Handing them that win builds instant goodwill toward your home.',
  'la-lookup': 'Families do not know their own council’s rules. Give them the exact team, links and thresholds and they stay, and engage, on your site.',
  'dementia-signs': 'It reaches families at the very first worry, long before they search for a home, so you are there the moment the journey begins.',
  'care-checklist': 'Families agonise privately over whether it is time for care. A gentle, structured check gives them clarity, and gives you the first conversation.',
  'cost-estimator': 'Cost is the question families are most afraid to ask. Answering it openly, with their own numbers, builds the trust that wins the enquiry.',
  'book-visit': 'A visit is the single biggest step toward a move-in. Removing every scrap of friction from booking one directly grows admissions.',
  'funding-guide': 'A personalised, branded PDF is worth giving an email address for, so it captures warm, named enquiries the other tools cannot.',
}

const UNIQUE: Record<FamilyToolKey, string> = {
  funding: 'It covers all four UK nations and models the real means test, so families get a genuine, personalised split, not a generic article.',
  dpa: 'It shows the real deferred figure and how the debt grows using the live national interest rate, not vague reassurance.',
  fnc: 'It ties FNC to the wider CHC picture, so families understand the whole nursing-funding journey in one place.',
  'chc-checker': 'It screens the actual CHC care domains rather than offering a vague “you might qualify”, so the result feels credible.',
  'chc-dst': 'A plain-English walk through all 12 domains and severity levels, the kind of depth that also earns you search rankings.',
  'attendance-allowance': 'A genuinely quick, satisfying check with a real weekly figure, including the terminal-illness fast-track most tools miss.',
  'la-lookup': 'It localises to each visitor’s own council automatically, with the direct pages they need, not a one-size-fits-all overview.',
  'dementia-signs': 'It is built on the clinically recognised AD8 screen, so it is genuinely helpful and sensitive, never a gimmick.',
  'care-checklist': 'It bands eight everyday signals into a warm, honest suggestion, written for worried adult children, not clinicians.',
  'cost-estimator': 'It combines the England means test, Attendance Allowance and the family’s own fee quote into one clear weekly figure.',
  'book-visit': 'Requests arrive with a preferred date, time and party size, so confirming a tour takes one call instead of five.',
  'funding-guide': 'It blends a needs check, an indicative cost and your live CQC rating into one tailored document, branded entirely as you.',
}

// la-lookup needs a real council to render, so preview it on a live client site.
const PREVIEW_SITE: Partial<Record<FamilyToolKey, string>> = { 'la-lookup': 'crossways' }

// Ordered, self-contained data for the scrolling showcase (grouped by category).
const CATEGORY_ORDER = CATEGORIES.map((c) => c.name)
const SHOWCASE: ShowcaseItem[] = [...FAMILY_TOOLS]
  .sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category))
  .map((t) => ({
    key: t.key,
    name: t.name,
    category: t.category,
    nursing: !!t.nursingRelevant,
    blurb: t.blurb,
    how: HOW[t.key] ?? [],
    points: POINTS[t.key] ?? [],
    why: WHY[t.key],
    unique: UNIQUE[t.key],
    site: PREVIEW_SITE[t.key],
  }))

const HERO_POINTS = ['Built for families', 'Exclusive to our clients', 'More traffic, more enquiries']

const WHY_POINTS = [
  'Rank for high-intent care searches',
  'Turn researchers into enquiries',
  'Every tool can capture a callback',
  'Branded in your colours & logo',
  'Live room availability built in',
  'Accessible to every family',
]

export default function CareToolsPage() {
  return (
    <>
      {/* JSON-LD, Service */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Care Tools & Technology',
            provider: { '@type': 'Organization', name: 'TRG Digital', url: SITE_URL },
            areaServed: 'GB',
            description:
              'Proprietary family care tools, live room availability and built-in accessibility, added to care provider websites to grow traffic and enquiries.',
          }),
        }}
      />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-16">
        <Star className="absolute left-4 top-10 hidden h-16 w-16 -rotate-12 text-brand-accent lg:block" />
        <Star className="absolute right-8 bottom-12 hidden h-12 w-12 rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Proprietary Technology</p>
            <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
              Tools families come for, <span className="text-brand-pop">enquiries</span> you keep
            </h1>
            <Squiggle className="mt-5 h-6 w-56 text-brand-pop" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-brand-ink-soft">
              We have built our own suite of easy care tools, funding calculators, NHS checkers and a
              local-council guide, plus live room availability and built-in accessibility. We add them to your
              website, so the families already searching for these answers find them on your site, use them, and
              become enquiries. It is technology we developed ourselves, and it is exclusive to our clients.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="btn-pop">
                Add these to your site
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
              <Link href="/website-development" className="btn-cta-outline">
                See website development
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-brand-ink-soft">
              {HERO_POINTS.map((p) => (
                <span key={p} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" />
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Visual, a branded tool + live availability + enquiry lift */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
              <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="h-2 w-2 rounded-full bg-amber-300" />
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">yourcarehome.co.uk</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-pop/10"><Calculator className="h-4 w-4 text-brand-pop" /></span>
                  <p className="font-display text-sm font-bold text-brand-ink">Care funding calculator</p>
                </div>
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-brand-ink-muted">Estimated weekly cost</p>
                <div className="mt-2 flex h-3 overflow-hidden rounded-full">
                  <span className="bg-brand-pop" style={{ width: '38%' }} />
                  <span className="bg-brand-accent" style={{ width: '50%' }} />
                  <span className="bg-green-500" style={{ width: '12%' }} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div><p className="font-display text-sm font-bold text-brand-ink">£318</p><p className="text-[10px] text-brand-ink-muted">You</p></div>
                  <div><p className="font-display text-sm font-bold text-brand-ink">£402</p><p className="text-[10px] text-brand-ink-muted">Council</p></div>
                  <div><p className="font-display text-sm font-bold text-brand-ink">£236</p><p className="text-[10px] text-brand-ink-muted">NHS (FNC)</p></div>
                </div>
                <div className="mt-4 rounded-lg bg-brand-ink px-3 py-2 text-center text-[11px] font-semibold text-white">Request a callback</div>
              </div>
            </div>

            {/* Live availability badge */}
            <div className="absolute -top-5 -right-4 hidden rounded-full border border-green-300 bg-green-50 px-3.5 py-1.5 text-sm font-semibold text-green-800 shadow-card sm:flex sm:items-center sm:gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              3 rooms available
            </div>

            {/* Enquiry lift */}
            <div className="absolute -bottom-6 -left-6 hidden w-48 rounded-xl border border-brand-line bg-white p-4 shadow-card sm:block">
              <p className="text-[11px] font-medium text-brand-ink-muted">Enquiries · since launch</p>
              <p className="mt-1 font-display text-2xl font-bold text-brand-ink">+34%</p>
              <svg viewBox="0 0 120 36" className="mt-2 w-full" preserveAspectRatio="none">
                <path d="M0,32 L24,29 L48,21 L72,17 L96,8 L120,4" fill="none" stroke="#34A853" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── The toolkit (grouped by category) ─────────────────────────── */}
      <section className="relative bg-brand-bg-warm px-6 py-24">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">The family toolkit</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              The tools we add to your site
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">
              Every one answers a question families are already typing into Google. They find it on your website,
              use it, and reach out, all branded in your colours.
            </p>
          </div>

          <ToolShowcase items={SHOWCASE} />
        </div>
      </section>

      {/* ── Why it works (two-column benefit) ─────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-10 top-12 hidden h-16 w-16 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              Gateway tools that bring families in
            </h2>
            <p className="mt-4 font-display text-lg font-semibold text-brand-pop">Be the site that actually helps.</p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-brand-ink-soft">
              <p>
                Families spend weeks researching care before they ever pick up the phone, working out who pays,
                whether the NHS contributes, what their council will do. When the tool that answers that question
                lives on your website, you become the home they trust, and the home they contact.
              </p>
              <p>
                These tools pull in new, high-intent search traffic and turn quiet researchers into real enquiries.
                Pair them with live room availability, so families can see you have space the moment they land, and
                you have a website that works to fill beds around the clock.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {WHY_POINTS.map((point) => (
              <div key={point} className="flex items-center gap-4 rounded-xl bg-brand-ink px-5 py-4 text-white">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-pop">
                  <Check className="h-4 w-4 text-white" />
                </span>
                <span className="font-display text-sm font-semibold uppercase tracking-wide">{point}</span>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-accent p-7">
              <p className="font-display text-xl font-bold uppercase leading-tight tracking-tight text-brand-ink">
                Want these on your website?
              </p>
              <Link href="/contact" className="btn-pop mt-5">
                Talk to us
                <span className="btn-arrow" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Availability + Accessibility feature blocks ───────────────── */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
        <Squiggle className="absolute -left-6 top-16 hidden h-8 w-64 text-brand-accent lg:block" />
        <Dots className="absolute bottom-12 right-10 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">More than tools</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
              Built to convert, built for everyone
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-brand-line bg-white p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10">
                <BedDouble className="h-6 w-6 text-brand-pop" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-brand-ink">Live room availability</h3>
              <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
                Show families you have space the moment they arrive. A live availability badge updates the instant a
                room frees up, and you keep it current in seconds. Families enquire when they can see you can help,
                so showing real availability drives more enquiries.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-300 bg-green-50 px-3.5 py-1.5 text-sm font-semibold text-green-800">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Rooms available now
              </div>
            </div>

            <div className="rounded-2xl border border-brand-line bg-white p-8 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-pop/10">
                <Accessibility className="h-6 w-6 text-brand-pop" />
              </div>
              <h3 className="mt-5 font-display text-xl font-semibold text-brand-ink">Built-in accessibility</h3>
              <p className="mt-3 text-base leading-relaxed text-brand-ink-soft">
                Care is chosen by older families, and by people with their own access needs. Everything we add is
                built to be used by everyone, larger text, high contrast, readable fonts and full keyboard and
                screen-reader support, so no family is shut out, and your site earns trust the moment they land.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {['Larger text', 'High contrast', 'Readable fonts', 'Screen-reader ready'].map((f) => (
                  <span key={f} className="rounded-full bg-brand-bg-warm px-3 py-1 text-xs font-semibold text-brand-ink-soft">{f}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Proprietary trust line */}
          <div className="mt-10 flex items-start gap-4 rounded-2xl border border-brand-line bg-white p-7">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-brand-accent/30"><Sparkles className="h-6 w-6 text-brand-ink" /></span>
            <p className="text-base leading-relaxed text-brand-ink-soft">
              <span className="font-semibold text-brand-ink">All of this is our own technology,</span> developed in
              house for the care sector and available only to TRG Digital clients. You will not find the same toolkit
              anywhere else, which keeps you a step ahead of the homes you compete with.
            </p>
          </div>
        </div>
      </section>

      {/* ── The pop in action ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24">
        <Star className="absolute right-6 top-12 hidden h-14 w-14 rotate-12 text-brand-accent lg:block" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          {/* Image left, the real pop over a client site */}
          <div className="order-2 lg:order-1">
            <ManagedImage
              src="/mockups/pop-in-action.jpg"
              width={1999}
              height={1189}
              alt="Our lead-capture pop-up shown over a care home website, with live room availability and a short set of questions"
              sizes="(max-width:1024px) 100vw, 50vw"
              className="h-auto w-full rounded-2xl border border-brand-line shadow-card"
            />
          </div>

          {/* Text right */}
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">Lead-capture technology</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-brand-ink sm:text-4xl">
              The pop that turns visitors into enquiries
            </h2>
            <p className="mt-5 text-base leading-relaxed text-brand-ink-soft">
              Most visitors leave without making contact. At exactly the right moment, our pop appears over your
              site, a couple of friendly questions, your live room availability and a photo of your home, and turns
              a browsing visitor into a named enquiry, straight to your inbox.
            </p>
            <div className="mt-7 space-y-5">
              {[
                { Icon: MousePointerClick, t: 'Shows at the right moment', b: 'Exit-intent, scroll-depth or time on page, never an intrusive mobile pop on load.' },
                { Icon: BedDouble, t: 'Your live availability', b: 'The same rooms-available figure you keep up to date, right inside the pop.' },
                { Icon: Accessibility, t: 'Accessible & on-brand', b: 'Honours your accessibility settings and uses your logo, colours and photos.' },
              ].map(({ Icon, t, b }) => (
                <div key={t} className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-pop/10">
                    <Icon className="h-5 w-5 text-brand-pop" />
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold text-brand-ink">{t}</h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-brand-ink-soft">{b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-pop px-6 py-16 text-center text-white">
        <Star className="absolute left-8 top-8 hidden h-16 w-16 text-white/50 sm:block" />
        <Star className="absolute bottom-8 right-8 hidden h-10 w-10 text-brand-accent sm:block" />
        <Burst className="absolute -bottom-10 right-1/4 hidden h-40 w-40 text-white/15 sm:block" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight sm:text-4xl">
            <TrendingUp className="mb-3 inline h-8 w-8" /><br />
            Turn searching families into enquiries
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            We will add our care tools, live availability and accessibility to your website, branded as yours, and
            built to grow your traffic and fill your beds.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn-cta">
              Add these to your site
              <span className="btn-arrow" aria-hidden>→</span>
            </Link>
            <Link href="/website-development" className="inline-flex h-12 items-center gap-1 px-6 text-sm font-semibold uppercase tracking-wide text-white/90 transition-colors hover:text-white">
              See website development →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
