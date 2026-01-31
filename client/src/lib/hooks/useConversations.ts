"use client"
import useSWR from "swr"
import { getConversations } from "@/lib/actions/chat.action"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useEffect } from "react"
import { IConversation, IMessage } from "@/types"

const fetcher = async () => {
  const result = await getConversations()
  if (!result.success) throw new Error(result.message)
  return result.data
}

export function useConversations(currentConversationId?: string) {
  const { socket } = useSocket()
  const { data: conversations, mutate } = useSWR("/api/conversations", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (data: IMessage) => {
      // Update conversations list when new message arrives
      mutate((current: any) => {
        if (!current) return current

        return current
          .map((conv: IConversation) => {
            if (conv.id === data.conversationId) {
              const isViewingConv = currentConversationId === data.conversationId
              return {
                ...conv,
                lastMessage: {
                  content: data.content,
                  senderId: data.senderId,
                  createdAt: data.createdAt,
                  isRead: data.isRead,
                },
                unreadCount: isViewingConv ? 0 : (conv.unreadCount || 0) + 1
              }
            }
            return conv
          })
          .sort((a: any, b: any) => {
            const aTime = a.lastMessage?.createdAt || a.updatedAt
            const bTime = b.lastMessage?.createdAt || b.updatedAt
            return new Date(bTime).getTime() - new Date(aTime).getTime()
          })
      }, false) //false = dont revalidate, just update cache
    }

    const handleMessagesRead = (data: { conversationId: string }) => {
      mutate((current: any) => {
        if (!current) return current

        return current.map((conv: IConversation) => {
          if (conv.id === data.conversationId) {
            return {
              ...conv,
              lastMessage: conv.lastMessage ? { ...conv.lastMessage, isRead: true } : undefined,
              unreadCount: 0, // reset unread count
            }
          }
          return conv
        })
      }, false)
    }

    socket.on("new_message", handleNewMessage)
    socket.on("conversation_updated", handleNewMessage)
    socket.on("messages_read", handleMessagesRead)

    return () => {
      socket.off("new_message", handleNewMessage)
      socket.off("conversation_updated", handleNewMessage)
      socket.off("messages_read", handleMessagesRead)
    }
  }, [socket, mutate, currentConversationId])

  return {
    conversations: conversations || [],
    currentConversation: conversations?.find((conv) => conv.id === currentConversationId),
    mutate,
  }
}
