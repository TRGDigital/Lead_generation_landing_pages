'use client'

import { usePathname } from 'next/navigation'
import { Breadcrumbs } from '@/components/marketing/Breadcrumbs'
import { TOOLS } from '@/lib/tools'

// The breadcrumb above every tool page and /tools, from the tools layout, so a new tool
// gets it without touching its page.
export function ToolBreadcrumbs() {
  const path = (usePathname() ?? '').replace(/\/$/, '')
  if (path === '/tools') return <Breadcrumbs trail={[['Free tools', '/tools']]} />
  const tool = TOOLS.find((t) => t.href === path)
  if (!tool) return null
  return <Breadcrumbs trail={[['Free tools', '/tools'], [tool.title, tool.href]]} />
}
