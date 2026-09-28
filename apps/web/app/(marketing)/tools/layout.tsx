import { ToolBreadcrumbs } from '@/components/marketing/ToolBreadcrumbs'
import { ToolRelated } from '@/components/marketing/ToolRelated'

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolBreadcrumbs />
      {children}
      <ToolRelated />
    </>
  )
}
