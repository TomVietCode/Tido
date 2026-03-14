import { notFound } from "next/navigation"
import { getPost } from "@/lib/actions/post.action"
import PostDetailContent from "@/components/posts/detail/PostDetailContent"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const res = await getPost(id)
  if (!res.success || !res.data) return { robots: { index: false, follow: false } }
  const post = res.data
  return {
    title: post.title,
    description: post.description?.slice(0, 155) || "Chi tiết tin tìm kiếm",
    alternates: { canonical: `/posts/${post.id}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description?.slice(0, 200),
      images: post.images?.[0] ? [post.images[0]] : [],
    },
  }
}

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
