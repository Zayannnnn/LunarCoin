import { Skeleton } from '@/components/ui/skeleton'

export function OverviewSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Skeleton className="h-14 w-full max-w-2xl rounded-xl" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={`primary-${i}`} className="h-[118px] rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={`secondary-${i}`} className="h-[88px] rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[320px] rounded-xl" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={`panel-${i}`} className="h-[220px] rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-40" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={`block-${i}`} className="h-[88px] rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-[320px] rounded-xl" />
        </div>
      </div>
    </div>
  )
}
