import { notFound } from "next/navigation"
import { getPost } from "@/lib/actions/post.action"
import PostDetailContent from "@/components/posts/detail/PostDetailContent"

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await getPost(id)

  if (!res.success || !res.data) {
    notFound()
  }

  return <PostDetailContent post={res.data} />
}
