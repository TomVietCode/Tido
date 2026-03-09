"use server"
import { auth } from "@/auth"
import { ErrUnauthorized } from "@/lib/errors"
import { sendRequest } from "@/lib/helpers/api"
import { getErrPayload } from "@/lib/helpers/handle-errors"
import { MyPostsResponse, ImageSearchResponse, Post, PostDetail, PostListItem, PostListResponse } from "@/types"

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

export const getSavedPosts = async () => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<PostListItem[]>>({
      url: "/posts/saved",
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}

export const getMyPosts = async (params?: Record<string, string | undefined>) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<MyPostsResponse>>({
      url: "/posts/me",
      method: "GET",
      queryParams: params,
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}

export const updatePostStatus = async (postId: string, status: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<Post>>({
      url: `/posts/${postId}/status`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
      body: { status },
    })

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}

export const deletePost = async (postId: string) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<boolean>>({
      url: `/posts/${postId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
    })

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}

export const updatePost = async (postId: string, data: Record<string, unknown>) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const res = await sendRequest<IBackendRes<Post>>({
      url: `/posts/${postId}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
      body: data,
    })

    return res
  } catch (error) {
    return getErrPayload(error)
  }
}

export const searchPostsByImage = async (formData: FormData) => {
  try {
    const session = await auth()
    if (!session) throw ErrUnauthorized

    const baseUrl = process.env.NEXT_PUBLIC_API_URL

    const res = await fetch(`${baseUrl}/posts/search/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.user.access_token}`,
      },
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Có lỗi khi tìm kiếm bằng ảnh",
        data: null,
      }
    }

    return {
      success: true,
      data: data.data as ImageSearchResponse,
    }
  } catch (error) {
    return getErrPayload(error)
  }
}