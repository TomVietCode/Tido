"use client"
import { getPost } from "@/lib/actions/post.action"
import { updatePostStatus } from "@/lib/actions/post.action"
import { PostDetail } from "@/types"
import { PostStatus, PostType } from "@/types/enums"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"
import useSWR from "swr"

export function useConversationPost(postId?: string) {
  const { data: session } = useSession()
  const [isUpdating, setIsUpdating] = useState(false)

  const { data: post, mutate } = useSWR<PostDetail | null>(
    postId ? `/api/posts/${postId}` : null,
    async () => {
      const res = await getPost(postId!)
      if (!res.success || !res.data) return null
      return res.data
    },
    { revalidateOnFocus: false }
  )

  const isPostOwner = !!post && session?.user?.id === post.userId
  const canUpdateStatus = isPostOwner && post.status === PostStatus.OPEN
  const statusButtonLabel = post?.type === PostType.FOUND ? "Đã trao trả thành công" : "Đã tìm thấy"

  const markResolved = async () => {
    if (!post || isUpdating) return
    setIsUpdating(true)
    try {
      const res = await updatePostStatus(post.id, PostStatus.CLOSED)
      if (res.success) {
        toast.success("Đã cập nhật trạng thái bài đăng")
        mutate()
      } else {
        toast.error(res.message || "Có lỗi xảy ra")
      }
    } catch {
      toast.error("Có lỗi xảy ra")
    } finally {
      setIsUpdating(false)
    }
  }

  return { post: post ?? undefined, isPostOwner, canUpdateStatus, statusButtonLabel, isUpdating, markResolved }
}
