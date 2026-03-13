"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  MoreHorizontalIcon,
  EyeIcon,
  EyeOffIcon,
  TrashIcon,
  ImageIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Pagination } from "@/components/ui/pagination"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"

import { AdminPostListItem, PostDetail } from "@/types"
import { PostStatus, PostType } from "@/types/enums"
import {
  getAdminPosts,
  getAdminPostDetail,
  adminDeletePost,
  adminToggleHidePost,
} from "@/lib/actions/admin-post.action"
import { ViewPostDetailDialog } from "./_components/ViewPostDetailDialog"
import dayjs from "dayjs"

export const statusMap: Record<
  PostStatus,
  { label: string; className: string }
> = {
  [PostStatus.OPEN]: { label: "Đang mở", className: "bg-green-100 text-green-700" },
  [PostStatus.CLOSED]: { label: "Đã đóng", className: "bg-gray-100 text-gray-700" },
  [PostStatus.HIDDEN]: { label: "Đã ẩn", className: "bg-red-100 text-red-700" },
}

export default function PostManagementPage() {
  const { data: session } = useSession()

  const [posts, setPosts] = useState<AdminPostListItem[]>([])
  const [meta, setMeta] = useState({ current: 1, pageSize: 10, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // View detail dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailPost, setDetailPost] = useState<PostDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingPost, setDeletingPost] = useState<AdminPostListItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchPosts = useCallback(
    async (p: number) => {
      if (!session?.user?.access_token) return
      setLoading(true)
      const res = await getAdminPosts({ page: p, limit: 10 }, session.user.access_token)
      if (res.success && res.data) {
        setPosts(res.data.result)
        setMeta(res.data.meta)
      }
      setLoading(false)
    },
    [session?.user?.access_token]
  )

  useEffect(() => {
    fetchPosts(page)
  }, [page, fetchPosts])

  // ─── View Detail ──────────────────────────────────────────
  const handleViewDetail = async (post: AdminPostListItem) => {
    if (!session?.user?.access_token) return
    setDetailDialogOpen(true)
    setDetailLoading(true)
    setDetailPost(null)
    const res = await getAdminPostDetail(post.id, session.user.access_token)
    if (res.success && res.data) {
      setDetailPost(res.data)
    } else {
      toast.error(res.message || "Không thể tải chi tiết bài đăng")
    }
    setDetailLoading(false)
  }

  // ─── Delete ──────────────────────────────────────────────
  const handleDeleteClick = (post: AdminPostListItem) => {
    setDeletingPost(post)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingPost || !session?.user?.access_token) return
    setIsDeleting(true)
    const res = await adminDeletePost(deletingPost.id, session.user.access_token)
    setIsDeleting(false)

    if (res.success) {
      toast.success("Xoá bài đăng thành công")
      setDeleteDialogOpen(false)
      setDeletingPost(null)
      if (posts.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        fetchPosts(page)
      }
    } else {
      toast.error(res.message || "Xoá bài đăng thất bại")
    }
  }

  // ─── Toggle Hide ──────────────────────────────────────────
  const handleToggleHide = async (post: AdminPostListItem) => {
    if (!session?.user?.access_token) return
    const res = await adminToggleHidePost(post.id, session.user.access_token)
    if (res.success) {
      const newStatus =
        post.status === PostStatus.HIDDEN ? PostStatus.OPEN : PostStatus.HIDDEN
      toast.success(
        newStatus === PostStatus.HIDDEN ? "Đã ẩn bài đăng" : "Đã hiện bài đăng"
      )
      fetchPosts(page)
    } else {
      toast.error(res.message || "Thao tác thất bại")
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý bài đăng</h1>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Ảnh</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead>Người đăng</TableHead>
              <TableHead>Tạo lúc</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-16 text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span className="text-muted-foreground">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                  Không có bài đăng nào
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  {/* Image */}
                  <TableCell>
                    {post.images && post.images.length > 0 ? (
                      <div className="w-10 h-10 rounded-md overflow-hidden border bg-muted shrink-0">
                        <img
                          src={post.images[0]}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-md border bg-muted flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </TableCell>

                  {/* Content: title + category */}
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium truncate max-w-xs">{post.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {post.category?.name ?? "—"}
                      </p>
                    </div>
                  </TableCell>

                  {/* Author */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {post.user?.avatarUrl && (
                        <img
                          src={post.user.avatarUrl}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span className="text-sm">{post.user?.fullName ?? "—"}</span>
                    </div>
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {dayjs(post.createdAt).format("HH:mm DD/MM/YYYY")}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge className={statusMap[post.status]?.className ?? "bg-gray-100 text-gray-700"}>
                      {statusMap[post.status]?.label ?? post.status}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetail(post)}>
                          <EyeIcon />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleHide(post)}>
                          {post.status === PostStatus.HIDDEN ? (
                            <>
                              <EyeIcon />
                              Hiện bài đăng
                            </>
                          ) : (
                            <>
                              <EyeOffIcon />
                              Ẩn bài đăng
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteClick(post)}
                        >
                          <TrashIcon />
                          Xoá
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && meta.pages > 1 && (
        <Pagination
          current={meta.current}
          pages={meta.pages}
          total={meta.total}
          onPageChange={setPage}
        />
      )}

      {/* View Detail Dialog */}
      <ViewPostDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        post={detailPost}
        loading={detailLoading}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xoá bài đăng"
        itemName={deletingPost?.title}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}