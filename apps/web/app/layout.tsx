import type { Metadata } from 'next'
import { Bricolage_Grotesque, Manrope } from 'next/font/google'
import CookieBanner from '@/components/CookieBanner'
import Analytics from '@/components/Analytics'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

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

export const metadata: Metadata = {
  title: {
    template: '%s | TRG Digital',
    default: 'TRG Digital | A Specialist Digital Agency for the Care Sector',
  },
  description:
    'TRG Digital is a specialist agency for the UK care sector: marketing and enquiry generation, website development, and custom software including CareStream and CareAssura.',
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
