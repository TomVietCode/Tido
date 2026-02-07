import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"

export function useChatScroll(messagesContainerRef: any, messageLength: number) {
  const [showScrollButton, setShowScrollButton] = useState(false)
  const prevScrollHeightRef = useRef(0)
  const prevMessageLengthRef = useRef(messageLength)

  const scrollToBottom = useCallback((smooth = false) => {
    const container = messagesContainerRef.current
    if (!container) return

    if (smooth) {
      container.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      container.scrollTop = 0
    }
  }, [messagesContainerRef])

  // calculate distance from bottom
  const getDistanceFromBottom = useCallback(() => {
    const container = messagesContainerRef.current
    if (!container) return 0

    return Math.abs(container.scrollTop)
  }, [])

  //restore scroll position after prepending older messages
  useLayoutEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const addedCount = messageLength - prevMessageLengthRef.current
    const prevHeight = prevScrollHeightRef.current
    const newHeight = container.scrollHeight
    
    if (addedCount > 1 && prevHeight > 0 && newHeight > prevHeight) {
      const heightDiff = newHeight - prevHeight
      container.scrollTop += heightDiff
    }

    prevScrollHeightRef.current = newHeight
    prevMessageLengthRef.current = messageLength
  }, [messageLength, messagesContainerRef])
  
  // show/hide scroll to bottom btn
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return
    const handleScroll = () => {
      setShowScrollButton(getDistanceFromBottom() > 200)
      prevScrollHeightRef.current = container.scrollHeight
    }
    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [messagesContainerRef])


  return { scrollToBottom, showScrollButton, getDistanceFromBottom }
}
