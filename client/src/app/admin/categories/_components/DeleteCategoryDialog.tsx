"use client"

import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog"

interface DeleteCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryName: string
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  categoryName,
  onConfirm,
  isDeleting,
}: DeleteCategoryDialogProps) {
  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Xác nhận xoá danh mục"
      itemName={categoryName}
      onConfirm={onConfirm}
      isDeleting={isDeleting}
    />
  )
}
