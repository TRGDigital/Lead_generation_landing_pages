import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DESIGNS, getDesign } from '@/lib/designs'
import OakfieldDesign from '@/components/designs/OakfieldDesign'
import BrightpathDesign from '@/components/designs/BrightpathDesign'
import StAidansDesign from '@/components/designs/StAidansDesign'
import WillowDesign from '@/components/designs/WillowDesign'
import MarchmontDesign from '@/components/designs/MarchmontDesign'
import RavenswoodDesign from '@/components/designs/RavenswoodDesign'

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

  switch (design.slug) {
    case 'oakfield-house':
      return <OakfieldDesign design={design} />
    case 'brightpath-care':
      return <BrightpathDesign design={design} />
    case 'st-aidans':
      return <StAidansDesign design={design} />
    case 'willow-court':
      return <WillowDesign design={design} />
    case 'marchmont-gardens':
      return <MarchmontDesign design={design} />
    case 'ravenswood-group':
      return <RavenswoodDesign design={design} />
    default:
      notFound()
  }
}
