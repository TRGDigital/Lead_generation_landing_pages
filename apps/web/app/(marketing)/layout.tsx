import Nav from '@/components/marketing/Nav'
import Footer from '@/components/marketing/Footer'
import { FloatingCta } from '@/components/marketing/FloatingCta'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-bg">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingCta />
    </div>
  )
}
