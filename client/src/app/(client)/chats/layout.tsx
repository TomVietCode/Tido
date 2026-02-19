import { auth } from "@/auth";
import ChatSidebar from "@/components/chats/ChatSidebar";
import { ChatSidebarSkeleton } from "@/components/chats/skeletons/SidebarSkeleton";
import { SocketProvider } from "@/lib/contexts/SocketContext";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) {
    notFound()
  }
  const token = session.user.access_token
  
  return (
    <SocketProvider token={token}>
      <div className="flex h-[calc(100dvh-3.6rem-3rem)] w-full flex-col overflow-hidden bg-white md:flex-row">
        <aside className="w-full min-h-0 md:max-w-xs border-r md:w-[350px] lg:max-w-[350px]">
          <Suspense fallback={<ChatSidebarSkeleton />}>
            <ChatSidebar currentUserId={session.user.id}/>
          </Suspense>
        </aside>
        <div className="min-h-0 w-full flex-1">
          {children}
        </div>
      </div>
    </SocketProvider>
  )
}