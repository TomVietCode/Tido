"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useConversations } from "@/lib/hooks/useConversations"
import { IMessage } from "@/types"
import { Session } from "next-auth"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"

interface IChatWindowProps {
  conversationId: string
  initialMessages: IMessage[]
  session: Session
}
export default function ChatWindow({ conversationId, initialMessages, session }: IChatWindowProps) {
  const currentUserId = session?.user?.id
  const { socket } = useSocket()
  const { conversations, mutate: mutateConversations } = useConversations(conversationId)
  const conversation = conversations?.find((conv) => conv.id === conversationId)

  const [messages, setMessages] = useState<IMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isInitialLoadRef = useRef(true)

  const isOwn = useCallback(
    (senderId?: string) => senderId && currentUserId && senderId === currentUserId,
    [currentUserId]
  )

  const scrollToBottom = useCallback((smooth = false) => {
    const container = messagesContainerRef.current
    const endMarker = messagesEndRef.current
    if (!container || !endMarker) return

    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    })
  }, [])

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isInitialLoadRef.current) {
      scrollToBottom(false)
      isInitialLoadRef.current = false
      return
    }
    scrollToBottom(true)
  }, [messages.length, scrollToBottom])

  // handle socket events
  useEffect(() => {
    if (!socket || !conversationId) return

    socket.emit("join_room", { conversationId })
    socket.emit("mark_as_read", { conversationId })

    const handleNewMessage = (msg: IMessage) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg])

        if (msg.senderId !== currentUserId) {
          socket.emit("mark_as_read", { conversationId })
        }
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        socket.emit("mark_as_read", { conversationId })
      }
    }

    const handleMessagesRead = () => {
      setMessages((prev) => prev.map((msg) => (msg.senderId === currentUserId ? { ...msg, isRead: true } : msg)))
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    socket.on("new_message", handleNewMessage)
    socket.on("messages_read", handleMessagesRead)

    return () => {
      socket.off("new_message", handleNewMessage)
      socket.off("messages_read", handleMessagesRead)
      socket.emit("leave_room", { conversationId })
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [socket, conversationId, mutateConversations])

  const sendMessage = useCallback(() => {
    if (!input.trim() || !socket) return

    socket.emit("send_message", {
      conversationId,
      content: input.trim(),
    })

    setInput("")
  }, [input, socket, conversationId])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b p-2 shadow-b shadow-md">
        <Link
          href={`/users/${conversation?.recipient.id}`}
          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition-colors"
        >
          <Avatar className="size-10">
            <AvatarImage src={conversation?.recipient.avatarUrl} />
            <AvatarFallback>{conversation?.recipient.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold truncate">{conversation?.recipient.fullName}</span>
        </Link>
      </div>

      {/* Message area */}
      <div ref={messagesContainerRef} className="flex-1 min-h-0 p-4 space-y-2 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center items-center text-gray-500">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
        ) : (
          messages.map((msg, i) => {
            const mine = isOwn(msg.senderId)
            const isLastMsg = i === messages.length - 1
            return (
              <div key={msg.id || i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[60%] flex flex-col">
                  <div
                    className={`px-3 py-2 rounded-lg wrap-break-word ${
                      mine ? "bg-primary text-white rounded-br-none" : "bg-white text-slate-900 border rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {mine && isLastMsg && (
                    <span className="text-[10px] text-gray-500 text-right">{msg.isRead ? "Đã đọc" : "Đã gửi"}</span>
                  )}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4 bg-white ">
        <div className="flex gap-2 ">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="flex-1 "
          />
          <button
            onClick={sendMessage}
            className="bg-primary text-white px-6 rounded-md hover:bg-primary-600 transition-colors"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  )
}
