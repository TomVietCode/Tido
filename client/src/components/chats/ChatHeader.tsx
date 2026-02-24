import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IConversation } from "@/types"
import Link from "next/link"

interface ChatHeaderProps {
  conversation?: IConversation
  draftRecipient?: { id: string; fullName: string; avatarUrl: string }
}

export default function ChatHeader({ conversation, draftRecipient }: ChatHeaderProps) {
  const recipient = conversation?.recipient ?? draftRecipient

  if (!recipient) {
    return (
      <div className="flex items-center justify-between border-b p-2 shadow-b shadow-md">
        <span className="text-sm font-semibold text-gray-700 p-1">Tin nhắn mới</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between border-b p-2 shadow-b shadow-md">
      <Link
        href={`/users/${recipient.id}`}
        className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-md transition-colors"
      >
        <Avatar className="size-10">
          <AvatarImage src={recipient.avatarUrl} />
          <AvatarFallback>{recipient.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-semibold truncate">{recipient.fullName}</span>
      </Link>
    </div>
  )
}
