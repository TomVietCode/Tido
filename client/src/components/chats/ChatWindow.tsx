"use client"
import ChatHeader from "@/components/chats/ChatHeader"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useChatScroll, useConversations, useInfiniteMessages } from "@/lib/hooks"
import { useChatSocket } from "@/lib/hooks/useChatSocket"
import { IMessage } from "@/types"
import { Session } from "next-auth"
import { useCallback, useEffect, useRef, useState } from "react"

interface IChatWindowProps {
  conversationId: string
  initialMessages: IMessage[]
  initialCursor: string | null
  initialHasMore: boolean
  session: Session
}
export default function ChatWindow({
  conversationId,
  initialMessages,
  initialCursor,
  initialHasMore,
  session,
}: IChatWindowProps) {
  const currentUserId = session?.user?.id
  const { socket } = useSocket()
  const { currentConversation } = useConversations(conversationId)

  // States
  const [input, setInput] = useState("")
  const [isRecipientTyping, setIsRecipientTyping] = useState(false)
  const isOwn = useCallback((senderId?: string) => senderId && currentUserId && senderId === currentUserId, [])

  // Hook for infinite scroll
  const { messages, isLoadingMore, hasMore, sentinelRef, addNewMessage, updateMessages } = useInfiniteMessages(
    conversationId,
    initialMessages,
    initialCursor,
    initialHasMore
  )

  // ref for scroll management
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const isInitialLoadRef = useRef(true)
  const { scrollToBottom } = useChatScroll(messages, messagesContainerRef)

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isInitialLoadRef.current) {
      scrollToBottom(false)
      isInitialLoadRef.current = false
    }
  }, [scrollToBottom])

  // socket events
  const handleNewMessage = (msg: IMessage) => {
    if (msg.conversationId === conversationId) {
      addNewMessage(msg)

      if (msg.senderId !== currentUserId) {
        socket?.emit("mark_as_read", { conversationId })
      }
    }
  }
  const handleMessagesRead = () => {
    updateMessages((prev) => prev.map((msg) => (msg.senderId === currentUserId ? { ...msg, isRead: true } : msg)))
  }
  useChatSocket(socket, conversationId, {
    onNewMessage: handleNewMessage,
    onMessagesRead: handleMessagesRead,
  })

  const sendMessage = () => {
    if (!input.trim() || !socket) return

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    socket.emit("stop_typing", { conversationId })
    isTypingRef.current = false

    socket.emit("send_message", {
      conversationId,
      content: input.trim(),
    })

    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (!socket || !conversationId) return

    if (!isTypingRef.current) {
      isTypingRef.current = true
      socket.emit("start_typing", { conversationId })
    }

    if (e.target.value.trim() === "") {
      socket.emit("stop_typing", { conversationId })
      isTypingRef.current = false
      return
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { conversationId })
      isTypingRef.current = false
    }, 1500)
  }

  useEffect(() => {
    if (!socket || !conversationId) return
    const handleStartTyping = (data: { userId: string; conversationId: string }) => {
      if (data.userId !== currentUserId && data.conversationId === conversationId) {
        setIsRecipientTyping(true)
      }
    }

    const handleStopTyping = (data: { userId: string; conversationId: string }) => {
      if (data.userId !== currentUserId && data.conversationId === conversationId) {
        setIsRecipientTyping(false)
      }
    }
    socket.on("user_typing", handleStartTyping)
    socket.on("user_stopped_typing", handleStopTyping)
    return () => {
      socket.off("user_typing", handleStartTyping)
      socket.off("user_stopped_typing", handleStopTyping)
    }
  }, [socket])

  useEffect(() => {
    if (isRecipientTyping) {
      scrollToBottom(true)
    }
  }, [isRecipientTyping, scrollToBottom])

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <ChatHeader conversation={currentConversation} />

      {/* Message area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 min-h-0 max-w-full p-4 space-y-2 overflow-y-auto bg-gray-50"
        style={{ overflowAnchor: "none" }}
      >
        {hasMore && (
          <div ref={sentinelRef} className="flex justify-center py-2">
            {isLoadingMore && <Spinner className="size-6 text-primary" />}
          </div>
        )}
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
                    className={`px-3 py-2 rounded-lg wrap-anywhere break-normal ${
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
        {isRecipientTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4 bg-white ">
        <div className="flex gap-2 ">
          <Input
            value={input}
            onChange={handleInputChange}
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
