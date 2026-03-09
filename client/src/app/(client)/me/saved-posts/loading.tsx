import PostCardSkeleton from "@/components/posts/list/PostCardSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function SavedPostsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
