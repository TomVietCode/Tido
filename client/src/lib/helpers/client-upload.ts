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