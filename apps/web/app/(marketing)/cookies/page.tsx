import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import { LegalPageView } from '@/components/marketing/LegalPageView'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/cookies', META)
}

const META: Metadata = {
  title: 'Cookie Policy | TRG Digital',
  description: 'Our cookie policy, what cookies we use and how to manage them.',
  alternates: { canonical: `${SITE_URL}/cookies` },
  robots: { index: true, follow: true },
}

export default function CookiesPage() {
  return <LegalPageView slug="cookies" />
}
