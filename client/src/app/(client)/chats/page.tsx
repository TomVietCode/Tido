import { auth } from "@/auth";
import ChatSidebar from "@/components/chats/ChatSidebar";
import ChatWindow from "@/components/chats/ChatWindow";
import { getConversations } from "@/lib/actions/chat.action";
import { SocketProvider } from "@/lib/contexts/SocketContext";
import { notFound } from "next/navigation";
import Error from "./error";

export default async function Chat() {
  const session = await auth()
  if (!session?.user?.id) {
    notFound()
  }
  const token = session.access_token
  const response = await getConversations()
  if (!response.success) {
    return <Error error={response.message} reset={() => {}} />
  }
  
  return (
    <SocketProvider token={token}>
      <div className="flex flex-1 h-full w-full overflow-hidden bg-white">
        <aside className={`block w-80 md:w-[350px] border-r`}>
          <ChatSidebar 
            conversations={response.data}  
          />
        </aside>
        <main className="block flex-1">
          <ChatWindow conversationId={""} />
        </main>
      </div>
    </SocketProvider>
  )
}