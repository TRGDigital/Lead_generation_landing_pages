import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { getPageSeoMap } from '@/lib/page-seo'
import { getImageAltMap } from '@/lib/image-alts'
import SeoTabs from '@/components/admin/SeoTabs'
import SiteOgImageEditor from '@/components/admin/SiteOgImageEditor'
import RalfyIndexPanel from '@/components/admin/RalfyIndexPanel'

export const metadata: Metadata = { title: 'SEO — Admin' }
export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.trgdigital.co.uk'

export default async function PageSeoAdmin() {
  await requireAdmin()
  const [overrides, imageAlts] = await Promise.all([getPageSeoMap(), getImageAltMap()])

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="font-display text-2xl font-semibold text-brand-ink">SEO</h1>
      <p className="mt-1 mb-6 text-sm text-brand-ink-muted">
        Manage the meta title, description and canonical for each page, and the alt text for every image on the site.
        Changes go live within a few minutes.
      </p>
      <div className="mb-6">
        <SiteOgImageEditor initialUrl={overrides['__site__']?.og_image ?? null} />
      </div>

      <div className="mb-8">
        <RalfyIndexPanel />
      </div>

      <SeoTabs overrides={overrides} imageAlts={imageAlts} siteUrl={SITE_URL} />
    </div>
  )
}
