import { Skeleton } from "@/components/ui/skeleton"

export default function PostDetailLoading() {
  return (
    <div className="min-h-[calc(100svh-7rem)] bg-background">
      <div className="mx-auto lg:w-6xl max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Image Gallery Skeleton */}
          <div className="space-y-3">
            <Skeleton className="aspect-4/3 w-full rounded-xl" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="relative flex-1 aspect-square rounded-lg" />
              ))}
            </div>
          </div>

          {/* Post Details Skeleton */}
          <div className="flex flex-col gap-5">
            <div className="space-y-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-3/4" />
              <Skeleton className="h-4 w-32" />
            </div>

            <Skeleton className="h-px w-full" />

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-36" />
                  </div>
                </div>
              ))}
            </div>

            <Skeleton className="h-px w-full" />

            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Skeleton className="h-11 w-full sm:w-[200px]" />
          <Skeleton className="h-11 w-full sm:w-[200px]" />
        </div>
      </div>
    </div>
  )
}
