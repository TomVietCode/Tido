"use client"
import { Input } from "@/components/ui/input"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useConversations } from "@/lib/hooks/useConversations"
import { IMessage } from "@/types"
import { useCallback, useEffect, useRef, useState } from "react"

export default function ChatWindow({ conversationId }: { conversationId: string }) {
  const { socket } = useSocket()
  const { mutate: mutateConversations } = useConversations()
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      content: input.trim()
    })

    setInput("")
  }, [input, socket, conversationId])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }, [sendMessage])
  return (
    <div className="flex flex-col h-full">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
        ) : (
          messages.map((msg, i) => (
            <div key={msg.id || i} className="p-2 bg-slate-100 rounded-lg max-w-[70%]">
              {msg.message}
            </div>
          ))
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
