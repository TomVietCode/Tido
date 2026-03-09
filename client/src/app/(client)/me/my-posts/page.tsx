import { getMyPosts } from "@/lib/actions/post.action"
import { MyPostsClient } from "@/components/me/MyPostsClient"

interface MyPostsPageProps {
  searchParams: Promise<{ filter?: string }>
}

export default async function MyPostsPage({ searchParams }: MyPostsPageProps) {
  const { filter } = await searchParams

  const statusMap: Record<string, string | undefined> = {
    active: "OPEN",
    closed: "CLOSED",
  }

  const status = filter ? statusMap[filter] : undefined

  const res = await getMyPosts({ status })

  const posts = res.data?.data ?? []
  const summary = res.data?.summary ?? { totalPosts: 0, totalResolved: 0 }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tin đã đăng</h1>
      <MyPostsClient
        initialPosts={posts}
        summary={summary}
        currentFilter={filter ?? "all"}
      />
    </div>
  )
}
