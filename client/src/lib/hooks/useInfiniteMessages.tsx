import { getMessages } from "@/lib/actions/chat.action"
import { IMessage } from "@/types"
import { useCallback, useRef, useState, useTransition } from "react"

interface UseInfiniteMessagesProps {
  conversationId: string
  initialMessages: IMessage[]
  initialCursor: string | null
  initialHasMore: boolean
  limit?: number
}

interface UseInfiniteMessagesReturn {
  messages: IMessage[]
  isLoadingMore: boolean
  hasMore: boolean
  loadMoreMessages: () => Promise<void>
  addNewMessage: (message: IMessage) => void
  sentinelRef: (node: HTMLDivElement | null) => void
  updateMessages: (updater: (prev: IMessage[]) => IMessage[]) => void
}

export function useInfiniteMessages({ 
  conversationId,
  initialMessages,
  initialCursor,
  initialHasMore,
  limit = 50,
}: UseInfiniteMessagesProps): UseInfiniteMessagesReturn {
  // state
  const [messages, setMessages] = useState<IMessage[]>(initialMessages)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)

  const [isPending, startTransition] = useTransition()

  const isLoadingRef = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // called when sentinel becomes visible
  const loadMoreMessages = useCallback(async () => {
    // prevent duplicate requests
    if (isLoadingRef.current || !hasMore || !cursor) return

    isLoadingRef.current = true

    try {
      const result = await getMessages(conversationId, limit, cursor)
      
      if (!result.success || !result.data) return

      const { messages: newMessages, nextCursor, hasMore: moreAvailable } = result.data

      startTransition(() => {
        setMessages((prev) => [...newMessages, ...prev])
        setCursor(nextCursor)
        setHasMore(moreAvailable)
      })
    } catch (error) {
      console.error("Error loading more messages:", error)
    } finally {
      isLoadingRef.current = false
    }
  }, [conversationId, limit, cursor, limit])

  // add new message to the end
  const addNewMessage = useCallback((msg: IMessage) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    if (!node) return

    // create new observer
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries
      if (entry.isIntersecting && !isLoadingRef.current && hasMore) {
        loadMoreMessages()
      }
    }, {
      // trigger when sentinel is 100px from viewport
      rootMargin: "100px 0px 0px 0px",
      threshold: 0,
    })

    observerRef.current.observe(node)
  }, [hasMore, loadMoreMessages])

  const updateMessages = useCallback(
    (updater: (prev: IMessage[]) => IMessage[]) => {
      setMessages(updater)
    },
    []
  )

  return {
    messages,
    isLoadingMore: isPending,
    hasMore,
    loadMoreMessages,
    addNewMessage,
    sentinelRef,
    updateMessages,
  }
}

