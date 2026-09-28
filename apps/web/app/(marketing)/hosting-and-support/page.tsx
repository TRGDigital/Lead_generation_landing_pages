import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Accessibility,
  BedDouble,
  Bell,
  Calculator,
  Check,
  FileText,
  Globe,
  KeyRound,
  LayoutDashboard,
  Lock,
  MessageCircle,
  MessageSquare,
  MousePointerClick,
  Phone,
  Search,
  Signpost, DatabaseBackup
} from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { FAMILY_TOOLS } from '@/lib/family-tools'
import { CountyHero, EndCta, Faqs, FaqJsonLd } from '@/components/marketing/county/CountySections'
import { Dots, Star } from '@/components/marketing/Decor'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'

// What ongoing care of a TRG-built site includes. Every item here maps to something the
// platform actually runs (see the per-site settings in lib/websites.ts, the embeds in
// public/*.js, the client-site admin console and the monthly summary cron). No prices on
// this site, and no uptime figures or response times we cannot evidence. Daily backups confirmed by Len, 28 Sept 2026.

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/hosting-and-support'

const linkClass = 'font-semibold text-brand-pop underline underline-offset-2'

// Public family tools only: hidden ones are built but not yet offered.
const PUBLIC_TOOL_COUNT = FAMILY_TOOLS.filter((t) => !t.hidden && !t.standalone).length

// The hero card: an example of what is running on a client site. Statuses, not numbers,
// so it never implies results we have not measured.
const RUNNING: { label: string; state: string; tone: 'on' | 'info' }[] = [
  { label: 'Website hosting', state: 'Live, HTTPS', tone: 'on' },
  { label: 'Your admin login', state: 'Active', tone: 'on' },
  { label: 'Enquiry pop-up', state: 'On', tone: 'on' },
  { label: 'Care tools on your site', state: 'Your choice', tone: 'info' },
  { label: 'Room availability', state: 'Updated by you', tone: 'info' },
  { label: 'Monthly results email', state: '1st of the month', tone: 'info' },
]

