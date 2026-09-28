import { ToolRelated } from '@/components/marketing/ToolRelated'

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolRelated />
    </>
  )
}
