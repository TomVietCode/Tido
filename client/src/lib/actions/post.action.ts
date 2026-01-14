"use server"
import { auth } from "@/auth"
import { sendRequest } from "@/lib/helpers/api"
import { Post } from "@/types"

export const createPost = async (data: any) => {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const res = await sendRequest<IBackendRes<Post>>({
    url: "/posts",
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
    body: data,
  })

  if (res.success === false || !res.data) {
    return {
      success: false,
      message: res.message,
    }
  }

  return res
}