"use server"
import { auth } from "@/auth"
import { ErrUnauthorized } from "@/lib/errors"
import { sendRequest } from "@/lib/helpers/api"
import { Post, PostListResponse } from "@/types"

export const getPosts = async (params?: Record<string, string | undefined> | URLSearchParams): Promise<PostListResponse> => {
  const session = await auth()
  const res = await sendRequest<IBackendRes<PostListResponse>>({
    url: "/posts",
    method: "GET",
    queryParams: params,
    headers: session
      ? {
          Authorization: `Bearer ${session.user.access_token}`,
        }
      : undefined,
  })
  if (Number(res.statusCode) >= 400) {
    return { meta: { limit: 20, hasNextPage: false, nextCursor: null }, data: [] }
  }
  if (!res.data) {
    return { meta: { limit: 20, hasNextPage: false, nextCursor: null }, data: [] }
  }

  return res.data
}

export const createPost = async (data: any) => {
  const session = await auth()
  if (!session) throw ErrUnauthorized

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
