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

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: React.ReactNode
  itemName?: string
  onConfirm: () => void
  isDeleting?: boolean
  confirmText?: string
  confirmingText?: string
  cancelText?: string
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "Xác nhận xoá",
  description,
  itemName,
  onConfirm,
  isDeleting,
  confirmText = "Xoá",
  confirmingText = "Đang xoá...",
  cancelText = "Huỷ",
}: DeleteConfirmDialogProps) {
  const defaultDescription = itemName ? (
    <>
      Bạn có chắc chắn muốn xoá{" "}
      <span className="font-semibold text-foreground">&ldquo;{itemName}&rdquo;</span>?
    </>
  ) : (
    "Bạn có chắc chắn muốn thực hiện hành động này? Hành động này không thể hoàn tác."
  )

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ?? defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? confirmingText : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
