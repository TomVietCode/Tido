"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"
import { MapPin, Folder, MessageCircle, Share2, ImageOff, User, Gift, Mail, Phone, Calendar, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ImageViewer } from "@/components/chats/ImageViewer"
import { PostDetail } from "@/types/post"
import { PostType } from "@/types/enums"
import { getPostTimeAgo } from "@/lib/helpers/date"
import { usePostContact } from "@/lib/hooks/usePostContact"
import AuthDialog from "@/components/auth/AuthDialog"
import QuestionDialog from "@/components/posts/list/QuestionDialog"
import dayjs from "dayjs"

interface PostDetailContentProps {
  post: PostDetail
}

export default function PostDetailContent({ post }: PostDetailContentProps) {
  const {
    isOwner,
    isContacting,
    handleContact,
    showAuthDialog,
    setShowAuthDialog,
    showQuestionDialog,
    setShowQuestionDialog,
  } = usePostContact({
    postId: post.id,
    postUserId: post.userId,
    postType: post.type,
    securityQuestion: post.securityQuestion,
  })

  const [selectedImage, setSelectedImage] = useState(0)
  const [showViewer, setShowViewer] = useState(false)

  const isLost = post.type === PostType.LOST
  const hasImages = post.images?.length > 0

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Đã sao chép liên kết!")
    } catch {
      toast.error("Không thể sao chép liên kết.")
    }
  }

  return (
    <div className="min-h-[calc(100svh-7rem)] bg-background">
      <div className="mx-auto lg:w-6xl max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => hasImages && setShowViewer(true)}
              className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted cursor-pointer"
            >
              {hasImages ? (
                <Image
                  src={post.images[selectedImage]}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageOff className="h-16 w-16 text-muted-foreground/40" />
                </div>
              )}
            </button>

            {post.images?.length > 1 ? (
              <div className="flex gap-2">
                {post.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative flex-1 aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === idx
                        ? "ring-2 ring-primary ring-offset-2"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${post.title} - ảnh ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 20vw, 10vw"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {/* Right Column: Post Details */}
          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={`select-none text-sm ${
                    isLost
                      ? "bg-orange-400 text-white hover:bg-orange-500"
                      : "bg-chart-2 text-white hover:bg-chart-3"
                  }`}
                >
                  {isLost ? "Thất lạc" : "Tìm thấy"}
                </Badge>

                {post.hasReward ? (
                  <Badge className="select-none text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                    Có hậu tạ
                  </Badge>
                ) : null}
              </div>

              <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                {post.title}
              </h1>

              <p className="text-sm text-muted-foreground">
                Đã đăng: {getPostTimeAgo(post.createdAt)}
              </p>
            </div>

            <Separator />

            <div className="flex flex-col gap-4">
              {post.user ? (
                <Link
                  href={`/user/${post.userId}`}
                  className="flex items-center gap-3 rounded-lg p-2 -m-2 transition-colors hover:bg-muted/60"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.user.avatarUrl} alt={post.user.fullName} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">Người đăng</p>
                    <p className="font-medium">{post.user.fullName}</p>
                  </div>
                </Link>
              ) : null}

              {post.location ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vị trí</p>
                    <p className="font-medium">{post.location}</p>
                  </div>
                </div>
              ) : null}
              {post.happenedAt ? (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{post.type === PostType.LOST ? "Mất ngày" : "Tìm thấy ngày"}</p>
                    <p className="font-medium">{dayjs(post.happenedAt).format("DD/MM/YYYY")}</p>
                  </div>
                </div>
              ) : null}
              {post.category ? (
                <Link
                  href={`/posts?catSlug=${post.category.slug}`}
                  className="flex items-center gap-3 rounded-lg p-2 -m-2 transition-colors hover:bg-muted/60"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Folder className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Danh mục</p>
                    <p className="font-medium">{post.category.name}</p>
                  </div>
                </Link>
              ) : null}
            </div>

            {post.contactVisible && post.user ? (
              <>
                <Separator />
                <h2 className="text-lg font-semibold">Thông tin liên hệ</h2>
                <div className="flex flex-row justify-between">
                  {post.user.email ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <a href={`mailto:${post.user.email}`} className="font-medium text-primary hover:underline">
                          {post.user.email}
                        </a>
                      </div>
                    </div>
                  ) : null}
                  {post.user.phoneNumber ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Số điện thoại</p>
                        <a href={`tel:${post.user.phoneNumber}`} className="font-medium text-primary hover:underline">
                          {post.user.phoneNumber}
                        </a>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            {post.description ? (
              <>
                <Separator />
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Mô tả chi tiết</h2>
                  <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {post.description}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {isOwner ? (
            <Button
              size="lg"
              className="w-full cursor-pointer gap-2 sm:w-auto sm:min-w-[200px]"
              asChild
            >
              <Link href={`/posts/${post.id}/edit`}>
                <Pencil className="h-5 w-5" />
                Chỉnh sửa bài viết
              </Link>
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full cursor-pointer gap-2 sm:w-auto sm:min-w-[200px]"
              onClick={handleContact}
              disabled={isContacting}
            >
              <MessageCircle className="h-5 w-5" />
              {isContacting ? "Đang xử lý..." : "Liên hệ ngay"}
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            className="w-full cursor-pointer gap-2 sm:w-auto sm:min-w-[200px]"
            onClick={handleShare}
          >
            <Share2 className="h-5 w-5" />
            Chia sẻ tin này
          </Button>
        </div>
      </div>

      {hasImages ? (
        <ImageViewer
          images={post.images}
          initialIndex={selectedImage}
          open={showViewer}
          onOpenChange={setShowViewer}
        />
      ) : null}
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      <QuestionDialog
        open={showQuestionDialog}
        onOpenChange={setShowQuestionDialog}
        postId={post.id}
        question={post.securityQuestion!}
      />
    </div>
  )
}
