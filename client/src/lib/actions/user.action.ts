"use server"

import { auth } from "@/auth"
import { sendRequest } from "@/lib/helpers/api"
import { Post } from "@/types"

export interface UserProfile {
  id: string
  email: string
  fullName: string
  role: string
  status: string
  avatarUrl?: string
  phoneNumber?: string
  createdAt: string
  updatedAt: string
}

export interface UpdateUserProfileDto {
  fullName: string
  phoneNumber?: string
  avatarUrl?: string
  facebookUrl?: string
}

export const getUserProfile = async () => {
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const res = await sendRequest<IBackendRes<UserProfile>>({
    url: "/users/profile",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
  })

  if (res.success === false || !res.data) {
    throw new Error(res.message || "Failed to fetch user profile")
  }

  return res.data
}

export const updateUserProfile = async (data: UpdateUserProfileDto) => {
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const res = await sendRequest<IBackendRes<UserProfile>>({
    url: "/users/profile",
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
    body: data,
  })

  if (res.success === false || !res.data) {
    throw new Error(res.message || "Failed to update user profile")
  }

  return res.data
}

export const getUserPosts = async () => {
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const res = await sendRequest<IBackendRes<IModelPaginate<Post>>>({
    url: `/posts/me`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
  })

  if (res.success === false || !res.data) {
    return []
  }

  return res.data.result
}

export const updatePostStatus = async (postId: string, status: string) => {
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const res = await sendRequest<IBackendRes<Post>>({
    url: `/posts/${postId}`,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
    body: { status },
  })

  return res
}

export const deletePost = async (postId: string) => {
  const session = await auth()
  if (!session) {
    throw new Error("Unauthorized")
  }

  const res = await sendRequest<IBackendRes<void>>({
    url: `/posts/${postId}`,
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
  })

  return res
}
