import { auth } from "@/auth";
import ChatSidebar from "@/components/chats/ChatSidebar";
import { SocketProvider } from "@/lib/contexts/SocketContext";
import { notFound } from "next/navigation";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) {
    notFound()
  }
  const token = session.user.access_token
  
  return (
    <SocketProvider token={token}>
      <div className="flex h-[calc(100dvh-3.6rem-3rem)] w-full bg-white overflow-hidden">
        <aside className={`block sm:w-60 md:w-[350px] border-r`}>
          <ChatSidebar currentUserId={session.user.id}/>
        </aside>
        <div className="block flex-1 md:w-[calc(100%-350px)]">
          {children}
        </div>
      </div>
    </SocketProvider>
  )
}