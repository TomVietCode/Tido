import { auth } from "@/auth";
import ChatBox from "@/components/chats/ChatBox";
import ConversationList from "@/components/chats/ConversationList";
import { SocketProvider } from "@/lib/contexts/SocketContext";
import { notFound } from "next/navigation";

export default async function Chat() {
  const session = await auth()
  if (!session?.user?.id) {
    notFound()
  }
  const token = session.access_token
  
  return (
    <SocketProvider token={token}>
      <ConversationList conversations={[]} />
      <ChatBox conversationId={""} />
    </SocketProvider>
  )
}