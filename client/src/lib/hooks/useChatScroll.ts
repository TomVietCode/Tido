import { IMessage } from "@/types"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

export function useChatScroll(messages: IMessage[], messagesContainerRef: any) {
  const [showScrollButton, setShowScrollButton] = useState(false)
  const prevScrollHeightRef = useRef(0)
  const prevMessagesLengthRef = useRef(messages.length)
  const isInitialLoadRef = useRef(true)

  const scrollToBottom = useCallback((smooth = false) => {
    if (!messagesContainerRef) return
    const container = messagesContainerRef.current

    setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      })
    }, 0)
  }, [])

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isInitialLoadRef.current) {
      scrollToBottom(false)
      isInitialLoadRef.current = false
    }
  }, [scrollToBottom])

  const handleShowScrollBtn = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    const isNearBottom = distanceFromBottom < 150
    setShowScrollButton(!isNearBottom)
  }, [])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return
    container.addEventListener("scroll", handleShowScrollBtn)
    return () => container.removeEventListener("scroll", handleShowScrollBtn)
  }, [handleShowScrollBtn])

  // handle scroll jump when prepending messages
  useLayoutEffect(() => {
    if (!messagesContainerRef) return
    const container = messagesContainerRef.current

    const currentMessagesLength = messages.length
    const prevMessagesLength = prevMessagesLengthRef.current

    //cal how many messages were prepended
    const prependedCount = currentMessagesLength - prevMessagesLength
    if (prependedCount > 0 && prevScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight
      const heightDiff = newScrollHeight - prevScrollHeightRef.current

      container.scrollTop += heightDiff
    }

    prevScrollHeightRef.current = container.scrollHeight
    prevMessagesLengthRef.current = currentMessagesLength
  }, [messages])

  return { scrollToBottom, showScrollButton }
}
