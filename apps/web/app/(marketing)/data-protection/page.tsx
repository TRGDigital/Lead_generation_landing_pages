import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Database, Lock, Mail } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { CountyHero, EndCta, FaqJsonLd, Faqs, Included, Prose } from '@/components/marketing/county/CountySections'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'

// Trust page for care buyers: how enquiry data is handled on the websites and tools TRG runs.
// Every statement here was checked against the code, config or live database settings
// (see the notes beside each section). Do not add claims that cannot be checked the same way:
// no certifications or pen tests until they are supplied. ICO number and daily backups confirmed 28 Sept.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'
const PATH = '/data-protection'

const linkClass = 'font-semibold text-brand-pop underline underline-offset-2'

// Hero illustration: the route an enquiry takes. Static, no motion.
const JOURNEY: { icon: typeof Mail; title: string; body: string }[] = [
  { icon: Database, title: 'Saved in London', body: 'Stored in our database in the London (eu-west-2) region' },
  { icon: Mail, title: 'Sent to you', body: 'Emailed to the address you give us, with a copy to TRG' },
  { icon: Lock, title: 'Locked down', body: 'Row level security on every table, admin area behind sign in' },
  { icon: Clock, title: 'Not kept forever', body: 'Client portal enquiries anonymised after 24 months' },
]

