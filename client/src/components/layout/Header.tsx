import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import UserDropDown from "@/components/auth/UserDropDown";
import AuthDialog from "@/components/auth/AuthDialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, MessageCircleMore, Bell, FileText, Home, FolderUp } from "lucide-react";

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center p-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 font-bold">
            <Image src="/tido-logo.png" alt="Logo" width="70" height="70" loading="eager"/>
          </Link>
        </div>

        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />

          <Input
            type="text"
            placeholder="Tìm kiếm đồ thất lạc..."
            className="pl-10 text-base bg-slate-50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
            {/* Trang chủ */}
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80"
            >
              <Home className="h-5 w-5" />
              <span>Trang chủ</span>
            </Link>

            {/* Chat */}
            <Link
              href="/chats"
              className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80"
            >
              <MessageCircleMore className="h-5 w-5" />
              <span>Chat</span>
            </Link>

            {/* Bài đăng */}
            <Link
              href="/posts"
              className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80"
            >
              <FileText className="h-5 w-5" />
              <span>Bài đăng</span>
            </Link>

            {/* Thông báo */}
            <Link
              href="/notifications"
              className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80"
            >
              <Bell className="h-5 w-5" />
              <span>Thông báo</span>
            </Link>
          </nav>
          {session ? (
            <>
              <Button className="ml-6 mr-6">
                <FolderUp />
                <Link href="/posts/new">Đăng Tin</Link>
              </Button>
              <UserDropDown user={session.user} />
            </>
          ) : (
            <>
              <AuthDialog />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
