import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getChatTimeAgo } from "@/lib/helpers/date"
import { IConversation } from "@/types"
import Link from "next/link"
import { memo, useMemo } from "react"

interface ConversationItemProps {
  conversation: IConversation
  isActive: boolean
  currentUserId: string
}
export const ConversationItem = memo(function ConversationItem({
  conversation,
  isActive,
  currentUserId,
}: ConversationItemProps) {
  const lastMessage = conversation.lastMessage

  const lastPreview = useMemo(() => {
    if (!lastMessage) return "Chưa có tin nhắn nào"
    if ((conversation.unreadCount || 0) > 1) {
      return `${conversation.unreadCount} tin nhắn mới`
    }
    const isMine = lastMessage.senderId === currentUserId
    return isMine ? `Bạn: ${lastMessage.content}` : `${lastMessage.content}`
  }, [lastMessage, currentUserId])

  return (
    <Link href={`/chats/${conversation.id}`} key={conversation.id}>
      <div
        className={`flex items-center gap-2 p-4 mx-2 rounded-md cursor-pointer transition-colors ${
          isActive ? "bg-blue-100 border-blue-200" : "hover:bg-gray-100"
        }`}
      >
        <Avatar className="size-10">
          <AvatarImage src={conversation.recipient.avatarUrl} />
          <AvatarFallback>{conversation.recipient.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex justify-between items-baseline mb-1">
            <h4 className={`text-sm font-medium truncate`}>{conversation.recipient.fullName}</h4>
            {lastMessage && (
              <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                {getChatTimeAgo(lastMessage.createdAt)}
              </span>
            )}
          </div>
          <p className={`text-xs truncate`}>
            {lastMessage ? (
              <span
                className={`${
                  !lastMessage?.isRead && lastMessage?.senderId !== currentUserId
                    ? "font-extrabold text-[0.8rem]"
                    : "text-slate-500"
                }`}
              >
                {lastPreview}
              </span>
            ) : (
              <span className="italic text-slate-400">Chưa có tin nhắn nào</span>
            )}
          </p>
        </div>
      </div>
    </Link>
  )
})
