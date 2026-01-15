"use client"
import { useSocket } from "@/lib/contexts/SocketContext"
import { useEffect, useState } from "react"

export default function ChatWindow({ conversationId }: { conversationId: string }) {
  const { socket } = useSocket()
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    if (!socket) return

    socket.emit("join_room", { conversationId })

    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off("new_message")
    }
  }, [socket, conversationId])

  const sendMessage = () => {
    if (input.trim() === "") return
    socket?.emit("send_message", { conversationId, content: input })
    setInput("")
  }

  return (
    <div className="flex h-full items-center gap-3 p-4 border-b">
      <div className="flex-1 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className="mb-2 p-2 bg-slate-100 rounded">
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="border flex-1" />
        <button onClick={sendMessage} onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}className="bg-blue-500 text-white px-4">
          Gửi
        </button>
      </div>
    </div>
  )
}
