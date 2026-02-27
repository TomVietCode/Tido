import { Suspense } from "react"
import FilterBar from "@/components/posts/list/FilterBar"
import PostGridSkeleton from "@/components/posts/list/PostGridSkeleton"
import PostListClient from "@/components/posts/list/PostListClient"
import { getPosts } from "@/lib/actions/post.action"
import { getCategoryAction } from "@/lib/actions/category.action"

export default async function PostListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const suspenseKey = JSON.stringify(params)

  const [postsRes, categoriesRes] = await Promise.all([getPosts(params), getCategoryAction()])

  const categories = categoriesRes.data ?? []
  const initialPosts = postsRes.data
    ? postsRes.data
    : { meta: { limit: 20, hasNextPage: false, nextCursor: null }, data: [] }
  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col">
      <FilterBar categories={categories} />

      <div className="flex flex-1 flex-col max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Suspense key={suspenseKey} fallback={<PostGridSkeleton />}>
          <PostListClient initialData={initialPosts} searchParams={params} />
        </Suspense>
      </div>
    </div>
  )
}
