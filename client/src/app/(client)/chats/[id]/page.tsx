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
  const res = await getMessages(id, 50, 0)
  if (!res.success) {
    return <div>Error: {res.message}</div>
  }
  return (
    <ChatWindow conversationId={id} initialMessages={res.data} session={session} />
  )
}