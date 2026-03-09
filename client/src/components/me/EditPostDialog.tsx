"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { X, Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import FormErrorMessage from "@/components/ui/form-error-message"
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone"

import { getPost, updatePost } from "@/lib/actions/post.action"
import { getCategoryAction } from "@/lib/actions/category.action"
import { getPresignedUrl } from "@/lib/actions/upload.action"
import { uploadFile } from "@/lib/helpers/client-upload"
import { Category } from "@/types"
import { PostType } from "@/types/enums"
import { editPostSchema, EditPostValues } from "@/lib/schemas/post.schema"
import { zodResolver } from "@hookform/resolvers/zod"

interface EditPostDialogProps {
  postId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditPostDialog({
  postId,
  open,
  onOpenChange,
  onSuccess,
}: EditPostDialogProps) {
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [postType, setPostType] = useState<PostType | null>(null)

  // Existing images from the server (URLs)
  const [existingImages, setExistingImages] = useState<string[]>([])
  // New files picked by the user
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([])

  const {
    register,
    setValue,
    watch,
    formState,
    handleSubmit,
    reset,
  } = useForm<EditPostValues>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      contactVisible: false,
      hasReward: false,
    },
  })

  const categoryIdValue = watch("categoryId")
  const contactVisibleValue = watch("contactVisible")
  const hasRewardValue = watch("hasReward")

  // Fetch post detail + categories when dialog opens
  useEffect(() => {
    if (!open || !postId) return

    const fetchData = async () => {
      setLoading(true)
      const [postRes, catRes] = await Promise.all([
        getPost(postId),
        getCategoryAction(),
      ])

      if (postRes.success && postRes.data) {
        const p = postRes.data
        setPostType(p.type)
        setExistingImages(p.images ?? [])
        setNewFiles([])

        reset({
          title: p.title,
          categoryId: Number(p.categoryId),
          description: p.description ?? "",
          location: p.location ?? "",
          happenedAt: p.happenedAt
            ? new Date(p.happenedAt).toISOString().split("T")[0]
            : undefined,
          contactVisible: p.contactVisible ?? false,
          hasReward: p.hasReward ?? false,
          securityQuestion: p.securityQuestion ?? "",
        })
      } else {
        toast.error("Không thể tải thông tin bài đăng")
        onOpenChange(false)
      }

      if (catRes.success && catRes.data) {
        setCategories(catRes.data)
      }

      setLoading(false)
    }

    fetchData()
  }, [open, postId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Generate previews for new files
  useEffect(() => {
    if (newFiles.length === 0) {
      setNewFilePreviews([])
      return
    }
    const urls = newFiles.map((f) => URL.createObjectURL(f))
    setNewFilePreviews(urls)
    return () => urls.forEach((u) => URL.revokeObjectURL(u))
  }, [newFiles])

  const totalImages = existingImages.length + newFiles.length

  const handleDrop = (files: File[]) => {
    const remaining = 5 - existingImages.length
    const added = [...newFiles, ...files].slice(0, remaining)
    setNewFiles(added)
  }

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: EditPostValues) => {
    if (!postId) return

    // Upload new files
    let uploadedUrls: string[] = []
    if (newFiles.length > 0) {
      const results = await Promise.all(
        newFiles.map(async (file) => {
          try {
            const { uploadUrl, uploadedUrl } = await getPresignedUrl(
              file.name,
              file.type
            )
            await uploadFile(file, uploadUrl)
            return uploadedUrl
          } catch {
            toast.error("Xảy ra lỗi khi upload ảnh")
            return null
          }
        })
      )
      uploadedUrls = results.filter((u): u is string => u !== null)
    }

    const images = [...existingImages, ...uploadedUrls]

    const submitData: Record<string, unknown> = {
      title: data.title,
      categoryId: data.categoryId,
      description: data.description || undefined,
      location: data.location || undefined,
      happenedAt: data.happenedAt || undefined,
      contactVisible: data.contactVisible,
      images,
    }

    if (postType === PostType.LOST) {
      submitData.hasReward = data.hasReward
    }
    if (postType === PostType.FOUND) {
      submitData.securityQuestion = data.securityQuestion || undefined
    }

    const res = await updatePost(postId, submitData)
    if (res.success) {
      toast.success("Cập nhật bài đăng thành công")
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(res.message || "Cập nhật thất bại")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bài đăng</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            {/* Title */}
            <div className="grid gap-1">
              <Label>
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("title")}
                placeholder="Tiêu đề bài đăng"
                className={formState.errors.title ? "border-destructive" : ""}
              />
              <FormErrorMessage error={formState.errors.title} />
            </div>

            {/* Category */}
            <div className="grid gap-1">
              <Label>
                Danh mục <span className="text-destructive">*</span>
              </Label>
              <Select
                value={categoryIdValue?.toString()}
                onValueChange={(val) =>
                  setValue("categoryId", Number(val), { shouldValidate: true })
                }
              >
                <SelectTrigger
                  className={
                    formState.errors.categoryId ? "border-destructive" : ""
                  }
                >
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormErrorMessage error={formState.errors.categoryId} />
            </div>

            {/* Description */}
            <div className="grid gap-1">
              <Label>Mô tả chi tiết</Label>
              <Textarea
                {...register("description")}
                placeholder="Mô tả đặc điểm, tình trạng..."
                className={
                  formState.errors.description ? "border-destructive" : ""
                }
              />
              <FormErrorMessage error={formState.errors.description} />
            </div>

            {/* Security Question (FOUND only) */}
            {postType === PostType.FOUND && (
              <div className="grid gap-1">
                <Label>Câu hỏi xác minh</Label>
                <Input
                  {...register("securityQuestion")}
                  placeholder="VD: Trong ví có bao nhiêu tiền?..."
                />
              </div>
            )}

            {/* Images */}
            <div className="grid gap-1">
              <Label>Hình ảnh ({totalImages}/5)</Label>

              {/* Existing images */}
              {(existingImages.length > 0 || newFilePreviews.length > 0) && (
                <div className="grid grid-cols-3 gap-3 mb-2">
                  {existingImages.map((url, i) => (
                    <div
                      key={url}
                      className="relative aspect-video rounded-md overflow-hidden border bg-muted"
                    >
                      <img
                        src={url}
                        alt="existing"
                        className="h-full w-full object-cover"
                      />
                      <span
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </span>
                    </div>
                  ))}
                  {newFilePreviews.map((url, i) => (
                    <div
                      key={url}
                      className="relative aspect-video rounded-md overflow-hidden border bg-muted"
                    >
                      <img
                        src={url}
                        alt="new"
                        className="h-full w-full object-cover"
                      />
                      <span
                        onClick={() => removeNewFile(i)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {totalImages < 5 && (
                <Dropzone
                  maxFiles={5 - existingImages.length}
                  accept={{
                    "image/*": [".png", ".jpg", ".jpeg", ".heic", ".webp"],
                  }}
                  onDrop={handleDrop}
                  className="border-dashed border-2"
                >
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              )}
            </div>

            {/* Time & Location */}
            <div className="grid gap-3 grid-cols-2">
              <div className="grid gap-1">
                <Label>Thời gian</Label>
                <Input type="date" {...register("happenedAt")} />
              </div>
              <div className="grid gap-1">
                <Label>Địa điểm</Label>
                <Input
                  {...register("location")}
                  placeholder="VD: Thư viện..."
                />
              </div>
            </div>

            {/* Contact & Reward toggles */}
            <div className="grid gap-3 grid-cols-2">
              <div className="flex items-center space-x-2">
                <Label>Công khai liên lạc?</Label>
                <Switch
                  checked={contactVisibleValue}
                  onCheckedChange={(val) => setValue("contactVisible", val)}
                />
              </div>
              {postType === PostType.LOST && (
                <div className="flex items-center space-x-2">
                  <Label>Có hậu tạ?</Label>
                  <Switch
                    checked={hasRewardValue}
                    onCheckedChange={(val) => setValue("hasReward", val)}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Huỷ
              </Button>
              <Button type="submit" disabled={formState.isSubmitting}>
                {formState.isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
