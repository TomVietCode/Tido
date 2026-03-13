// src/app/(client)/posts/page.tsx

import { Suspense } from "react"
import PostGridSkeleton from "@/components/posts/list/PostGridSkeleton"
import PostPageClient from "@/components/posts/list/PostPageClient"
import { getPosts } from "@/lib/actions/post.action"
import { getCategoryAction } from "@/lib/actions/category.action"

export default async function PostListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams

  const defaultData = {
    meta: { limit: 20, hasNextPage: false, nextCursor: null },
    data: [],
  }

  const [postsRes, categoriesRes] = await Promise.all([
    getPosts(params),
    getCategoryAction(),
  ])

  const initialPosts = postsRes?.data ?? defaultData
  const categories = categoriesRes?.data ?? []

  return (
    <Suspense key={JSON.stringify(params)} fallback={<PostGridSkeleton />}>
      <PostPageClient
        categories={categories}
        initialData={initialPosts}
        searchParams={params}
      />
    </Suspense>
  )
}