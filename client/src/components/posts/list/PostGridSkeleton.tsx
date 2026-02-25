import PostCardSkeleton from "@/components/posts/list/PostCardSkeleton"

const SKELETON_COUNT = 8

export default function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}
