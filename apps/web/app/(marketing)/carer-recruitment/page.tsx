import type { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, Search, Smartphone, Lock, MapPin, Inbox } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { ServiceLanding } from '@/components/marketing/ServiceLanding'
import { SerpJobs, SchemaCode } from '@/components/marketing/SerpMock'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

const META: Metadata = {
  title: 'Carer Recruitment Websites for Care Providers',
  description:
    'Recruit more carers from your own website. Careers pages with pay up front, job pages listed free in Google for Jobs, a quick mobile application with optional CV upload and secure CV storage, built for care providers.',
  alternates: { canonical: `${SITE_URL}/carer-recruitment` },
  robots: { index: true, follow: true },
}

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/carer-recruitment', META)
}

export default function CarerRecruitmentPage() {
  return (
    <ServiceLanding
      path="/carer-recruitment"
      schemaName="Carer recruitment websites"
      schemaDescription="Careers sections, job pages and recruitment campaigns that help UK care providers recruit carers from their own website."
      eyebrow="Carer recruitment"
      title={['Recruit more', 'carers', 'from your own website']}
      intro="For most care providers, finding carers is as hard as finding clients. We build careers sections that carers actually use: every role with its pay shown up front, a quick application that works on a phone, and job pages Google shows for free. All on your own website, with no separate jobs site to manage."
      heroPoints={['Pay shown up front', 'Listed free in Google for Jobs', 'Apply in minutes on a phone']}
      primaryCta={{ label: 'Talk to us about recruitment', href: '/contact' }}
      secondaryCta={{ label: 'See our websites', href: '/website-development' }}
      mock={{
        url: 'yourcareservice.co.uk/careers',
        heading: 'Care Practitioner, bank',
        rows: [
          ['Pay', 'Shown up front'],
          ['Hours', 'Shifts listed clearly'],
          ['Apply', 'About five minutes'],
          ['CV', 'Optional upload'],
        ],
        badge: 'Listed in Google for Jobs',
      }}
      why={{
        title: 'Carers search for jobs the same way families search for care',
        tagline: 'If your jobs are hard to find, good carers go elsewhere.',
        paragraphs: [
          'Carers look for work on their phones, usually between shifts. They search for care jobs in their town, compare the pay and apply to the roles that make it easy. A careers page that hides the pay, sends people to a separate jobs site or asks for a CV they do not have loses them in seconds.',
          <>
            We build recruitment into your{' '}
            <Link href="/website-development" className="font-semibold text-brand-pop underline-offset-2 hover:underline">website</Link>{' '}
            from the start: a careers section with separate routes for different roles, a page for every vacancy, and
            the structured data Google needs to list your jobs in its own job search, alongside the paid job boards.
          </>,
        ],
      }}
      points={[
        'A page for every vacancy with pay up front',
        'Job postings marked up for Google for Jobs',
        'A short mobile application form',
        'Optional CV upload with secure storage',
        'Care jobs pages for every town you hire in',
        'Applications in one place, with instant alerts',
      ]}
      pointsCta="Want to see how your jobs look to carers today?"
      cards={{
        subtitle: 'What we build',
        title: 'Everything a carer needs to say yes',
        items: [
          { Icon: Briefcase, title: 'Careers section', body: 'Separate routes for visiting and live-in carers, nurses and support workers, so every applicant sees the roles and requirements that apply to them.' },
          { Icon: Search, title: 'Google for Jobs', body: 'Every vacancy is marked up in the format Google uses for its job listings, so your roles can appear in Google job search at no cost.' },
          { Icon: Smartphone, title: 'Mobile application', body: 'A short form that works on a phone. Applicants can upload a CV if they have one, and apply without one if they do not.' },
          { Icon: Lock, title: 'Secure CV storage', body: 'CVs are kept in a private, encrypted area and opened only by your team through links that expire, with automatic deletion after a period you choose.' },
          { Icon: MapPin, title: 'Care jobs by town', body: 'A careers page for each town and village you recruit in, so carers searching for care jobs near them find you first.' },
          { Icon: Inbox, title: 'Every application in one place', body: 'Applications land in your content management system and your inbox straight away, with the role and page they came from.' },
        ],
      }}
      extra={
        <section className="relative overflow-hidden bg-brand-bg-warm px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-pop">What carers see</p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight text-brand-ink sm:text-4xl">
                A job page that answers the pay question first
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-ink-soft">
                Carers compare roles in minutes, usually on a phone between shifts. This is the shape of a job page we
                build, and the markup behind it that puts the same role into Google&apos;s own job results.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* A job page as we build it */}
              <div className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-soft">
                <div className="flex items-center gap-1.5 border-b border-brand-line bg-brand-bg-warm px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="ml-2 truncate rounded bg-white px-2 py-0.5 text-[9px] text-brand-ink-muted">
                    oakfieldhouse.co.uk/careers/care-assistant-days
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-pop">Now recruiting</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold text-brand-ink">Care Assistant, days</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ['Pay', '£12.60 an hour'],
                      ['Hours', 'Full time, 8am to 8pm'],
                      ['Shifts', 'Three days on, three off'],
                      ['Based', 'Alderbury, Wiltshire'],
                      ['Holiday', '28 days, pro rata'],
                      ['Experience', 'Not essential, training given'],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-xl bg-brand-bg-warm px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-ink-muted">{k}</p>
                        <p className="text-sm font-semibold text-brand-ink">{v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-xl border border-brand-line p-4">
                    <p className="text-sm font-semibold text-brand-ink">Apply in about five minutes</p>
                    <div className="mt-3 space-y-2">
                      {['Your name', 'Phone or email', 'Which shifts suit you', 'Upload a CV (optional)'].map((f) => (
                        <div key={f} className="rounded-lg bg-brand-bg-warm px-3 py-2 text-[13px] text-brand-ink-soft">{f}</div>
                      ))}
                    </div>
                    <span className="mt-3 inline-block rounded-full bg-brand-pop px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white">
                      Send application
                    </span>
                  </div>
                </div>
              </div>

              {/* The same role in Google, and the markup that puts it there */}
              <div className="space-y-6">
                <SerpJobs
                  heading="Care jobs near Alderbury"
                  jobs={[
                    { title: 'Care Assistant, days', meta: 'Oakfield House · Alderbury, Wiltshire', chips: ['£12.60 an hour', 'Full time', 'Posted 2 days ago'] },
                    { title: 'Live-in Carer', meta: 'Brightpath Care · Melrose Green, Suffolk', chips: ['From £143 a day', 'Live-in'] },
                    { title: 'Registered Nurse, nights', meta: "St Aidan's Nursing Home · Northbrook", chips: ['£21.40 an hour', 'Nights'] },
                  ]}
                />
                <SchemaCode
                  lines={[
                    { text: '<script type="application/ld+json">', tone: 'tag' },
                    { text: '{' },
                    { text: '  "@type": "JobPosting",', tone: 'key' },
                    { text: '  "title": "Care Assistant, days",', tone: 'value' },
                    { text: '  "hiringOrganization": { "name": "Oakfield House" },', tone: 'value' },
                    { text: '  "jobLocation": { "addressLocality": "Alderbury", "addressRegion": "Wiltshire" },', tone: 'value' },
                    { text: '  "baseSalary": { "currency": "GBP", "value": 12.60, "unitText": "HOUR" },', tone: 'value' },
                    { text: '  "employmentType": "FULL_TIME",', tone: 'value' },
                    { text: '  "datePosted": "2026-09-21", "validThrough": "2026-11-21"', tone: 'value' },
                    { text: '}' },
                    { text: '</script>', tone: 'tag' },
                    { text: '' },
                    { text: '// written for you each time a vacancy is added, and removed when it is filled', tone: 'comment' },
                  ]}
                />
                <p className="text-sm leading-relaxed text-brand-ink-muted">
                  Illustrations. The providers shown are the fictional ones from our{' '}
                  <Link href="/designs" className="font-semibold text-brand-pop underline-offset-2 hover:underline">design examples</Link>,
                  and Google decides which listings to show for each search.
                </p>
              </div>
            </div>
          </div>
        </section>
      }
      steps={{
        title: 'From hard to find to hired',
        items: [
          { n: '01', title: 'Map your roles', body: 'We agree the roles you recruit for, the pay and requirements for each, and the areas you need carers in.' },
          { n: '02', title: 'Build the careers section', body: 'Job pages, the application form, secure CV storage and Google for Jobs markup, all on your own website.' },
          { n: '03', title: 'Fill the pipeline', body: 'Your team adds and closes vacancies themselves, and recruitment campaigns can be added when you need more applicants fast.' },
        ],
      }}
      cta={{
        title: 'Recruit carers from your own website',
        body: 'Tell us which roles you are hiring for and where, and we will show you how to get more carers applying directly to you.',
      }}
    />
  )
}
