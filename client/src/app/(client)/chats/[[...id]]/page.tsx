import NotFound from "@/app/(client)/not-found"
import { auth } from "@/auth"
import ChatWindow from "@/components/chats/ChatWindow"
import { getMessages } from "@/lib/actions/chat.action"

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session) {
    return NotFound()
  }
  if (!id) {
    return (
      <div className="flex h-full items-center justify-center gap-3 p-4 border-b">
        <h1>Mở một cuộc hội thoại để bắt đầu</h1>
      </div>
    )
  }
  const convId = id[0]

  let initialMessages: any[] = []
  let initialCursor: string | null = null
  let initialHasMore: boolean = true

  const res = await getMessages(convId, 50)
  if (res.success && res.data) {
    initialMessages = res.data.messages
    initialCursor = res.data.nextCursor
    initialHasMore = res.data.hasMore
  }
  return (
    <ChatWindow
      conversationId={convId}
      initialMessages={initialMessages}
      initialCursor={initialCursor}
      initialHasMore={initialHasMore}
      session={session}
    />
  )
}
