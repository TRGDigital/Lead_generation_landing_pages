'use client'

import { usePathname } from 'next/navigation'
import { RelatedLinks } from '@/components/marketing/RelatedLinks'
import { JsonLd } from '@/components/JsonLd'
import { breadcrumbLd } from '@/lib/schema'
import { GROUP_SERVICE, TOOL_SERVICE, TOOLS, relatedTools } from '@/lib/tools'

// Rendered once from the tools layout, so every tool page gets these without touching its
// page: the breadcrumb markup, and the "more tools like this" band. Server rendered like any
// client component, so both are in the HTML crawlers read.
export function ToolRelated() {
  const path = (usePathname() ?? '').replace(/\/$/, '')
  if (path === '/tools') return <JsonLd data={breadcrumbLd([['Free tools', '/tools']])} />
  const tool = TOOLS.find((t) => t.href === path)
  if (!tool) return null
  const items = relatedTools(tool.href).map((t) => ({ title: t.title, body: t.short, href: t.href, icon: t.icon }))
  return (
    <>
      <JsonLd data={breadcrumbLd([['Free tools', '/tools'], [tool.title, tool.href]])} />
      <RelatedLinks
        heading="More free tools like this"
        items={items}
        footer={TOOL_SERVICE[tool.href] ?? GROUP_SERVICE[tool.group]}
      />
    </>
  )
}
