"use server"
import { auth } from "@/auth"
import { sendRequest } from "@/lib/helpers/api"

export const getPresignedUrl = async (fileName: string, contentType: string) => {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")
  const res = await sendRequest<IBackendRes<{ uploadUrl: string, fileUrl: string }>>({
    url: "/uploads/presigned-url",
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
    body: {
      fileName,
      contentType,
    },
  })

  if (res.success === false || !res.data) throw new Error(res.message)
  return {
    fileUrl: res.data.fileUrl,
    uploadUrl: res.data.uploadUrl,
  }
}

export const uploadFile = async(file: any, uploadUrl: string) => {
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  })
  
  if (!uploadRes.ok) throw new Error("Upload failed")
  return uploadRes.url
}