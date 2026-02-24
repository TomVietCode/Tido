"use client"
import useSWR from "swr"
import { getUnreadCounts } from "@/lib/actions/chat.action"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useEffect } from "react"

const fetcher = async () => {
  const res = await getUnreadCounts()
  if (!res.success || typeof res.data !== 'number') throw new Error(res.message)
  return res.data
}

export function useUnreadCount() {
  const { socket } = useSocket()

  const { data: totalUnreadCount, mutate } = useSWR("/api/unread-counts", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  useEffect(() => {
    if (!socket) return

    const triggerRevalidate = () => mutate()

    socket.on("conversation_updated", triggerRevalidate)
    socket.on("messages_read", triggerRevalidate)

    return () => {
      socket.off("conversation_updated", triggerRevalidate)
      socket.off("messages_read", triggerRevalidate)
    }
  }, [socket, mutate])

  return totalUnreadCount
}