"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNotificationCount } from "@/lib/hooks/useNotificationCount"
import { useNotifications } from "@/lib/hooks/useNotifications"
import { markAllNotificationsAsRead } from "@/lib/actions/notification.action"
import NotificationItem from "./NotificationItem"
import { Separator } from "@/components/ui/separator"

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { count: unreadCount, mutate: mutateCount } = useNotificationCount()
  const { notifications, mutate: mutateNotifications, isLoading } = useNotifications()

  const handleRemove = (id: string) => {
    mutateNotifications(
      (current) => current?.filter((n) => n.id !== id),
      false,
    )
    mutateCount()
  }

  const handleRead = (id: string) => {
    mutateNotifications(
      (current) =>
        current?.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      false,
    )
    mutateCount()
  }

  const handleMarkAllRead = async () => {
    mutateNotifications(
      (current) => current?.map((n) => ({ ...n, isRead: true })),
      false,
    )
    mutateCount()
    await markAllNotificationsAsRead()
  }

  const hasUnread = typeof unreadCount === "number" && unreadCount > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center gap-1 text-foreground/60 transition-colors hover:text-foreground/80">
          <div className="relative">
            <Bell className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-medium">Thông báo</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-96 p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-sm font-semibold">Thông báo</h3>
          {hasUnread && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline"
            >
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>
        <Separator />
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="mb-2 h-8 w-8" />
              <p className="text-sm">Chưa có thông báo nào</p>
            </div>
          ) : (
            <div className="p-1">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRemove={handleRemove}
                  onRead={handleRead}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
