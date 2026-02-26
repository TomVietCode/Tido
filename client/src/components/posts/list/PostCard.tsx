"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CalendarDays, MapPin, ImageOff, MessageCircle, ArrowRight, Bookmark, Gift } from "lucide-react"
import { PostListItem } from "@/types/post"
import dayjs from "dayjs"
import { PostType } from "@/types/enums"
import { getPostTimeAgo } from "@/lib/helpers/date"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"
import AuthDialog from "@/components/auth/AuthDialog"
import { createConversation } from "@/lib/actions/chat.action"

interface PostCardProps {
  post: PostListItem
}

export default function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showQuestionDialog, setShowQuestionDialog] = useState(false)
  const [isContacting, setIsContacting] = useState(false)

  const handleContact = async () => {
    if (!session) {
      toast.warning("Bạn cần đăng nhập để thực hiện chức năng này!")
      setShowAuthDialog(true)
      return
    }

    if (post.type === PostType.FOUND && post.securityQuestion) {
      setShowQuestionDialog(true)
      return
    }

    await startConversation()
  }

  const startConversation = async () => {
    try {
      setIsContacting(true)
      const res = await createConversation(post.userId, post.id)
      if (res.success && res.data) {
        router.push(`/chats/${res.data.id}`)
      } else {
        toast.error(res.message ?? "Không thể tạo cuộc hội thoại")
      }
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.")
    } finally {
      setIsContacting(false)
    }
  }
  
  const isLost = post.type === PostType.LOST
  const hasImage = post.images?.length > 0
  const detailHref = `/posts/${post.id}`

  return (
    <Card className="group w-full overflow-hidden rounded-2xl py-0 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg gap-2">
      <div className="relative aspect-video w-full shrink-0 overflow-hidden">
        {hasImage ? (
          <Image
            src={post.images[0]}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <ImageOff className="h-10 w-10 text-muted-foreground/50" />
          </div>
        )}

        <Badge className={`absolute left-3 top-3 select-none ${isLost ? "bg-orange-400" : "bg-chart-2"}`}>
          {isLost ? "Thất lạc" : "Tìm thấy"}
        </Badge>

        <Button
          size="icon"
          variant="secondary"
          className="absolute right-3 top-3 h-8 w-8 rounded-full cursor-pointer opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        >
          <Bookmark className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col gap-4 px-4 pb-5">
        <div className="flex-1 space-y-2.5">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />· {getPostTimeAgo(post.createdAt)}
          </div>
          <Link href={detailHref} className="hover:underline">
            <h3 className="text-[15px] font-semibold leading-snug line-clamp-2">{post.title}</h3>
          </Link>

          <div className="space-y-1.5 text-sm text-muted-foreground">
            {post.happenedAt ? (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span>{dayjs(post.happenedAt).format("DD/MM/YYYY")}</span>
              </div>
            ) : null}

            {post.location ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{post.location}</span>
              </div>
            ) : null}
          </div>

          {post.hasReward ? (
            <Badge className="w-fit flex items-center gap-1 select-none bg-yellow-200 text-yellow-700">
              <Gift className="h-3.5 w-3.5" />
              Có hậu tạ
            </Badge>
          ) : null}
        </div>

        <div className="flex gap-3 shrink-0">
          {}
          <Button className="flex-1 gap-2 cursor-pointer" size="lg" onClick={handleContact}>
            <MessageCircle className="h-4 w-4" />
            Liên hệ
          </Button>
          <Button variant="outline" className="flex-1 gap-2 cursor-pointer" size="lg" asChild>
            <Link href={detailHref}>
              Chi tiết
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </Card>
  )
}
