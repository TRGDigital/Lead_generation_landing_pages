import { Skeleton } from '@/components/ui/skeleton'

export default function PortalLoading() {
  return (
    <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
      <Skeleton className="h-44 w-full rounded-2xl" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
