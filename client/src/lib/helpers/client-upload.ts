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

export const uploadChatImage = async (file: File): Promise<string> => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Định dạng ảnh không hợp lệ")
  }

  if (file.size > maxSize) {
    throw new Error("Kích thước ảnh không được vượt quá 5MB")
  }

  const { uploadUrl, uploadedUrl } = await getPresignedUrl(
    file.name,
    file.type,
    'chat-images'
  )

  await uploadFile(file, uploadUrl)

  return uploadedUrl
}