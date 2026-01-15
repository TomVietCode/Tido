"use client"

import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { lostFormSchema, LostFormValues } from "@/lib/schemas/post.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import FormErrorMessage from "@/components/ui/form-error-message"
import { Category } from "@/types"
import { toast } from "sonner"
import { getPresignedUrl } from "@/lib/actions/upload.action"
import { createPost } from "@/lib/actions/post.action"
import { PostType } from "@/types/enums"
import { showErrorToast } from "@/lib/helpers/handle-errors"
import { uploadFile } from "@/lib/helpers/client-upload"

export default function LostForm({ categories }: { categories: Category[] }) {
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const { register, watch, getValues, setValue, formState, handleSubmit, reset } = useForm<LostFormValues>({
    resolver: zodResolver(lostFormSchema),
    defaultValues: {
      title: "",
      description: "",
      files: [],
      location: "",
      contactVisible: false,
      hasReward: false,
    },  
  })
  const files = watch("files")

  const handleDrop = (newFiles: File[]) => {
    const currentFiles = getValues("files") || []
    const updatedFiles = [...currentFiles, ...newFiles].slice(0, 5)
    setValue("files", updatedFiles, { shouldValidate: true })
  }

  useEffect(() => {
    if (categories.length === 0) {
      toast.error("Không thể lấy danh sách danh mục")
    }
  }, [categories])
  
  useEffect(() => {
    if (files.length === 0) {
      setFilePreviews([])
      return
    }
    const objectUrls = files.map((file) => URL.createObjectURL(file))
    setFilePreviews(objectUrls)
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [files])

  const removeFile = (indexToRemove: number) => {
    const currentFiles = getValues("files") || []
    const updatedFiles = currentFiles.filter((_, i) => i !== indexToRemove)
    setValue("files", updatedFiles, { shouldValidate: true })
  }

  const onSubmit = async (data: LostFormValues) => {
    const { files, ...props } = data
  
    // Upload tất cả ảnh song song và đợi hoàn thành
    const uploadResults = await Promise.all(
      files.map(async (file: File) => {
        try {
          const { uploadUrl, uploadedUrl } = await getPresignedUrl(file.name, file.type)
          await uploadFile(file, uploadUrl)
          return uploadedUrl
        } catch (error: any) {
          toast.error(error.message || "Xảy ra lỗi khi upload ảnh")
          return null
        }
      })
    )
  
    const images = uploadResults.filter((url): url is string => url !== null)
    if (images.length === 0 && files.length > 0) {
      toast.error("Không thể upload ảnh, vui lòng thử lại")
      return
    }
  
    const submitData = {
      ...props,
      happenedAt: props.happenedAt ?  props.happenedAt : undefined,
      images: images.length > 0 ? images : [],
      type: PostType.LOST
    }
  
    const res = await createPost(submitData)
    if (res.success === false) {
      showErrorToast(res.message)
      return
    }
  
    toast.success("Đăng tin thành công")
    reset({
      title: "",
      description: "",
      files: [],
      location: "",
      contactVisible: false,
      hasReward: false,
    })
  }

  return (
    <TabsContent value="lost">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <CardContent className="grid gap-4">
            {/* Title */}
            <div className="grid gap-1">
              <Label htmlFor="tabs-lost-title">
                Tiêu đề <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("title")}
                id="tabs-lost-title"
                placeholder="VD: Rơi ví da màu đen ở thư viện..."
                className={formState.errors.title && "border-destructive"}
              />
              <FormErrorMessage error={formState.errors.title} />
            </div>

            {/* Category */}
            <div className="grid gap-1">
              <Label htmlFor="tabs-lost-category">
                Danh mục <span className="text-destructive">*</span>
              </Label>
              <Select onValueChange={(val) => setValue("categoryId", Number(val), { shouldValidate: true })}>
                <SelectTrigger className={`w-full ${formState.errors.categoryId && "border-destructive"}`}>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem key={category.slug} value={category.id.toString()}>{category.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormErrorMessage error={formState.errors.categoryId} />
            </div>

            {/* Description */}
            <div className="grid gap-1">
              <Label htmlFor="tabs-demo-description">Mô tả chi tiết</Label>
              <Textarea
                id="tabs-demo-description"
                placeholder="Mô tả đặc điểm, tình trạng của đồ vật..."
                {...register("description")}
                className={formState.errors.description && "border-destructive"}
              />
              <FormErrorMessage error={formState.errors.description} />
            </div>

            {/* Images */}
            <div className="grid gap-1">
              <Label htmlFor="tabs-demo-description">Hình ảnh</Label>
              <Dropzone
                maxFiles={5}
                accept={{ "image/*": [".png", ".jpg", ".jpeg", ".heic"] }}
                onDrop={handleDrop}
                src={files.length > 0 ? files : undefined}
                className="border-dashed border-2"
              >
                <DropzoneEmptyState />
                <DropzoneContent>
                  <div className="grid grid-cols-2 gap-3 w-full sm:grid-cols-3">
                    {filePreviews.map((url, i) => (
                      <div key={url} className="relative aspect-video rounded-md overflow-hidden border bg-muted">
                        <img src={url} alt="preview" className="h-full w-full object-cover" />
                        <span
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFile(i)
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={14} />
                        </span>
                      </div>
                    ))}
                    {files.length < 5 && (
                      <div className="flex items-center justify-center border-2 border-dashed rounded-md hover:bg-muted transition-colors">
                        <span className="text-xs text-muted-foreground">+ Thêm ảnh</span>
                      </div>
                    )}
                  </div>
                </DropzoneContent>
              </Dropzone>
            </div>

            {/* Time and Location */}
            <div className="grid gap-3 grid-cols-2">
              <div className="grid gap-1">
                <Label htmlFor="tabs-lost-time">Thời gian</Label>
                <Input type="date" {...register("happenedAt")} />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="tabs-lost-location">Địa điểm</Label>
                <Input id="tabs-lost-location" {...register("location")} placeholder="VD: Thư viện..." />
              </div>
            </div>

            {/* Contact and Reward */}
            <div className="grid gap-3 grid-cols-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="contact-mode">Hiển thị số điện thoại công khai?</Label>
                <Switch
                  id="contact-mode"
                  className="data-[state=checked]:bg-orange-400"
                  onCheckedChange={(val) => setValue("contactVisible", val)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="has-reward">Có hậu tạ?</Label>
                <Switch
                  id="has-reward"
                  className="data-[state=checked]:bg-orange-400"
                  onCheckedChange={(val) => setValue("hasReward", val)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="">
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              className="w-full bg-orange-400 text-white hover:bg-orange-500 transition-colors duration-300 cursor-pointer "
            >
              {formState.isSubmitting ? "Đang đăng..." : "Đăng tin ngay"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </TabsContent>
  )
}
