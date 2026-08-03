import type { Metadata } from 'next'
import { applyPageSeo } from '@/lib/page-seo'
import { LegalPageView } from '@/components/marketing/LegalPageView'

export const revalidate = 3600

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://app.example.com'

export async function generateMetadata(): Promise<Metadata> {
  return applyPageSeo('/privacy', META)
}

const META: Metadata = {
  title: 'Privacy Policy | TRG Digital',
  description: 'Our privacy policy, how we collect, use, and protect your data.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return <LegalPageView slug="privacy" />
}
