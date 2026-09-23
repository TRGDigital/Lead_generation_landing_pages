import Script from 'next/script'
import Nav from '@/components/marketing/Nav'
import { AccessibilityBar } from '@/components/marketing/AccessibilityBar'
import Footer from '@/components/marketing/Footer'
import { Accreditations } from '@/components/marketing/Accreditations'
import { WhoWeServe } from '@/components/marketing/WhoWeServe'
import { HomeFaqs } from '@/components/marketing/HomeFaqs'
import { FloatingCta } from '@/components/marketing/FloatingCta'
import { AgentTools } from '@/components/marketing/AgentTools'
import { AttributionCapture } from '@/components/marketing/AttributionCapture'
import { AltMapProvider } from '@/components/marketing/ManagedImage'
import { EnquiryProvider } from '@/components/marketing/EnquiryOverlay'
import { getImageAltMap } from '@/lib/image-alts'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const altMap = await getImageAltMap()
  return (
    <AltMapProvider map={altMap}>
      <EnquiryProvider>
      <div className="flex min-h-screen flex-col bg-brand-bg">
        <AccessibilityBar />
        <Nav />
        <main className="flex-1">{children}</main>
        <WhoWeServe />
        <HomeFaqs />
        <Accreditations />
        <Footer />
        <FloatingCta />
        {/* WebMCP tools for AI agents (no-ops where unsupported) */}
        <AgentTools />
        <AttributionCapture />
        {/* Lead-capture overlay, controlled from /admin/websites -> TRG Digital */}
        <Script src="/embed.js" data-site="trgdigital" strategy="afterInteractive" />
      </div>
      </EnquiryProvider>
    </AltMapProvider>
  )
}
