import Link from "next/link"
import Image from "next/image"
import { auth } from "@/auth"
import UserDropDown from "@/components/auth/UserDropDown"
import AuthDialog from "@/components/auth/AuthDialog"
import { Button } from "../ui/button"


export default async function Header() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center p-4">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 font-bold">
            <Image src="/logo.jpg" alt="Logo" width="60" height="60" />
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden not-first:justify-end md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/chats" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Chat
            </Link>
            <Link href="/posts" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Bài đăng
            </Link>
            <Link href="/notifications" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Thông báo
            </Link>
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Trang chủ
            </Link>
          </nav>
          {session ? (
            <>
              <Button  >
                <Link href="/posts/new">
                  Tạo bài đăng
                </Link>
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
  )
}
