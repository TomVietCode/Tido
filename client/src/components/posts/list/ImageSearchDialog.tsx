"use client"

import { useState, useEffect, useCallback } from "react"
import { ImageIcon, Loader2, SearchIcon, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone"
import { toast } from "sonner"
import { ImageSearchResponse } from "@/types/post"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { processImageFile } from "@/lib/helpers/image-helpers"
import { PostType } from "@/types/enums"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ImageSearchDialogProps {
  onSearchResults: (results: ImageSearchResponse, previewUrl: string) => void
}

export default function ImageSearchDialog({ onSearchResults }: ImageSearchDialogProps) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [postType, setPostType] = useState<PostType>(PostType.LOST)
  const [preview, setPreview] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Create preview URL when file changes
  useEffect(() => {
    if (!file) {
      setPreview(null)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    const toastId = toast.loading("Đang xử lý hình ảnh của bạn...", {
      position: "top-center",
    })
    try {
      if (acceptedFiles.length > 0) {
        const processedFile = await processImageFile(acceptedFiles[0])
        setFile(processedFile)
        toast.success("Xử lý hình ảnh hoàn tất", { id: toastId })
      }
    } catch (error) {
      toast.error("Xảy ra lỗi khi xử lý hình ảnh của bạn!", { id: toastId })
    }
  }, [])

  const handleRemoveFile = () => {
    setFile(null)
  }

  const handleSearch = async () => {
    if (!postType) {
      toast.error("Vui lòng chọn loại bài đăng")
      return
    }
    if (!file) {
      toast.error("Vui lòng chọn ảnh để tìm kiếm")
      return
    }

    setIsSearching(true)

    try {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("postType", postType)

      const res = await fetch("/api/posts/search/image", {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      const json = await res.json()

      if (!json.success) {
        toast.error(json.message || "Có lỗi khi tìm kiếm")
        return
      }

      const results = json.data as ImageSearchResponse
      onSearchResults(results, preview!)
      setOpen(false)
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
    } finally {
      setIsSearching(false)
    }
  }

  // Reset state when dialog is closed
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setFile(null)
      setPreview(null)
      setIsSearching(false)
      setPostType(PostType.LOST)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full cursor-pointer">
                <ImageIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tìm kiếm bằng hình ảnh</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tìm kiếm bằng hình ảnh</DialogTitle>
          <DialogDescription>Chọn hoặc kéo thả ảnh để tìm bài đăng có hình ảnh tương tự</DialogDescription>
        </DialogHeader>
        <div className="space-x-2 flex items-center">
          <p className="text-sm font-medium">Bạn cần tìm kiếm theo loại bài đăng nào?</p>
          <Select value={postType} onValueChange={(v) => setPostType(v as PostType)}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại bài đăng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PostType.LOST}>Thất lạc</SelectItem>
              <SelectItem value={PostType.FOUND}>Nhặt được</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4">
          {/* Dropzone or Preview */}
          {!file ? (
            <Dropzone
              maxFiles={1}
              accept={{
                "image/*": [".png", ".jpg", ".jpeg", ".webp"],
              }}
              onDrop={handleDrop}
              className="border-dashed border-2 min-h-[200px]"
            >
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
          ) : (
            <div className="relative rounded-lg overflow-hidden border bg-muted">
              <img src={preview!} alt="Ảnh tìm kiếm" className="w-full max-h-[300px] object-contain" />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full
                           hover:bg-red-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleSearch} disabled={!file || !postType || isSearching} className="w-full cursor-pointer">
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Đang tìm kiếm, vui lòng đợi trong giây lát...
              </>
            ) : (
              <>
                <SearchIcon className="h-4 w-4 mr-2" />
                Tìm kiếm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
