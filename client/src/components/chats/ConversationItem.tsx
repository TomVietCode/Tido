import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getTimeAgo } from "@/lib/helpers/date"
import { Conversation } from "@/types"
import Link from "next/link"
import { memo, useMemo } from "react"

interface ConversationItemProps {
  conversation: Conversation,
  isActive: boolean
  currentUserId: string
}
export const ConversationItem = memo(function ConversationItem({ conversation, isActive, currentUserId }: ConversationItemProps) {
  const lastMessage = conversation.lastMessage
  const lastPreview = useMemo(() => {
    if (!lastMessage) return "Chưa có tin nhắn nào"
    const isMine = lastMessage.senderId === currentUserId
    const recipientShortName = conversation.recipient.fullName.split(" ").at(-1)
    const senderLabel = isMine ? "Bạn" : recipientShortName
    return `${senderLabel}: ${lastMessage.content}`
  }, [lastMessage, currentUserId, conversation.recipient.fullName])
  
  return (
    <Link href={`/chats/${conversation.id}`} key={conversation.id}>
      <div className={`flex items-center gap-2 p-4 border cursor-pointer transition-colors ${isActive ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`}>
        <Avatar>
          <AvatarImage src={conversation.recipient.avatarUrl} />
        </Avatar>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex justify-between items-baseline mb-1">
            <h4 className={`text-sm font-semibold truncate`}>{conversation.recipient.fullName}</h4>
            {lastMessage && (
              <span 
              className="text-[10px] text-slate-500 whitespace-nowrap ml-2"
              >
                {getTimeAgo(lastMessage.createdAt)}
              </span>
            )}
          </div>
          <p className={`text-xs truncate text-slate-500`}>
            {lastMessage ? lastPreview : <span className="italic text-slate-400">Chưa có tin nhắn nào</span>}
          </p>
        </div>
      </div>
    </Link>
  )
}) 