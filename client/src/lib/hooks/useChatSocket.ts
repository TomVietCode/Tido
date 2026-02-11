import { IMessage } from "@/types"
import { useEffect } from "react"

export function useChatSocket(
  socket: any,
  conversationId: string,
  handlers: {
    onNewMessage: (msg: IMessage) => void
    onMessagesRead: () => void
  }
) {
  
  // handle socket events
  useEffect(() => {
    if (!socket || !conversationId) return

    socket.emit("join_room", { conversationId })
    socket.emit("mark_as_read", { conversationId })

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        socket.emit("mark_as_read", { conversationId })
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    socket.on("new_message", handlers.onNewMessage)
    socket.on("messages_read", handlers.onMessagesRead)

    return () => {
      socket.off("new_message", handlers.onNewMessage)
      socket.off("messages_read", handlers.onMessagesRead)
      socket.emit("leave_room", { conversationId })
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [socket, conversationId])
}
