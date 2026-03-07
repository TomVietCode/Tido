"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { PostDetail } from "@/types"
import { PostStatus, PostType } from "@/types/enums"
import dayjs from "dayjs"
import { statusMap } from "../page"

interface ViewPostDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: PostDetail | null
  loading?: boolean
}

const typeMap: Record<PostType, string> = {
  [PostType.LOST]: "Thất lạc",
  [PostType.FOUND]: "Tìm thấy",
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—"
  return dayjs(date).format("HH:mm DD/MM/YYYY")
}

export function ViewPostDetailDialog({
  open,
  onOpenChange,
  post,
  loading,
}: ViewPostDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết bài đăng</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
            <span className="ml-2 text-muted-foreground">Đang tải...</span>
          </div>
        ) : !post ? (
          <div className="text-center py-12 text-muted-foreground">
            Không tìm thấy bài đăng
          </div>
        ) : (
          <div className="space-y-5">
            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {post.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-muted">
                    <img
                      src={img}
                      alt={`Ảnh ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Title & Status */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={statusMap[post.status]?.className ?? "bg-gray-100 text-gray-700"}>
                  {statusMap[post.status]?.label ?? post.status}
                </Badge>
                <Badge className={`${post.type === PostType.LOST ? "bg-orange-400" : "bg-chart-2"}`}>{typeMap[post.type] ?? post.type}</Badge>
                {post.hasReward && <Badge className="bg-yellow-200 text-yellow-700">Có hậu tạ</Badge>}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Danh mục</span>
                <p className="font-medium">{post.category?.name ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Người đăng</span>
                <div className="flex items-center gap-2 mt-0.5">
                  {post.user?.avatarUrl && (
                    <img
                      src={post.user.avatarUrl}
                      alt=""
                      className="w-5 h-5 rounded-full"
                    />
                  )}
                  <p className="font-medium">{post.user?.fullName ?? "—"}</p>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Email</span>
                <p className="font-medium">{post.user?.email ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Số điện thoại</span>
                <p className="font-medium">{post.user?.phoneNumber ?? "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Thời gian xảy ra</span>
                <p className="font-medium">{formatDate(post.happenedAt)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Ngày tạo</span>
                <p className="font-medium">{formatDate(post.createdAt)}</p>
              </div>
              {post.location && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Địa điểm</span>
                  <p className="font-medium">{post.location}</p>
                </div>
              )}
              {post.securityQuestion && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Câu hỏi bảo mật</span>
                  <p className="font-medium">{post.securityQuestion}</p>
                </div>
              )}
            </div>

            {/* Description */}
            {post.description && (
              <div>
                <span className="text-sm text-muted-foreground">Mô tả</span>
                <p className="text-sm mt-1 whitespace-pre-wrap">{post.description}</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
