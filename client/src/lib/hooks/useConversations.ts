"use client"
import useSWR from 'swr'
import { getConversations } from "@/lib/actions/chat.action"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useEffect } from 'react'
import { Conversation, IMessage } from '@/types'

const fetcher = async () => {
  const result = await getConversations()
  if(!result.success) throw new Error(result.message)
  return result.data
}

export function useConversations() {
  const { socket } = useSocket()
  const { data: conversations, mutate } = useSWR(
    '/api/conversations',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true
    }
  )

  useEffect(() => {
    if(!socket) return

    const handleNewMessage = (data: IMessage) => {
      // Update conversations list when new message arrives
      mutate((current: Conversation[]) => {
        if (!current) return current

        return current.map((conv: Conversation) => {
          if (conv.id === data.conversationId) {
            return {
              ...conv,
              lastMessage: {
                content: data.message,
                senderId: data.senderId,
                createdAt: data.createdAt
              },
            }
          }
          return conv
        }).sort((a: any, b: any) => {
          const aTime = a.lastMessage?.createdAt || a.updatedAt
          const bTime = b.lastMessage?.createdAt || b.updatedAt
          return new Date(bTime).getTime() - new Date(aTime).getTime()
        })
      }, false) //false = dont revalidate, just update cache
    }

    socket.on('new_message', handleNewMessage)

    return () => {
      socket.off('new_message', handleNewMessage)
    }
  }, [socket, mutate])

  return {
    conversations: conversations || [],
    mutate
  }
}