"use server"
import { auth } from "@/auth"
import { ErrUnauthorized } from "@/lib/errors"
import { sendRequest } from "@/lib/helpers/api"
import { getErrPayload } from "@/lib/helpers/handle-errors"
import { Post, PostDetail, PostListResponse } from "@/types"

export const getPosts = async (params?: Record<string, string | undefined> | URLSearchParams) => {
  try {
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

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}

export const getPost = async (id: string) => {
  try {
    const session = await auth()
    const res = await sendRequest<IBackendRes<PostDetail>>({
      url: `/posts/${id}`,
      method: "GET",
      headers: session
        ? { Authorization: `Bearer ${session.user.access_token}` }
        : undefined,
    })
    return res
  } catch (error) {
    return getErrPayload(error)
  }
}

export const createPost = async (data: any) => {
  try {
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
  } catch (error) {
    return getErrPayload(error)
  }
}

export const toggleSavePost = async (postId: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<boolean>>({
      url: `/posts/${postId}/save`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}
