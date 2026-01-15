"use client"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { getTimeAgo } from "@/lib/helpers/date"
import { Conversation } from "@/types"
import Link from "next/link"

interface ChatSidebarProps {
  conversations: Conversation[]
}
export default function ChatSidebar({ conversations }: ChatSidebarProps) {
  return (
    <div className="h-full flex flex-col">
      <h1>Tin nhắn</h1>
      {/* Search input */}
      <Input type="text" placeholder="Tìm kiếm" className="w-full p-2 border rounded-md" />

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => (
          <Link href={`/chats/${conversation.id}`} key={conversation.id}>
            <div className="flex items-center gap-2 p-4 border cursor-pointer">
              <Avatar>
                <AvatarImage src={conversation.recipient.avatarUrl} />
              </Avatar>
              <div className="flex flex-1 flex-col overflow-hidden">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-sm font-semibold truncate`}>{conversation.recipient.fullName}</h4>
                  {conversation.lastMessage && (
                    <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">{getTimeAgo(conversation.lastMessage.createdAt.toString())}</span>
                  )}
                </div>
                <p className={`text-xs truncate text-slate-500`}>
                  {conversation.lastMessage ? (
                    conversation.lastMessage.content
                  ) : (
                    <span className="italic text-slate-400">Chưa có tin nhắn nào</span>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
