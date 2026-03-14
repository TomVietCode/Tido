"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserIcon, FileText, Bookmark, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProfileSidebarProps {
  fullName: string
  email: string
  avatarUrl?: string
}

const navItems = [
  { href: "/me", label: "Thông tin chung", icon: UserIcon, exact: true },
  { href: "/me/my-posts", label: "Tin đã đăng", icon: FileText },
  { href: "/me/saved-posts", label: "Tin đã lưu", icon: Bookmark },
  { href: "/me/setting", label: "Cài đặt", icon: Settings },
]

export default function ProfileSidebar({ fullName, email, avatarUrl }: ProfileSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="rounded-xl border bg-card p-4 shadow-sm lg:sticky lg:top-20 lg:p-6">
        <div className="flex items-center gap-3 border-b pb-4 lg:flex-col lg:gap-2 lg:pb-5">
          <Avatar className="h-14 w-14 lg:h-16 lg:w-16">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="text-lg">{fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-left lg:text-center">
            <p className="font-semibold text-sm">{fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <nav className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:mt-4 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors lg:gap-3 lg:py-2.5",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
