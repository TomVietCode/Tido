import NotFound from "@/app/(client)/not-found"
import { auth } from "@/auth"
import ChatWindow from "@/components/chats/ChatWindow"
import { getMessages } from "@/lib/actions/chat.action"
import { redirect } from "next/navigation"

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session) {
    return NotFound()
  }
  if (!id) {
    return (
      <div className="hidden h-full items-center justify-center gap-3 border-b p-4 md:flex bg-gray-50">
        <h1>Mở một cuộc hội thoại để bắt đầu</h1>
      </div>
    )
  }
  const convId = id[0]
  const isDraft = convId.startsWith("draft_")
  const draftRecipientId = isDraft ? convId.replace("draft_", "") : undefined

  let initialMessages: any[] = []
  let initialCursor: string | null = null
  let initialHasMore: boolean = true

  if (!isDraft) {
    const res = await getMessages(convId, 50)
    if (!res.success) {
      if (res.statusCode === 403 || res.statusCode === 404) {
        redirect("/chats")
      }
    }

    if (res.success && res.data) {
      initialMessages = res.data.messages
      initialCursor = res.data.nextCursor
      initialHasMore = res.data.hasMore
    }
  }
  return (
    <ChatWindow
      conversationId={isDraft ? undefined : convId}
      draftRecipientId={draftRecipientId}
      initialMessages={initialMessages}
      initialCursor={initialCursor}
      initialHasMore={initialHasMore}
      session={session}
    />
  )
}
