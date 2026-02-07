import { Skeleton } from "@/components/ui/skeleton"

export function ChatSidebarSkeleton() {
  return (
    <div className="h-full flex flex-col gap-4 p-2">
      
      <div className="flex items-center justify-between mt-2 mx-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>

      {/* search bar */}
      <div className="px-2">
        <Skeleton className="h-8 w-full rounded-2xl" />
      </div>

      <div className="flex-1 space-y-2 mt-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}