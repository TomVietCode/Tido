"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useConversationPost } from "@/lib/hooks"
import { IConversation } from "@/types"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface ChatHeaderProps {
  conversation?: IConversation
}

export default function ChatHeader({ conversation }: ChatHeaderProps) {
  const { post, canUpdateStatus, statusButtonLabel, isUpdating, markResolved } = useConversationPost(
    conversation?.postId
  )

  const recipient = conversation?.recipient

  if (!recipient) {
    return (
      <div className="flex items-center justify-between border-b p-2 shadow-b shadow-md">
        <span className="text-sm font-semibold text-gray-700 p-1">Đang tải...</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 border-b p-2 shadow-b shadow-md">
      <Link
        href={`/users/${recipient.id}`}
        className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-md transition-colors shrink-0"
      >
        <Avatar className="size-10">
          <AvatarImage src={recipient.avatarUrl} />
          <AvatarFallback>{recipient.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold truncate">{recipient.fullName}</span>
      </Link>

      <div className="flex items-center gap-2 ml-auto">
        {post && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={`/posts/${post.id}`}
                className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors min-w-0"
              >
                {post.images?.[0] && (
                  <Image
                    src={post.images[0]}
                    alt={post.title}
                    width={32}
                    height={32}
                    className="size-8 rounded object-cover shrink-0"
                  />
                )}
                <span className="text-xs text-gray-600 truncate max-w-[180px]">{post.title}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Đi đến trang chi tiết bài viết</p>
            </TooltipContent>
          </Tooltip>
        )}

        {canUpdateStatus && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs shrink-0"
                onClick={markResolved}
                disabled={isUpdating}
              >
                <CheckCircle2 className="size-3.5" />
                {statusButtonLabel}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Cập nhật trạng thái bài đăng</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
