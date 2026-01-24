"use client"
import { ConversationItem } from "@/components/chats/ConversationItem"
import { Input } from "@/components/ui/input"
import { useConversations } from "@/lib/hooks/useConversations"
import { Conversation } from "@/types"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

interface IChatSidebarProps {
  currentUserId: string
}
export default function ChatSidebar({ currentUserId }: IChatSidebarProps) {
  const { conversations } = useConversations()
  const pathname = usePathname()
  const activeId = useMemo(() => {
    const match = pathname?.match(/\/chats\/([^/]+)/)
    return match ? match[1] : null
  }, [pathname])

  return (
    <div className="h-full flex flex-col gap-4">
      <h1>Tin nhắn</h1>
      {/* Search input */}
      <Input type="text" placeholder="Tìm kiếm" className="w-full p-2 border rounded-md" />

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Chưa có cuộc trò chuyện nào
          </div>
        ) : (
          conversations.map((conversation: Conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeId === conversation.id}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  )
}
