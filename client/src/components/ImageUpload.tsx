"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { getPresignedUrl } from "@/lib/actions/upload.action"

export const uploadFile = async(file: any, uploadUrl: string) => {
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      'x-amz-acl': 'public-read'
    },
    body: file,
  })
  
  if (!uploadRes.ok) throw new Error("Xảy ra lỗi khi lưu ảnh")
}

export function DirectUpload() {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // 1. Lấy presigned URL từ backend
      const { fileUrl, uploadUrl } = await getPresignedUrl(file.name, file.type)
      console.log("fileUrl: ", fileUrl)
      console.log("uploadUrl: ", uploadUrl)

      const uploadedUrl = await uploadFile(file, uploadUrl)
      console.log("uploadedUrl: ", uploadedUrl)
      toast.success("Upload thành công!")
    } catch (error: any) {
      toast.error(error.message || "Upload thất bại")
    } finally {
      setUploading(false)
    }
  }

  return <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
}
