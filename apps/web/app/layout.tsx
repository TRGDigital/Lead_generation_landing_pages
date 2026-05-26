import type { Metadata } from 'next'
import { Fraunces, Lora, Manrope } from 'next/font/google'
import CookieBanner from '@/components/CookieBanner'
import Analytics from '@/components/Analytics'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | CareBeds',
    default: 'CareBeds — Fill Your Empty Beds',
  },
  description:
    'CareBeds connects UK care homes with pre-qualified resident enquiries. Pay only when a resident moves in.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${lora.variable} ${manrope.variable}`}
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
