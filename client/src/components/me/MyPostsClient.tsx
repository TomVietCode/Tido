"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import dayjs from "dayjs"
import { toast } from "sonner"
import { Pencil, Trash2, ImageIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"
import { EditPostDialog } from "@/components/me/EditPostDialog"

import { deletePost, updatePostStatus } from "@/lib/actions/post.action"
import { MyPostListItem } from "@/types"
import { PostStatus, PostType } from "@/types/enums"
import { cn } from "@/lib/utils"

interface MyPostsClientProps {
  initialPosts: MyPostListItem[]
  summary: { totalPosts: number; totalResolved: number }
  currentFilter: string
}

const filterTabs = [
  { key: "all", label: "Tất cả" },
  { key: "active", label: "Đang hiển thị" },
  { key: "closed", label: "Đã ẩn/Đã xong" },
]

export function MyPostsClient({
  initialPosts,
  summary,
  currentFilter,
}: MyPostsClientProps) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)

  // Sync posts state when server re-renders with new props (filter change)
  useEffect(() => {
    setPosts(initialPosts)
  }, [initialPosts])

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingPost, setDeletingPost] = useState<MyPostListItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)

  // ─── Filter ──────────────────────────────────────────────
  const handleFilterChange = (key: string) => {
    const params = key === "all" ? "/me/my-posts" : `/me/my-posts?filter=${key}`
    router.push(params)
  }

  // ─── Edit ────────────────────────────────────────────────
  const handleEditClick = (post: MyPostListItem) => {
    setEditingPostId(post.id)
    setEditDialogOpen(true)
  }

  // ─── Mark as found (OPEN → CLOSED) ──────────────────────
  const handleMarkResolved = async (post: MyPostListItem) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id ? { ...p, status: PostStatus.CLOSED } : p
      )
    )

    const res = await updatePostStatus(post.id, PostStatus.CLOSED)
    if (res.success) {
      toast.success("Đã cập nhật trạng thái bài đăng")
      router.refresh()
    } else {
      // Revert on failure
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, status: PostStatus.OPEN } : p
        )
      )
      toast.error(res.message || "Cập nhật thất bại")
    }
  }

  // ─── Delete ──────────────────────────────────────────────
  const handleDeleteClick = (post: MyPostListItem) => {
    setDeletingPost(post)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingPost) return
    setIsDeleting(true)

    const res = await deletePost(deletingPost.id)
    setIsDeleting(false)

    if (res.success) {
      toast.success("Xoá bài đăng thành công")
      setPosts((prev) => prev.filter((p) => p.id !== deletingPost.id))
      setDeleteDialogOpen(false)
      setDeletingPost(null)
      router.refresh()
    } else {
      toast.error(res.message || "Xoá bài đăng thất bại")
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Số tin đã đăng</p>
            <p className="text-3xl font-bold mt-1">{summary.totalPosts}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Đã đóng</p>
            <p className="text-3xl font-bold mt-1">{summary.totalResolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilterChange(tab.key)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-t-md transition-colors",
              currentFilter === tab.key
                ? "bg-white border border-b-transparent text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nội dung</TableHead>
              <TableHead>Ngày đăng</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  Chưa có tin đăng nào.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  {/* Product: thumbnail + title */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {post.images && post.images.length > 0 ? (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden border bg-muted shrink-0">
                          <Image
                            src={post.images[0]}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md border bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                      <span className="font-medium truncate max-w-xs">
                        {post.title}
                      </span>
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {dayjs(post.createdAt).format("DD/MM/YYYY")}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    {post.status === PostStatus.OPEN ? (
                      <Badge className="bg-yellow-100 text-yellow-700 border-transparent">
                        {post.type === PostType.LOST ? "Đang tìm" : "Đang tìm chủ nhân"}
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 border-transparent">
                        {post.type === PostType.LOST ? "Đã tìm thấy" : "Đã trao trả"}
                      </Badge>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditClick(post)}
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(post)}
                        title="Xoá"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {post.status === PostStatus.OPEN && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleMarkResolved(post)}
                        >
                          {post.type === PostType.LOST ? "Đã tìm thấy" : "Đã trao trả"}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        itemName={deletingPost?.title}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Edit Post Dialog */}
      <EditPostDialog
        postId={editingPostId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}
