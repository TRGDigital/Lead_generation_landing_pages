import type { Metadata } from 'next'
import { Bricolage_Grotesque, Manrope } from 'next/font/google'
import CookieBanner from '@/components/CookieBanner'
import Analytics from '@/components/Analytics'
import { Toaster } from '@/components/ui/toaster'
import { getSiteOgImage } from '@/lib/page-seo'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

// Display: Bricolage Grotesque — a characterful modern grotesque for a bold,
// distinctive, agency feel (replaces the serif Fraunces). Body: Manrope (sans).
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

// Async so the site-wide default social image (set in /admin/seo) becomes the
// default og:image + Twitter card image for every route that doesn't set its own.
export async function generateMetadata(): Promise<Metadata> {
  const og = await getSiteOgImage()
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: '%s | TRG Digital',
      default: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
    },
    description:
      'TRG Digital is a specialist agency for the UK care sector: marketing and enquiry generation, website development, and custom software including CareStream and CareAssura.',
    openGraph: { type: 'website', siteName: 'TRG Digital', images: [og] },
    twitter: { card: 'summary_large_image', images: [og] },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${manrope.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <CookieBanner />
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
