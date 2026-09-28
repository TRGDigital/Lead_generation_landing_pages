import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DESIGNS, getDesign } from '@/lib/designs'
import OakfieldDesign from '@/components/designs/OakfieldDesign'
import BrightpathDesign from '@/components/designs/BrightpathDesign'
import StAidansDesign from '@/components/designs/StAidansDesign'
import WillowDesign from '@/components/designs/WillowDesign'
import MarchmontDesign from '@/components/designs/MarchmontDesign'
import RavenswoodDesign from '@/components/designs/RavenswoodDesign'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'
import ModernTemplate from '@/components/designs/families/ModernTemplate'
import { MODERN } from '@/lib/design-families/modern'
import TraditionalTemplate from '@/components/designs/families/TraditionalTemplate'
import { TRADITIONAL } from '@/lib/design-families/traditional'
import ClinicalTemplate from '@/components/designs/families/ClinicalTemplate'
import { CLINICAL } from '@/lib/design-families/clinical'
import PremiumTemplate from '@/components/designs/families/PremiumTemplate'
import { PREMIUM } from '@/lib/design-families/premium'
import { JsonLd } from '@/components/JsonLd'
import { ORG_REF, WEBSITE_REF, SCHEMA_SITE } from '@/lib/schema'

export const revalidate = 3600
export const dynamicParams = false

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export function generateStaticParams() {
  return DESIGNS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const design = getDesign(params.slug)
  if (!design) return {}
  return {
    title: `${design.name}: an example care website design`,
    description: `${design.style} An example ${design.setting.toLowerCase()} website design by TRG Digital, shown with content for a fictional provider.`,
    alternates: { canonical: `${SITE_URL}/designs/${design.slug}` },
    robots: { index: true, follow: true },
  }
}

export default function DesignExamplePage({ params }: { params: { slug: string } }) {
  const design = getDesign(params.slug)
  if (!design) notFound()

  let page: React.ReactNode
  switch (design.slug) {
    case 'oakfield-house':
      page = <OakfieldDesign design={design} />
      break
    case 'brightpath-care':
      page = <BrightpathDesign design={design} />
      break
    case 'st-aidans':
      page = <StAidansDesign design={design} />
      break
    case 'willow-court':
      page = <WillowDesign design={design} />
      break
    case 'marchmont-gardens':
      page = <MarchmontDesign design={design} />
      break
    case 'ravenswood-group':
      page = <RavenswoodDesign design={design} />
      break
    default: {
      const modern = design.family === 'modern' ? MODERN.find((m) => m.slug === design.slug) : undefined
      const traditional = design.family === 'traditional' ? TRADITIONAL.find((m) => m.slug === design.slug) : undefined
      const clinical = design.family === 'clinical' ? CLINICAL.find((m) => m.slug === design.slug) : undefined
      const premium = design.family === 'premium' ? PREMIUM.find((m) => m.slug === design.slug) : undefined
      if (modern) page = <ModernTemplate c={modern} />
      else if (traditional) page = <TraditionalTemplate c={traditional} />
      else if (clinical) page = <ClinicalTemplate c={clinical} />
      else if (premium) page = <PremiumTemplate c={premium} />
      else notFound()
    }
  }
  return (
    <>
      <Breadcrumbs trail={[['Design examples', '/designs'], [design.name, `/designs/${design.slug}`]]} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: `${design.name}: an example care website design`,
          description: design.style,
          url: `${SCHEMA_SITE}/designs/${design.slug}`,
          creator: ORG_REF,
          isPartOf: WEBSITE_REF,
        }}
      />
      {page}
    </>
  )
}
