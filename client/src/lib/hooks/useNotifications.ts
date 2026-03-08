"use client"
import useSWR from "swr"
import { getNotifications } from "@/lib/actions/notification.action"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useEffect } from "react"
import { INotification } from "@/types"

const fetcher = async () => {
  const res = await getNotifications()
  if (!res.success || !res.data) throw new Error(res.message)
  return res.data
}

export function useNotifications() {
  const { socket } = useSocket()

  const { data: notifications, mutate, isLoading } = useSWR(
    "/api/notifications",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  )

  useEffect(() => {
    if (!socket) return

    const handleNewNotification = (notification: INotification) => {
      mutate((current) => {
        if (!current) return [notification]
        return [notification, ...current]
      }, false)
    }

    socket.on("new_notification", handleNewNotification)

    return () => {
      socket.off("new_notification", handleNewNotification)
    }
  }, [socket, mutate])

  return {
    notifications: notifications || [],
    mutate,
    isLoading,
  }
}
