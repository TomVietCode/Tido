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
      <div className="flex flex-1 h-full w-full overflow-hidden bg-white">
        <aside className={`block w-80 md:w-[350px] border-r`}>
          <ChatSidebar/>
        </aside>
        <main className="block flex-1">
          {children}
        </main>
      </div>
    </SocketProvider>
  )
}