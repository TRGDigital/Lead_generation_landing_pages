import type { Metadata } from 'next'
import Link from 'next/link'
import { Briefcase, Search, Smartphone, Lock, MapPin, Inbox } from 'lucide-react'
import { applyPageSeo } from '@/lib/page-seo'
import { ServiceLanding } from '@/components/marketing/ServiceLanding'

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
