import { notFound } from 'next/navigation'
import { getWebsiteBySlug } from '@/lib/websites'
import { getFamilyTool, isToolKey } from '@/lib/family-tools'
import { getLABySlug } from '@/lib/local-authorities'
import { getServiceLinks } from '@/lib/la-service-links'
import { ToolEmbed } from '@/components/tools/ToolEmbed'
import ToolTracker from '@/components/marketing/ToolTracker'

// Branded, frameable tool widget. Loaded inside an auto-resizing iframe by tools.js on a
// client site: /embed/tools/<tool>?site=<slug>. Branding + lead capture come from the
// allocated website record. Lives outside the (marketing) group so it has no nav/footer.
export const dynamic = 'force-dynamic'

type Props = { params: { tool: string }; searchParams: { site?: string } }

export default async function ToolEmbedPage({ params, searchParams }: Props) {
  if (!isToolKey(params.tool)) notFound()
  const tool = getFamilyTool(params.tool)!

  const slug = (searchParams.site || '').trim()
  const site = slug ? await getWebsiteBySlug(slug) : null

  // Hidden tools are not public yet: they only load for a client site they are allocated to.
  if (tool.hidden && !(site && (site.tools_enabled || []).includes(params.tool))) notFound()

  // The funding guide is a premium standalone tool gated by its own flag; every other tool
  // must be allocated to the site in the admin tools grid.
  const isAllowed = site
    ? params.tool === 'funding-guide'
      ? site.funding_guide_enabled
      : (site.tools_enabled || []).includes(params.tool)
    : true
  if (!isAllowed) {
    return (
      <div className="mx-auto max-w-md p-8 text-center text-sm text-brand-ink-muted">
        This tool is not currently enabled for this site.
      </div>
    )
  }

  const color = site?.overlay_color || '#F0532B'
  const logo = site?.overlay_logo_url || ''
  const captureSite = site && site.tools_capture_leads ? site.slug : undefined
  const la = params.tool === 'la-lookup' && site?.tools_la_slug ? getLABySlug(site.tools_la_slug) : null
  const laLinks = params.tool === 'la-lookup' && site?.tools_la_slug ? getServiceLinks(site.tools_la_slug) : []

  // The LA tool is not a finder: show the relevant council's name in the header.
  const title = params.tool === 'la-lookup' && la ? la.name : tool.name
  const blurb = params.tool === 'la-lookup' && la ? 'Adult social care and care funding' : tool.short

  return (
    // Logs anonymous per-site usage (view + first interaction) so the admin
    // Tool usage view can break embedded-tool activity down by client site.
    <ToolTracker tool={params.tool} site={site?.slug}>
      <ToolEmbed
        toolKey={params.tool}
        title={title}
        blurb={blurb}
        color={color}
        logo={logo}
        captureSite={captureSite}
        la={la}
        laLinks={laLinks}
      />
    </ToolTracker>
  )
}
