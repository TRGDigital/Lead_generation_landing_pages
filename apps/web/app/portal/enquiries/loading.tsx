import { Skeleton } from '@/components/ui/skeleton'

export default function EnquiriesLoading() {
  return (
    <div className="px-4 py-6 max-w-lg mx-auto space-y-5">
      <Skeleton className="h-10 w-full rounded-xl" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
