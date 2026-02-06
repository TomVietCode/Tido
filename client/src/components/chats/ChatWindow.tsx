"use client"
import ChatHeader from "@/components/chats/ChatHeader"
import EmojiPicker from "@/components/chats/EmojiPicker"
import { MessageContent } from "@/components/chats/MessageContent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useSocket } from "@/lib/contexts/SocketContext"
import { uploadChatImage } from "@/lib/helpers/client-upload"
import { useChatScroll, useConversations, useInfiniteMessages } from "@/lib/hooks"
import { useChatSocket } from "@/lib/hooks/useChatSocket"
import { IMessage } from "@/types"
import { MessageType } from "@/types/enums"
import { ArrowDownIcon, ImageIcon, SmileIcon, X } from "lucide-react"
import { Session } from "next-auth"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { object } from "zod"

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
  const [unreadCount, setUnreadCount] = useState(0)
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
  const { scrollToBottom, showScrollButton } = useChatScroll(messages, messagesContainerRef)

  // socket events
  const handleNewMessage = (msg: IMessage) => {
    if (msg.conversationId === conversationId) {
      addNewMessage(msg)

      // scroll when near bottom or is my message
      const container = messagesContainerRef.current
      if (container) {
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
        const isNearBottom = distanceFromBottom < 150

        if (isNearBottom || msg.senderId === currentUserId) {
          setTimeout(() => scrollToBottom(true), 0)
        }
        if (msg.senderId !== currentUserId && isNearBottom) {
          socket?.emit("mark_as_read", { conversationId })
        }
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

  const sendMessage = async () => {
    if (!socket) return

    if (selectedImages.length > 0) {
      try {
        setIsUploading(true)
        const imageUrls = await Promise.all(
          selectedImages.map(async (image) => {
            return await uploadChatImage(image)
          })
        )

        socket.emit("send_message", {
          conversationId,
          content: input.trim(),
          type: MessageType.IMAGE,
          imageUrls
        })
        clearPreviewImages()
      } catch (error) {
        console.error("Upload failed", error)
        setIsUploading(false)
      } finally {
        setIsUploading(false)
      }
      return
    }

    if (!input.trim()) return
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
    if (!isRecipientTyping) return

    const container = messagesContainerRef.current
    if (!container) return

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    const isNearBottom = distanceFromBottom < 150

    if (isNearBottom) {
      requestAnimationFrame(() => {
        scrollToBottom(true)
      })
    }
  }, [isRecipientTyping, scrollToBottom])

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setSelectedImages([...selectedImages, ...files])

    // gen preview URL
    const objectUrls = Array.from(files).map((file) => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...objectUrls])
  }

  const removePreviewImage = (index: number) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
    setSelectedImages(selectedImages.filter((_, i) => i !== index))
  }
 
  const clearPreviewImages = () => {
    setImagePreviews([])
    setSelectedImages([])
  } 
  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => prev + emoji)
  }
  return (
    <div className="flex flex-col h-full relative">
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
              <MessageContent key={msg.id} msg={msg} mine={mine as boolean} isLastMsg={isLastMsg} />
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
      </div>

      {showScrollButton && (
        <Button
          onClick={() => {
            scrollToBottom(true)
            setUnreadCount(0)
          }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 
                 rounded-full bg-white shadow-lg border border-gray-100
                 text-primary font-medium text-sm
                 hover:bg-gray-50 transition-all active:scale-95"
          aria-label="Scroll to bottom"
        >
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          <ArrowDownIcon className="size-5" />
        </Button>
      )}

      {/* Input area */}
      <div className="border-t p-4 bg-white ">
        {/* Image Preview */}
        {imagePreviews && (
          <div className="p-2 flex gap-2">
            {imagePreviews.map((imagePreview, index) => (
              <div className="relative inline-block" key={index}>
                <Image 
                  src={imagePreview} 
                  alt="Preview" 
                  width={100} 
                  height={100} 
                  className="max-h-32 rounded-lg object-cover" 
                  priority={false} 
                  loading="lazy" 
                />
              <button
                onClick={() => removePreviewImage(index)}
                className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full p-0.5 hover:bg-red-600"
              >
                <X className="size-3" />
              </button>
            </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input type="file" multiple ref={fileInputRef} accept="image/*" onChange={handleImageSelect} className="hidden" />

          {/* Image button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
          >
            <ImageIcon className="size-5" />
          </button>

          {/* Emoji picker */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="h-full p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
            >
              <SmileIcon className="size-5" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">
                <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)}/>
              </div>
            )}
          </div>

          {/* Text input */}
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="flex-1 "
          />
          <button
            onClick={sendMessage}
            disabled={isUploading || (!input.trim() && selectedImages.length === 0)}
            className="bg-primary text-white px-6 rounded-md hover:bg-primary-600 transition-colors"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  )
}
