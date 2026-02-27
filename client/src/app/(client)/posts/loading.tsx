import PostGridSkeleton from "@/components/posts/list/PostGridSkeleton"

export default function LoadingPostsPage() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col w-full">
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="h-10 w-full max-w-md rounded-full bg-muted animate-pulse" />
        </div>
      </div>

      <div className="flex flex-1 flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PostGridSkeleton />
      </div>
    </div>
  )
}