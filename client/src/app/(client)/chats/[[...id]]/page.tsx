import NotFound from "@/app/(client)/not-found"
import { auth } from "@/auth"
import ChatWindow from "@/components/chats/ChatWindow"
import { getMessages, getUserById } from "@/lib/actions/chat.action"
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
  let draftRecipient: { id: string; fullName: string; avatarUrl: string } | undefined

  if (isDraft && draftRecipientId) {
    const userRes = await getUserById(draftRecipientId)
    if (userRes.success && userRes.data) {
      draftRecipient = {
        id: userRes.data.id,
        fullName: userRes.data.fullName,
        avatarUrl: userRes.data.avatarUrl || "",
      }
    }
  } else {
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
      draftRecipient={draftRecipient}
      initialMessages={initialMessages}
      initialCursor={initialCursor}
      initialHasMore={initialHasMore}
      session={session}
    />
  )
}