function JourneyCard() {
  return (
    <div className="rounded-3xl border-2 border-brand-ink bg-white p-4 shadow-[6px_6px_0_0_#2a2620] sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-ink-muted">One enquiry</p>
      <p className="mt-1 font-display text-lg font-bold uppercase tracking-tight text-brand-ink">Where it goes</p>
      <ol className="mt-4 divide-y divide-brand-line overflow-hidden rounded-2xl border border-brand-line">
        {JOURNEY.map((s) => (
          <li key={s.title} className="flex items-start gap-3 px-3 py-3 sm:px-4">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-bg-warm text-brand-pop">
              <s.icon className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-brand-ink">{s.title}</p>
              <p className="mt-0.5 text-sm leading-snug text-brand-ink-soft">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm leading-relaxed text-brand-ink-soft">
        Families often share a relative&rsquo;s health details in an enquiry. This is the route it takes.
      </p>
    </div>
  )
}

const FAQS: [string, string][] = [
  [
    'Where is enquiry data stored?',
    'Enquiries are saved in our Supabase database, which is hosted in the eu-west-2 region in London, and the server code that receives a form runs in Vercel\'s London region, so an enquiry is processed and stored in the UK. The database is backed up daily.',
  ],
  [
    'Can other care providers see our enquiries?',
    'No. Enquiries from your website are emailed to the address you give us, with a copy to TRG. In our client portal, database rules mean each signed in user only sees enquiries for the homes assigned to their own account.',
  ],
  [
    'Does the dementia signs check store what families enter?',
    'No. The check works in the visitor\'s browser and nothing entered is stored. If a family chooses to ask for a call back at the end, only their name, email, phone number, contact tick box and the page they were on are sent. Their answers to the check are never sent.',
  ],
  [
    'Is the text I paste into the review reply helper or job advert checker saved?',
    'The text is sent to Anthropic\'s Claude model to write the draft, and the draft is sent back to you. We do not save the pasted review or advert in our database. Reviews that mention a safeguarding concern are never sent to the AI at all.',
  ],
  [
    'How long do you keep enquiries?',
    'Enquiries in our client portal are anonymised automatically once they are 24 months old. A nightly job removes the name, email, phone number, message, notes, resident name, IP address and browser details.',
  ],
  [
    'Do your embedded tools set cookies on our website?',
    'Our cookie banner, Google tag and Microsoft Clarity do not load when one of our tools is embedded on your website, so the tool does not add our analytics to your pages.',
  ],
]

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo(PATH, {
    title: 'Data Protection and Security for Care Websites',
    description:
      'How TRG Digital handles enquiry data on care websites: stored in London, seen only by you and us, tools that keep nothing, and cookies only with consent.',
    alternates: { canonical: `${SITE_URL}${PATH}` },
  })
}

export default function DataProtectionPage() {
  return (
    <main>
      <Breadcrumbs trail={[['Data protection', PATH]]} />
      <FaqJsonLd faqs={FAQS} />

      <CountyHero
        eyebrow="Data protection"
        before="Data protection and security for"
        highlight="care websites"
        intro={
          <>
            <p>
              When a family enquires about care, they often tell you about a relative&rsquo;s health. Under UK GDPR that is
              special category data, and you are right to ask how it is handled before you choose a website provider.
            </p>
            <p>
              This page explains, in plain English, where enquiries go on the websites and tools we run, who can see them,
              and what our tools and AI features do and do not keep.
            </p>
          </>
        }
        points={['Stored in London', 'Seen by you and us only', 'Tools that keep nothing']}
        primary={{ label: 'Ask us a question', href: '/contact' }}
        secondary={{ label: 'Privacy policy', href: '/privacy' }}
        mock={<JourneyCard />}
      />

      <Prose
        sections={[
          {
            // Region: Supabase project bloeazbeoqtddtmjanws reports eu-west-2. Function region:
            // "regions": ["lhr1"] in vercel.json since 28 Sept 2026. Retention: app/api/cron/data-retention.
            heading: 'Where your data lives',
            paragraphs: [
              <>
                Enquiries, tool sign ups and account details are saved in a Supabase database hosted in the eu-west-2
                region, which is London.
              </>,
              <>
                The websites are hosted on Vercel. Visitors in the UK are served from Vercel&rsquo;s London network, and
                the server code that receives a form runs in Vercel&rsquo;s London region too, so an enquiry is
                processed and stored in the UK. Enquiry emails are delivered by SendGrid.
              </>,
              <>
                We do not keep enquiries in our client portal forever. Every night an automatic job anonymises any that
                are more than 24 months old, removing the name, email, phone number, message, notes, resident name, IP
                address and browser details.
              </>,
            ],
          },
          {
            // organic-leads route (to/bcc), RLS state from pg_policies, lib/auth.ts, middleware.ts,
            // migrations 00009_client_rls.sql, cron/client-monthly-summary (counts only).
            heading: 'Who can see enquiries',
            paragraphs: [
              <>
                When a family uses a form, pop up, call back button or tool on your website, the enquiry is emailed to
                the address you give us, with a copy to TRG so we can make sure nothing is missed. If no address has
                been set up yet, it comes to TRG only.
              </>,
              <>
                The enquiry is also saved in a database table that has row level security switched on and no public
                access rules. That means it cannot be read through the website&rsquo;s public connection at all. Only our
                server code can reach it, and our admin area, which needs a signed in account with the admin role.
              </>,
              <>
                Providers who use our client portal sign in to see their enquiries. Database rules check which homes are
                assigned to each account, so a user only ever sees enquiries for their own homes, never anyone
                else&rsquo;s.
              </>,
              <>
                Our monthly summary emails to clients contain counts of enquiries by type, not the families&rsquo;
                details.
              </>,
            ],
          },
        ]}
      />

      <Prose
        tone="warm"
        sections={[
          {
            // components/tools/* disclaimers + no fetch calls, ToolLeadCapture in components/tools/ui.tsx,
            // app/api/tool-events (no personal details), app/api/funding-guide.
            heading: 'What our tools collect (and do not)',
            paragraphs: [
              <>
                Our family tools, such as the dementia signs check, care checklist, cost estimator, live in care
                comparison and visit planner, work in the visitor&rsquo;s browser. Nothing a family enters is stored,
                and each tool says so on screen.
              </>,
              <>
                At the end of a tool a family can choose to ask for a call back or a copy of their results. Only then are
                any personal details sent: their name, email and phone number, whether they ticked the box agreeing to
                be contacted, the page they were on and, for some tools, a short summary of the result so your team has context. The dementia signs
                check never sends the family&rsquo;s answers, even with a call back.
              </>,
              <>
                The funding guide is the exception by design: a family gives their details and a few answers so we can
                email them a personalised PDF guide, and your team receives the enquiry.
              </>,
              <>
                We also count how often each tool is viewed and used. That count records the tool, the page and a random
                session code. It holds no names, emails or other personal details.
              </>,
            ],
          },
          {
            // app/api/review-reply-helper, app/api/job-advert-rewrite, app/api/chat, lib/review-reply.ts.
            heading: 'AI features',
            paragraphs: [
              <>
                A few features use Anthropic&rsquo;s Claude AI model. In each case the text is sent to the model to
                produce an answer, and the answer comes straight back. We do not save the text in our database.
              </>,
            ],
            sub: [
              {
                heading: 'Care review reply helper',
                body: (
                  <>
                    Sends the pasted review, star rating, platform, your name, role, service name and chosen tone, to
                    draft a public reply. Reviews that mention a safeguarding concern, such as abuse or neglect, are never
                    sent to the AI: you get a fixed, neutral holding reply instead. The tool also flags names, health
                    details, dates, room numbers and contact details in the review, and warns you if any appear in the
                    draft.
                  </>
                ),
              },
              {
                heading: 'Care job advert checker',
                body: <>Sends the advert you paste, with our checker&rsquo;s score, to write an improved version.</>,
              },
              {
                heading: 'Website chat assistant',
                body: (
                  <>
                    Only on websites where it is switched on. Sends the family&rsquo;s chat messages, along with your
                    home&rsquo;s own website content, so the assistant can answer. The conversation is not saved in our
                    database.
                  </>
                ),
              },
            ],
          },
          {
            // components/CookieBanner.tsx, components/Analytics.tsx.
            heading: 'Cookies and analytics',
            paragraphs: [
              <>
                On trgdigital.co.uk a cookie banner asks visitors to accept or decline, and remembers the choice in
                their browser. Our Google tag uses Google&rsquo;s Consent Mode: advertising and analytics storage is
                switched off by default and only switched on if the visitor accepts. Microsoft Clarity, which records
                heatmaps and sessions, only loads after they accept.
              </>,
              <>
                When one of our tools is embedded on your website, our banner, Google tag and Clarity do not load inside
                it at all. More detail is in our{' '}
                <Link href="/cookies" className={linkClass}>
                  cookie policy
                </Link>
                .
              </>,
            ],
          },
        ]}
      />

      <Included
        heading="Security measures"
        intro="The protections below are built into the platform that runs our websites and tools, and you can check the first one yourself in any browser."
        groups={[
          {
            // live curl: http 308 to https, strict-transport-security: max-age=63072000.
            title: 'Connections',
            items: [
              'Every page is served over HTTPS, and plain http addresses are redirected to it',
              'Browsers are told to use HTTPS only for the next two years (HSTS)',
            ],
          },
          {
            // pg_class relrowsecurity on all public tables, middleware.ts, lib/auth.ts, env var naming.
            title: 'Access',
            items: [
              'Row level security switched on for every table in our database',
              'Admin and client portal pages need a signed in account',
              'The admin area also checks the account has the admin role',
              'The database key that bypasses these rules stays on our servers and is never sent to browsers',
            ],
          },
          {
            // zod schemas + honeypots + IP rate limits in marketing-leads, organic-leads, funding-guide.
            title: 'Forms',
            items: [
              'Every field is checked on the server, with length limits',
              'A hidden honeypot field quietly drops spam bots',
              'Repeat submissions from the same connection are limited each hour, which is why we store the IP address with an enquiry',
            ],
          },
          {
            // Confirmed by Len, 28 Sept 2026.
            title: 'Backups',
            items: ['The database is backed up every day'],
          },
          {
            // sentry.*.config.ts beforeSend filters.
            title: 'Error monitoring',
            items: [
              'Our error reports are set up to strip email addresses, phone numbers and names before they are sent',
              'AI tools log token counts for cost tracking, not the text you pasted',
            ],
          },
        ]}
      />

      <Prose
        sections={[
          {
            heading: 'Your rights and requests',
            paragraphs: [
              <>
                Our{' '}
                <Link href="/privacy" className={linkClass}>
                  privacy policy
                </Link>{' '}
                sets out what we collect, why, and the rights you and the families who contact you have under UK GDPR.
              </>,
              <>
                If you, or a family who enquired through your website, want to see, correct or remove information we
                hold, or you have a question this page does not answer, please{' '}
                <Link href="/contact" className={linkClass}>
                  get in touch
                </Link>{' '}
                and tell us what you need.
              </>,
              <>
                TRG Digital Ltd is registered with the Information Commissioner’s Office, registration number{' '}
                <a href="https://ico.org.uk/ESDWebPages/Entry/ZC221613" target="_blank" rel="noopener" className={linkClass}>
                  ZC221613
                </a>
                .
              </>,
            ],
          },
        ]}
      />

      <Faqs heading="Common questions" faqs={FAQS} />

      <EndCta
        title="Questions about your data?"
        body="Ask us before you sign anything. We would rather you knew exactly where your enquiries go."
        primary={{ label: 'Talk to us', href: '/contact' }}
        secondary={{ label: 'Read the privacy policy', href: '/privacy' }}
      />
    </main>
  )
}
