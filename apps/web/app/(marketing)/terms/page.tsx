import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import { LegalPageView } from '@/components/marketing/LegalPageView'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/terms', META)
}

const META: Metadata = {
  title: 'Terms of Service | TRG Digital',
  description: 'The terms that govern use of our website and services.',
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return <LegalPageView slug="terms" />
}
