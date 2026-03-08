"use client"
import useSWR from "swr"
import { getNotificationUnreadCount } from "@/lib/actions/notification.action"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useEffect } from "react"

const fetcher = async () => {
  const res = await getNotificationUnreadCount()
  if (!res.success || typeof res.data !== 'number') throw new Error(res.message)
  return res.data
}

export function useNotificationCount() {
  const { socket } = useSocket()

  const { data: count, mutate } = useSWR("/api/notification-unread-count", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  })

  useEffect(() => {
    if (!socket) return

    const triggerRevalidate = () => mutate()

    socket.on("new_notification", triggerRevalidate)

    return () => {
      socket.off("new_notification", triggerRevalidate)
    }
  }, [socket, mutate])

  return { count, mutate }
}
