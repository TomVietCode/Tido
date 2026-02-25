"use server"
import { auth } from "@/auth"
import { sendRequest } from "@/lib/helpers/api"
import { Post, PostListResponse } from "@/types"

export const getPosts = async (
  params?: Record<string, string | undefined>,
): Promise<PostListResponse> => {
  const res = await sendRequest<IBackendRes<PostListResponse>>({
    url: "/posts",
    method: "GET",
    queryParams: params,
  })

  if (!res.data) {
    return { meta: { limit: 20, hasNextPage: false, nextCursor: null }, data: [] }
  }

  return res.data
}

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