"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getChatTimeAgo } from "@/lib/helpers/date"
import { IConversation } from "@/types"
import { MoreHorizontal, Trash2, UserRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { memo, useMemo, useState } from "react"

interface ConversationItemProps {
  conversation: IConversation
  isActive: boolean
  currentUserId: string
  onDelete: (conversation: IConversation) => Promise<void>
}

export const ConversationItem = memo(function ConversationItem({
  conversation,
  isActive,
  currentUserId,
  onDelete,
}: ConversationItemProps) {
  const router = useRouter()
  const [openConfirm, setOpenConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const lastMessage = conversation.lastMessage
  const lastPreview = useMemo(() => {
    if (!lastMessage) return "Chưa có tin nhắn nào"
    if ((conversation.unreadCount || 0) > 1) return `${conversation.unreadCount} tin nhắn mới`
    const isMine = lastMessage.senderId === currentUserId
    return isMine ? `Bạn: ${lastMessage.content}` : lastMessage.content
  }, [lastMessage, currentUserId, conversation.unreadCount])

  const handleDelete = async () => {
    try {
      setDeleting(true)
      await onDelete(conversation)
      setOpenConfirm(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div
        className={`group relative mx-2 rounded-md p-4 transition-colors ${
          isActive ? "border border-blue-200 bg-blue-100" : "hover:bg-gray-100"
        }`}
      >
        <Link
          href={`/chats/${conversation.id}`}
          className="absolute inset-0 z-10 rounded-md"
          aria-label={`Mở cuộc trò chuyện với ${conversation.recipient.fullName}`}
        />

        <div className="relative z-0 flex items-center gap-2 pr-12">
          <Avatar className="size-10 shrink-0">
            <AvatarImage src={conversation.recipient.avatarUrl} />
            <AvatarFallback>{conversation.recipient.fullName.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <h4 className="mb-1 truncate text-sm font-medium">{conversation.recipient.fullName}</h4>
            <p className="truncate text-xs">
              {lastMessage ? (
                <span
                  className={
                    !lastMessage.isRead && lastMessage.senderId !== currentUserId
                      ? "text-[0.8rem] font-extrabold"
                      : "text-slate-500"
                  }
                >
                  {lastPreview} · {getChatTimeAgo(lastMessage.createdAt)}
                </span>
              ) : (
                <span className="italic text-slate-400">Chưa có tin nhắn nào</span>
              )}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              className="
              absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border/70 
              bg-background/90 shadow-sm transition-opacity duration-150 group-hover:opacity-100
              "
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center" className="z-30" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => router.push(`/users/${conversation.recipient.id}`)}>
              <UserRound className="mr-2 size-4" />
              Trang cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setOpenConfirm(true)}>
              <Trash2 className="mr-2 size-4" />
              Xóa cuộc trò chuyện
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent className="max-w-sm" size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa cuộc trò chuyện?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa cuộc trò chuyện này? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* full-width buttons */}
          <AlertDialogFooter className="sm:flex-col">
            <AlertDialogCancel className="sm:w-full" disabled={deleting}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" className="sm:w-full" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})
