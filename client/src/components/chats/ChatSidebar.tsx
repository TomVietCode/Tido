"use client"
import { ConversationItem } from "@/components/chats/ConversationItem"
import { UserSearchItem } from "@/components/chats/UserSearchItem"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { createConversation, searchUsers } from "@/lib/actions/chat.action"
import { useConversations } from "@/lib/hooks"
import { IConversation, SearchUserResponse } from "@/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MoveLeft, SearchIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react"

interface IChatSidebarProps {
  currentUserId: string
}
export default function ChatSidebar({ currentUserId }: IChatSidebarProps) {
  const router = useRouter()
  const { conversations, mutate } = useConversations()
  const pathname = usePathname()

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchUserResponse[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Debounce search query
  const deferredQuery = useDeferredValue(searchQuery)

  const activeId = useMemo(() => {
    const match = pathname?.match(/\/chats\/([^/]+)/)
    return match ? match[1] : null
  }, [pathname])

  // Search user with debounced query
  useEffect(() => {
    if (deferredQuery.trim().length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    let cancelled = false
    setIsSearching(true)

    const doSearch = async () => {
      const res = await searchUsers(deferredQuery)
      if (cancelled) return
      setSearchResults(res.success ? res.data! : [])
      setIsSearching(false)
    }
    doSearch()

    return () => {
      cancelled = true
    }
  }, [deferredQuery])

  const handleSelectUser = useCallback(
    async (user: SearchUserResponse) => {
      const existingConv = conversations.find((conv: IConversation) => conv.recipient.id === user.id)
      if (existingConv) {
        router.push(`/chats/${existingConv.id}`)
      } else {
        const res = await createConversation(user.id)
        if (res.success && res.data) {
          mutate()
          router.push(`/chats/${res.data.id}`)
        }
      }
      setSearchQuery("")
    },
    [conversations, router, mutate]
  )

  const isShowingSearchResult = deferredQuery.trim().length >= 2
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex items-center justify-between mt-2 mx-2">
        <p className="font-bold  text-2xl text-gray-800">Tin Nhắn</p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => router.back()} variant="outline" size="icon-sm">
              <MoveLeft />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Quay lại trang trước</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Search input */}
      <div className="px-2">
        <InputGroup className="p-2 border rounded-2xl">
          <InputGroupInput
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {isShowingSearchResult ? (
          <>
            {isSearching ? (
              <div className="p-4 text-center text-sm text-gray-500">Đang tìm kiếm...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">Không tìm thấy kết quả</div>
            ) : (
              <>
                <p className="px-4 py-2 text-xs text-gray-500 uppercase">Kết quả tìm kiếm cho: {deferredQuery}</p>
                {searchResults.map((user) => (
                  <UserSearchItem key={user.id} user={user} onClick={() => handleSelectUser(user)} />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">Chưa có cuộc trò chuyện nào</div>
            ) : (
              conversations.map((conversation: IConversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isActive={activeId === conversation.id}
                  currentUserId={currentUserId}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  )
}
