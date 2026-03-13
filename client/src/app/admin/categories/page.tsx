"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { MoreHorizontalIcon, PencilIcon, PlusIcon, TrashIcon } from "lucide-react"

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

import { Category } from "@/types"
import { CategoryStatus } from "@/types/enums"
import { getCategoriesPaginated, deleteCategory } from "@/lib/actions/category.action"
import { CategoryDialog } from "./_components/CategoryDialog"
import { DeleteCategoryDialog } from "./_components/DeleteCategoryDialog"

export default function CategoriesManagementPage() {
  const { data: session } = useSession()

  const [categories, setCategories] = useState<Category[]>([])
  const [meta, setMeta] = useState({ current: 1, pageSize: 10, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCategories = useCallback(async (p: number) => {
    setLoading(true)
    const res = await getCategoriesPaginated({ page: p, limit: 10 })
    if (res.success && res.data) {
      setCategories(res.data.result)
      setMeta(res.data.meta)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCategories(page)
  }, [page, fetchCategories])

  const handleCreate = () => {
    setEditingCategory(null)
    setDialogOpen(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setDialogOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCategory || !session?.user?.access_token) return
    setIsDeleting(true)
    const res = await deleteCategory(deletingCategory.id, session.user.access_token)
    setIsDeleting(false)

    if (res.success) {
      toast.success("Xoá danh mục thành công")
      setDeleteDialogOpen(false)
      setDeletingCategory(null)
      // If current page becomes empty after deletion, go to previous page
      if (categories.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        fetchCategories(page)
      }
    } else {
      toast.error(res.message || "Xoá danh mục thất bại")
    }
  }

  const handleDialogSuccess = () => {
    fetchCategories(page)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý danh mục</h1>
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon />
          Thêm danh mục mới
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Tên danh mục</TableHead>
              <TableHead>Số lượng bài viết</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="w-16 text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span className="text-muted-foreground">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Không có danh mục nào
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell className="text-muted-foreground">
                    {(meta.current - 1) * meta.pageSize + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.postCount ?? 0}</TableCell>
                  <TableCell>
                    <Badge
                      className={category.status === CategoryStatus.ACTIVE ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                    >
                      {category.status === CategoryStatus.ACTIVE ? "Đang hoạt động" : "Đã ẩn"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontalIcon />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(category)}>
                          <PencilIcon />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteClick(category)}
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

      {/* Create/Edit dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSuccess={handleDialogSuccess}
      />

      {/* Delete confirmation dialog */}
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        categoryName={deletingCategory?.name ?? ""}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}
