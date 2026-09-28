'use client'

import { usePathname } from 'next/navigation'
import { RelatedLinks } from '@/components/marketing/RelatedLinks'
import { GROUP_SERVICE, TOOL_SERVICE, TOOLS, relatedTools } from '@/lib/tools'

// Rendered once from the tools layout, so every tool page gets the "more tools like this"
// band without touching its page. Server rendered like any
// client component, so the links are in the HTML crawlers read.
export function ToolRelated() {
  const path = (usePathname() ?? '').replace(/\/$/, '')
  const tool = TOOLS.find((t) => t.href === path)
  if (!tool) return null
  const items = relatedTools(tool.href).map((t) => ({ title: t.title, body: t.short, href: t.href, icon: t.icon }))
  return (
    <>
      <RelatedLinks
        heading="More free tools like this"
        items={items}
        footer={TOOL_SERVICE[tool.href] ?? GROUP_SERVICE[tool.group]}
      />
    </>
  )
}
