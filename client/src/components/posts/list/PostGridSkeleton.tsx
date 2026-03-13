import PostCardSkeleton from "@/components/posts/list/PostCardSkeleton"

const SKELETON_COUNT = 8

export default function PostGridSkeleton() {
  return (
    <div className="flex flex-1 flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
