"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

import { Category } from "@/types"
import { CategoryStatus } from "@/types/enums"
import { categoryFormSchema, type CategoryFormValues } from "@/lib/schemas/category.schema"
import { createCategory, updateCategory } from "@/lib/actions/category.action"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category?: Category | null
  onSuccess: () => void
}

export function CategoryDialog({ open, onOpenChange, category, onSuccess }: CategoryDialogProps) {
  const { data: session } = useSession()
  const isEditing = !!category

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      status: CategoryStatus.ACTIVE,
      iconCode: "",
    },
  })

  useEffect(() => {
    if (open) {
      if (category) {
        form.reset({
          name: category.name,
          status: category.status,
          iconCode: category.iconCode ?? "",
        })
      } else {
        form.reset({
          name: "",
          status: CategoryStatus.ACTIVE,
          iconCode: "",
        })
      }
    }
  }, [open, category, form])

  const onSubmit = async (values: CategoryFormValues) => {
    const token = session?.user?.access_token
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn")
      return
    }

    const payload = {
      name: values.name,
      status: values.status,
      ...(values.iconCode ? { iconCode: values.iconCode } : {}),
    }

    const res = isEditing
      ? await updateCategory(category!.id, payload, token)
      : await createCategory(payload, token)

    if (res.success) {
      toast.success(isEditing ? "Cập nhật danh mục thành công" : "Thêm danh mục thành công")
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(res.message || "Đã có lỗi xảy ra")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin cho danh mục này."
              : "Điền thông tin để tạo danh mục mới."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập tên danh mục" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={CategoryStatus.ACTIVE}>Hoạt động</SelectItem>
                      <SelectItem value={CategoryStatus.INACTIVE}>Không hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã icon (tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: package, wallet, key..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Spinner />}
                {isEditing ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