function RunningCard() {
  return (
    <div className="rounded-3xl border-2 border-brand-ink bg-white p-4 shadow-[6px_6px_0_0_#2a2620] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">Example site</p>
      <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">
        What keeps running after launch
      </p>
      <ul className="mt-4 divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line">
        {RUNNING.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
            <span className="text-sm font-semibold text-brand-ink">{r.label}</span>
            <span
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                r.tone === 'on' ? 'bg-brand-pop/10 text-brand-pop' : 'bg-brand-bg-warm text-brand-ink-soft'
              }`}
            >
              {r.tone === 'on' && <span className="h-1.5 w-1.5 rounded-full bg-brand-pop" aria-hidden />}
              {r.state}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">
        An illustration of one client site. Which tools are switched on is decided site by site.
      </p>
    </div>
  )
}

type Card = { Icon: typeof Globe; title: string; body: React.ReactNode }

function CardGrid({ cards, cols = 3 }: { cards: Card[]; cols?: 2 | 3 }) {
  return (
    <div className={`mt-8 grid gap-5 sm:grid-cols-2 ${cols === 3 ? 'lg:grid-cols-3' : ''}`}>
      {cards.map(({ Icon, title, body }) => (
        <div key={title} className="rounded-2xl border-2 border-brand-ink bg-white p-5 shadow-[6px_6px_0_0_#2a2620]">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-pop/10 text-brand-pop">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="mt-4 font-display text-base font-bold uppercase tracking-wide text-brand-ink">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">{body}</p>
        </div>
      ))}
    </div>
  )
}

function SectionHead({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: React.ReactNode }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight text-brand-ink sm:text-3xl">{title}</h2>
      <div className="mt-3 space-y-3 text-base leading-relaxed text-brand-ink-soft">{intro}</div>
    </div>
  )
}

const LOOKED_AFTER: Card[] = [
  {
    Icon: Globe,
    title: 'Hosting',
    body: 'Your site is hosted for you on Vercel, the platform behind Next.js, the same set up this website runs on. There is no server for you to rent, renew or look after.',
  },
  {
    Icon: Lock,
    title: 'Security certificate',
    body: 'Every page is served over HTTPS with a security certificate, so families see the padlock and forms are sent securely.',
  },
  {
    Icon: Signpost,
    title: 'Redirects kept in order',
    body: 'Old addresses are redirected when the site launches so you keep your rankings, and new redirects can be added from the admin whenever a page moves.',
  },
  {
    Icon: Search,
    title: 'Found in search',
    body: 'The sitemap, robots.txt and the files written for AI assistants are generated automatically, so new pages, posts and vacancies are picked up without anyone remembering to do it.',
  },
  {
    Icon: DatabaseBackup,
    title: 'Daily backups',
    body: 'Your site and its content are backed up every day, so a mistake or a bad edit can be put right.',
  },
  {
    Icon: Bell,
    title: 'Watched after launch',
    body: 'Once the domain is switched over we submit the sitemap to Google and keep an eye on Search Console and analytics, rather than handing over and walking away.',
  },
  {
    Icon: KeyRound,
    title: 'Kept up to date',
    body: (
      <>
        We keep the systems your site runs on patched and up to date, as set out in{' '}
        <Link href="/our-commitment" className={linkClass}>
          our commitment
        </Link>
        .
      </>
    ),
  },
]

const DASHBOARD: { title: string; body: string }[] = [
  { title: 'Enquiries', body: 'Every enquiry sent through your website forms, with a status you update as you follow up.' },
  { title: 'Pages', body: 'Edit the words on your main pages yourself, along with their titles and descriptions for Google.' },
  { title: 'Blog posts and authors', body: 'Write, edit and publish articles, credited to real people on your team.' },
  { title: 'Jobs', body: 'Add, edit and close the vacancies shown on your careers page.' },
  { title: 'Photos and gallery', body: 'Upload and caption photos, and describe each image for screen readers and search engines.' },
  { title: 'Reviews', body: 'Choose the family reviews shown on your site and link out to where they were left.' },
  { title: 'Town and service pages', body: 'Manage the pages for the towns and types of care you cover, with AI assisted drafting you review before publishing.' },
  { title: 'Logins for your team', body: 'A login for each person who needs one, with a main account that can add and remove users.' },
]

const TOOLS: Card[] = [
  {
    Icon: MousePointerClick,
    title: 'Enquiry pop-up',
    body: 'A gentle pop-up that appears when a visitor is about to leave or has scrolled far enough, in your colours, with optional short questions. You decide which pages, which devices and how often it shows.',
  },
  {
    Icon: Calculator,
    title: 'Family care tools',
    body: (
      <>
        {PUBLIC_TOOL_COUNT} calculators and guides families use when weighing up care, from funding and Attendance
        Allowance to NHS Continuing Healthcare, branded as yours. See them on{' '}
        <Link href="/care-tools" className={linkClass}>
          our care tools page
        </Link>
        .
      </>
    ),
  },
  {
    Icon: BedDouble,
    title: 'Room availability',
    body: 'A live availability badge on your site. You update it from a private link on your phone, no login needed, and the change shows straight away.',
  },
  {
    Icon: Phone,
    title: 'Click to call bar',
    body: 'A sticky call button so families can phone you in one tap. Set your opening hours, and it can offer a call back request too, including when you are closed.',
  },
  {
    Icon: Accessibility,
    title: 'Accessibility toolbar',
    body: 'Visitors can enlarge text, switch to high contrast, use a more readable font, highlight links, enlarge the cursor and stop animations, and their choices are remembered.',
  },
  {
    Icon: MessageCircle,
    title: 'AI care assistant',
    body: 'A chat window that answers families from your own content and the facts you give us, and offers a call back when a question needs a person.',
  },
]

const FAQS: [string, string][] = [
  [
    'What happens after my website goes live?',
    'We switch your domain over, submit your sitemap to Google and keep watching Search Console and analytics. Your site stays hosted by us, served over HTTPS, and you have your own admin login to keep it up to date. Enquiries from the pop-up, care tools and call back requests are emailed to you, and a short results email arrives on the first of each month.',
  ],
  [
    'Do I need to be technical to update my site?',
    'No. The admin is built for care teams. You can edit page wording, publish blog posts, add and close jobs, upload photos, choose reviews and follow up enquiries without touching any code. Anything you would rather not do yourself, just ask us.',
  ],
  [
    'How do I ask for a change?',
    'Talk to us directly by phone or email, or raise it at one of our regular review calls. You deal with the people who built your site, not a ticket queue or a stranger.',
  ],
  [
    'Can I update room availability myself?',
    'Yes. You get a private link that opens a simple form on your phone. Choose whether you have rooms available, limited availability or are full, add a note if you like, and the badge on your site updates straight away. Keep the link private, as anyone with it can make the change.',
  ],
  [
    'Which tools can I have on my site?',
    'The enquiry pop-up, the family care tools, the room availability badge, the click to call bar, the accessibility toolbar and the AI care assistant are each switched on for your site when you want them. You can have one, several or none, and change your mind later.',
  ],
  [
    'Who owns the domain and the content?',
    'You do. The domain stays in your name, the content and your data are yours, and Google Analytics, Tag Manager and Search Console are set up under your own email addresses. Our content management system is our own technology, so the system itself cannot be copied to another website.',
  ],
  [
    'How is enquiry data looked after?',
    'We are registered with the Information Commissioner’s Office and handle personal data in line with UK GDPR. Data is held on secure cloud infrastructure, encrypted in transit and at rest, and access is limited to the people who need it. Our data protection page has the detail.',
  ],
]

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, {
    title: 'Hosting and Support for Care Provider Websites',
    description:
      'What happens after your care website launches: hosting, your own admin, family tools, enquiry alerts and a monthly results email, looked after for you.',
    alternates: { canonical: `${SITE_URL}${PATH}` },
    robots: { index: true, follow: true },
  })
}

export default function HostingAndSupportPage() {
  return (
    <main>
      <Breadcrumbs trail={[['Hosting and support', PATH]]} />
      <FaqJsonLd faqs={FAQS} />

      <CountyHero
        eyebrow="Hosting and support"
        before="What happens"
        highlight="after launch"
        intro={
          <>
            <p>
              A care website is not finished the day it goes live. Families keep searching, vacancies change, rooms fill
              and free up, and enquiries need to reach the right person quickly.
            </p>
            <p>
              Here is what we keep running for every site we build, what you can manage yourself, and the tools we can
              switch on when you want them.
            </p>
          </>
        }
        points={['Hosted and served over HTTPS', 'Your own admin login', 'A direct line to the team']}
        primary={{ label: 'Start your new website', href: '/start-building-your-new-website' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
        mock={<RunningCard />}
      />

      {/* What is looked after for you */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-14">
        <Dots className="absolute right-10 top-12 hidden h-20 w-20 text-brand-pop/40 lg:block" />
        <div className="mx-auto max-w-5xl">
          <SectionHead
            eyebrow="Included"
            title="What is looked after for you"
            intro={
              <p>
                The technical side of keeping a website online is ours to worry about. This is what that covers for every
                site we build.
              </p>
            }
          />
          <CardGrid cards={LOOKED_AFTER} />
        </div>
      </section>

      {/* Your dashboard */}
      <section className="px-6 py-14">
        <div className="mx-auto grid max-w-5xl items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-24">
            <SectionHead
              eyebrow="Your dashboard"
              title="Your own admin, built for care teams"
              intro={
                <>
                  <p>
                    Every site comes with its own content management system, with a login for each person on your team.
                    Day to day changes are yours to make whenever you like, without waiting for us.
                  </p>
                  <p>
                    Enquiries from our pop-up, care tools and call back requests are also emailed to your named contact as
                    they arrive, showing how each one came in and any answers the family gave.
                  </p>
                </>
              }
            />
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-brand-bg-warm p-5">
              <LayoutDashboard className="mt-0.5 h-5 w-5 shrink-0 text-brand-pop" aria-hidden />
              <p className="text-sm leading-relaxed text-brand-ink-soft">
                If we also run paid campaigns for you, a separate enquiries portal lets you track each enquiry from first
                contact to move in, and pause the campaign yourself.{' '}
                <Link href="/how-it-works" className={linkClass}>
                  How campaigns work
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="rounded-3xl border-2 border-brand-ink bg-white p-5 shadow-[6px_6px_0_0_#2a2620] sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">In your admin</p>
            <ul className="mt-3 divide-y divide-brand-line">
              {DASHBOARD.map((d) => (
                <li key={d.title} className="flex items-start gap-3 py-3.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-pop" aria-hidden />
                  <div>
                    <p className="text-sm font-bold text-brand-ink">{d.title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-brand-ink-soft">{d.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tools that keep working for you */}
      <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-14">
        <Star className="absolute left-6 top-10 hidden h-14 w-14 -rotate-12 text-brand-pop/60 lg:block" />
        <div className="mx-auto max-w-5xl">
          <SectionHead
            eyebrow="Switched on when you want them"
            title="Tools that keep working for you"
            intro={
              <p>
                These run from our platform and sit on your site with one line of code. Each one is switched on for your
                site when you want it, set up in your colours, and changed or switched off later without a rebuild.
              </p>
            }
          />
          <CardGrid cards={TOOLS} />
          <div className="mt-8 flex items-start gap-3 rounded-2xl border-2 border-brand-pop/30 bg-white p-5">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-pop" aria-hidden />
            <p className="text-sm leading-relaxed text-brand-ink-soft">
              <span className="font-bold text-brand-ink">A results email on the 1st of each month.</span> A short summary
              of the enquiries your site brought in the month before, split into pop-up enquiries, care tool enquiries,
              call back requests and taps on your phone number, so you can see what the tools are doing.
            </p>
          </div>
        </div>
      </section>

      {/* Changes and updates */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <SectionHead
            eyebrow="Changes and updates"
            title="Asking for a change"
            intro={
              <p>
                Plenty you can do in the admin yourself. For anything else, you talk to the people who built your site.
              </p>
            }
          />
          <CardGrid
            cols={3}
            cards={[
              {
                Icon: MessageSquare,
                title: 'A direct line',
                body: 'Phone or email the founder and the team directly. No account managers passing you along, and no project handed to a stranger.',
              },
              {
                Icon: Bell,
                title: 'We check in',
                body: 'We review progress and results with you regularly and ask what is working, rather than waiting for a problem to surface.',
              },
              {
                Icon: Check,
                title: 'We put things right',
                body: 'If something falls short we own it and fix it, at our cost where the fault is ours, and tell you honestly what happened.',
              },
            ]}
          />
          <p className="mt-6 text-sm text-brand-ink-soft">
            The full set of promises is on{' '}
            <Link href="/our-commitment" className={linkClass}>
              our commitment page
            </Link>
            .
          </p>
        </div>
      </section>

      {/* You own it */}
      <section className="bg-brand-ink px-6 py-14 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">You own it</p>
          <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            Your domain, your content, your accounts
          </h2>
          <ul className="mt-6 space-y-3">
            {[
              'The domain stays registered in your name.',
              'The website content and your data are yours.',
              'Google Analytics, Tag Manager and Search Console are set up under your own email addresses, with us added as an admin user.',
              'Our content management system is our own technology, so the system itself cannot be copied or reused for another website.',
            ].map((s) => (
              <li key={s} className="flex items-start gap-3 text-base leading-relaxed text-white/85">
                <Check className="mt-1 h-4 w-4 shrink-0 text-brand-pop" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-white/60">
            How family and enquiry data is handled is set out on our{' '}
            <Link href="/data-protection" className="font-semibold text-brand-accent underline-offset-2 hover:underline">
              data protection page
            </Link>
            .
          </p>
        </div>
      </section>

      <Faqs heading="Questions about hosting and support" faqs={FAQS} />

      <EndCta
        title="Ready for a site that keeps working?"
        body="Tell us about your service and we will show you what we would build, and what we would keep running for you after launch."
        primary={{ label: 'Start your new website', href: '/start-building-your-new-website' }}
        secondary={{ label: 'Talk to us', href: '/contact' }}
      />
    </main>
  )
}
