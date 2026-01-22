"use client"
import { Input } from "@/components/ui/input"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useConversations } from "@/lib/hooks/useConversations"
import { IMessage } from "@/types"
import { Session } from "next-auth"
import { useCallback, useEffect, useRef, useState } from "react"

interface IChatWindowProps {
  conversationId: string
  initialMessages: IMessage[]
  session: Session
}
export default function ChatWindow({ conversationId, initialMessages, session }: IChatWindowProps) {
  const currentUserId = session?.user?.id
  const { socket } = useSocket()
  const { mutate: mutateConversations } = useConversations()
  const [messages, setMessages] = useState<IMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isOwn = useCallback(
    (senderId?: string) => senderId && currentUserId && senderId === currentUserId,
    [currentUserId]
  )
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // handle socket events
  useEffect(() => {
    if (!socket || !conversationId) return

    socket.emit("join_room", { conversationId })

    const handleNewMessage = (msg: IMessage) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev) => [...prev, msg])

        // update conversations list in sidebar
        mutateConversations()
      }
    }

    socket.on("new_message", handleNewMessage)

    return () => {
      socket.off("new_message", handleNewMessage)
      // socket.emit("leave_room", { conversationId })
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
      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
        ) : (
          messages.map((msg, i) => {
            const mine = isOwn(msg.senderId)
            return (
              <div key={msg.id || i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] wrap-break-word ${
                    mine ? "bg-primary text-white rounded-br-none" : "bg-white text-slate-900 border rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="flex-1 "
          />
          <button
            onClick={sendMessage}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-blue-600 trainsition-colors"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  )
}
