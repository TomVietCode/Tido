"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getChatTimeAgo } from "@/lib/helpers/date"
import { markNotificationAsRead } from "@/lib/actions/notification.action"
import { updateContactRequestStatus } from "@/lib/actions/contact-request.action"
import {
  type INotification,
  type FirstMessageNotification,
  type ContactRequestNotification,
  NotificationType,
} from "@/types"
import { MessageCircleMore, Check, X } from "lucide-react"

interface NotificationItemProps {
  notification: INotification
  onRemove: (id: string) => void
  onRead: (id: string) => void
  onClose: () => void
}

export default function NotificationItem({ notification, onRemove, onRead, onClose }: NotificationItemProps) {
  switch (notification.type) {
    case NotificationType.FIRST_MESSAGE:
      return (
        <FirstMessageItem
          notification={notification}
          onRead={onRead}
          onClose={onClose}
        />
      )
    case NotificationType.CONTACT_REQUEST:
      return (
        <ContactRequestItem
          notification={notification}
          onRemove={onRemove}
          onRead={onRead}
          onClose={onClose}
        />
      )
  }
}

function FirstMessageItem({
  notification,
  onRead,
  onClose,
}: {
  notification: FirstMessageNotification
  onRead: (id: string) => void
  onClose: () => void
}) {
  const router = useRouter()
  const { senderName, senderAvatar, conversationId } = notification.data

  const handleClick = async () => {
    if (!notification.isRead) {
      onRead(notification.id)
      markNotificationAsRead(notification.id).catch(() => {})
    }
    onClose()
    router.push(`/chats/${conversationId}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-accent",
        !notification.isRead && "bg-accent/50"
      )}
    >
      <Avatar className="mt-0.5 size-10 shrink-0">
        <AvatarImage src={senderAvatar ?? undefined} alt={senderName} />
        <AvatarFallback>{senderName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{senderName}</span>
          {" đã gửi tin nhắn cho bạn"}
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
          <MessageCircleMore className="h-3 w-3" />
          <span>{getChatTimeAgo(notification.createdAt)}</span>
        </div>
      </div>
      {!notification.isRead && (
        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  )
}

function ContactRequestItem({
  notification,
  onRemove,
  onRead,
  onClose,
}: {
  notification: ContactRequestNotification
  onRemove: (id: string) => void
  onRead: (id: string) => void
  onClose: () => void
}) {
  const router = useRouter()
  const [loading, setLoading] = useState<"accept" | "reject" | null>(null)
  const { requesterName, requesterAvatar, contactRequestId, postTitle, answerPreview } = notification.data

  const handleAccept = async () => {
    setLoading("accept")
    try {
      if (!notification.isRead) {
        onRead(notification.id)
        markNotificationAsRead(notification.id).catch(() => {})
      }
      const res = await updateContactRequestStatus(contactRequestId, "ACCEPTED")
      if (res.success && res.data?.conversationId) {
        onClose()
        router.push(`/chats/${res.data.conversationId}`)
      }
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async () => {
    setLoading("reject")
    onRemove(notification.id)
    if (!notification.isRead) {
      markNotificationAsRead(notification.id).catch(() => {})
    }
    try {
      await updateContactRequestStatus(contactRequestId, "REJECTED")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-lg p-3 transition-colors",
        !notification.isRead && "bg-accent/50"
      )}
    >
      <Avatar className="mt-0.5 size-10 shrink-0">
        <AvatarImage src={requesterAvatar ?? undefined} alt={requesterName} />
        <AvatarFallback>{requesterName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-semibold">{requesterName}</span>
          {" đã trả lời câu hỏi xác minh cho bài "}
          <span className="font-medium">&quot;{postTitle}&quot;</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
          Câu trả lời: &quot;{answerPreview}&quot;
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Button
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={handleAccept}
            disabled={loading !== null}
          >
            <Check className="mr-1 h-3 w-3" />
            Chấp nhận
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs"
            onClick={handleReject}
            disabled={loading !== null}
          >
            <X className="mr-1 h-3 w-3" />
            Từ chối
          </Button>
        </div>
        <span className="mt-1.5 block text-xs text-muted-foreground">
          {getChatTimeAgo(notification.createdAt)}
        </span>
      </div>
    </div>
  )
}
