"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  MoreHorizontalIcon,
  ShieldIcon,
  ShieldOffIcon,
  BanIcon,
  UnlockIcon,
  TrashIcon,
} from "lucide-react"
import dayjs from "dayjs"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

import { AdminUserListItem } from "@/types"
import { UserRole, UserStatus } from "@/types/enums"
import {
  getAdminUsers,
  adminToggleBanUser,
  adminToggleRoleUser,
  adminDeleteUser,
} from "@/lib/actions/admin-user.action"

const statusMap: Record<UserStatus, { label: string; className: string }> = {
  [UserStatus.ACTIVE]: { label: "Hoạt động", className: "bg-green-100 text-green-700" },
  [UserStatus.BANNED]: { label: "Đã khoá", className: "bg-red-100 text-red-700" },
}

const roleMap: Record<UserRole, { label: string; variant: string }> = {
  [UserRole.CLIENT]: { label: "Người dùng", variant: "default" },
  [UserRole.ADMIN]: { label: "Quản trị viên", variant: "secondary" },
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function UsersManagementPage() {
  const { data: session } = useSession()

  const [users, setUsers] = useState<AdminUserListItem[]>([])
  const [meta, setMeta] = useState({ current: 1, pageSize: 10, pages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<AdminUserListItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchUsers = useCallback(
    async (p: number) => {
      if (!session?.user?.access_token) return
      setLoading(true)
      const res = await getAdminUsers({ page: p, limit: 10 }, session.user.access_token)
      if (res.success && res.data) {
        setUsers(res.data.result)
        setMeta(res.data.meta)
      }
      setLoading(false)
    },
    [session?.user?.access_token]
  )

  useEffect(() => {
    fetchUsers(page)
  }, [page, fetchUsers])

  // ─── Toggle Ban ──────────────────────────────────────────
  const handleToggleBan = async (user: AdminUserListItem) => {
    if (!session?.user?.access_token) return
    const res = await adminToggleBanUser(user.id, session.user.access_token)
    if (res.success) {
      const wasBanned = user.status === UserStatus.BANNED
      toast.success(wasBanned ? "Đã mở khoá tài khoản" : "Đã khoá tài khoản")
      fetchUsers(page)
    } else {
      toast.error(res.message || "Thao tác thất bại")
    }
  }

  // ─── Toggle Role ──────────────────────────────────────────
  const handleToggleRole = async (user: AdminUserListItem) => {
    if (!session?.user?.access_token) return
    const res = await adminToggleRoleUser(user.id, session.user.access_token)
    if (res.success) {
      const wasAdmin = user.role === UserRole.ADMIN
      toast.success(wasAdmin ? "Đã huỷ quyền quản trị" : "Đã cấp quyền quản trị")
      fetchUsers(page)
    } else {
      toast.error(res.message || "Thao tác thất bại")
    }
  }

  // ─── Delete ──────────────────────────────────────────────
  const handleDeleteClick = (user: AdminUserListItem) => {
    setDeletingUser(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingUser || !session?.user?.access_token) return
    setIsDeleting(true)
    const res = await adminDeleteUser(deletingUser.id, session.user.access_token)
    setIsDeleting(false)

    if (res.success) {
      toast.success("Xoá tài khoản thành công")
      setDeleteDialogOpen(false)
      setDeletingUser(null)
      if (users.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        fetchUsers(page)
      }
    } else {
      toast.error(res.message || "Xoá tài khoản thất bại")
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý người dùng</h1>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thông tin</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="w-16 text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    <span className="text-muted-foreground">Đang tải...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  {/* User Info: Avatar + Name + Email */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="text-sm">
                    {user.phoneNumber || "—"}
                  </TableCell>

                  {/* Role */}
                  <TableCell className="text-sm">
                    <Badge variant={roleMap[user.role]?.variant as "default" | "secondary" | "destructive" | "outline" | null | undefined}>
                      {roleMap[user.role]?.label ?? user.role}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <Badge className={statusMap[user.status]?.className ?? "bg-gray-100 text-gray-700"}>
                      {statusMap[user.status]?.label ?? user.status}
                    </Badge>
                  </TableCell>

                  {/* Created At */}
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {dayjs(user.createdAt).format("DD/MM/YYYY")}
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
                        <DropdownMenuItem onClick={() => handleToggleBan(user)}>
                          {user.status === UserStatus.BANNED ? (
                            <>
                              <UnlockIcon />
                              Mở khoá tài khoản
                            </>
                          ) : (
                            <>
                              <BanIcon />
                              Khoá tài khoản
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleRole(user)}>
                          {user.role === UserRole.ADMIN ? (
                            <>
                              <ShieldOffIcon />
                              Huỷ quyền admin
                            </>
                          ) : (
                            <>
                              <ShieldIcon />
                              Cấp quyền admin
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <TrashIcon />
                          Xoá tài khoản
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xoá tài khoản"
        itemName={deletingUser?.fullName}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  )
}
