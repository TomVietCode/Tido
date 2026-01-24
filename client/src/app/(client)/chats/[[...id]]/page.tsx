import NotFound from "@/app/(client)/not-found";
import { auth } from "@/auth";
import ChatWindow from "@/components/chats/ChatWindow";
import { getMessages } from "@/lib/actions/chat.action";

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
  const res = await getMessages(id, 50, 0)
  if (!res.success) {
    return <div>Error: {res.message}</div>
  }
  return (
    <ChatWindow conversationId={id} initialMessages={res.data} session={session} />
  )
}