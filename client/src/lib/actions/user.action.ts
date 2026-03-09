"use server"

import { auth } from "@/auth"
import { ErrUnauthorized } from "@/lib/errors"
import { sendRequest } from "@/lib/helpers/api"
import { UserProfile } from "@/types/user"

export const getProfile = async (): Promise<UserProfile> => {
  const session = await auth()
  if (!session) throw ErrUnauthorized

  const res = await sendRequest<IBackendRes<UserProfile>>({
    url: "/users/profile",
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
  })

  if (!res.success || !res.data) throw new Error(res.message)
  return res.data
}

export const updateProfile = async (data: {
  fullName: string
  phoneNumber?: string
  avatarUrl?: string
  facebookUrl?: string
}): Promise<UserProfile> => {
  const session = await auth()
  if (!session) throw ErrUnauthorized

  const res = await sendRequest<IBackendRes<UserProfile>>({
    url: "/users/profile",
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.user.access_token}`,
    },
    body: data,
  })

  if (!res.success || !res.data) throw new Error(res.message)
  return res.data
}
