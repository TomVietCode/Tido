"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { PostType } from "@/types/enums"
import { createConversation } from "@/lib/actions/chat.action"

interface UsePostContactOptions {
  postId: string
  postUserId: string
  postType: PostType
  securityQuestion?: string
}

export function usePostContact({
  postId,
  postUserId,
  postType,
  securityQuestion,
}: UsePostContactOptions) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)
  const [isContacting, setIsContacting] = useState(false)

  const isOwner = session?.user?.id === postUserId

  const handleContact = async () => {
    if (!session) {
      toast.warning("Bạn cần đăng nhập để thực hiện chức năng này!")
      setShowAuthDialog(true)
      return
    }

    if (postType === PostType.FOUND && securityQuestion) {
      setShowQuestionDialog(true)
      return
    }

    setIsContacting(true)
    try {
      const res = await createConversation(postUserId, postId)
      if (res.success && res.data) {
        router.push(`/chats/${res.data.id}`)
      } else {
        toast.error(res.message ?? "Có lỗi xảy ra, vui lòng thử lại sau!")
      }
    } finally {
      setIsContacting(false)
    }
  }

  return {
    session,
    isOwner,
    isContacting,
    handleContact,
    showAuthDialog,
    setShowAuthDialog,
    showQuestionDialog,
    setShowQuestionDialog,
  }
}
