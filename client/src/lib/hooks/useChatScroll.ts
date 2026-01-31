import { IMessage } from "@/types"
import { useCallback, useLayoutEffect, useRef } from "react"

export function useChatScroll(messages: IMessage[], messagesContainerRef: any) {
  const prevScrollHeightRef = useRef(0)
  const prevMessagesLengthRef = useRef(messages.length)

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

  return { scrollToBottom }
}
