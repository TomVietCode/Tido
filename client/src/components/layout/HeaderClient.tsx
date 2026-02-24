"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import UserDropDown from "@/components/auth/UserDropDown"
import AuthDialog from "@/components/auth/AuthDialog"
import { Search, MessageCircleMore, Bell, FileText, Home, FolderUp, Menu, X } from "lucide-react"
import { Session } from "next-auth"
import { useUnreadCount } from "@/lib/hooks/useUnreadCount"

interface HeaderClientProps {
  session: Session | null
}

export default function HeaderClient({ session }: HeaderClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const totalUnread = useUnreadCount()
  
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center p-4">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 font-bold">
            <Image src="/logo.png" alt="Logo" width="140" height="60" />
          </Link>
        </div>

        {/* Search - Hidden on mobile */}
        <div className="relative hidden md:flex flex-1 items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm đồ thất lạc..."
            className="pl-10 text-base bg-slate-50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium mr-5.5">
            <Link
              href="/"
              className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80"
            >
              <Home className="h-5 w-5" />
              <span>Trang chủ</span>
            </Link>
          </nav>

          {session ? (
            <>
              <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
                <Link
                  href="/chats"
                  className="relative flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80 m-1"
                >
                  <div className="relative">
                    <MessageCircleMore className="h-5 w-5" />
                    {typeof totalUnread === 'number' && totalUnread > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}
                  </div>
                  <span>Chat</span>
                </Link>

                <Link
                  href="/posts"
                  className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  <FileText className="h-5 w-5" />
                  <span>Bài đăng</span>
                </Link>

                <Link
                  href="/notifications"
                  className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  <Bell className="h-5 w-5" />
                  <span>Thông báo</span>
                </Link>
              </nav>
              <Button className="ml-4 mr-6">
                <FolderUp />
                <Link href="/posts/new">Đăng Tin</Link>
              </Button>
              <UserDropDown user={session.user} />
            </>
          ) : (
            <>
              <nav className="hidden md:flex items-center gap-6 text-xs font-medium mr-3">
                <Link
                  href="/posts"
                  className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  <FileText className="h-5 w-5" />
                  <span>Bài đăng</span>
                </Link>
              </nav>

              <AuthDialog />
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden ml-auto p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className=" md:hidden fixed inset-x-0 top-14 z-40 border-t border-border/40 bg-background max-h-[calc(100vh-56px)] overflow-y-auto">
          {/* Mobile Search */}
          <div className="p-4">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm đồ thất lạc..."
                className="pl-10 text-base bg-slate-50 border-border/50 focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-col p-4 pt-0 space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-foreground/60 transition-colors hover:text-foreground/80 p-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>Trang chủ</span>
            </Link>

            {session ? (
              <>
                <Link
                  href="/chats"
                  className="flex items-center gap-3 text-foreground/60 transition-colors hover:text-foreground/80 p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="relative">
                    <MessageCircleMore className="h-5 w-5" />
                    {typeof totalUnread === 'number' && totalUnread > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                        {totalUnread > 99 ? "99+" : totalUnread}
                      </span>
                    )}
                  </div>
                  <span>Chat</span>
                </Link>

                <Link
                  href="/posts"
                  className="flex items-center gap-3 text-foreground/60 transition-colors hover:text-foreground/80 p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  <span>Bài đăng</span>
                </Link>

                <Link
                  href="/notifications"
                  className="flex items-center gap-3 text-foreground/60 transition-colors hover:text-foreground/80 p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Bell className="h-5 w-5" />
                  <span>Thông báo</span>
                </Link>

                <Link
                  href="/posts/new"
                  className="flex w-35 items-center gap-3 bg-primary text-primary-foreground p-3 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FolderUp className="h-5 w-5" />
                  <span>Đăng Tin</span>
                </Link>

                <div className="pt-4 border-t">
                  <UserDropDown user={session.user} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 text-sm font-medium ml-2">
                  <Link
                    href="/posts"
                    className="flex items-center gap-2 text-foreground/60 transition-colors hover:text-foreground/80"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Bài đăng</span>
                  </Link>
                </div>
                <div className="pt-2">
                  <AuthDialog />
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
