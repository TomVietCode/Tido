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
    <aside className="w-64 shrink-0">
      <div className="sticky top-20 rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center gap-2 pb-5 border-b">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="text-lg">{fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-semibold text-sm">{fullName}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
        </div>

        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
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
